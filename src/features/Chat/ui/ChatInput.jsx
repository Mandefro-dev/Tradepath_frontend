import React, { useState, useRef } from 'react';
import { FaPaperPlane, FaPaperclip, FaSmile } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Loader } from '@/shared/ui';
import { theme } from '@/styles/theme';
import EmojiPicker from 'emoji-picker-react';
import { useClickOutside } from '@/core/hooks/useClickOutside';
import axiosInstance from '@/core/api/axiosInstance';
import { API_ENDPOINTS } from '@/shared/config/apiConfig';
import { toast } from 'react-toastify';
import { ReplyPreview } from './ReplayPreview';

export const ChatInput = ({ onSendMessage, messageToReply, onCancelReply,isLoading }) => {
  const [text, setText] = useState('');
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);
  
  useClickOutside(emojiPickerRef, () => setEmojiPickerOpen(false));

  const handleSendText = (e) => {
    e.preventDefault();
    if (!text.trim() || isUploading) return;
    onSendMessage({ text, messageType: 'TEXT', parentMessageId: messageToReply?._id, });
    setText('');
    if (onCancelReply) onCancelReply()
  };

  const onEmojiClick = (emojiData) => {
    setText(prev => prev + emojiData.emoji);
    setEmojiPickerOpen(false);
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('chatMedia', file);

    try {
      // FIX: Use the correct API endpoint for media upload
      const response = await axiosInstance.post(API_ENDPOINTS.CHAT_MEDIA_UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const { url, name, type } = response.data;
      const messageType = type.startsWith('image/') ? 'IMAGE' : 'FILE';
      // Pass the complete payload to the parent to be sent via socket
      onSendMessage({ text: '', messageType, mediaUrl: url, fileName: name ,parentMessageId: messageToReply?._id,});
      if (onCancelReply) onCancelReply();
    } catch (error) {
      toast.error(error.response?.data?.message || "File upload failed. Max size is 10MB.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const containerStyle = { padding: theme.spacing.md, borderTop: `1px solid ${theme.border}`, backgroundColor: theme.backgroundAlt, flexShrink: 0 };
  const formStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.sm, position: 'relative' };
  const inputStyle = { width: '100%', backgroundColor: theme.surfaceLight, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadiusFull, padding: `${theme.spacing.sm + 2}px ${theme.spacing.md}px`, color: theme.textPrimary, outline: 'none' };
  const emojiPickerContainerStyle = { position: 'absolute', bottom: '120%', left: 0, zIndex: theme.zIndexDropdown };

  return (
    <div style={containerStyle}>
          <ReplyPreview messageToReply={messageToReply} onCancelReply={onCancelReply} />
      <form onSubmit={handleSendText} style={formStyle}>
        <div ref={emojiPickerRef}>
          <AnimatePresence>
          {isEmojiPickerOpen && (
            <motion.div style={emojiPickerContainerStyle} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}}>
              <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" lazyLoadEmojis={true} />
            </motion.div>
          )}
          </AnimatePresence>
          <Button variant="ghost" type="button" onClick={() => setEmojiPickerOpen(p => !p)} style={{fontSize:'1.2rem'}}><FaSmile /></Button>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{display:'none'}}/>
        <Button variant="ghost" type="button" onClick={() => fileInputRef.current.click()} style={{fontSize:'1.2rem'}} disabled={isUploading}>
            {isUploading ? <Loader size="sm"/> : <FaPaperclip />}
        </Button>

        <input placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} style={inputStyle} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSendText(e); }} />
        <Button type="submit" variant="primary" size="md" style={{borderRadius: '50%', width: '42px', height: '42px'}} disabled={!text.trim() || isUploading}><FaPaperPlane /></Button>
      </form>
    </div>)}