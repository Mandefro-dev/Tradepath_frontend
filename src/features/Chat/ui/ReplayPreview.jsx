import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { theme } from '@/styles/theme';

export const ReplyPreview = ({ messageToReply, onCancelReply }) => {
  if (!messageToReply) return null;

  const containerStyle = {
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    backgroundColor: theme.surface,
    borderTop: `1px solid ${theme.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: theme.fontSizeSm,
  };
  const contentStyle = { color: theme.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
  const authorStyle = { fontWeight: theme.fontWeightSemibold, color: theme.textPrimary, marginRight: '4px' };
  const buttonStyle = { background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', padding: theme.spacing.xs };

  return (
    <motion.div style={containerStyle} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
      <div style={contentStyle}>
        Replying to <span style={authorStyle}>{messageToReply.user.name}</span>: "{messageToReply.text}"
      </div>
      <button onClick={onCancelReply} style={buttonStyle} aria-label="Cancel reply"><FaTimes /></button>
    </motion.div>
  );
};