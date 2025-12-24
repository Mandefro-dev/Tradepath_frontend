import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNowStrict } from 'date-fns';
import { FaReply, FaEdit, FaTrashAlt, FaEllipsisH } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { theme } from '@/styles/theme';
import { Button, Input, ConfirmModal, Tooltip ,Loader} from '@/shared/ui';
import { CommentForm } from '@/features/PostIntractions/ui/CommentForm';
import {
  editCommentOnPost,
  deleteCommentFromPost,
  fetchRepliesForComment
} from '@/entities/Post/model/postsSlice'; // Make sure this path is correct

export const CommentItem = ({ comment, postId, isReply = false }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector(state => state.auth);
  
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReplies, setShowReplies] = useState(false);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const canEditOrDelete = currentUser?._id === comment.user?._id; // Add post owner check later

  const handleSaveEdit = async () => {
    if (!editText.trim() || editText === comment.text) {
      setIsEditing(false);
      return;
    }
    await dispatch(editCommentOnPost({ postId, commentId: comment._id, text: editText }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(deleteCommentFromPost({ postId, commentId: comment._id, parentCommentId: comment.parentComment }));
    setShowDeleteConfirm(false);
  };

  const handleToggleReplies = useCallback(() => {
    const newShowRepliesState = !showReplies;
    setShowReplies(newShowRepliesState);
    if (newShowRepliesState && comment.repliesCount > 0 && (!comment.replies || comment.replies.length === 0)) {
        setRepliesLoading(true);
        dispatch(fetchRepliesForComment({ postId, parentCommentId: comment._id }))
            .finally(() => setRepliesLoading(false));
    }
  }, [showReplies, dispatch, postId, comment]);
  
  // Styles
  const containerStyle = { display: 'flex', gap: theme.spacing.sm, marginLeft: isReply ? theme.spacing.xl : 0, position: 'relative' };
  const replyLineStyle = { position: 'absolute', left: `-${theme.spacing.lg}px`, top: `-${theme.spacing.sm}px`, bottom: '0', width: '2px', backgroundColor: theme.border };
  const contentBubbleStyle = { backgroundColor: isReply ? theme.backgroundAlt : theme.surfaceLight, padding: `${theme.spacing.sm}px ${theme.spacing.md}px`, borderRadius: theme.borderRadiusLg, flexGrow: 1, width: '100%' };
  const textStyle = { color: theme.textSecondary, fontSize: '0.9rem', whiteSpace: 'pre-wrap', lineHeight: 1.5, wordBreak: 'break-word' };
  const actionButtonStyle = { color: theme.textMuted, fontSize: '0.75rem', fontWeight: theme.fontWeightMedium, display: 'flex', alignItems: 'center', gap: '4px' };
  const editFormStyle = { display: 'flex', flexDirection: 'column', gap: theme.spacing.sm, marginTop: theme.spacing.xs };
  const editTextAreaStyle = { width: '100%', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadiusMd, padding: theme.spacing.sm, color: theme.textPrimary, fontSize:'0.9rem', resize: 'none' };

  return (
    <>
    <motion.div layout style={containerStyle} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
      {isReply && <div style={replyLineStyle} />}
      {/* ... Avatar link ... */}
      <div style={{ flexGrow: 1 }}>
        <div style={contentBubbleStyle}>
          {/* ... Header with name, time, and Edit/Delete dropdown (omitted for brevity) ... */}
          {isEditing ? (
            <motion.div style={editFormStyle} initial={{opacity:0}} animate={{opacity:1}}>
              <textarea value={editText} onChange={(e) => setEditText(e.target.value)} style={editTextAreaStyle} rows="3" autoFocus/>
              <div style={{display:'flex', gap: '8px', justifyContent: 'flex-end'}}>
                <Button onClick={() => setIsEditing(false)} variant="secondary" size="sm">Cancel</Button>
                <Button onClick={handleSaveEdit} size="sm">Save</Button>
              </div>
            </motion.div>
          ) : (
            <p style={textStyle}>{comment.text}</p>
          )}
        </div>

        <div style={{ marginTop: theme.spacing.xs, display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          <Button variant="ghost" size="sm" style={actionButtonStyle} onClick={() => setIsReplying(!isReplying)}><FaReply /> Reply</Button>
          {canEditOrDelete && !isEditing && <Button variant="ghost" size="sm" style={actionButtonStyle} onClick={() => setIsEditing(true)}><FaEdit /> Edit</Button>}
          {canEditOrDelete && !isEditing && <Button variant="ghost" size="sm" style={{...actionButtonStyle, color: theme.error}} onClick={() => setShowDeleteConfirm(true)}><FaTrashAlt /> Delete</Button>}
        </div>

        <AnimatePresence>
          {isReplying && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              <CommentForm postId={postId} parentCommentId={comment._id} onCommentPosted={() => setIsReplying(false)} autoFocus />
            </motion.div>
          )}
        </AnimatePresence>
        
        {comment.repliesCount > 0 && (
          <Button variant="link" size="sm" onClick={handleToggleReplies} style={{marginTop: theme.spacing.sm, color: theme.primary, fontSize: '0.8rem'}}>
            {showReplies ? 'Hide Replies' : `View ${comment.repliesCount} Replies`}
          </Button>
        )}

        {showReplies && (
          <div style={{ marginTop: theme.spacing.md, paddingTop: theme.spacing.md, borderLeft: `2px solid ${theme.border}`, paddingLeft: theme.spacing.md, display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            {repliesLoading && (!comment.replies || comment.replies.length === 0) && <Loader size="sm" />}
            {comment.replies?.map(reply => (
              <CommentItem key={reply._id} comment={reply} postId={postId} isReply={true} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
    <ConfirmModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={handleDelete} title="Delete Comment?" message="This will permanently delete this comment." variant="danger" />
    </>
  );
};