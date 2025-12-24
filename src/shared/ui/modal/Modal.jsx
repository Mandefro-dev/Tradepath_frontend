import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CgClose } from 'react-icons/cg';
import { Button } from '@/shared/ui';
import { useClickOutside } from '@/core/hooks/useClickOutside'; // Assuming this hook exists

export const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = React.useRef(null);
  useClickOutside(modalRef, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/80 backdrop-blur-sm p-4"
        >
          <motion.div
            ref={modalRef}
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-lg p-6 bg-dark-900 rounded-xl shadow-2xl border border-dark-700"
          >
            <div className="flex items-start justify-between pb-4 border-b border-dark-700">
              <h2 className="text-xl font-semibold text-light">{title}</h2>
              <Button variant="ghost" size="sm" onClick={onClose} className="!p-2 rounded-full">
                <CgClose className="text-xl" />
              </Button>
            </div>
            <div className="mt-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};