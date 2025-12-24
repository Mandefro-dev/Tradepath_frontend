
// frontend/src/features/Chat/ui/ConversationListPanel.jsx (COMPLETE)
import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { theme } from '@/styles/theme';
import { formatDistanceToNowStrict } from 'date-fns';
import { Loader } from '@/shared/ui';
import { Link } from 'react-router-dom';

const ConversationItem = ({ conversation, isSelected, onSelect }) => {
    const { user: currentUser } = useSelector(state => state.auth);
    const otherParticipant = conversation.otherParticipant;
    
    if (!otherParticipant) return null;

    const itemBaseStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.md, padding: `${theme.spacing.sm}px ${theme.spacing.md}px`, borderRadius: theme.borderRadiusMd, cursor: 'pointer', transition: 'background-color 0.2s ease' };
    const itemStyle = isSelected ? {...itemBaseStyle, backgroundColor: theme.primaryLight} : itemBaseStyle;
    const avatarStyle = { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 };
    const nameStyle = { fontWeight: theme.fontWeightSemibold, color: theme.textPrimary };
    const lastMessageStyle = { fontSize: theme.fontSizeSm, color: theme.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };

    return (
        <motion.div style={itemStyle} onClick={() => onSelect(conversation)} whileHover={{backgroundColor: !isSelected && theme.surfaceLight}}>
            <img src={otherParticipant.profilePicture || `https://i.pravatar.cc/48?u=${otherParticipant._id}`} alt={otherParticipant.name} style={avatarStyle} />
            <div style={{overflow: 'hidden', flexGrow: 1}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span style={nameStyle}>{otherParticipant.name}</span>
                    {conversation.lastMessage?.timestamp && <span style={{fontSize:'0.75rem', color: theme.textMuted}}>{formatDistanceToNowStrict(new Date(conversation.lastMessage.timestamp), {addSuffix: true})}</span>}
                </div>
                <p style={lastMessageStyle}>
                    {conversation.lastMessage?.sender === currentUser._id && "You: "}
                    {conversation.lastMessage?.text || "No messages yet."}
                </p>
            </div>
        </motion.div>
    );
};

export const ConversationListPanel = ({ conversations, onSelectConversation, selectedConversationId, isLoading }) => {
  const containerStyle = { display: 'flex', flexDirection: 'column', height: '100%' };
  const headerStyle = { padding: theme.spacing.md, borderBottom: `1px solid ${theme.border}`, flexShrink: 0 };
  const listStyle = { flexGrow: 1, overflowY: 'auto', padding: theme.spacing.sm, display: 'flex', flexDirection: 'column', gap: theme.spacing.xs };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h2 style={{fontSize: '1.25rem', fontWeight: theme.fontWeightSemibold}}>Messages</h2>
      </header>
      <div style={listStyle}>
        {isLoading && <div style={{paddingTop: '20px'}}><Loader /></div>}
        {!isLoading && conversations.length === 0 && <p style={{textAlign:'center', color:theme.textMuted, padding: '20px'}}>No conversations yet.</p>}
        {!isLoading && conversations.map(convo => (
          <ConversationItem key={convo._id} conversation={convo} isSelected={selectedConversationId === convo._id} onSelect={onSelectConversation} />
        ))}
      </div>
    </div>
  );
};