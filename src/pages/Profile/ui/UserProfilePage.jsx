// // frontend/src/pages/Profile/ui/UserProfilePage.jsx
// import React, { useEffect, useState, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaCalendarAlt, FaLink, FaTwitter, FaLinkedin, FaEdit } from 'react-icons/fa';
// import { format } from 'date-fns';

// import {
//   fetchUserProfile,
//   clearViewedUserProfile,
//   fetchFollowersForUser,
//   fetchFollowingForUser,
// } from '@/features/Social/model/socialSlice';
// import { fetchFeedPosts, resetPostStatus } from '@/entities/Post/model/postsSlice';

// import PostCard from '@/entities/Post/ui/PostCard';
// import { Loader, Button } from '@/shared/ui';
// import { theme } from '@/styles/theme';
// import FollowButton from '@/features/Social/ui/FollowButton';


// import { EditProfileModal } from '@/features/UserProfileManagment/ui/EditProfileModal';
// import { UserListModal } from '@/features/Social/ui/UserListModal';

// const UserProfilePage = () => {
//   const { userId } = useParams();
//   const dispatch = useDispatch();

//   const { user: currentUser } = useSelector((state) => state.auth);
//   const { viewedProfile, status: socialStatus, error: socialError } = useSelector((state) => state.social);
//   const { posts: allPosts, status: postsStatus } = useSelector((state) => state.posts);

//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('posts');
//   const [listModal, setListModal] = useState({ isOpen: false, type: 'Followers', users: [], isLoading: false });

//   // Memoize the user's posts to prevent re-filtering on every render
//   const userPosts = useMemo(() => {
//     return allPosts.filter((p) => p.user?._id === userId);
//   }, [allPosts, userId]);

//   useEffect(() => {
//     if (userId) {
//       // Clear previous profile data and fetch new data
//       dispatch(clearViewedUserProfile());
//       dispatch(resetPostStatus());
//       dispatch(fetchUserProfile(userId));
//       dispatch(fetchFeedPosts({ page: 1, feedType: 'user', userId }));
//     }
//     // Cleanup on unmount or when userId changes
//     return () => {
//       dispatch(clearViewedUserProfile());
//       dispatch(resetPostStatus());
//     };
//   }, [dispatch, userId]);

//   const handleOpenListModal = (type) => {
//     setListModal({ isOpen: true, type, users: [], isLoading: true });
//     const thunkToDispatch = type === 'Followers' ? fetchFollowersForUser : fetchFollowingForUser;
//     dispatch(thunkToDispatch(userId)).then((action) => {
//       if (action.meta.requestStatus === 'fulfilled') {
//         const usersList = type === 'Followers' ? action.payload.followers : action.payload.following;
//         setListModal((prev) => ({ ...prev, users: usersList, isLoading: false }));
//       } else {
//         setListModal({ isOpen: false, type: '', users: [], isLoading: false });
//       }
//     });
//   };

//   const isOwnProfile = currentUser?._id === userId;
//   const profileUser = viewedProfile.user;

//   // --- Inline Styles ---
//   const headerStyle = { backgroundColor: theme.backgroundAlt, borderRadius: theme.borderRadiusXl, boxShadow: theme.shadowCard, border: `1px solid ${theme.border}`, marginBottom: theme.spacing.lg, overflow: 'hidden' };
//   const bannerStyle = { height: '220px', backgroundColor: theme.surface, backgroundSize: 'cover', backgroundPosition: 'center' };
//   const contentStyle = { padding: `0 ${theme.spacing.lg}px ${theme.spacing.lg}px`, position: 'relative', top: `-${theme.spacing.xxl}px`, marginBottom: `-${theme.spacing.xxl}px` };
//   const avatarStyle = { width: '128px', height: '128px', borderRadius: '50%', objectFit: 'cover', border: `4px solid ${theme.backgroundAlt}`, boxShadow: theme.shadowModal };
//   const infoStyle = { flexGrow: 1 };
//   const nameActionsStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: theme.spacing.md };
//   const nameStyle = { fontSize: '2rem', fontWeight: theme.fontWeightBold, color: theme.textPrimary };
//   const badgeStyle = { backgroundColor: theme.primary, color: 'white', fontSize: '0.7rem', fontWeight: theme.fontWeightBold, padding: '2px 8px', borderRadius: theme.borderRadiusSm, marginLeft: theme.spacing.sm, verticalAlign: 'middle', textTransform: 'uppercase' };
//   const bioStyle = { color: theme.textSecondary, marginTop: theme.spacing.xs, fontSize: '0.95rem', maxWidth: '60ch' };
//   const metaInfoStyle = { display: 'flex', flexWrap: 'wrap', gap: `${theme.spacing.sm}px ${theme.spacing.lg}px`, color: theme.textMuted, fontSize: theme.fontSizeSm, marginTop: theme.spacing.sm };
//   const metaItemStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.sm };
//   const socialLinkStyle = { color: theme.textMuted, '&:hover': { color: theme.primary } };
//   const statsStyle = { display: 'flex', gap: theme.spacing.lg, marginTop: theme.spacing.md };
//   const statItemStyle = { fontSize: theme.fontSizeSm, color: theme.textSecondary, cursor: 'pointer', background: 'none', border: 'none' };
//   const tabContainerStyle = { display: 'flex', gap: theme.spacing.sm, borderBottom: `1px solid ${theme.border}`, marginBottom: theme.spacing.lg };
//   const tabButtonStyle = (isActive) => ({ padding: `${theme.spacing.sm}px ${theme.spacing.md}px`, color: isActive ? theme.primary : theme.textSecondary, fontWeight: isActive ? theme.fontWeightSemibold : theme.fontWeightMedium, borderBottom: `2px solid ${isActive ? theme.primary : 'transparent'}`, marginBottom: '-1px', transition: 'color 0.2s ease, border-color 0.2s ease' });

