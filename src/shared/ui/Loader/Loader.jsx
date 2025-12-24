// File: frontend/src/shared/ui/Loader.jsx (COMPLETE & ADVANCED)
import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export const Loader = ({ size = 'md', message, className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={clsx("flex flex-col items-center justify-center gap-4", className)}>
      <motion.div
        className={clsx("rounded-full border-solid border-primary border-t-transparent animate-spin", sizeClasses[size])}
        aria-label="Loading"
        role="status"
      />
      {message && <p className="text-sm text-medium-text">{message}</p>}
    </div>
  );
};