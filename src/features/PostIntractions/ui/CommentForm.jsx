import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import { addCommentToPost } from '@/entities/Post/model/postsSlice';
import { Button, Loader } from '@/shared/ui';
import { theme } from '@/styles/theme';

export const CommentForm = ({ postId, parentCommentId = null, onCommentPosted, autoFocus = false }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const { user } = useSelector((state) => state.auth);
  // Get a specific loading status for submitting comments if you add one to the slice
  const { status } = useSelector((state) => state.posts); 
  const isLoading = status === 'submitting'; // Assuming a 'submitting' status for create/update/delete

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;

    try {
      await dispatch(addCommentToPost({ postId, text, parentCommentId })).unwrap();
      setText('');
      if (onCommentPosted) onCommentPosted();
    } catch (error) {
      // Error is handled via toast in the slice's thunk
    }
  };

  const formStyle = { display: 'flex', alignItems: 'flex-start', gap: theme.spacing.sm, marginTop: theme.spacing.md };
  const avatarStyle = { width: '32px', height: '32px', borderRadius: theme.borderRadiusFull, objectFit: 'cover', marginTop: '5px' };
  const textareaStyle = {
    flexGrow: 1,
    backgroundColor: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.borderRadiusMd,
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    color: theme.textPrimary,
    fontSize: '0.9rem',
    resize: 'none',
    outline: 'none',
    transition: `border-color ${theme.transitionSpeed} ease, box-shadow ${theme.transitionSpeed} ease`,
    minHeight: '42px',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <img
        src={user?.profilePicture || `https://i.pravatar.cc/32?u=${user?._id}`}
        alt={user?.name || 'You'}
        style={avatarStyle}
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={parentCommentId ? "Write a reply..." : "Add a comment..."}
        style={textareaStyle}
        rows="1" // Auto-expands with content, can be enhanced with JS if needed
        onFocus={(e) => e.target.style.borderColor = theme.primary}
        onBlur={(e) => e.target.style.borderColor = theme.border}
        required
        autoFocus={autoFocus}
      />
      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isLoading}
        disabled={isLoading || !text.trim()}
        style={{ height: '42px', padding: `0 ${theme.spacing.md}px` }}
        aria-label="Post comment"
      >
        <FaPaperPlane />
      </Button>
    </form>
  );
};