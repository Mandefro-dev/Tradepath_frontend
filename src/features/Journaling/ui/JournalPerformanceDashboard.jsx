// // frontend/src/features/Journaling/ui/JournalPerformanceDashboard.jsx

// import React, { useEffect, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { motion } from 'framer-motion';
// import {
//   ResponsiveContainer, LineChart, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell
// } from 'recharts';
// import {
//   FaFilter, FaSyncAlt, FaDollarSign, FaPercentage, FaExchangeAlt,
//   FaChartPie, FaTrophy, FaSadTear, FaBalanceScale, FaQuestionCircle, FaChartLine,FaCog
// } from 'react-icons/fa';
// import { format } from 'date-fns';
// import { fetchTradeStats, fetchTrades } from '@/entities/Trade/model/tradesSlice';

// import { theme } from '@/styles/theme';
// import { Loader, Button, Tooltip } from '@/shared/ui';
// // Note: JournalFilterBar would be imported if we wanted a separate filter control on this page.
// // For now, we'll display stats based on the global filters set in the Trade Log tab.

// // --- Sub-component for displaying a single statistic ---
// const StatCard = ({ title, value, unit = '', valueSize = '1.875rem', icon, color, tooltip }) => {
//   const cardStyle = {
//     backgroundColor: theme.backgroundAlt,
//     padding: theme.spacing.md,
//     borderRadius: theme.borderRadiusLg,
//     boxShadow: theme.shadowCard,
//     border: `1px solid ${theme.border}`,
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     minHeight: '120px',
//   };
//   const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm };
//   const titleStyle = { fontSize: theme.fontSizeSm, color: theme.textMuted, fontWeight: theme.fontWeightMedium, display: 'flex', alignItems: 'center', gap: theme.spacing.xs };
//   const iconContainerStyle = { fontSize: '1.2rem', color: color || theme.primary, opacity: 0.8 };
//   const valueStyle = { fontSize: valueSize, fontWeight: theme.fontWeightBold, color: color || theme.textPrimary, lineHeight: 1.2 };

//   const content = (
//     <div style={cardStyle}>
//       <div style={headerStyle}>
//         <span style={titleStyle}>
//           {title}
//           {tooltip && <Tooltip content={tooltip}><FaQuestionCircle style={{fontSize: '0.8em', marginLeft: '4px', cursor: 'help'}}/></Tooltip>}
//         </span>
//         {icon && <div style={iconContainerStyle}>{icon}</div>}
//       </div>
//       <div>
//         <span style={valueStyle}>{value}{unit}</span>
//       </div>
//     </div>
//   );
//   return content;
// };

// // --- Custom Tooltip for Recharts ---
// const CustomRechartsTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     const tooltipStyle = {
//       backgroundColor: `rgba(15, 23, 32, 0.9)`, // Dark, slightly transparent
//       backdropFilter: 'blur(4px)',
//       border: `1px solid ${theme.borderStrong}`,
//       borderRadius: theme.borderRadiusMd,
//       padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
//       color: theme.textPrimary,
//       boxShadow: theme.shadowModal,
//     };
//     const labelStyle = { color: theme.textSecondary, fontWeight: theme.fontWeightMedium, marginBottom: theme.spacing.xs, fontSize: theme.fontSizeSm };
//     const pnlStyle = { color: payload[0].value >= 0 ? theme.success : theme.error, fontWeight: theme.fontWeightSemibold };

//     return (
//       <div style={tooltipStyle}>
//         <p style={labelStyle}>{`Date: ${label}`}</p>
//         <p style={pnlStyle}>{`Cumulative P&L: $${payload[0].value.toFixed(2)}`}</p>
//       </div>
//     );
//   }
//   return null;
// };


// const JournalPerformanceDashboard = () => {
//   const dispatch = useDispatch();
//   const {
//     stats,
//     trades, // We need the full list of trades for the P&L chart
//     status: tradesStatus,
//     error,
//     filters
//   } = useSelector((state) => state.trades);

//   useEffect(() => {
//     // Fetch both stats and a comprehensive list of trades for the charts.
//     // We fetch all trades matching the filter to build the client-side equity curve.
//     // For very large datasets, this should be a dedicated backend endpoint.
//     if (tradesStatus !== 'loading') {
//       dispatch(fetchTradeStats(filters));
//       dispatch(fetchTrades({ page: 1, limit: 1000, applyCurrentFilters: true })); // Fetch up to 1000 trades for charting
//     }
//   }, [dispatch, filters]);

