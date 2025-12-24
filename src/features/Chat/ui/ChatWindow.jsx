import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Loader, Button } from '@/shared/ui';

export const ChatWindow = ({ 
  messages, 
  onSendMessage, 
  headerContent, 
  isLoading, 
  hasMore, 
  onLoadMore, 
  messageToReply, 
  onCancelReply, 
  onReplyRequest 
}) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle infinite scroll trigger
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current;
      if (scrollTop === 0 && hasMore && !isLoading) {
        onLoadMore();
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 w-full relative">
      {/* Header */}
      <header className="h-16 px-4 border-b border-gray-800 bg-gray-800/50 backdrop-blur-sm flex items-center justify-between shrink-0 z-10">
        {headerContent}
      </header>

      {/* Messages Area */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        {/* Loading Spinner for older messages */}
        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader size="sm" />
          </div>
        )}

        {hasMore && !isLoading && (
          <div className="flex justify-center py-2">
            <Button variant="ghost" size="sm" onClick={onLoadMore} className="text-gray-400 hover:text-white">
              Load Older Messages
            </Button>
          </div>
        )}

        {/* Message List */}
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg._id || msg.tempId} 
                layout 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                transition={{ duration: 0.2 }}
              >
                <MessageBubble 
                  message={msg} 
                  onReplyRequest={onReplyRequest} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput 
        onSendMessage={onSendMessage} 
        messageToReply={messageToReply} 
        onCancelReply={onCancelReply} 
        isLoading={isLoading}
      />
    </div>
  );
};// import React, { useRef, useEffect, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { MessageBubble } from './MessageBubble';
// import { ChatInput } from './ChatInput';
// import { theme } from '@/styles/theme';
// import { Loader, Button } from '@/shared/ui';

// export const ChatWindow = ({ messages, onSendMessage, headerContent, isLoading, hasMore, onLoadMore,messageToReply, onCancelReply, onReplyRequest }) => {
//   const messagesEndRef = useRef(null);
//   const messageContainerRef = useRef(null);

//   useEffect(() => {
//     if (messageContainerRef.current) {
//       const { scrollHeight, clientHeight, scrollTop } = messageContainerRef.current;
//       if (scrollHeight - scrollTop < clientHeight + 300) {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//       }
//     }
//   }, [messages]);

//   const windowStyle = { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: theme.backgroundMain };
//   const headerStyle = { padding: `0 ${theme.spacing.md}px`, borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.backgroundAlt, flexShrink: 0, minHeight: '65px', display: 'flex', alignItems: 'center' };
//   const messageListStyle = { flexGrow: 1, overflowY: 'auto', padding: theme.spacing.md, display: 'flex', flexDirection: 'column-reverse' };
//   const messageListInnerStyle = { display: 'flex', flexDirection: 'column', gap: theme.spacing.md, paddingTop: theme.spacing.md };

//   return (
//     <div style={windowStyle}>
//       <header style={headerStyle}>{headerContent}</header>
//       <div style={messageListStyle} ref={messageContainerRef}>
//         <div style={messageListInnerStyle}>
//             <div ref={messagesEndRef} />
//             <AnimatePresence>
//               {messages.map(msg => (
//                 <motion.div key={msg._id || msg.tempId} layout initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} transition={{type:'spring', stiffness: 200, damping:20}}>
//                   <MessageBubble message={msg} onReplyRequest={onReplyRequest}/>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//             {hasMore && !isLoading && (
//               <div style={{textAlign:'center', margin: `${theme.spacing.md}px 0`}}>
//                   <Button variant="secondary" size="sm" onClick={onLoadMore}>Load Older Messages</Button>
//               </div>
//             )}
//             {isLoading && <div style={{display:'flex', justifyContent:'center', padding: theme.spacing.md}}><Loader /></div>}
//         </div>
//       </div>
//       <ChatInput onSendMessage={onSendMessage} messageToReply={messageToReply} onCancelReply={onCancelReply} />
//     </div>
//   );
// };
