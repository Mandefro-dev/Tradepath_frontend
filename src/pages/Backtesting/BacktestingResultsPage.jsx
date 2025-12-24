import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchSessionResults, clearCurrentSession } from '@/entities/BacktestSession/model/backtestSlice';
import { Loader, Button } from '@/shared/ui';
import { theme } from '@/styles/theme';
import { AnalyticsStatCard } from '@/features/BacktestingEngine/ui/AnalyticsStatCard';
import { EquityCurveChart, WinLossPieChart } from '@/features/BacktestingEngine/ui/AnalyticsCharts';
import { PATHS } from '@/app/routing/paths';
import { FaArrowLeft, FaChartLine, FaPercentage, FaExchangeAlt, FaBalanceScale, FaTrophy, FaSadTear, FaRedo } from 'react-icons/fa';

export const BacktestResultsPage = () => {
  const { sessionId } = useParams();
  const dispatch = useDispatch();
  const { config, results } = useSelector(state => state.backtest.currentSession);
  const { data: analytics, status, error } = results;

  useEffect(() => {
    if (sessionId) {
      dispatch(fetchSessionResults(sessionId));
    }
    return () => { dispatch(clearCurrentSession()); };
  }, [dispatch, sessionId]);
  
  const pageStyle = { maxWidth: '1200px', margin: '0 auto', padding: theme.spacing.lg };
  const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg, paddingBottom: theme.spacing.md, borderBottom: `1px solid ${theme.border}` };
  const titleStyle = { fontSize: '2rem', fontWeight: theme.fontWeightBold };
  const statsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: theme.spacing.md, marginBottom: theme.spacing.xl };

  if (status === 'loading' || !analytics) {
    return <div style={{height:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}><Loader size="lg" message="Generating Performance Report..." /></div>;
  }
  if (status === 'failed') {
    return <div style={{color: theme.error, textAlign:'center', padding:'40px'}}>Error loading results: {error}</div>;
  }

  const pnlIsPositive = analytics.totalPnl >= 0;

  return (
    <motion.div style={pageStyle} initial={{opacity:0}} animate={{opacity:1}}>
      <div style={headerStyle}>
        <div>
            <h1 style={titleStyle}>Backtest Results</h1>
            <p style={{color: theme.textSecondary}}>Performance analysis for "{config?.name || 'Session'}"</p>
        </div>
        <Link to={`/backtesting/${sessionId}`}><Button variant="secondary" leftIcon={<FaRedo/>}>Replay Again</Button></Link>
      </div>

      <div style={statsGridStyle}>
        <AnalyticsStatCard title="Net P&L" value={analytics.totalPnl?.toFixed(2) ?? '0.00'} unit="$" color={pnlIsPositive ? theme.success : theme.error} icon={<FaDollarSign/>} size="lg"/>
        <AnalyticsStatCard title="Win Rate" value={analytics.winRate?.toFixed(1) ?? '0.0'} unit="%" color={analytics.winRate >= 50 ? theme.success : theme.warning} icon={<FaPercentage/>} tooltip="Wins / (Wins + Losses)"/>
        <AnalyticsStatCard title="Profit Factor" value={analytics.profitFactor?.toFixed(2) ?? '0.00'} color={analytics.profitFactor >= 1.5 ? theme.success : theme.info} icon={<FaBalanceScale/>} tooltip="Gross Profit / Gross Loss"/>
        <AnalyticsStatCard title="Total Trades" value={analytics.totalTrades ?? 0} icon={<FaExchangeAlt/>} />
        <AnalyticsStatCard title="Max Drawdown" value={analytics.maxDrawdown?.toFixed(2) ?? '0.00'} unit="%" color={theme.warning} tooltip="Largest peak-to-trough equity decline."/>
        <AnalyticsStatCard title="Sharpe Ratio" value={analytics.sharpeRatio?.toFixed(2) ?? 'N/A'} icon={<FaChartLine />} tooltip="Risk-adjusted return. Higher is better."/>
        <AnalyticsStatCard title="Average Win" value={analytics.averageWin?.toFixed(2) ?? '0.00'} unit="$" color={theme.success} icon={<FaTrophy/>}/>
        <AnalyticsStatCard title="Average Loss" value={analytics.averageLoss?.toFixed(2) ?? '0.00'} unit="$" color={theme.error} icon={<FaSadTear/>}/>
      </div>

      <div style={{display:'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: theme.spacing.lg, alignItems: 'stretch'}}>
        <EquityCurveChart data={analytics.equityCurve} initialBalance={config?.initialBalance || 0} />
        <WinLossPieChart wins={analytics.winningTrades} losses={analytics.losingTrades} breakevens={analytics.breakevenTrades} />
      </div>
      
      {/* A full trade journal table for this session could be rendered here */}
      {/* <div style={{marginTop: theme.spacing.xl}}>
          <h3 style={{fontSize:'1.5rem', fontWeight:theme.fontWeightSemibold}}>Trade Log</h3>
          <BacktestJournalPanel /> // We would need to fetch the trades for the session here
      </div> */}

    </motion.div>
  );
};
export default BacktestResultsPage;