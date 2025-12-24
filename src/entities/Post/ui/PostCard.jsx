import React, { useState } from 'react';
import { useSelector,useDispatch  } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

import { formatDistanceToNowStrict } from 'date-fns';
import { FaChartLine, FaRegCommentDots, FaShareAlt, FaEllipsisH } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { theme } from '@/styles/theme';
import { Tooltip } from '@/shared/ui';

import { LikeButton } from '@/features/PostIntractions/ui/LikeButton';
import { Button } from '@/shared/ui';
import { CommentSection } from '@/features/PostIntractions/ui/CommentSection';
import { fetchCommentsForPost } from '../model/postsSlice';
// import { CommentSection } from '@/features/PostInteractions/ui/CommentSection'; // Create this

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);

  if (!post || !post.user) return null; // Defensive check
  
  const {
    _id, user, trade, caption, chartImageUrl, likesCount, commentsCount,
    createdAt, isLikedByCurrentUser,
  } = post;

  const handleToggleComments = () => {
    const newState = !showComments;
    setShowComments(newState);
    // Fetch initial comments when section is opened for the first time
    if (newState && (!post.actualComments || post.actualComments.length === 0) && post.commentsCount > 0) {
      dispatch(fetchCommentsForPost({ postId: post._id, page: 1 }));
    }
  };

  const isWin = trade?.pnl >= 0;

  // --- Styles ---
  const cardStyle = { backgroundColor: theme.backgroundAlt, borderRadius: theme.borderRadiusXl, boxShadow: theme.shadowCard, border: `1px solid ${theme.border}`, marginBottom: theme.spacing.xl };
  const headerStyle = { padding: `${theme.spacing.md}px ${theme.spacing.lg}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
  const authorInfoStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.sm };
  const avatarStyle = { width: '40px', height: '40px', borderRadius: theme.borderRadiusFull, objectFit: 'cover', border: `2px solid ${theme.border}` };
  const nameStyle = { fontWeight: theme.fontWeightSemibold, color: theme.textPrimary };
  const timeStyle = { fontSize: theme.fontSizeSm, color: theme.textMuted };
  const captionStyle = { padding: `0 ${theme.spacing.lg}px ${theme.spacing.md}px`, color: theme.textSecondary, whiteSpace: 'pre-wrap', lineHeight: 1.6 };
  const tradeSnippetStyle = { margin: `0 ${theme.spacing.lg}px ${theme.spacing.md}px`, padding: theme.spacing.md, backgroundColor: theme.surfaceLight, borderRadius: theme.borderRadiusLg, border: `1px solid ${theme.border}` };
  const chartImageContainerStyle = { maxHeight: '500px', overflow: 'hidden', cursor: 'pointer', borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` };
  const chartImageStyle = { width: '100%', height: 'auto', objectFit: 'contain' };
  const actionsStyle = { padding: `${theme.spacing.xs}px ${theme.spacing.lg}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: theme.textMuted,borderTop: `1px solid ` };
  const leftActionsStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.sm };

  return (
    <motion.div style={cardStyle} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
      <div style={headerStyle}>
        <div style={authorInfoStyle}>
          <img src={user.profilePicture || `https://i.pravatar.cc/40?u=${user._id}`} alt={user.name} style={avatarStyle} />
          <div>
            <Link to={`/profile/${user._id}`}><p style={nameStyle}>{user.name}</p></Link>
            <p style={timeStyle}>{formatDistanceToNowStrict(new Date(createdAt))} ago</p>
          </div>
        </div>
        <button style={{ color: theme.textMuted, padding: theme.spacing.sm, borderRadius: theme.borderRadiusFull }}><FaEllipsisH /></button>
      </div>

      {caption && <p style={captionStyle}>{caption}</p>}
      
      {trade && (
        <div style={tradeSnippetStyle}>
          <div style={{display: 'flex', alignItems: 'center', gap: theme.spacing.md, fontSize: theme.fontSizeSm, fontWeight: theme.fontWeightMedium}}>
            <FaChartLine style={{color: theme.textMuted}}/>
            <span style={{color: theme.primary}}>{trade.symbol}</span>
            <span style={{color: isWin ? theme.success : theme.error}}>{trade.direction}</span>
            <span>P&L: <strong style={{color: isWin ? theme.success : theme.error}}>{trade.pnl?.toFixed(2)}$</strong></span>
            {trade.pnlPercent != null && <span style={{color: theme.textMuted}}>({trade.pnlPercent.toFixed(2)}%)</span>}
          </div>
        </div>
      )}
      
      {chartImageUrl && (
        <div style={chartImageContainerStyle}>
          <img src={`${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES || 'http://localhost:5001'}${chartImageUrl}`} alt="Trade Chart" style={chartImageStyle} />
        </div>
      )}

      <div style={actionsStyle}>
        <div style={leftActionsStyle}>
          <LikeButton post={post} currentUser={currentUser} />

            <Button variant="ghost" onClick={handleToggleComments} leftIcon={<FaRegCommentDots />}>
            {commentsCount}
          </Button>
        </div>
        <Tooltip content="Share (coming soon)">
            <Button variant="ghost" disabled leftIcon={<FaShareAlt />} />
        </Tooltip>
      </div>
      
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <CommentSection postId={_id} />
            <div style={{borderTop: `1px solid ${theme.border}`, padding: theme.spacing.lg, color: theme.textMuted, textAlign: 'center'}}>Comment Section Coming Soon</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default PostCard;