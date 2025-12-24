// frontend/src/pages/Community/ui/FeedPage.jsx (COMPLETE)
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlusCircle, FaGlobe, FaUsers } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchFeedPosts, resetPostStatus, receiveNewPost, receiveUpdatedPost, receiveNewComment } from '@/entities/Post/model/postsSlice';
import { useInfiniteScroll } from '@/core/hooks/useInfiniteScroll';
import PostCard from '@/entities/Post/ui/PostCard';
import CreatePostModal from '@/features/PostCreation/ui/CreatePostModal';
import { Button, Loader } from '@/shared/ui';
import { useSocket } from '@/core/socket/socketContext';
import { theme } from '@/styles/theme';
const FeedPage = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const { posts, pagination, status, error } = useSelector((state) => state.posts);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [feedType, setFeedType] = useState('public'); // 'public' or 'following'

  useEffect(() => {
    dispatch(resetPostStatus());
    dispatch(fetchFeedPosts({ page: 1, feedType }));
  }, [dispatch, feedType]);

  useEffect(() => {
    if (!socket || !isAuthenticated) return;
    const handleNewPost = (newPost) => {
      console.log('Socket: New post received', newPost);
      // Check if this post should appear in the current feed view
      // This logic can get complex. For now, assume public posts appear in public feed.
      if (feedType === 'public' && newPost.visibility === 'PUBLIC') {
        dispatch(receiveNewPost(newPost));
      }
    };
    const handlePostUpdate = (updatedPostData) => {
      console.log('Socket: Post updated (like/comment count)', updatedPostData);
      dispatch(receiveUpdatedPost(updatedPostData));
    };
    const handleNewComment = (payload) => {
      console.log('Socket: New comment for post', payload);
      dispatch(receiveNewComment(payload));
    };

    // ... more listeners for updates, comments etc. ...
    socket.on('newPublicPost', handleNewPost);
    socket.on('postUpdated', handlePostUpdate);
    socket.on('newCommentOnPost', handleNewComment);
    return () => { socket.off('newPublicPost', handleNewPost); socket.off('postUpdated', handlePostUpdate); socket.off('newCommentOnPost', handleNewComment); };
  }, [socket, dispatch, feedType, isAuthenticated]);

  const loadMorePosts = useCallback(() => { /* ... */ });
  // --- ROBUST INFINITE SCROLL ---
  const handleLoadMore = useCallback(() => {
    if (pagination.hasMore && status !== 'loading') {
      dispatch(fetchFeedPosts({ page: pagination.currentPage + 1, feedType }));
    }
  }, [dispatch, pagination, feedType, status]);

  const lastPostElementRef = useInfiniteScroll(handleLoadMore, pagination.hasMore, status === 'loading');


  const pageStyle = { maxWidth: '750px', margin: '0 auto', padding: `${theme.spacing.lg}px`, minHeight: '100vh' };
  const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg };
  const titleStyle = { fontSize: '2rem', fontWeight: theme.fontWeightBold, color: theme.textPrimary };
  const tabContainerStyle = { display: 'flex', gap: theme.spacing.sm, borderBottom: `1px solid ${theme.border}`, marginBottom: theme.spacing.lg };
  const tabButtonStyle = (isActive) => ({
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    color: isActive ? theme.primary : theme.textSecondary,
    fontWeight: isActive ? theme.fontWeightSemibold : theme.fontWeightMedium,
    borderBottom: `2px solid ${isActive ? theme.primary : 'transparent'}`,
    marginBottom: '-1px', // Align with container border
    transition: 'color 0.2s ease, border-color 0.2s ease',
    display: 'flex', alignItems: 'center', gap: theme.spacing.sm,
  });

  return (
    <div style={pageStyle}>
      <motion.div style={headerStyle} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={titleStyle}>Community Feed</h1>
        <Button variant="primary" onClick={() => setIsCreatePostModalOpen(true)} leftIcon={<FaPlusCircle />}>
          Share Trade
        </Button>
      </motion.div>

      <CreatePostModal isOpen={isCreatePostModalOpen} onClose={() => setIsCreatePostModalOpen(false)} />

      <div style={tabContainerStyle}>
        <button style={tabButtonStyle(feedType === 'public')} onClick={() => setFeedType('public')}><FaGlobe /> Public</button>
        <button style={tabButtonStyle(feedType === 'following')} onClick={() => setFeedType('following')}><FaUsers /> Following</button>
      </div>

      {status === 'loading' && posts.length === 0 && <div style={{padding: theme.spacing.xl}}><Loader message="Loading feed..." /></div>}
      {status === 'succeeded' && posts.length === 0 && <div style={{textAlign:'center', padding: theme.spacing.xl, color: theme.textMuted}}>Feed is empty. Be the first to post!</div>}

      <div>
        <AnimatePresence>
        {posts.map((post, index) => (
            // Attach the ref to the last element to trigger infinite scroll
            <div key={post._id} ref={posts.length === index + 1 ? lastPostElementRef : null}>
              <PostCard post={post} />
            </div>
          ))}
        </AnimatePresence>
      </div>
      {status === 'loading' && posts.length > 0 && (
         <div style={{display: 'flex', justifyContent: 'center', padding: `${theme.spacing.lg}px 0`}}>
            <Loader message="Loading more posts..." />
         </div>
      )}



    </div>
  );
};
export default FeedPage;
