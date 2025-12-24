import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { theme } from '@/styles/theme';
import FollowButton from './FollowButton';
export const UserListItem = ({ user, onAction }) => {
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing.sm}px 0`,
    transition: `background-color ${theme.transitionSpeed} ease`,
  };
  const userInfoStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.md, textDecoration: 'none' };
  const avatarStyle = { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' };
  const nameStyle = { fontWeight: theme.fontWeightSemibold, color: theme.textPrimary };
  const bioStyle = { fontSize: theme.fontSizeSm, color: theme.textSecondary, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
  if(!user) return null

  return (
    <motion.div style={rowStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
      <Link to={`/profile/${user._id}`} onClick={onAction} style={userInfoStyle}>
        <img src={user.profilePicture || `https://i.pravatar.cc/48?u=${user._id}`} alt={user.name} style={avatarStyle} />
        <div>
          <span style={nameStyle}>{user.name}</span>
          {user.bio && <p style={bioStyle}>{user.bio}</p>}
        </div>
      </Link>
      <FollowButton targetUserId={user._id} />
    </motion.div>
  );
};