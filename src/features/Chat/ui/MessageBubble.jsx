import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { FaFileAlt, FaReply } from 'react-icons/fa';

export const MessageBubble = ({ message, onReplyRequest }) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const isOwnMessage = message.user._id === currentUser._id;
  const [isHovered, setIsHovered] = useState(false);

  // Determine the correct Image/File URL
  const getMediaUrl = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL_FOR_IMAGES || 'http://localhost:5001';
    // Fallback logic: check if mediaUrl exists or if it's nested in the media object
    const path = message.mediaUrl || message.media?.url;
    if (!path) return '';
    return path.startsWith('http') ? path : `${baseUrl}${path}`;
  };

  const renderContent = () => {
    const url = getMediaUrl();
    
    switch (message.messageType) {
      case 'IMAGE':
        return (
          <div className="mt-1 mb-1 max-w-sm overflow-hidden rounded-lg border border-white/10">
            <img 
              src={url} 
              alt={message.fileName || 'Uploaded image'} 
              className="w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(url, '_blank')}
            />
          </div>
        );
      case 'FILE':
        return (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 p-2 bg-black/20 rounded hover:bg-black/30 transition-colors mt-1"
          >
            <FaFileAlt className="text-blue-400" />
            <span className="text-sm truncate max-w-[200px]">{message.fileName || 'Download File'}</span>
          </a>
        );
      case 'TEXT':
      default:
        return <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>;
    }
  };

  return (
    <motion.div 
      className={`flex items-end gap-2 mb-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      {!isOwnMessage && (
        <img 
          src={message.user.profilePicture || `https://ui-avatars.com/api/?name=${message.user.name}&background=random`} 
          alt={message.user.name} 
          className="w-8 h-8 rounded-full border border-gray-700 mb-5"
        />
      )}

      <div className={`flex flex-col max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {/* Username for others */}
        {!isOwnMessage && (
          <span className="text-xs font-semibold text-blue-400 ml-2 mb-1">
            {message.user.name}
          </span>
        )}

        <div className="relative group">
          {/* Main Bubble */}
          <div 
            className={`px-4 py-2 shadow-md relative ${
              isOwnMessage 
                ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm' 
                : 'bg-gray-800 text-gray-100 rounded-2xl rounded-bl-sm border border-gray-700'
            }`}
          >
            {renderContent()}

            {/* Reply Button (Hover Only) */}
            <button
              onClick={() => onReplyRequest(message)}
              className={`absolute top-0 -translate-y-1/2 p-1.5 bg-gray-700 border border-gray-600 rounded-full text-xs text-white shadow-xl transition-opacity duration-200 hover:bg-gray-600 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              } ${isOwnMessage ? '-left-8' : '-right-8'}`}
            >
              <FaReply />
            </button>
          </div>

          {/* Timestamp */}
          <div className={`mt-1 text-[10px] text-gray-500 ${isOwnMessage ? 'text-right mr-1' : 'text-left ml-1'}`}>
            {message.createdAt ? format(new Date(message.createdAt), 'p') : 'Just now'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};// import React from 'react';
// import { motion } from 'framer-motion';
// import { useSelector } from 'react-redux';
// import { format } from 'date-fns';
// import { theme } from '@/styles/theme';
// import { FaFileAlt } from 'react-icons/fa';
// import { FaReply } from 'react-icons/fa';

// export const MessageBubble = ({ message , onReplyRequest}) => {
//   const { user: currentUser } = useSelector(state => state.auth);
//   const isOwnMessage = message.user._id === currentUser._id;
//   const [hovered, setHovered] = React.useState(false);

//   const bubbleStyle = {
//     display: 'flex',
//     flexDirection: isOwnMessage ? 'row-reverse' : 'row',
//     alignItems: 'flex-end',
//     gap: theme.spacing.sm,
//     maxWidth: '80%',
//     marginLeft: isOwnMessage ? 'auto' : '0',
//     marginRight: isOwnMessage ? '0' : 'auto',
//   };
//   const contentStyle = {
//     backgroundColor: isOwnMessage ? theme.primary : theme.surface,
//     color: isOwnMessage ? theme.textOnPrimary : theme.textPrimary,
//     padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
//     borderRadius: theme.borderRadiusXl,
//     borderBottomLeftRadius: isOwnMessage ? theme.borderRadiusXl : '4px',
//     borderBottomRightRadius: isOwnMessage ? '4px' : theme.borderRadiusXl,
//     boxShadow: theme.shadowSubtle,
//   };
//   const avatarStyle = { width: '32px', height: '32px', borderRadius: '50%' };
//   const textStyle = { whiteSpace: 'pre-wrap', wordBreak: 'break-word' };
//   const metadataStyle = { fontSize: '0.7rem', color: isOwnMessage ? theme.surfaceLight : theme.textMuted, marginTop: '2px', textAlign: isOwnMessage ? 'right' : 'left' };
//   const bubbleContainerStyle = {
//     display: 'flex',
//     flexDirection: isOwnMessage ? 'row-reverse' : 'row',
//     alignItems: 'flex-end',
//     gap: theme.spacing.sm,
//     maxWidth: '80%',
//     marginLeft: isOwnMessage ? 'auto' : '0',
//     marginRight: isOwnMessage ? '0' : 'auto',
//   };
//   const imageStyle = { maxWidth: '300px', maxHeight: '300px', borderRadius: theme.borderRadiusLg, cursor: 'pointer' };
//   const fileStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.sm, padding: `${theme.spacing.xs}px 0` };
//   const replyButtonStyle = {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     background: 'transparent',
//     border: 'none',
//     color: '#555',
//     cursor: 'pointer',
//     opacity: 0,
//     transition: 'opacity 0.2s ease',
//   };
  
//   const renderContent = () => {
//     switch (message.messageType) {
//       case 'IMAGE':
//         return <img src={`${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES || 'http://localhost:5001'}${message.mediaUrl}`} alt={message.fileName || 'Uploaded image'} style={imageStyle} />;
//       case 'FILE':
//         return <a href={`${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES || 'http://localhost:5001'}${message.mediaUrl}`} target="_blank" rel="noopener noreferrer" style={fileStyle}><FaFileAlt /> {message.fileName}</a>;
//       case 'TEXT':
//       default:
//         return <p style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{message.text}</p>;
//     }
//   };
//   return (
//     <motion.div style={bubbleContainerStyle} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
//       {!isOwnMessage && <img src={message.user.profilePicture || `https://i.pravatar.cc/32?u=${message.user._id}`} alt={message.user.name} style={avatarStyle} />}
//       <div style={{maxWidth: '100%'}}>
//       <div style={contentStyle}>
//           {!isOwnMessage && <p style={{fontWeight: theme.fontWeightSemibold, fontSize: theme.fontSizeSm, color: isOwnMessage ? theme.textOnPrimary : theme.primary}}>{message.user.name}</p>}
//           {renderContent()}
         

          
// <div
//   onMouseEnter={() => setHovered(true)}
//   onMouseLeave={() => setHovered(false)}
//   style={{ ...contentStyle, position: 'relative' }}
// >
//   {/* Message content */}
//   <button
//     onClick={() => onReplyRequest(message)}
//     style={{ ...replyButtonStyle, opacity: hovered ? 1 : 0 }}
//   >
//     <FaReply />
//   </button>
// </div>
//         </div>
//         <p style={metadataStyle}>{format(new Date(message.createdAt), 'p')}</p>
//       </div>
//     </motion.div>
//   );
// };