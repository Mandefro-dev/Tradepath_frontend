
// frontend/src/shared/ui/Modal/ConfirmModal.jsx (NEW FILE)
// This is a specific type of Modal for confirmations
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Button } from '@/shared/ui/Button/Button'; // Use your styled Button

import { theme } from '@/styles/theme';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: -20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger", // 'danger', 'warning', 'info', 'success'
}) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (variant) {
      case 'danger': return { icon: <FaExclamationTriangle />, color: theme.error };
      case 'warning': return { icon: <FaExclamationTriangle />, color: theme.warning };
      case 'success': return { icon: <FaCheckCircle />, color: theme.success };
      case 'info':
      default: return { icon: <FaQuestionCircle />, color: theme.info };
    }
  };

  const { icon, color: iconColor } = getIconAndColor();

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: theme.zIndexModalBackdrop,
  };

  const modalStyle = {
    backgroundColor: theme.backgroundAlt,
    padding: `${theme.spacing.lg}px`,
    borderRadius: theme.borderRadiusXl,
    boxShadow: theme.shadowModal,
    width: '100%',
    maxWidth: '450px',
    border: `1px solid ${theme.border}`,
    textAlign: 'center',
  };

  const iconContainerStyle = {
    fontSize: '3rem',
    color: iconColor,
    marginBottom: theme.spacing.md,
  };

  const titleStyle = {
    fontSize: '1.375rem', // ~22px
    fontWeight: theme.fontWeightSemibold,
    color: theme.textPrimary,
    marginBottom: theme.spacing.sm,
  };

  const messageStyle = {
    fontSize: '0.95rem',
    color: theme.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 1.6,
  };

  const actionsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: `${theme.spacing.md}px`,
    marginTop: theme.spacing.lg,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={overlayStyle}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose} // Close on overlay click
        >
          <motion.div
            style={modalStyle}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()} // Prevent close on modal content click
          >
            <div style={iconContainerStyle}>{icon}</div>
            <h2 style={titleStyle}>{title}</h2>
            <p style={messageStyle}>{message}</p>
            <div style={actionsStyle}>
              <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                {cancelText}
              </Button>
              <Button
                variant={variant === 'danger' || variant === 'warning' ? 'danger' : 'primary'}
                onClick={onConfirm}
                isLoading={isLoading}
                disabled={isLoading}
                style={variant === 'success' ? {backgroundColor: theme.success, borderColor: theme.success} : {}}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )}