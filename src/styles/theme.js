export const lightTheme = {
    // Colors
    primary: '#007AFF', // Professional Blue
    primaryHover: '#0056b3',
    primaryLight: 'rgba(0, 122, 255, 0.1)',
    primaryRGB: '0, 122, 255',
  
    backgroundMain: '#f4f7f9', // Very light gray, almost white
    backgroundAlt: '#ffffff',   // White for cards, surfaces
    surface: '#E9ECEF',   
    surfaceHover: '#DDE2E6',      // Slightly darker gray for secondary elements
    surfaceLight: '#F8F9FA',   // Even lighter for subtle distinctions
    textDisabled: '#adb5bd',
    textPrimary: '#212529',     // Dark gray for primary text
    textSecondary: '#495057',    // Medium gray for secondary text
    textMuted: '#6c757d',       // Lighter gray for muted text
    textOnPrimary: '#FFFFFF',   // Text on primary color buttons
  
    border: '#dee2e6',          // Standard border color
    borderStrong: '#ced4da',
    inputFocusBorder: '#80bdff', // Light blue for focus, similar to Bootstrap
    inputFocusBoxShadow: (colorRGB) => `0 0 0 0.2rem rgba(${colorRGB}, 0.25)`,
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
  
    // Typography
    fontFamilySans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSizeBase: '16px',
    fontSizeSm: '0.875rem', // 14px
    fontSizeLg: '1.125rem', // 18px
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightSemibold: 600,
    fontWeightBold: 700,
  
    // Spacing (can be used as multipliers or direct values)
    // spacingUnit: 4, // 4px base
    // spacing: {
    //   xs: 4,
    //   sm: 8,
    //   md: 16,
    //   lg: 24,
    //   xl: 32,
    //   xxl: 48,
    // },
    spacing: (multiplier) => `${multiplier * 4}px`, // e.g., theme.spacing(2) -> '8px'
  
    // Borders
    borderRadiusSm: '0.2rem',
    borderRadiusMd: '0.375rem',
    borderRadiusLg: '0.5rem',
    borderRadiusXl: '0.75rem',
    borderRadiusFull: '9999px',
  
    // Shadows (subtle for light theme)
    shadowSubtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowCard: '0 3px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    shadowModal: '0 10px 20px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    shadowFocus: (colorRGB) => `0 0 0 3px rgba(${colorRGB}, 0.25)`,

  
    // Z-Indexes
    zIndexDropdown: 1000,
    zIndexSticky: 1020,
    zIndexModalBackdrop: 1040,
    zIndexModal: 1050,
    zIndexToast: 1090,


    transitionSpeed: '0.2s',
    transitionTiming: 'ease-in-out',
  };
  
  // Example Dark Theme (can be toggled later if needed)
  export const darkTheme = {
    primary: '#0ea5e9', // sky-500
    primaryHover: '#0284c7', // sky-600
    primaryRGB: '14, 165, 233',
  
    backgroundMain: '#0B1120',    // Very dark blue/slate
    backgroundAlt: '#1E293B',   // slate-800
    surface: '#334155',  // slate-700
    surfaceLight: '#475569', // slate-600
  
    textPrimary: '#f1f5f9', // slate-100
    textSecondary: '#94a3b8',// slate-400
    textMuted: '#64748b',   // slate-500
    textOnPrimary: '#FFFFFF',
  
    border: '#3e4c5f',
    borderStrong: '#475569',
    inputFocusBorder: '#38bdf8', // sky-400
  
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    // ... (copy spacing, borderRadius, shadows, zIndexes from lightTheme or define new ones)
    ...lightTheme, // Spread common values, then override specifics
  };
  
  // For now, we'll default to light theme
  export const theme = lightTheme;
  
  // Helper for hover states with inline styles
  import React from "react";
  export const useAddHover = (baseStyle, hoverStyle) => {
    const [isHovered, setIsHovered] = React.useState(false); // Needs React import in component
    return {
      style: { ...baseStyle, ...(isHovered ? hoverStyle : {}) },
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
    };
  };