import React from 'react';
import { useDispatch } from 'react-redux';
import { motion,AnimatePresence } from 'framer-motion';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { toggleLikeOnPost } from '@/entities/Post/model/postsSlice';
import { theme } from '@/styles/theme';
import { toast } from 'react-toastify';


export const LikeButton = ({ post, currentUser }) => {
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = React.useState(post.isLikedByCurrentUser);
  const [likesCount, setLikesCount] = React.useState(post.likesCount);

  // Optimistic update
  const handleLike = () => {
    if (!currentUser) {
      toast.info("Please login to like posts.");
      return;
    }
    
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

    dispatch(toggleLikeOnPost({ postId: post._id }))
      .unwrap()
      .catch(() => {
        // Revert UI on failure
        toast.error("Failed to update like.");
        setIsLiked(isLiked); // Revert to original state
        setLikesCount(likesCount);
      });
  };

  const likeColor = isLiked ? theme.error : theme.textSecondary;

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: `${theme.spacing.sm}px`,
    color: likeColor,
    fontWeight: theme.fontWeightMedium,
    fontSize: theme.fontSizeSm,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.borderRadiusMd,
    transition: 'color 0.2s ease, background-color 0.2s ease',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <motion.button
      onClick={handleLike}
      style={buttonStyle}
      whileHover={{ backgroundColor: isLiked ? `rgba(220, 53, 69, 0.1)` : theme.surface, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isLiked ? "liked" : "unliked"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{display: 'inline-block'}}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
        </motion.span>
      </AnimatePresence>
      <span>{likesCount}</span>
    </motion.button>
  );
};