//   if (socialStatus === 'loading' && !profileUser) return <div style={{padding: '40px', textAlign:'center'}}><Loader size="lg" message="Loading Profile..." /></div>;
//   if (socialError && !profileUser) return <div style={{padding: '40px', textAlign:'center', color: theme.error}}>Error: {socialError}</div>;
//   if (!profileUser) return <div style={{padding: '40px', textAlign:'center'}}><Loader size="lg" /></div>; // Loading state between profiles

//   const renderTabContent = () => {
//     if (activeTab === 'posts') {
//       return (
//         <motion.div key="posts-tab" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
//           {postsStatus === 'loading' && <Loader />}
//           {postsStatus !== 'loading' && userPosts.length === 0 && <p style={{color: theme.textMuted, textAlign:'center', padding: '40px'}}>This user hasn't shared any posts yet.</p>}
//           <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: theme.spacing.lg}}>
//             {userPosts.map(post => <PostCard key={post._id} post={post} />)}
//           </div>
//           {/* TODO: Add load more posts button for user profile */}
//         </motion.div>
//       );
//     }
//     // The lists are now shown in the modal, so tabs just set the view for posts.
//     return null;
//   };

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//       <div style={headerStyle}>
//         <div style={{...bannerStyle, backgroundImage: profileUser.profileBannerUrl ? `url(${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES || 'http://localhost:5001'}${profileUser.profileBannerUrl})` : `linear-gradient(45deg, ${theme.surfaceLight}, ${theme.surface})`}}></div>
//         <div style={contentStyle}>
//           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
//             <img src={profileUser.profilePicture || `https://i.pravatar.cc/128?u=${userId}`} alt={profileUser.name} style={avatarStyle} />
//             {isOwnProfile ? <Button onClick={() => setIsEditModalOpen(true)} variant="secondary" size="sm" leftIcon={<FaEdit />}>Edit Profile</Button> : <FollowButton targetUserId={userId} />}
//           </div>
//           <div style={{marginTop: theme.spacing.md}}>
//             <h1 style={nameStyle}>{profileUser.name} {profileUser.subscriptionTier === 'pro' && <span style={badgeStyle}>PRO</span>}</h1>
//             <p style={bioStyle}>{profileUser.bio || "Trader & Analyst."}</p>
//             <div style={metaInfoStyle}>
//               <span style={metaItemStyle}><FaCalendarAlt /> Joined {format(new Date(profileUser.createdAt), 'MMM yyyy')}</span>
//               {profileUser.socialLinks?.website && <a href={profileUser.socialLinks.website} target="_blank" rel="noopener noreferrer" style={{...metaItemStyle, ...socialLinkStyle}}><FaLink /> {profileUser.socialLinks.website}</a>}
//               {profileUser.socialLinks?.twitter && <a href={`https://twitter.com/${profileUser.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" style={{...metaItemStyle, ...socialLinkStyle}}><FaTwitter /> @{profileUser.socialLinks.twitter}</a>}
//             </div>
//           </div>
//           <div style={statsStyle}>
//             <button onClick={() => setActiveTab('posts')} style={statItemStyle}><strong style={{color: theme.textPrimary}}>{userPosts.length}</strong> Posts</button>
//             <button onClick={() => handleOpenListModal('Followers')} style={statItemStyle}><strong style={{color: theme.textPrimary}}>{profileUser.followersCount}</strong> Followers</button>
//             <button onClick={() => handleOpenListModal('Following')} style={statItemStyle}><strong style={{color: theme.textPrimary}}>{profileUser.followingCount}</strong> Following</button>
//           </div>
//         </div>
//       </div>

//       <div style={tabContainerStyle}>
//         <Button variant={activeTab === 'posts' ? 'primary' : 'ghost'} onClick={() => setActiveTab('posts')}>Posts</Button>
//       </div>

//       <AnimatePresence mode="wait">
//         {renderTabContent()}
//       </AnimatePresence>

//       {isOwnProfile && <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={currentUser} />}
//       <UserListModal 
//         isOpen={listModal.isOpen} 
//         onClose={() => setListModal({ isOpen: false, type: '', users: [], isLoading: false })}
//         title={listModal.type}
//         users={listModal.users}
//         isLoading={listModal.isLoading}
//       />
//     </motion.div>
//   );
// };
// export default UserProfilePage;

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaLink, FaTwitter, FaLinkedin, FaEdit, FaCheck, FaAt } from 'react-icons/fa';
import { format } from 'date-fns';

