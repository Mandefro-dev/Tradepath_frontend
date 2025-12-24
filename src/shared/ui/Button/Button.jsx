import React from 'react';
import { motion } from 'framer-motion';

import { Loader } from '../Loader/Loader';
import clsx from 'clsx';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950";
  
  const variantClasses = {
    primary: "bg-primary text-white border-transparent hover:bg-primary-hover focus:ring-primary",
    secondary: "bg-dark-800 text-light border border-dark-700 hover:bg-dark-700 focus:ring-primary",
    danger: "bg-danger text-white border-transparent hover:opacity-90 focus:ring-danger",
    ghost: "bg-transparent text-primary hover:bg-primary/10 focus:ring-primary",
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      className={clsx(baseClasses, variantClasses[variant], sizeClasses[size], (disabled || isLoading) && 'opacity-60 cursor-not-allowed', className)}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? { scale: 1.03, y: -2 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      {...props}
    >
      {isLoading ? (
        <Loader size="sm" />
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};