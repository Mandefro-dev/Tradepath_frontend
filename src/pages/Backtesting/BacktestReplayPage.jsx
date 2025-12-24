import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  fetchSessionDetails,
  fetchSessionTrades,
  clearCurrentSession,
  // Import all socket event reducers
  setSessionReady,
  setSessionStatus,
  appendCandleData,
  handleTradeOpened,
  handleTradeClosed,
  setSessionError,
  updateSessionState
} from '@/entities/BacktestSession/model/backtestSlice';
import backtestSocketService from '@/core/socket/backtest.socket.service';
import { useSocket } from '@/core/socket/socketContext';
import { Loader, Button } from '@/shared/ui';
import { theme } from '@/styles/theme';
import { ReplayChartDisplay } from '@/features/BacktestingEngine/ui/ReplayChartDisplay';
import { ReplayControlBar } from '@/features/BacktestingEngine/ui/ReplayControlBar';
import { TradeExecutionPanel } from '@/features/BacktestingEngine/ui/TradeExecutionPanel';
import { BacktestJournalPanel } from '@/features/BacktestingEngine/ui/BacktestJournalPanel';
import { PATHS } from '@/app/routing/paths';
import { FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const BacktestReplayPage = () => {
  const { sessionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const { currentSession } = useSelector(state => state.backtest);
  const { config, status, candles, openPosition, trades, equity, error } = currentSession;

  useEffect(() => {
    if (sessionId) {
      // FIX: The `.unwrap().catch()` logic is removed. We will handle errors based on the Redux state.
      dispatch(fetchSessionDetails(sessionId));
      dispatch(fetchSessionTrades(sessionId));
    }
    // Cleanup function to clear the session data when leaving the page
    return () => {
      dispatch(clearCurrentSession());
    };
  }, [dispatch, sessionId]);

  useEffect(() => {
    if (socket && sessionId && status !== 'error') {
      const dispatchActions = {
        setSessionReady: (data) => dispatch(setSessionReady(data)),
        setSessionStatus: (data) => dispatch(setSessionStatus(data)),
        appendCandleData: (data) => dispatch(appendCandleData(data)),
        handleTradeOpened: (data) => dispatch(handleTradeOpened(data)),
        handleTradeClosed: (data) => dispatch(handleTradeClosed(data)),
        setSessionError: (data) => dispatch(setSessionError(data)),
        updateSessionState: (data) => dispatch(updateSessionState(data)),
      };
      backtestSocketService.connect(socket, dispatchActions);
      backtestSocketService.setupSession(sessionId);
    }
    // Cleanup function to disconnect the service
    return () => {
      backtestSocketService.disconnect();
    };
  }, [dispatch, sessionId, socket, status]); // Re-run if status changes from error

  // --- Inline Styles ---
  const pageStyle = { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 65px)', overflow: 'hidden' };
  const topBarStyle = { padding: `${theme.spacing.sm}px ${theme.spacing.md}px`, borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: theme.spacing.md, backgroundColor: theme.backgroundAlt, flexShrink:0 };
  const mainContentStyle = { display: 'flex', flexGrow: 1, overflow: 'hidden' };
  const chartAreaStyle = { flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative' };
  const errorOverlayStyle = { position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter:'blur(4px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:100, color: theme.error };

  // --- RENDER LOGIC ---
  if (status === 'loading' || status === 'configuring' || !config) {
    return <div style={{height: 'calc(100vh - 65px)', display:'flex', alignItems:'center', justifyContent:'center'}}><Loader size="lg" message="Loading Backtest Session..." /></div>;
  }
  
  if (status === 'error') {
    return (
      <div style={{...pageStyle, alignItems:'center', justifyContent:'center', gap: theme.spacing.lg}}>
        <FaExclamationTriangle style={{fontSize:'4rem', color: theme.error}}/>
        <h2 style={{fontSize:'1.5rem', fontWeight:theme.fontWeightBold}}>Failed to Load Session</h2>
        <p style={{color: theme.textSecondary}}>{error || "An unknown error occurred."}</p>
        <Link to={PATHS.BACKTEST_DASHBOARD}><Button variant="secondary">Back to Dashboard</Button></Link>
      </div>
    );
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} style={pageStyle}>
      <div style={topBarStyle}>
        <Link to={PATHS.BACKTEST_DASHBOARD}><Button variant="secondary" size="sm" leftIcon={<FaArrowLeft/>}>Dashboard</Button></Link>
        <h1 style={{fontWeight:theme.fontWeightSemibold}}>{config.name}</h1>
        <span style={{color: theme.textMuted}}>{config.symbol} | {config.timeframe}</span>
      </div>
      <div style={mainContentStyle}>
        <div style={chartAreaStyle}>
          <div className="replay-chart-container-for-snapshot" style={{flexGrow: 1}}>
            <ReplayChartDisplay candles={candles} openPosition={openPosition} executedTrades={trades} />
          </div>
          <ReplayControlBar sessionId={sessionId} currentStatus={status} currentSpeed={currentSession.replaySpeed} />
        </div>
        <TradeExecutionPanel sessionId={sessionId} />
      </div>
      <div style={{flexShrink: 0, borderTop: `1px solid ${theme.border}`}}>
        <BacktestJournalPanel sessionId={sessionId} />
      </div>
    </motion.div>
  );
};
export default BacktestReplayPage;
