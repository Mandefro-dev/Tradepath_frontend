import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationCircle } from 'react-icons/fa';

export const FormError = ({ children }) => {
  if (!children) return null;

  return (
    <motion.p
      className="flex items-center gap-2 mt-2 text-sm text-danger"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <FaExclamationCircle />
      {children}
    </motion.p>
  );
};