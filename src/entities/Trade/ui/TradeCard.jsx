// frontend/src/entities/Trade/ui/TradeCard.jsx (NEW FILE or update if placeholder exists)
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowUp, FaArrowDown, FaCalendarAlt, FaDollarSign, FaTag, FaStickyNote, FaImage,
  FaEdit, FaTrashAlt, FaChartLine, FaBalanceScale, FaPercentage, FaSmile, FaFrown, FaMeh,
  FaNewspaper, FaExclamationTriangle, FaCog, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { format, formatDistanceToNowStrict } from 'date-fns';

import { theme } from '@/styles/theme';
import { Button, Tooltip, ConfirmModal } from '@/shared/ui'; // Assuming these are created
import { deleteTrade, setTradeDetails, fetchTradeStats } from '../model/tradesSlice'; // Or from where tradesSlice is

// Helper to format duration (ms to readable string)
const formatDuration = (ms) => {
  if (!ms || ms < 0) return 'N/A';
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  let str = '';
  if (days > 0) str += `${days}d `;
  if (hours > 0) str += `${hours}h `;
  if (minutes > 0 && days === 0) str += `${minutes}m `; // Show minutes only if no days
  if (seconds > 0 && days === 0 && hours === 0) str += `${seconds}s`; // Show seconds only if no days/hours
  return str.trim() || '0s';
};


