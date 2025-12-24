// import React from 'react';
// import { theme } from '@/shared/styles/theme';

// export const Form = ({ children, onSubmit, className = '', style: customStyle = {}, ...props }) => {
//   const formStyle = {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: theme.spacing(5), // Space between form groups (e.g., 20px)
//     ...customStyle,
//   };
//   return (
//     <form onSubmit={onSubmit} style={formStyle} noValidate className={className} {...props}>
//       {children}
//     </form>
//   );
// };

// export const FormGroup = ({ children, className = '', style: customStyle = {} }) => {
//   const groupStyle = {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: theme.spacing(1.5), // Space between label and input (e.g., 6px)
//     textAlign: 'left',
//     ...customStyle,
//   };
//   return <div style={groupStyle} className={className}>{children}</div>;
// };

// export const FormLabel = ({ children, htmlFor, className = '', style: customStyle = {} }) => {
//   const labelStyle = {
//     fontSize: theme.fontSizeSm, // 14px
//     fontWeight: 500,
//     color: theme.textSecondary,
//     ...customStyle,
//   };
//   return <label htmlFor={htmlFor} style={labelStyle} className={className}>{children}</label>;
// };

// export const FormError = ({ children, className = '', style: customStyle = {} }) => {
//   if (!children) return null;
//   const errorStyle = {
//     fontSize: '0.8rem', // 12.8px
//     color: theme.error,
//     marginTop: theme.spacing(1), // 4px
//     textAlign: 'left',
//     ...customStyle,
//   };
//   return <p style={errorStyle} className={className}>{children}</p>;
// };
import React from 'react';
import { theme } from '@/styles/theme';

export const Form = ({ children, onSubmit, className = '', style: customStyle = {}, ...props }) => {
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.spacing.lg}px`, // e.g., 24px
    ...customStyle,
  };
  return (
    <form onSubmit={onSubmit} style={formStyle} noValidate className={className} {...props}>
      {children}
    </form>
  );
};

export const FormGroup = ({ children, className = '', style: customStyle = {} }) => {
  const groupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.spacing.xs}px`, // e.g., 4px between label and input
    textAlign: 'left',
    ...customStyle,
  };
  return <div style={groupStyle} className={className}>{children}</div>;
};

export const FormLabel = ({ children, htmlFor, className = '', style: customStyle = {} }) => {
  const labelStyle = {
    fontSize: theme.fontSizeSm,
    fontWeight: theme.fontWeightMedium,
    color: theme.textSecondary,
    marginBottom: `${theme.spacing.xs / 2}px`, // Small gap below label
    ...customStyle,
  };
  return <label htmlFor={htmlFor} style={labelStyle} className={className}>{children}</label>;
};

export const FormError = ({ children, className = '', style: customStyle = {} }) => {
  if (!children) return null;
  const errorStyle = {
    fontSize: '0.8rem',
    color: theme.error,
    marginTop: `${theme.spacing.xs}px`,
    textAlign: 'left',
    ...customStyle,
  };
  return <p style={errorStyle} className={className}>{children}</p>;
};