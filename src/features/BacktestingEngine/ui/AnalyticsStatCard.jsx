// File: frontend/src/features/BacktestingEngine/ui/AnalyticsStatCard.jsx (NEW FILE)
import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/styles/theme';
import { Tooltip } from '@/shared/ui';
import { FaQuestionCircle } from 'react-icons/fa';

export const AnalyticsStatCard = ({ title, value, unit = '', color, tooltip, icon, size = 'md' }) => {
  const cardStyle = {
    backgroundColor: theme.backgroundAlt,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadiusLg,
    boxShadow: theme.shadowCard,
    border: `1px solid ${theme.border}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };
  const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm };
  const titleStyle = { fontSize: theme.fontSizeSm, color: theme.textMuted, fontWeight: theme.fontWeightMedium, display: 'flex', alignItems: 'center', gap: '4px' };
  const valueStyle = {
    fontSize: size === 'lg' ? '2.25rem' : '1.75rem',
    fontWeight: theme.fontWeightBold,
    color: color || theme.textPrimary,
    lineHeight: 1.2,
  };

  const content = (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <span style={titleStyle}>
          {title}
          {tooltip && <Tooltip content={tooltip}><FaQuestionCircle style={{ cursor: 'help', opacity: 0.7 }} /></Tooltip>}
        </span>
        {icon && <span style={{ fontSize: '1.5rem', color: color || theme.primary, opacity: 0.8 }}>{icon}</span>}
      </div>
      <div>
        <span style={valueStyle}>{value}{unit}</span>
      </div>
    </div>
  );
  return content;
};