const TradeCard = ({ trade, onEditRequest }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!trade) return null;

  const {
    _id, symbol, direction, entryTime, exitTime, durationMs, entryPrice, exitPrice, quantity,
    status, stopLossPrice, takeProfitPrice, riskRewardRatio, pnl, pnlPercent, commission,
    setupTags, entryConfirmation, exitReason, emotionEntry, emotionExit, confidenceLevelEntry,
    confidenceLevelExit, newsImpact, mistakesMade, marketConditions, tradeType, tradingSession,
    notes, preTradeScreenshotUrl, postTradeScreenshotUrl, partialProfitTaken
  } = trade;

  const isWin = pnl > 0;
  const isLoss = pnl < 0;
  const isBreakeven = pnl === 0 && status === 'CLOSED';

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await dispatch(deleteTrade(_id)).unwrap();
      // Toast for success is in slice
      dispatch(fetchTradeStats({})); // Refresh stats after delete
    } catch (error) {
      // Toast for error is in slice
    }
  };

  // Inline Styles
  const cardStyle = {
    backgroundColor: theme.backgroundAlt,
    borderRadius: theme.borderRadiusXl,
    boxShadow: theme.shadowCard,
    border: `1px solid ${theme.border}`,
    marginBottom: `${theme.spacing.lg}px`,
    overflow: 'hidden', // For rounded corners with motion.div
    color: theme.textPrimary,
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
    borderBottom: `1px solid ${theme.border}`,
    cursor: 'pointer', // To indicate it's expandable
  };

  const symbolStyle = {
    fontSize: '1.25rem',
    fontWeight: theme.fontWeightSemibold,
    color: theme.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: `${theme.spacing.sm}px`,
  };

  const directionIconStyle = (dir) => ({
    color: dir === 'LONG' ? theme.success : theme.error,
    fontSize: '1.1em',
  });

  const pnlStyle = {
    fontSize: '1.2rem',
    fontWeight: theme.fontWeightBold,
    color: isWin ? theme.success : (isLoss ? theme.error : theme.textSecondary),
  };

  const summaryGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: `${theme.spacing.md}px`,
    padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
  };

  const detailItemStyle = {
    fontSize: theme.fontSizeSm,
    color: theme.textSecondary,
    display: 'flex',
    flexDirection: 'column', // Stack label and value
  };
  const detailLabelStyle = {
    fontWeight: theme.fontWeightMedium,
    color: theme.textMuted,
    marginBottom: `${theme.spacing.xs / 2}px`,
    fontSize: '0.8rem',
  };
  const detailValueStyle = {
    fontWeight: theme.fontWeightSemibold,
    color: theme.textPrimary,
  };

  const tagStyle = {
    backgroundColor: `rgba(${theme.primaryRGB}, 0.15)`,
    color: theme.primary,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.borderRadiusFull,
    fontSize: '0.75rem',
    fontWeight: theme.fontWeightMedium,
  };

  const expandedContentStyle = {
    padding: `0 ${theme.spacing.lg}px ${theme.spacing.lg}px ${theme.spacing.lg}px`,
    borderTop: `1px solid ${theme.border}`,
    marginTop: `${theme.spacing.md}px`,
  };
  
  const sectionTitleStyle = {
    fontSize: '1rem',
    fontWeight: theme.fontWeightSemibold,
    color: theme.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    borderBottom: `1px solid ${theme.surface}`,
  };

  const screenshotStyle = {
    maxWidth: '200px',
    maxHeight: '150px',
    borderRadius: theme.borderRadiusMd,
    border: `1px solid ${theme.border}`,
    objectFit: 'cover',
    cursor: 'pointer', // For opening in a lightbox later
  };

  const actionButtonStyle = {
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    fontSize: theme.fontSizeSm,
  };


  return (
    <>
      <motion.div
        style={cardStyle}
        layout // Animate layout changes when expanding
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={{ boxShadow: theme.shadowModal, borderColor: theme.primaryLight }}
      >
        <div style={headerStyle} onClick={() => setIsExpanded(!isExpanded)}>
          <div style={symbolStyle}>
            {direction === 'LONG' ? <FaArrowUp style={directionIconStyle('LONG')} /> : <FaArrowDown style={directionIconStyle('SHORT')} />}
            {symbol}
            <span style={{fontSize: theme.fontSizeSm, color: theme.textMuted, fontWeight: theme.fontWeightNormal}}>
              ({direction})
            </span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: theme.spacing.lg}}>
            <span style={pnlStyle}>
              {pnl != null ? `${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}` : (status === 'OPEN' ? 'Open' : 'N/A')}
              {status === 'CLOSED' && pnl != null && <span style={{fontSize: '0.8em', marginLeft: theme.spacing.xs, color: theme.textMuted}}>({pnlPercent != null ? pnlPercent.toFixed(2) : '...'}%)</span>}
            </span>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
              <FaChevronDown style={{ color: theme.textMuted }} />
            </motion.div>
          </div>
        </div>

        <div style={summaryGridStyle}>
          <div style={detailItemStyle}><span style={detailLabelStyle}>Entry Date</span> <span style={detailValueStyle}>{format(new Date(entryTime), 'MMM dd, yyyy HH:mm')}</span></div>
          <div style={detailItemStyle}><span style={detailLabelStyle}>Exit Date</span> <span style={detailValueStyle}>{exitTime ? format(new Date(exitTime), 'MMM dd, yyyy HH:mm') : 'Open'}</span></div>
          <div style={detailItemStyle}><span style={detailLabelStyle}>Duration</span> <span style={detailValueStyle}>{status === 'CLOSED' ? formatDuration(durationMs) : '-'}</span></div>
          <div style={detailItemStyle}><span style={detailLabelStyle}>R:R</span> <span style={detailValueStyle}>{riskRewardRatio ? riskRewardRatio.toFixed(2) + ':1' : 'N/A'}</span></div>
          <div style={detailItemStyle}><span style={detailLabelStyle}>Quantity</span> <span style={detailValueStyle}>{quantity}</span></div>
          <div style={detailItemStyle}><span style={detailLabelStyle}>Entry Price</span> <span style={detailValueStyle}>{entryPrice.toFixed(4)}</span></div>
          <div style={detailItemStyle}><span style={detailLabelStyle}>Exit Price</span> <span style={detailValueStyle}>{exitPrice ? exitPrice.toFixed(4) : 'N/A'}</span></div>
          <div style={detailItemStyle}><span style={detailLabelStyle}>Commission</span> <span style={detailValueStyle}>{commission != null ? commission.toFixed(2) : 'N/A'}</span></div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              style={expandedContentStyle}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {setupTags && setupTags.length > 0 && (
                <div style={{marginBottom: theme.spacing.md}}>
                  <h4 style={sectionTitleStyle}>Setup Tags</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.sm }}>
                    {setupTags.map(tag => <span key={tag} style={tagStyle}>{tag}</span>)}
                  </div>
                </div>
              )}

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing.md}}>
                {entryConfirmation && <div style={detailItemStyle}><span style={detailLabelStyle}>Entry Confirmation</span> <span style={detailValueStyle}>{entryConfirmation}</span></div>}
                {exitReason && <div style={detailItemStyle}><span style={detailLabelStyle}>Exit Reason</span> <span style={detailValueStyle}>{exitReason}</span></div>}
                {emotionEntry && <div style={detailItemStyle}><span style={detailLabelStyle}>Emotion (Entry)</span> <span style={detailValueStyle}>{emotionEntry}</span></div>}
                {confidenceLevelEntry && <div style={detailItemStyle}><span style={detailLabelStyle}>Confidence (Entry)</span> <span style={detailValueStyle}>{confidenceLevelEntry}/10</span></div>}
                {emotionExit && <div style={detailItemStyle}><span style={detailLabelStyle}>Emotion (Exit)</span> <span style={detailValueStyle}>{emotionExit}</span></div>}
                {confidenceLevelExit && <div style={detailItemStyle}><span style={detailLabelStyle}>Confidence (Exit)</span> <span style={detailValueStyle}>{confidenceLevelExit}/10</span></div>}
                {marketConditions && <div style={detailItemStyle}><span style={detailLabelStyle}>Market Conditions</span> <span style={detailValueStyle}>{marketConditions}</span></div>}
                {tradeType && <div style={detailItemStyle}><span style={detailLabelStyle}>Trade Type</span> <span style={detailValueStyle}>{tradeType}</span></div>}
                {tradingSession && <div style={detailItemStyle}><span style={detailLabelStyle}>Session</span> <span style={detailValueStyle}>{tradingSession}</span></div>}
                {newsImpact && <div style={detailItemStyle}><span style={detailLabelStyle}>News Impact</span> <span style={detailValueStyle}>{newsImpact}</span></div>}
                {mistakesMade && <div style={detailItemStyle}><span style={detailLabelStyle}>Mistakes Made</span> <span style={detailValueStyle}>{mistakesMade}</span></div>}
                {partialProfitTaken && <div style={detailItemStyle}><span style={detailLabelStyle}>Partial Profit</span> <span style={detailValueStyle}>Yes</span></div>}
              </div>

              {notes && (
                <div style={{marginTop: theme.spacing.md}}>
                  <h4 style={sectionTitleStyle}>Notes</h4>
                  <p style={{...detailValueStyle, whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.9rem'}}>{notes}</p>
                </div>
              )}

              {(preTradeScreenshotUrl || postTradeScreenshotUrl) && (
                <div style={{marginTop: theme.spacing.md}}>
                  <h4 style={sectionTitleStyle}>Screenshots</h4>
                  <div style={{ display: 'flex', gap: theme.spacing.md, flexWrap: 'wrap' }}>
                    {preTradeScreenshotUrl && <a href={`${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES || 'http://localhost:5001'}${preTradeScreenshotUrl}`} target="_blank" rel="noopener noreferrer"><img src={`${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES || 'http://localhost:5001'}${preTradeScreenshotUrl}`} alt="Pre-trade" style={screenshotStyle} /></a>}
                    {postTradeScreenshotUrl && <a href={`${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES || 'http://localhost:5001'}${postTradeScreenshotUrl}`} target="_blank" rel="noopener noreferrer"><img src={`${import.meta.env.VITE_API_BASE_URL_FOR_IMAGES || 'http://localhost:5001'}${postTradeScreenshotUrl}`} alt="Post-trade" style={screenshotStyle} /></a>}
                  </div>
                </div>
              )}

              <div style={{ marginTop: theme.spacing.lg, display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.md, borderTop: `1px solid ${theme.border}`, paddingTop: theme.spacing.md }}>
                <Button variant="secondary" size="sm" onClick={() => onEditRequest(trade)} style={actionButtonStyle} leftIcon={<FaEdit />}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)} style={actionButtonStyle} leftIcon={<FaTrashAlt />}>Delete</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Trade"
        message={`Are you sure you want to permanently delete the trade for ${symbol}?`}
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
};

export default TradeCard;