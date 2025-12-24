// frontend/src/features/Journaling/ui/JournalInsights.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaLightbulb, FaRobot, FaChartBar, FaExclamationTriangle } from 'react-icons/fa';
import { theme } from '@/styles/theme';

const JournalInsights = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: `${theme.spacing.xxl}px ${theme.spacing.lg}px`,
    minHeight: 'calc(100vh - 250px)',
    backgroundColor: theme.backgroundAlt,
    borderRadius: theme.borderRadiusXl,
    border: `1px solid ${theme.border}`,
    color: theme.textPrimary,
  };

  const iconStyle = {
    fontSize: '4.5rem',
    color: theme.primary,
    marginBottom: theme.spacing.lg,
    background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.info} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const titleStyle = {
    fontSize: '1.75rem',
    fontWeight: theme.fontWeightBold,
    marginBottom: theme.spacing.md,
  };

  const messageStyle = {
    fontSize: '1rem',
    color: theme.textSecondary,
    maxWidth: '550px',
    marginBottom: theme.spacing.xl,
    lineHeight: 1.7,
  };

  const featureListStyle = {
    listStyle: 'none',
    padding: 0,
    marginBottom: theme.spacing.xl,
    color: theme.textSecondary,
    textAlign: 'left',
    maxWidth: '400px',
    margin: `0 auto ${theme.spacing.xl}px auto`,
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.spacing.md}px`,
  };

  const featureItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    fontSize: '0.95rem',
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <FaRobot style={iconStyle} />
      <h2 style={titleStyle}>Smart Insights are Coming Soon!</h2>
      <p style={messageStyle}>
        Unlock deeper understanding of your trading behavior. We're developing AI-powered tools to analyze your journal and provide personalized, actionable feedback.
      </p>
      <div style={featureListStyle}>
        <div style={featureItemStyle}><FaLightbulb style={{color: theme.warning, fontSize: '1.5rem', flexShrink: 0}} /> <span>Identify your most profitable setups and market conditions.</span></div>
        <div style={featureItemStyle}><FaExclamationTriangle style={{color: theme.error, fontSize: '1.5rem', flexShrink: 0}} /> <span>Recognize recurring mistakes and emotional patterns.</span></div>
        <div style={featureItemStyle}><FaChartBar style={{color: theme.success, fontSize: '1.5rem', flexShrink: 0}} /> <span>Optimize your performance based on time of day, asset class, and more.</span></div>
      </div>
      <p style={{...messageStyle, fontSize: theme.fontSizeSm }}>
        The more detailed your journal, the more powerful your insights will be. Keep logging!
      </p>
    </motion.div>
  );
};
export default JournalInsights;
