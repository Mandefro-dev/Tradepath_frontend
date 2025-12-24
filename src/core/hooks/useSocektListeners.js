
// frontend/src/core/hooks/useSocketListeners.js 
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
// import { useSocket } from './useSocketConnection'; // Assuming useSocket is from core/socket/socketContext.js
import { useSocket } from '../socket/socketContext';
import { toast } from 'react-toastify';
import {
  receiveNewPost, receiveUpdatedPost, receiveNewComment, commentUpdated, commentDeleted
} from '@/entities/Post/model/postsSlice';
//import { addNotification } from '@/entities/Notification/model/notificationSlice'; // Assuming this slice exists

export const useSocketListeners = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (!socket || !isAuthenticated) return;

    // Handlers
    const handleNewFollower = (data) => {
      toast.info(data.message || `Someone followed you!`);
      // dispatch(addNotification(data)); // For notification center
    };
    const handleNewPublicPost = (post) => dispatch(receiveNewPost(post));
    const handlePostUpdate = (update) => dispatch(receiveUpdatedPost(update));
    const handleNewComment = (payload) => dispatch(receiveNewComment(payload));
    const handleCommentUpdate = (payload) => dispatch(commentUpdated(payload));
    const handleCommentDelete = (payload) => dispatch(commentDeleted(payload));

    // Register listeners
    socket.on('newFollower', handleNewFollower);
    socket.on('newPublicPost', handleNewPublicPost);
    socket.on('postUpdated', handlePostUpdate);
    socket.on('newCommentOnPost', handleNewComment);
    socket.on('commentUpdatedOnPost', handleCommentUpdate);
    socket.on('commentDeletedFromPost', handleCommentDelete);

    // Cleanup on unmount
    return () => {
      socket.off('newFollower', handleNewFollower);
      socket.off('newPublicPost', handleNewPublicPost);
      socket.off('postUpdated', handlePostUpdate);
      socket.off('newCommentOnPost', handleNewComment);
      socket.off('commentUpdatedOnPost', handleCommentUpdate);
      socket.off('commentDeletedFromPost', handleCommentDelete);
    };
  }, [socket, dispatch,isAuthenticated]);
};