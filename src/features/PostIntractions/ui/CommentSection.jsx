import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCommentsForPost } from '@/entities/Post/model/postsSlice';
import { CommentItem } from '@/entities/Comment/ui/CommentItem';
import { CommentForm } from './CommentForm';
import { Loader, Button } from '@/shared/ui';
import { theme } from '@/styles/theme';

export const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();
  
  // This selector logic is key for performance. It finds the single post
  // and extracts its comment-related data.
  const { comments, commentsPagination, commentsStatus } = useSelector((state) => {
    const postInFeed = state.posts.posts.find(p => p._id === postId);
    const postInDetail = state.posts.currentPost;
    const post = postInFeed || (postInDetail?._id === postId ? postInDetail : null);
    
    return {
        comments: post?.actualComments || [],
        commentsPagination: post?.commentsPagination || { hasMore: post?.commentsCount > 0 },
        commentsStatus: post?.commentsStatus || 'idle',
    };
  });
  
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = useCallback(() => {
    if (commentsPagination?.hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      const nextPage = (commentsPagination.page || 0) + 1;
      dispatch(fetchCommentsForPost({ postId, page: nextPage }))
        .finally(() => setIsLoadingMore(false));
    }
  }, [dispatch, postId, commentsPagination, isLoadingMore]);

  const topLevelComments = comments.filter(c => !c.parentComment);

  const containerStyle = {
    borderTop: `1px solid ${theme.border}`,
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px ${theme.spacing.lg}px`,
    backgroundColor: theme.surfaceLight,
  };
  const listStyle = { display: 'flex', flexDirection: 'column', gap: theme.spacing.md, marginTop: theme.spacing.md };

  return (
    <div style={containerStyle}>
      <CommentForm postId={postId} />
      <div style={listStyle}>
        {commentsStatus === 'loading' && !comments.length && <div style={{padding: theme.spacing.md}}><Loader message="Loading comments..."/></div>}
        <AnimatePresence>
          {topLevelComments.map(comment => (
            <CommentItem key={comment._id || comment.tempId} comment={comment} postId={postId} />
          ))}
        </AnimatePresence>
      </div>
      {commentsPagination?.hasMore && (
        <div style={{ textAlign: 'center', marginTop: theme.spacing.md }}>
          <Button variant="link" onClick={handleLoadMore} isLoading={isLoadingMore} style={{color: theme.primary, fontSize: theme.fontSizeSm}}>
            {isLoadingMore ? 'Loading...' : 'View more comments'}
          </Button>
        </div>
      )}
    </div>
  );
};
