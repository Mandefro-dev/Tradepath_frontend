import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import { fetchConversations,fetchDirectMessages, sendDirectMessageBySocket, clearCurrentConversation, receiveNewDirectMessage} from '@/entities/Convesation/model/ConversationSlice';
import { ChatWindow } from '@/features/Chat/ui/ChatWindow';
import { ConversationListPanel } from '@/features/Chat/ui/ConversationListPanel';
import { Loader } from '@/shared/ui';
import { theme } from '@/styles/theme';
import { useSocket } from '@/core/socket/socketContext';
import { FaComments } from 'react-icons/fa';

export const DirectMessagesPage = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const { conversations, currentConversation, status: convListStatus } = useSelector(state => state.conversations);
  const { user: currentUser } = useSelector(state => state.auth);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);
  
  useEffect(() => {
    // Listen for incoming direct messages
    if (socket) {
        socket.on('newDirectMessage', (message) => {
            dispatch(receiveNewDirectMessage(message));
        });
        return () => { socket.off('newDirectMessage'); };
    }
  }, [socket, dispatch]);

  useEffect(() => {
    if (selectedConversation) {
      dispatch(fetchDirectMessages({ partnerId: selectedConversation.otherParticipant._id }));
    }
    return () => { dispatch(clearCurrentConversation()); };
  }, [dispatch, selectedConversation]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = (messagePayload) => {
    if (!socket || !selectedConversation) return;
    dispatch(sendDirectMessageBySocket({
      socket,
      receiverId: selectedConversation.otherParticipant._id,
      text: messagePayload.text,
    }));
  };

  const pageStyle = { display: 'flex', height: 'calc(100vh - 65px)', borderTop: `1px solid ${theme.border}` };
  const conversationPanelStyle = { width: '350px', flexShrink: 0, borderRight: `1px solid ${theme.border}`, backgroundColor: theme.backgroundAlt, display: 'flex', flexDirection: 'column' };
  const chatWindowStyle = { flexGrow: 1, display: 'flex', flexDirection: 'column' };
  const placeholderStyle = { display:'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center', height:'100%', color: theme.textMuted, gap: theme.spacing.md };

  return (
    <div style={pageStyle}>
      <aside style={conversationPanelStyle}>
        <ConversationListPanel
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversation?._id}
          isLoading={convListStatus === 'loading'}
        />
      </aside>
      <main style={chatWindowStyle}>
        {selectedConversation ? (
          <ChatWindow
            messages={currentConversation.messages}
            onSendMessage={handleSendMessage}
            isLoading={currentConversation.status === 'loading'}
            hasMore={currentConversation.pagination.hasMore}
            onLoadMore={() => dispatch(fetchDirectMessages({partnerId: selectedConversation.otherParticipant._id, page: currentConversation.pagination.currentPage + 1}))}
            headerContent={
              <div style={{display:'flex', alignItems:'center', gap: theme.spacing.sm}}>
                <img src={selectedConversation.otherParticipant.profilePicture || `https://i.pravatar.cc/40?u=${selectedConversation.otherParticipant._id}`} alt="Partner" style={{width:'40px', height:'40px', borderRadius:'50%'}} />
                <h3 style={{fontWeight: theme.fontWeightSemibold}}>{selectedConversation.otherParticipant.name}</h3>
              </div>
            }
          />
        ) : (
          <div style={placeholderStyle}>
            <FaComments style={{fontSize: '4rem', opacity: 0.5}}/>
            <h2 style={{fontSize:'1.25rem', fontWeight:theme.fontWeightSemibold}}>Your Messages</h2>
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </main>
    </div>
  );
};
export default DirectMessagesPage;