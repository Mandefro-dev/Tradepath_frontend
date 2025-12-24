import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CgClose } from 'react-icons/cg';
import { Loader, Button } from '@/shared/ui';
import { theme } from '@/styles/theme';
import { UserListItem } from './UserListItem';


export const UserListModal = ({ isOpen, onClose, title, users, isLoading }) => {
  const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 32, 0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: theme.zIndexModalBackdrop };
  const modalStyle = { backgroundColor: theme.backgroundAlt, padding: theme.spacing.lg, borderRadius: theme.borderRadiusXl, boxShadow: theme.shadowModal, width: '100%', maxWidth: '480px', height: '70vh', border: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column' };
  const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md, borderBottom: `1px solid ${theme.border}`, paddingBottom: theme.spacing.md, flexShrink: 0 };
  const titleStyle = { fontSize: '1.25rem', fontWeight: theme.fontWeightSemibold };
  const listContainerStyle = { flexGrow: 1, overflowY: 'auto', paddingRight: theme.spacing.sm };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div style={overlayStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div style={modalStyle} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} onClick={(e) => e.stopPropagation()}>
            <div style={headerStyle}>
              <h2 style={titleStyle}>{title}</h2>
              <Button variant="ghost" onClick={onClose} style={{ fontSize: '1.5rem', padding: theme.spacing.sm }}><CgClose /></Button>
            </div>
            <div style={listContainerStyle}>
              {isLoading && <div style={{paddingTop: theme.spacing.xl, display: 'flex', justifyContent:'center'}}><Loader message={`Loading ${title.toLowerCase()}...`} /></div>}
              {!isLoading && users.length === 0 && <p style={{ textAlign: 'center', color: theme.textMuted, padding: theme.spacing.lg }}>No users to display.</p>}
              {!isLoading && users.map(user => <UserListItem key={user._id} user={user} onAction={onClose} />)}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};