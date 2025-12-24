// frontend/src/shared/ui/Tooltip/Tooltip.jsx (NEW FILE)
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/styles/theme';
export const Tooltip = ({ children, content, position = 'top', delay = 300 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const tooltipBaseStyle = {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Darker tooltip
    color: '#fff',
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.borderRadiusSm,
    fontSize: theme.fontSizeSm,
    fontWeight: theme.fontWeightMedium,
    zIndex: theme.zIndexTooltip,
    whiteSpace: 'nowrap',
    boxShadow: theme.shadowSubtle,
    pointerEvents: 'none', // Important so it doesn't interfere with mouse events on child
  };

  const getPositionStyle = () => {
    switch (position) {
      case 'bottom':
        return { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' };
      case 'left':
        return { top: '50%', right: '100%', transform: 'translateY(-50%) translateX(-8px)' };
      case 'right':
        return { top: '50%', left: '100%', transform: 'translateY(-50%) translateX(8px)' };
      case 'top':
      default:
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' };
    }
  };
  
  const wrapperStyle = {
    position: 'relative',
    display: 'inline-flex', // So wrapper only takes space of children
  };

  return (
    <div
      style={wrapperStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter} // For accessibility with keyboard navigation
      onBlur={handleMouseLeave}
      tabIndex={0} // Make it focusable if it's wrapping non-interactive content
    >
      {children}
      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? 5 : (position === 'bottom' ? -5 : 0) }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === 'top' ? 5 : (position === 'bottom' ? -5 : 0) }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            style={{ ...tooltipBaseStyle, ...getPositionStyle() }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};