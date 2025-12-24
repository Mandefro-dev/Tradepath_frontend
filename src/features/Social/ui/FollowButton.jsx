import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaUserPlus, FaUserCheck, FaUserMinus } from "react-icons/fa";
import { toggleFollowUser } from "../model/socialSlice"; // Assuming socialSlice 
import { Button } from "@/shared/ui";
import { toast } from "react-toastify";

const FollowButton = ({
  targetUserId,
  isInitiallyFollowing,
  onFollowStateChange,
}) => {
  const dispatch = useDispatch();
  const { user: currentUser, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const { status } = useSelector((state) => state.social); // For loading state

  // Use a local state for immediate UI feedback, potentially synced with prop
  const [isFollowing, setIsFollowing] = React.useState(isInitiallyFollowing);

  React.useEffect(() => {
    setIsFollowing(isInitiallyFollowing);
  }, [isInitiallyFollowing]);

  const handleToggleFollow = async () => {
    if (!isAuthenticated || !currentUser) {
      toast.info("Please login to follow users.");
      return;
    }
    if (currentUser._id === targetUserId) {
      toast.info("You can't follow yourself!");
      return;
    }

    // Optimistic update (optional but good for UX)
    // setIsFollowing(!isFollowing);

    const resultAction = await dispatch(toggleFollowUser(targetUserId));

    if (toggleFollowUser.fulfilled.match(resultAction)) {
      setIsFollowing(resultAction.payload.isFollowing); // Update from actual backend response
      if (onFollowStateChange) {
        onFollowStateChange(resultAction.payload.isFollowing);
      }
    } else {
      // Revert optimistic update if it failed
      // setIsFollowing(isFollowing);
    }
  };

  if (!isAuthenticated || (currentUser && currentUser._id === targetUserId)) {
    return null; // Don't show button if not logged in or viewing own profile
  }

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
      <Button
        onClick={handleToggleFollow}
        disabled={status === "loading"}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 flex items-center space-x-2
          ${
            isFollowing
              ? "bg-gray-600 hover:bg-gray-700 text-gray-200"
              : "bg-sky-500 hover:bg-sky-600 text-white"
          }`}
      >
        {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
        <span>
          {status === "loading" ? "..." : isFollowing ? "Following" : "Follow"}
        </span>
      </Button>
    </motion.div>
  );
};

export default FollowButton;
