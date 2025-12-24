import React, { useState } from 'react';
import clsx from 'clsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const Input = React.forwardRef(({
  type = 'text',
  leftIcon,
  rightIcon,
  error = false,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const baseClasses = "w-full bg-dark-800 border border-dark-700 text-light rounded-md shadow-sm placeholder-muted-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200";
  const sizeClasses = "px-4 py-2.5 text-sm";
  const iconPaddingClasses = clsx({
    'pl-10': leftIcon,
    'pr-10': rightIcon || isPassword,
  });

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="relative">
      {leftIcon && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-text">
          {leftIcon}
        </span>
      )}
      <input
        type={isPassword && showPassword ? 'text' : type}
        ref={ref}
        className={clsx(baseClasses, sizeClasses, iconPaddingClasses, error && 'border-danger focus:ring-danger/50', className)}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-text hover:text-light-text"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
      {rightIcon && !isPassword && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-text">
          {rightIcon}
        </span>
      )}
    </div>
  );
});