//   const pnlOverTimeData = useMemo(() => {
//     if (!trades || trades.length === 0) return [{ name: 'Start', PnL: 0 }];

//     const closedTrades = trades
//       .filter(t => t.status === 'CLOSED' && t.exitTime)
//       .sort((a, b) => new Date(a.exitTime) - new Date(b.exitTime));

//     if (closedTrades.length === 0) return [{ name: 'Start', PnL: 0 }];

//     let cumulativePnl = 0;
//     const chartData = [{
//       name: format(new Date(closedTrades[0].entryTime), 'MMM dd'),
//       PnL: 0,
//     }];

//     closedTrades.forEach(trade => {
//       cumulativePnl += trade.pnl || 0;
//       chartData.push({
//         name: format(new Date(trade.exitTime), 'MMM dd'),
//         PnL: parseFloat(cumulativePnl.toFixed(2)),
//       });
//     });

//     return chartData;
//   }, [trades]);

//   const winLossDataForPie = useMemo(() => {
//     const data = [
//       { name: 'Wins', value: stats.wins || 0, fill: theme.success },
//       { name: 'Losses', value: stats.losses || 0, fill: theme.error },
//       { name: 'Breakeven', value: stats.breakEvens || 0, fill: theme.textMuted },
//     ];
//     return data.filter(item => item.value > 0);
//   }, [stats.wins, stats.losses, stats.breakEvens]);

//   // --- Inline Styles ---
//   const dashboardStyle = { padding: `${theme.spacing.sm}px 0` };
//   const statsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing.md, marginBottom: theme.spacing.xl };
//   const chartContainerStyle = { backgroundColor: theme.backgroundAlt, padding: `${theme.spacing.md}px`, borderRadius: theme.borderRadiusXl, boxShadow: theme.shadowCard, border: `1px solid ${theme.border}`, marginBottom: theme.spacing.lg, minHeight: '400px' };
//   const chartTitleStyle = { fontSize: '1.2rem', fontWeight: theme.fontWeightSemibold, color: theme.textPrimary, marginBottom: theme.spacing.lg, display: 'flex', alignItems: 'center', gap: theme.spacing.sm };
//   const filterInfoStyle = { fontSize: theme.fontSizeSm, color: theme.textMuted, marginBottom: theme.spacing.lg, textAlign: 'center', padding: theme.spacing.sm, backgroundColor: theme.surfaceLight, borderRadius: theme.borderRadiusMd, border: `1px solid ${theme.border}` };


//   if (tradesStatus === 'loading' && !stats.totalTrades && trades.length === 0) {
//     return <div style={{display:'flex', justifyContent:'center', padding: theme.spacing.xl}}><Loader size="lg" message="Calculating performance metrics..." /></div>;
//   }
//   if (tradesStatus === 'failed' && error && !stats.totalTrades) {
//     return <div style={{color: theme.error, textAlign: 'center', padding: theme.spacing.lg}}>Error loading performance data: {error}</div>;
//   }
//   if (tradesStatus !== 'loading' && stats.totalTrades === 0) {
//     return <div style={{textAlign:'center', color: theme.textMuted, padding: theme.spacing.xl, marginTop: theme.spacing.lg}}>No closed trades found matching your criteria. Log some trades to see performance insights!</div>
//   }

//   const pnlIsPositive = stats.totalPnl >= 0;

//   return (
//     <motion.div style={dashboardStyle} initial={{opacity:0, y: 20}} animate={{opacity:1, y:0}} transition={{duration:0.4}}>
//       <div style={filterInfoStyle}>
//         <FaFilter style={{marginRight: theme.spacing.sm, display: 'inline-block', verticalAlign: 'middle'}}/>
//         Displaying stats for currently applied filters.
//         <Button variant="ghost" size="sm" onClick={() => dispatch(fetchTradeStats(filters))} style={{marginLeft: theme.spacing.md}} leftIcon={<FaSyncAlt/>}>Refresh</Button>
//       </div>

