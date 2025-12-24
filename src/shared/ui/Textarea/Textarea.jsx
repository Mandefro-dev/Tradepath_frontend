import React from 'react';
import { theme } from '@/styles/theme'; // Assuming you use a theme object for styling

export const Textarea = React.forwardRef(({ label, name, error, ...props }, ref) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  };

  const labelStyle = {
    marginBottom: theme.spacing.xs,
    fontSize: theme.fontSizeSm,
    fontWeight: theme.fontWeightMedium,
    color: theme.textSecondary,
  };

  const textareaStyle = {
    padding: '10px 12px',
    fontSize: theme.fontSizeMd,
    color: theme.textPrimary,
    backgroundColor: theme.surface,
    border: `1px solid ${error ? theme.error : theme.border}`,
    borderRadius: theme.borderRadius,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
    resize: 'vertical',
  };

  // Style for when the textarea is focused
  const handleFocus = (e) => {
    e.target.style.borderColor = theme.primary;
    e.target.style.boxShadow = `0 0 0 3px ${theme.primary}30`;
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = error ? theme.error : theme.border;
    e.target.style.boxShadow = 'none';
  };
  
  return (
    <div style={containerStyle}>
      {label && <label htmlFor={name} style={labelStyle}>{label}</label>}
      <textarea
        id={name}
        name={name}
        ref={ref}
        style={textareaStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {error && <p style={{ color: theme.error, fontSize: theme.fontSizeSm, marginTop: theme.spacing.xs }}>{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';