import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaEye, FaCalendarAlt, FaCheckCircle, FaPauseCircle, FaExclamationTriangle,FaCog } from 'react-icons/fa';
import { theme } from '@/styles/theme';
import { Button } from '@/shared/ui';
import { format } from 'date-fns';

const statusStyles = {
  COMPLETED: { color: theme.success, icon: <FaCheckCircle/>, label: 'Completed' },
  RUNNING: { color: theme.primary, icon: <FaPlay style={{animation: 'pulse 1.5s infinite'}}/>, label: 'Running' },
  PAUSED: { color: theme.warning, icon: <FaPauseCircle/>, label: 'Paused' },
  ERROR: { color: theme.error, icon: <FaExclamationTriangle/>, label: 'Error' },
  default: { color: theme.textMuted, icon: <FaCog/>, label: 'Configuring' }
};

export const BacktestSessionCard = ({ session }) => {
  const cardStyle = { backgroundColor: theme.backgroundAlt, borderRadius: theme.borderRadiusXl, boxShadow: theme.shadowCard, border: `1px solid ${theme.border}`, padding: theme.spacing.md, display:'flex', flexDirection:'column', gap: theme.spacing.md };
  const headerStyle = { display:'flex', justifyContent:'space-between', alignItems:'flex-start'};
  const titleStyle = { fontWeight: theme.fontWeightSemibold, fontSize: '1.1rem', color: theme.textPrimary };
  const statusBadgeStyle = (status) => ({
    textTransform: 'capitalize',
    fontSize: theme.fontSizeSm,
    fontWeight: theme.fontWeightMedium,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.borderRadiusFull,
    backgroundColor: `rgba(${(statusStyles[status] || statusStyles.default).color.replace(/[^\d,]/g, '')}, 0.1)`,
    color: (statusStyles[status] || statusStyles.default).color,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs
  });
  
  return (
    <>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      <motion.div style={cardStyle} whileHover={{y: -5, boxShadow: theme.shadowModal}}>
        <div style={headerStyle}>
          <div>
            <h3 style={titleStyle}>{session.name}</h3>
            <p style={{color: theme.textSecondary, fontWeight: theme.fontWeightMedium}}>{session.symbol} - {session.timeframe}</p>
          </div>
          <span style={statusBadgeStyle(session.status)}>
            {(statusStyles[session.status] || statusStyles.default).icon}
            {(statusStyles[session.status] || statusStyles.default).label}
          </span>
        </div>
        <div style={{color: theme.textMuted, fontSize: theme.fontSizeSm, display:'flex', alignItems:'center', gap: theme.spacing.sm}}>
          <FaCalendarAlt />
          <span>{format(new Date(session.startDate), 'MMM dd, yyyy')} - {format(new Date(session.endDate), 'MMM dd, yyyy')}</span>
        </div>
        <div style={{marginTop: 'auto', paddingTop: theme.spacing.md, borderTop: `1px solid ${theme.border}`}}>
          <Link to={`/backtesting/${session._id}`} style={{textDecoration:'none'}}>
            <Button variant="primary" style={{width:'100%'}} leftIcon={session.status === 'COMPLETED' ? <FaEye/> : <FaPlay/>}>
              {session.status === 'COMPLETED' ? 'Review Results' : 'Continue Session'}
            </Button>
          </Link>
        </div>
      </motion.div>
    </>
  )}