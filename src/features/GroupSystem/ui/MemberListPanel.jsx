// frontend/src/features/GroupSystem/ui/MemberListPanel.jsx (COMPLETE)
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGroupMembers, manageGroupMember } from '@/entities/Group/model/groupSlice';
import { Loader, Button } from '@/shared/ui';
import { theme } from '@/styles/theme';
import { FaCrown, FaShieldAlt, FaUser, FaEllipsisV, FaSignOutAlt, FaLevelUpAlt, FaLevelDownAlt } from 'react-icons/fa';
import { useClickOutside } from '@/core/hooks/useClickOutside';

const MemberActionsDropdown = ({ onAction, canManage, memberRole, isCreator }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  if (!canManage || isCreator) return null;

  const dropdownStyle = { position: 'absolute', right: 0, top: '100%', backgroundColor: theme.backgroundAlt, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadiusMd, boxShadow: theme.shadowModal, zIndex: theme.zIndexDropdown, width: '160px', overflow:'hidden' };
  const itemStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.sm, padding: `${theme.spacing.sm}px ${theme.spacing.md}px`, cursor: 'pointer', fontSize: theme.fontSizeSm, color: theme.textSecondary };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} style={{padding: theme.spacing.sm}} aria-label="Manage member">
        <FaEllipsisV />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div style={dropdownStyle} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            {memberRole === 'MEMBER' && <button style={{...itemStyle, width:'100%'}} onClick={() => {onAction('PROMOTE'); setIsOpen(false);}}><FaLevelUpAlt /> Promote to Admin</button>}
            {memberRole === 'ADMIN' && <button style={{...itemStyle, width:'100%'}} onClick={() => {onAction('DEMOTE'); setIsOpen(false);}}><FaLevelDownAlt /> Demote to Member</button>}
            <button style={{...itemStyle, width:'100%', color: theme.error}} onClick={() => {onAction('KICK'); setIsOpen(false);}}><FaSignOutAlt /> Kick Member</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const MemberListItem = ({ member, currentUserRole, groupId }) => {
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector(state => state.auth);
    const isCreator = member.user._id === member.group.creator;
    const canManage = currentUserRole === 'ADMIN' && member.user._id !== currentUser._id;

    const handleManageAction = (action) => {
        if(window.confirm(`Are you sure you want to ${action.toLowerCase()} this member?`)) {
            dispatch(manageGroupMember({ groupId, userId: member.user._id, action }));
        }
    };
    
    const rowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${theme.spacing.sm}px 0` };
    const userInfoStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.md, textDecoration: 'none' };
    const avatarStyle = { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' };
    const nameStyle = { fontWeight: theme.fontWeightSemibold, color: theme.textPrimary };
    const roleStyle = { fontSize: theme.fontSizeSm, color: theme.textMuted, display: 'flex', alignItems:'center', gap:'4px' };

    return (
        <motion.div style={rowStyle} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} layout>
            <Link to={`/profile/${member.user._id}`} style={userInfoStyle}>
                <img src={member.user.profilePicture || `https://i.pravatar.cc/40?u=${member.user._id}`} alt={member.user.name} style={avatarStyle} />
                <div>
                    <span style={nameStyle}>{member.user.name}</span>
                    <span style={roleStyle}>
                        {isCreator ? <FaCrown style={{color:theme.warning}}/> : (member.role === 'ADMIN' ? <FaShieldAlt style={{color:theme.primary}}/> : <FaUser />)}
                        {isCreator ? 'Creator' : member.role}
                    </span>
                </div>
            </Link>
            <MemberActionsDropdown onAction={handleManageAction} canManage={canManage} memberRole={member.role} isCreator={isCreator}/>
        </motion.div>
    );
};

export const MemberListPanel = ({ groupId, currentUserRole }) => {
    const dispatch = useDispatch();
    const { members, status } = useSelector(state => state.groups.currentGroup);

    useEffect(() => {
        if (groupId) dispatch(fetchGroupMembers({ groupId }));
    }, [dispatch, groupId]);
    
    const containerStyle = { padding: theme.spacing.md, overflowY:'auto', height:'100%', display: 'flex', flexDirection: 'column', gap: theme.spacing.sm };

    return (
        <div style={containerStyle}>
            {status === 'loadingMembers' && members.length === 0 && <Loader />}
            <AnimatePresence>
                {members.map(member => <MemberListItem key={member._id} member={member} currentUserRole={currentUserRole} groupId={groupId}/>)}
            </AnimatePresence>
        </div>
    );
};