//       <div style={statsGridStyle}>
//         <StatCard title="Net P&L" value={stats.totalPnl?.toFixed(2) ?? '0.00'} unit="$" color={pnlIsPositive ? theme.success : theme.error} icon={<FaDollarSign/>} tooltip="Total profit or loss from all closed trades."/>
//         <StatCard title="Win Rate" value={stats.winRate?.toFixed(1) ?? '0.0'} unit="%" color={stats.winRate >= 50 ? theme.success : (stats.winRate > 0 ? theme.warning : theme.error)} icon={<FaPercentage/>} tooltip="Percentage of winning trades out of all profitable and losing trades."/>
//         <StatCard title="Total Closed Trades" value={stats.totalTrades ?? 0} icon={<FaExchangeAlt/>} tooltip="Total number of completed trades in this period."/>
//         <StatCard title="Profit Factor" value={stats.profitFactor?.toFixed(2) ?? '0.00'} color={stats.profitFactor >= 1.5 ? theme.success : (stats.profitFactor >= 1 ? theme.info : theme.error)} icon={<FaBalanceScale/>} tooltip="Gross Profit divided by Gross Loss. A value above 1 indicates profitability."/>
//         <StatCard title="Average Win" value={stats.averageWin?.toFixed(2) ?? '0.00'} unit="$" color={theme.success} icon={<FaTrophy/>} tooltip="The average profit amount from your winning trades."/>
//         <StatCard title="Average Loss" value={stats.averageLoss?.toFixed(2) ?? '0.00'} unit="$" color={theme.error} icon={<FaSadTear/>} tooltip="The average loss amount from your losing trades."/>
//         <StatCard title="Avg. R:R Logged" value={stats.averageRiskReward?.toFixed(2) ?? 'N/A'} unit=":1" icon={<FaCog/>} tooltip="The average Risk-to-Reward ratio from trades where it was calculated."/>
//         <StatCard title="Wins / Losses / B.E." value={`${stats.wins || 0} / ${stats.losses || 0} / ${stats.breakEvens || 0}`} icon={<FaChartPie/>} tooltip="Total winning vs. losing vs. breakeven trades."/>
//       </div>

//       <div style={{display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: theme.spacing.lg, alignItems: 'stretch'}}>
//         <motion.div style={chartContainerStyle} initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay:0.1, duration: 0.4}}>
//           <h3 style={chartTitleStyle}><FaChartLine style={{color:theme.primary}} /> Account Growth (Cumulative P&L)</h3>
//           <ResponsiveContainer width="100%" height={320}>
//             <AreaChart data={pnlOverTimeData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
//               <defs>
//                 <linearGradient id="colorPnlGradient" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor={pnlIsPositive ? theme.success : theme.error} stopOpacity={0.4}/>
//                   <stop offset="95%" stopColor={pnlIsPositive ? theme.success : theme.error} stopOpacity={0.05}/>
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
//               <XAxis dataKey="name" stroke={theme.textMuted} fontSize={theme.fontSizeSm} tick={{fill: theme.textMuted}} axisLine={{stroke: theme.border}} tickLine={{stroke: theme.border}}/>
//               <YAxis stroke={theme.textMuted} fontSize={theme.fontSizeSm} tickFormatter={(value) => `$${value}`} tick={{fill: theme.textMuted}} axisLine={{stroke: theme.border}} tickLine={{stroke: theme.border}} allowDecimals={false}/>
//               <RechartsTooltip content={<CustomRechartsTooltip />} cursor={{ stroke: theme.primary, strokeWidth: 1, strokeDasharray: '3 3' }}/>
//               <Area type="monotone" dataKey="PnL" stroke={pnlIsPositive ? theme.success : theme.error} fillOpacity={1} fill="url(#colorPnlGradient)" strokeWidth={2.5} activeDot={{ r: 7, strokeWidth: 2, fill: theme.backgroundAlt, stroke: pnlIsPositive ? theme.success : theme.error }} />
//             </AreaChart>
//           </ResponsiveContainer>
//         </motion.div>

//         <motion.div style={chartContainerStyle} initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{delay:0.2, duration: 0.4}}>
//           <h3 style={chartTitleStyle}><FaChartPie style={{color:theme.primary}}/> Trade Outcomes</h3>
//           <ResponsiveContainer width="100%" height={320}>
//             <PieChart>
//               <Pie data={winLossDataForPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} labelLine={false}
//                    label={({ name, percent, value }) => value > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : null} >
//                 {winLossDataForPie.map((entry, index) => ( <Cell key={`cell-${index}`} fill={entry.fill} stroke={theme.backgroundAlt} /> ))}
//               </Pie>
//               <RechartsTooltip contentStyle={{ backgroundColor: `rgba(30, 41, 59, 0.9)`, border: `1px solid ${theme.borderStrong}`, borderRadius: theme.borderRadiusMd }} formatter={(value, name) => [`${value} trades`, name]}/>
//               <Legend iconSize={10} wrapperStyle={{fontSize: theme.fontSizeSm, paddingTop: '15px', color: theme.textSecondary}}/>
//             </PieChart>
//           </ResponsiveContainer>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default JournalPerformanceDashboard;
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, PieChart, Pie, Cell, Legend
} from 'recharts';
import { format } from 'date-fns';
import { fetchTradeStats, fetchTrades } from '@/entities/Trade/model/tradesSlice';
import { Loader } from '@/shared/ui';

