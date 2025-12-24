// frontend/src/pages/Groups/ui/GroupDetailPage.jsx (FINALIZED WITH ALL FIXES)
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify'; // FIX: Added missing toast import
import { FaComments, FaUsers, FaCog, FaSignInAlt, FaSignOutAlt, FaLock } from 'react-icons/fa';
import {
  fetchGroupDetails,
  fetchGroupMessages,
  sendGroupMessageBySocket,
  clearCurrentGroup,
  joinGroup,
  leaveGroup,
  updateGroupMemberRealtime,
  receiveNewGroupMessage
} from '@/entities/Group/model/groupSlice';
import { ChatWindow } from '@/features/Chat/ui/ChatWindow';
import { MemberListPanel } from '@/features/GroupSystem/ui/MemberListPanel';
import { GroupSettingsPanel } from '@/features/GroupSystem/ui/GroupSettingsPanel';
import { Loader, Button } from '@/shared/ui';
import { theme } from '@/styles/theme'; // FIX: Corrected import path
import { useSocket } from '@/core/socket/socketContext';

export const GroupDetailPage = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  
  // Destructure with default values to prevent crashes if state is temporarily unavailable
  const { currentGroup = {}, status = 'idle' } = useSelector(state => state.groups || {});
  const { user: currentUser } = useSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = useState('chat');
  const [messageToReply, setMessageToReply] = useState(null);
  // --- DATA FETCHING & SOCKET LOGIC ---
  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupDetails(groupId)).unwrap().catch(() => {
        toast.error("Could not load group or access denied.");
        navigate('/groups', { replace: true });
      });
    }
    // Cleanup function to clear the group data when leaving the page
    return () => { dispatch(clearCurrentGroup()); };
  }, [dispatch, groupId, navigate]);

  useEffect(() => {
    if (!socket || !groupId) return;
    
      
    const memberJoinedHandler = (data) => { if (data.groupId === groupId) dispatch(updateGroupMemberRealtime({ groupId, user: data.user, isJoining: true })); };
    const memberLeftHandler = (data) => { if (data.groupId === groupId) dispatch(updateGroupMemberRealtime({ groupId, user: { _id: data.userId }, isJoining: false })); };
    const newMessagehandler = (message) => { if (message.group === groupId) dispatch(receiveNewGroupMessage({ groupId, message })); };
      
    socket.emit('chat:joinGroup', groupId);
    socket.on('group:memberJoined', memberJoinedHandler);
    socket.on('group:memberLeft', memberLeftHandler);
    socket.on('newGroupMessage', newMessagehandler);
      
      return () => {
        socket.emit('chat:leaveGroup', groupId);
        socket.off('group:memberJoined', memberJoinedHandler);
        socket.off('group:memberLeft', memberLeftHandler);
        socket.off('newGroupMessage', newMessagehandler);
      };
    
  }, [socket, groupId,  dispatch]);
  const handleSendMessage = useCallback((messagePayload) => {
    if (!socket) {
      toast.error("Chat connection not available.");
      return;
    }

    const text = messagePayload.text?.trim() || '';
    let media = null;

    // FIX: Check if mediaUrl exists and is a string before trimming
    if (messagePayload.mediaUrl && typeof messagePayload.mediaUrl === 'string' && messagePayload.mediaUrl.trim() !== '') {
      media = {
        url: messagePayload.mediaUrl.trim(),
        type: messagePayload.messageType === 'file' ? 'file' : 'image', // Basic type detection
      };
    }

    // Prevent sending if empty
    if (!text && !media) {
      toast.error("Cannot send empty message. Add text or attach media.");
      return;
    }

    const payload = {
      socket,
      groupId,
      text,
      messageType: media ? (messagePayload.messageType || 'IMAGE') : 'TEXT',
      ...(media ? { media } : {}), // Only add media key if media object exists
      fileName: messagePayload.fileName,
    };

    dispatch(sendGroupMessageBySocket(payload));
    setMessageToReply(null);
  }, [dispatch, socket, groupId]);

  // DELETE or COMMENT OUT the 'handleSendMessages' function immediately following this to avoid conflicts.
  const handleLoadMoreMessages = useCallback(() => {
    if (currentGroup.messagesPagination.hasMore && currentGroup.status !== 'loadingMessages') {
      const firstMessageId = currentGroup.messages[0]?._id;
      dispatch(fetchGroupMessages({ groupId, before: firstMessageId }));
    }
  }, [dispatch, groupId, currentGroup.messages, currentGroup.messagesPagination, currentGroup.status]);

  const handleJoinGroup = () => dispatch(joinGroup(groupId));
  const handleLeaveGroup = () => { if (window.confirm('Are you sure you want to leave this group?')) dispatch(leaveGroup(groupId)); };

  //
  
  // --- INLINE STYLES ---
  const pageStyle = { display: 'flex', height: 'calc(100vh - 65px)', borderTop: `1px solid ${theme.border}` };
  const sidebarStyle = { width: '320px', flexShrink: 0, borderRight: `1px solid ${theme.border}`, backgroundColor: theme.backgroundAlt, display: 'flex', flexDirection: 'column' };
  const mainContentStyle = { flexGrow: 1, display: 'flex', flexDirection: 'column', backgroundColor: theme.backgroundMain };
  const groupHeaderStyle = { padding: theme.spacing.lg, textAlign:'center', borderBottom: `1px solid ${theme.border}` };
  const groupLogoStyle = { width: '80px', height: '80px', borderRadius:'50%', margin: '0 auto', marginBottom: theme.spacing.md, objectFit: 'cover', border: `2px solid ${theme.border}` };
  const tabContainerStyle = { display: 'flex', borderBottom: `1px solid ${theme.border}`, padding: `0 ${theme.spacing.sm}px`, flexShrink: 0 };
  const tabContentStyle = { flexGrow: 1, overflowY: 'auto' };

  // --- RENDER LOGIC ---
  if (status === 'loading' && !currentGroup.details) {
    return <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%'}}><Loader size="lg" message="Loading Group..." /></div>;
  }
  if (status === 'failed' && !currentGroup.details) {
    return <div style={{padding: '40px', textAlign:'center', color: theme.error}}>Group not found or you do not have access.</div>;
  }
  if (!currentGroup.details || !currentUser) {
    return null; // Prevents render errors
  }
  
  const { details: group, members, messages, messagesPagination } = currentGroup;
  const isChatVisible = group.isMember;

  const renderSidebarContent = () => {
    switch(activeTab) {
        case 'members': return <MemberListPanel groupId={groupId} currentUserRole={group.currentUserRole} />;
        case 'settings': return group.currentUserRole === 'ADMIN' ? <GroupSettingsPanel group={group} /> : null;
        default: return null;
    }
  };

  return (
    <div style={pageStyle}>
      <aside style={sidebarStyle}>
        <div style={groupHeaderStyle}>
          {/* FIX: Replaced all instances of `group.` with `currentGroup.details.` or `group.` after destructuring */}
          <img src={group.logoUrl ? `${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES || 'http://localhost:5001'}${group.logoUrl}` : `https://avatar.vercel.sh/${groupId}?size=80`} alt={group.name} style={groupLogoStyle}/>
          <h2 style={{fontSize:'1.2rem', fontWeight: theme.fontWeightBold, color:theme.textPrimary}}>{group.name}</h2>
          <p style={{color:theme.textSecondary, fontSize: theme.fontSizeSm, margin: `${theme.spacing.xs}px 0`}}>{group.memberCount} Members</p>
          <div style={{marginTop: theme.spacing.md}}>
            {!group.isMember ? (
              group.groupType === 'PUBLIC' && <Button variant="primary" size="sm" onClick={handleJoinGroup} leftIcon={<FaSignInAlt/>}>Join Group</Button>
            ) : (
              // FIX: Added a defensive check for `currentUser` before accessing `_id`
              currentUser._id !== group.creator && <Button variant="danger" size="sm" onClick={handleLeaveGroup} leftIcon={<FaSignOutAlt/>}>Leave Group</Button>
            )}
          </div>
        </div>
        
        <div style={tabContainerStyle}>
          <Button variant={activeTab === 'chat' ? 'primary' : 'ghost'} onClick={() => setActiveTab('chat')}>Chat</Button>
          <Button variant={activeTab === 'members' ? 'primary' : 'ghost'} onClick={() => setActiveTab('members')}>Members</Button>
          {group.currentUserRole === 'ADMIN' && <Button variant={activeTab === 'settings' ? 'primary' : 'ghost'} onClick={() => setActiveTab('settings')}>Settings</Button>}
        </div>

        <div style={tabContentStyle}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            {activeTab !== 'chat' && renderSidebarContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </aside>
      
      <main style={mainContentStyle}>
        {currentGroup.details?.isMember ? (
          <ChatWindow
            key={groupId} // Add a key to force re-mount when changing groups
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={status === 'loadingMessages'}
            hasMore={messagesPagination.hasMore}
            onLoadMore={handleLoadMoreMessages}
            messageToReply={messageToReply}
            onCancelReply={() => setMessageToReply(null)}  
           onReplyRequest={setMessageToReply}
            headerContent={ <h3 style={{fontWeight: theme.fontWeightSemibold}} ># general</h3> 
           
          }
          />
        ) : (
          <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', flexDirection:'column', gap: theme.spacing.md}}>
            <FaLock style={{fontSize:'3rem', color: theme.textMuted}}/>
            <h3 style={{fontSize: '1.2rem', fontWeight:theme.fontWeightSemibold}}>This is a {group.groupType} group</h3>
            <p style={{color: theme.textSecondary}}>Join the group to view and participate in the chat.</p>
            {group.groupType === 'PUBLIC' && <Button variant="primary" onClick={handleJoinGroup}>Join Group</Button>}
          </div>
        )}
      </main>
    </div>
  );
};

export default GroupDetailPage;