import {
  fetchUserProfile, clearViewedUserProfile, fetchFollowersForUser, fetchFollowingForUser
} from '@/features/Social/model/socialSlice';
import { fetchFeedPosts, resetPostStatus } from '@/entities/Post/model/postsSlice';

import PostCard from '@/entities/Post/ui/PostCard';
import { Loader, Button } from '@/shared/ui';
import { theme } from '@/styles/theme';
import FollowButton from '@/features/Social/ui/FollowButton';
import { EditProfileModal } from '@/features/UserProfileManagment/ui/EditProfileModal';
import { UserListModal } from '@/features/Social/ui/UserListModal';

const UserProfilePage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  
  const { user: currentUser } = useSelector(state => state.auth);
  const { viewedProfile, status: socialStatus, error: socialError } = useSelector(state => state.social);
  const { userPosts, posts: feedPosts, status: postsStatus } = useSelector(state => state.posts); // Access both userPosts and feedPosts

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [listModal, setListModal] = useState({ isOpen: false, type: 'Followers', users: [], isLoading: false });

  // This correctly memoizes the posts for the currently viewed user
  const profileUserPosts = useMemo(() => {
    return userPosts[userId]?.items || [];
  }, [userPosts, userId]);

  useEffect(() => {
    if (userId) {
      dispatch(clearViewedUserProfile());
      dispatch(fetchUserProfile(userId));
      dispatch(fetchFeedPosts({ page: 1, feedType: 'user', userId }));
    }
    return () => { dispatch(clearViewedUserProfile()); };
  }, [dispatch, userId]);

  const handleOpenListModal = (type) => {
    setListModal({ isOpen: true, type, users: [], isLoading: true });
    const thunkToDispatch = type === 'Followers' ? fetchFollowersForUser : fetchFollowingForUser;
    dispatch(thunkToDispatch(userId)).then(action => {
      if (action.meta.requestStatus === 'fulfilled') {
        setListModal(prev => ({ ...prev, users: action.payload.results, isLoading: false }));
      } else {
        setListModal({ isOpen: false, type: '', users: [], isLoading: false });
      }
    });
  };

  const isOwnProfile = currentUser?._id === userId;
  const profileUser = viewedProfile.user;

  // --- All inline styles from the previous detailed response would be defined here ---
  // e.g., headerStyle, bannerStyle, contentStyle, avatarStyle, etc.
  
  if (socialStatus === 'loading' && !profileUser) return <div style={{padding: '40px', textAlign:'center'}}><Loader size="lg" message="Loading Profile..." /></div>;
  if (socialError && !profileUser) return <div style={{padding: '40px', textAlign:'center', color: theme.error}}>Error: {socialError}</div>;
  if (!profileUser) return null;

  const renderTabContent = () => {
    if (activeTab === 'posts') {
      return (
        <motion.div key="posts-tab" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          {postsStatus === 'loading' && profileUserPosts.length === 0 && <Loader />}
          {postsStatus !== 'loading' && profileUserPosts.length === 0 && <p style={{color: theme.textMuted, textAlign:'center', padding: '40px'}}>This user hasn't shared any posts yet.</p>}
          <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: theme.spacing.lg}}>
            {profileUserPosts.map(post => <PostCard key={post._id} post={post} />)}
          </div>
          {/* TODO: Load more posts button for user profile */}
        </motion.div>
      );
    }
    return null; // The lists are now handled by the modal
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* ... The full JSX for the Profile Header with banner, avatar, stats, and buttons ... */}
      {/* Example for the stats buttons that open the modal */}
      <div >
          <button onClick={() => setActiveTab('posts')} >
              <strong style={{color: theme.textPrimary}}>{profileUser.postsCount || userPosts.length}</strong> Posts
          </button>
          <button onClick={() => handleOpenListModal('Followers')}>
              <strong style={{color: theme.textPrimary}}>{profileUser.followersCount}</strong> Followers
          </button>
          <button onClick={() => handleOpenListModal('Following')} >
              <strong style={{color: theme.textPrimary}}>{profileUser.followingCount}</strong> Following
          </button>
      </div>

      {/* ... The JSX for the tabs ... */}
      <div >
        <Button variant={activeTab === 'posts' ? 'primary' : 'ghost'} onClick={() => setActiveTab('posts')}>Posts</Button>
      </div>
      
      <AnimatePresence mode="wait">
        {renderTabContent()}
      </AnimatePresence>

      {isOwnProfile && <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={currentUser} />}
      <UserListModal 
        isOpen={listModal.isOpen} 
        onClose={() => setListModal({ isOpen: false, type: '', users: [], isLoading: false })}
        title={listModal.type}
        users={listModal.users}
        isLoading={listModal.isLoading}
      />
    </motion.div>
  );
};
export default UserProfilePage;
