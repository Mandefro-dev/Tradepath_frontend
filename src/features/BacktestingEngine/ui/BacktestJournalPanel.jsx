import React, { useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format, formatDistanceStrict } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/styles/theme';
import { FaStickyNote, FaCamera, FaSave, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Button,  Tooltip, Loader } from '@/shared/ui';
import { Modal } from '@/shared/ui/modal/Modal';
import { updateBacktestTradeNotes, uploadBacktestSnapshot } from '@/entities/BacktestSession/model/backtestSlice';
import html2canvas from 'html2canvas';

const TradeLogRow = ({ trade }) => {
  const dispatch = useDispatch();
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notes, setNotes] = useState(trade.notes || '');
  const [uploadStatus, setUploadStatus] = useState('idle');
  const trades = useSelector(state => state.backtest.currentSession?.trades ?? []);
  const handleNotesSave = () => {
    dispatch(updateBacktestTradeNotes({ tradeId: trade._id, notes }));
    setIsNotesModalOpen(false);
  };

  const handleSnapshotClick = () => {
    const chartElement = document.querySelector('.replay-chart-container-for-snapshot');
    if (!chartElement) { alert("Chart element not found for snapshot."); return; }

    setUploadStatus('loading');
    html2canvas(chartElement, { useCORS: true, allowTaint: true, backgroundColor: theme.backgroundAlt })
      .then(canvas => {
        canvas.toBlob((blob) => {
          const file = new File([blob], `snapshot-${trade._id}.png`, { type: 'image/png' });
          dispatch(uploadBacktestSnapshot({ tradeId: trade._id, file }))
            .finally(() => setUploadStatus('idle'));
        }, 'image/png');
      })
      .catch(err => {
        console.error("Error creating canvas for snapshot:", err);
        setUploadStatus('idle');
      });
  };

  const pnlStyle = { color: trade.pnl >= 0 ? theme.success : theme.error, fontWeight: theme.fontWeightBold };
  const rowStyle = { display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr 1fr auto', alignItems: 'center', padding: `${theme.spacing.sm}px ${theme.spacing.md}px`, borderBottom: `1px solid ${theme.border}`, fontSize: theme.fontSizeSm, transition: 'background-color 0.2s ease' };

  return (
    <>
      <motion.div style={rowStyle} whileHover={{backgroundColor: theme.surfaceLight}} layout>
        <span>{format(new Date(trade.entryTime), 'MMM dd, HH:mm:ss')}</span>
        <span style={{color: trade.direction === 'LONG' ? theme.success : theme.error}}>{trade.direction}</span>
        <span>{trade.entryPrice.toFixed(4)}</span>
        <span>{trade.exitPrice?.toFixed(4) || '-'}</span>
        <span>{trade.quantity}</span>
        <span style={pnlStyle}>{trade.pnl?.toFixed(2)}</span>
        <span style={{textTransform:'capitalize'}}>{trade.exitReason?.replace(/_/g, ' ').toLowerCase() || '-'}</span>
        <div style={{display:'flex', gap: theme.spacing.xs}}>
          <Tooltip content="Add/Edit Notes"><Button variant="ghost" size="sm" onClick={() => setIsNotesModalOpen(true)}><FaStickyNote/></Button></Tooltip>
          <Tooltip content="Capture & Upload Chart"><Button as="label" variant="ghost" size="sm" isLoading={uploadStatus === 'loading'}><FaCamera/></Button></Tooltip>
          <input type="file" onChange={handleSnapshotClick} style={{display:'none'}} disabled={uploadStatus === 'loading'} />
        </div>
      </motion.div>
      <Modal isOpen={isNotesModalOpen} onClose={() => setIsNotesModalOpen(false)} title={`Notes for ${trade.symbol} Trade`}>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="6" style={{width:'100%', backgroundColor:theme.surface, border:`1px solid ${theme.border}`, borderRadius:theme.borderRadiusMd, padding:theme.spacing.md}}/>
        <div style={{display:'flex', justifyContent:'flex-end', marginTop:theme.spacing.md}}><Button onClick={handleNotesSave}>Save Notes</Button></div>
      </Modal>
    </>
  );
};

export const BacktestJournalPanel = () => {
  const { trades } = useSelector(state => state.backtest.currentSession);
  
  const panelStyle = { backgroundColor: theme.backgroundAlt, padding: theme.spacing.md, borderTop: `1px solid ${theme.border}` };
  const headerStyle = { display:'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr 1fr auto', padding: `0 ${theme.spacing.md}px ${theme.spacing.sm}px`, borderBottom: `2px solid ${theme.borderStrong}`, fontWeight: theme.fontWeightSemibold, fontSize: theme.fontSizeSm, color: theme.textSecondary };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <span>Entry Time</span><span>Direction</span><span>Entry</span><span>Exit</span>
        <span>Qty</span><span>P&L ($)</span><span>Exit Reason</span><span>Actions</span>
      </div>
      {/* <div style={{maxHeight:'200px', overflowY:'auto'}}>
        {trades.length === 0 && <p style={{textAlign:'center', color:theme.textMuted, padding:theme.spacing.lg}}>No trades executed yet.</p>}
        <AnimatePresence>
          {[...trades].reverse().map(trade => <TradeLogRow key={trade._id} trade={trade}/>)}
        </AnimatePresence>
      </div> */}
    </div>
  );
};