/**
 * INLINE SVG ICONS
 * Using internal SVGs to ensure the preview renders correctly while 
 * maintaining the high-end aesthetic.
 */
const Icons = {
  Refresh: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>,
  Trend: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>,
  Pie: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>,
  Filter: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
};

/**
 * PREMIUM STAT CARD
 * Glassmorphic design with animated entry and hover effects.
 */
const StatCard = ({ title, value, unit = '', color = 'blue', delay = 0 }) => {
  const colorMap = {
    green: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
    red: 'from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20',
    blue: 'from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20',
    orange: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20',
    slate: 'from-slate-500/20 to-slate-500/5 text-slate-400 border-slate-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden group p-5 rounded-3xl border backdrop-blur-md bg-gradient-to-br ${colorMap[color] || colorMap.blue} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
    >
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-mono font-black tracking-tighter text-white">
            {value}
          </span>
          <span className="text-xs font-bold opacity-60">{unit}</span>
        </div>
      </div>
      <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icons.Trend />
      </div>
    </motion.div>
  );
};

/**
 * CUSTOM CHART TOOLTIP
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div className="bg-slate-900/95 border border-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-lg font-mono font-bold ${val >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {val >= 0 ? '+' : '-'}${Math.abs(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

const JournalPerformanceDashboard = () => {
  const dispatch = useDispatch();
  const {
    stats,
    trades,
    status: tradesStatus,
    error,
    filters
  } = useSelector((state) => state.trades);

  // Initial Data Fetching - Logic remains identical to original requirements
  useEffect(() => {
    if (tradesStatus !== 'loading') {
      dispatch(fetchTradeStats(filters));
      dispatch(fetchTrades({ page: 1, limit: 1000, applyCurrentFilters: true }));
    }
  }, [dispatch, filters]);

  // Equity Curve Data Processing
  const pnlOverTimeData = useMemo(() => {
    if (!trades || trades.length === 0) return [{ name: 'Start', PnL: 0 }];

    const closedTrades = trades
      .filter(t => t.status === 'CLOSED' && t.exitTime)
      .sort((a, b) => new Date(a.exitTime) - new Date(b.exitTime));

    if (closedTrades.length === 0) return [{ name: 'Start', PnL: 0 }];

    let cumulativePnl = 0;
    const chartData = [{
      name: format(new Date(closedTrades[0].entryTime || Date.now()), 'MMM dd'),
      PnL: 0,
    }];

    closedTrades.forEach(trade => {
      cumulativePnl += trade.pnl || 0;
      chartData.push({
        name: format(new Date(trade.exitTime), 'MMM dd'),
        PnL: parseFloat(cumulativePnl.toFixed(2)),
      });
    });

    return chartData;
  }, [trades]);

  // Outcome Distribution Data
  const winLossDataForPie = useMemo(() => [
    { name: 'Wins', value: stats.wins || 0, color: '#10b981' },
    { name: 'Losses', value: stats.losses || 0, color: '#f43f5e' },
    { name: 'BE', value: stats.breakEvens || 0, color: '#64748b' },
  ].filter(d => d.value > 0), [stats]);

  // Loading State
  if (tradesStatus === 'loading' && !stats.totalTrades && trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader size="lg" message="Synchronizing Performance Data..." />
      </div>
    );
  }

  // Error State
  if (tradesStatus === 'failed' && error && !stats.totalTrades) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-rose-500 font-bold bg-rose-500/5 rounded-3xl border border-rose-500/20 mx-4">
        <p className="text-lg">Network Sync Error</p>
        <p className="text-xs font-mono opacity-60 mt-2">{error}</p>
        <button 
          onClick={() => dispatch(fetchTradeStats(filters))}
          className="mt-6 px-6 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold uppercase"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Empty State
  if (tradesStatus !== 'loading' && stats.totalTrades === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-slate-500 text-center px-6">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 opacity-20">
          <Icons.Trend />
        </div>
        <p className="text-xl font-black text-white mb-2">Matrix Empty</p>
        <p className="text-sm max-w-xs opacity-60">Log and close trades in your journal to unlock performance analytics.</p>
      </div>
    );
  }

  const pnlIsPositive = (stats.totalPnl || 0) >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-8 pb-10"
    >
      {/* ANALYTICS HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-[2rem] bg-slate-900/40 border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Icons.Filter />
          </div>
          <div>
            <span className="block text-[11px] font-black text-white uppercase tracking-[0.2em]">Live Analysis</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Filters Active</span>
          </div>
        </div>
        <button 
          onClick={() => dispatch(fetchTradeStats(filters))}
          className="flex items-center gap-2 px-8 py-3 bg-white hover:bg-slate-200 text-black rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-white/5 active:scale-95"
        >
          <Icons.Refresh />
          Refresh Stats
        </button>
      </div>

      {/* CORE PERFORMANCE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Net Profit" 
          value={(pnlIsPositive ? '+' : '-') + '$' + Math.abs(stats.totalPnl || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} 
          color={pnlIsPositive ? 'green' : 'red'} 
          delay={0.05}
        />
        <StatCard 
          title="Win Rate" 
          value={stats.winRate?.toFixed(1) || '0.0'} 
          unit="%" 
          color={stats.winRate >= 50 ? 'blue' : 'orange'} 
          delay={0.1}
        />
        <StatCard 
          title="Profit Factor" 
          value={stats.profitFactor?.toFixed(2) || '0.00'} 
          unit="x"
          color="slate" 
          delay={0.15}
        />
        <StatCard 
          title="Avg R:R" 
          value={stats.averageRiskReward?.toFixed(2) || 'N/A'} 
          unit="RR"
          color="slate" 
          delay={0.2}
        />
      </div>

      {/* SECONDARY METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <StatCard title="Volume" value={stats.totalTrades || 0} unit="Trades" color="slate" delay={0.25} />
         <StatCard title="Efficiency" value={stats.averageWin?.toFixed(0) || '0'} unit="Avg$" color="green" delay={0.3} />
         <StatCard title="Drawdown" value={stats.averageLoss?.toFixed(0) || '0'} unit="Avg$" color="red" delay={0.35} />
         <StatCard title="Outcome Mix" value={`${stats.wins || 0}/${stats.losses || 0}/${stats.breakEvens || 0}`} unit="W/L/B" color="slate" delay={0.4} />
      </div>

      {/* DATA VISUALIZATION SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* EQUITY CURVE CONTAINER */}
        <div className="xl:col-span-2 p-8 rounded-[3rem] bg-slate-900/30 border border-white/5 flex flex-col min-h-[480px]">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Icons.Trend />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Performance Velocity</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Cumulative P&L Curve</p>
              </div>
            </div>
            <div className="flex gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            </div>
          </div>

          <div className="flex-1 w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pnlOverTimeData}>
                <defs>
                  <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={pnlIsPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={pnlIsPositive ? '#10b981' : '#f43f5e'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} 
                  tickFormatter={(v) => `$${v}`}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="PnL" 
                  stroke={pnlIsPositive ? '#10b981' : '#f43f5e'} 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#pnlGradient)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* OUTCOME DISTRIBUTION CONTAINER */}
        <div className="p-8 rounded-[3rem] bg-slate-900/30 border border-white/5 flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Icons.Pie />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Outcome Mix</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Win/Loss Distribution</p>
            </div>
          </div>

          <div className="flex-1 min-h-[280px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={winLossDataForPie}
                  innerRadius={85}
                  outerRadius={105}
                  paddingAngle={10}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1500}
                >
                  {winLossDataForPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  content={({ payload }) => (
                    <div className="flex justify-center gap-6 mt-10">
                      {payload.map((entry, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-10">
              <span className="text-4xl font-mono font-black text-white">{stats.totalTrades || 0}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Total</span>
            </div>
          </div>

          <div className="mt-auto pt-10 space-y-3">
             <div className="flex justify-between items-center text-[11px] p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 font-black uppercase tracking-wider">Winning Streak</span>
                <span className="text-emerald-400 font-mono font-bold">--</span>
             </div>
             <div className="flex justify-between items-center text-[11px] p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-slate-400 font-black uppercase tracking-wider">Expectancy</span>
                <span className="text-blue-400 font-mono font-bold">${((stats.totalPnl || 0) / (stats.totalTrades || 1)).toFixed(2)}</span>
             </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default JournalPerformanceDashboard;