
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchBacktestSessions, resetSessionList } from '@/entities/BacktestSession/model/backtestSlice';
import { Loader, Button } from '@/shared/ui';
import { theme } from '@/styles/theme';
import { FaPlus, FaHistory, FaRocket } from 'react-icons/fa';
import { BacktestSessionCard } from '@/entities/BacktestSession/ui/BacktestSessionCard';
import { BacktestConfigurationForm } from '@/features/BacktestingEngine/ui/BacktestConfigurationForm';

export const BacktestDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- FIX: Defensive destructuring to prevent the 'undefined' error ---
  // We now provide a default empty object for sessionsList and a default empty array for items.
  const {
    items: sessions = [],
    pagination = { hasMore: false, currentPage: 1 },
    status = 'idle'
  } = useSelector(state => state.backtest.sessionsList) || { items: [], pagination: {}, status: 'idle' };
  // --- END OF FIX ---

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    // Reset the list on mount to ensure fresh data
    dispatch(resetSessionList());
    if (status === 'idle') {
      dispatch(fetchBacktestSessions());
    }
    
  }, [dispatch]);

  const handleSessionCreated = (newSession) => {
    setIsCreateModalOpen(false);
    navigate(`/backtesting/${newSession._id}`);
  };
  
  // --- Inline Styles ---
  const pageStyle = { maxWidth: '1200px', margin: '0 auto', padding: theme.spacing.lg };
  const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg, paddingBottom: theme.spacing.md, borderBottom: `1px solid ${theme.border}` };
  const titleStyle = { fontSize: '2rem', fontWeight: theme.fontWeightBold, color: theme.textPrimary };
  const subheaderStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginTop: theme.spacing.xl, marginBottom:theme.spacing.md, color: theme.textSecondary };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: theme.spacing.lg };
  const emptyStateStyle = {
    textAlign: 'center',
    padding: `${theme.spacing.xxl}px ${theme.spacing.lg}px`,
    backgroundColor: theme.backgroundAlt,
    borderRadius: theme.borderRadiusXl,
    border: `1px dashed ${theme.border}`,
    color: theme.textMuted,
    marginTop: theme.spacing.xl,
  };
  const emptyIconStyle = { fontSize: '3rem', marginBottom: theme.spacing.md, opacity: 0.7, color: theme.primary };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 1 }, // Parent doesn't animate opacity itself
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07, // Each child card will animate in with this delay
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <motion.div style={pageStyle} initial={{opacity:0}} animate={{opacity:1}}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Backtesting Center</h1>
        <Button variant="primary" leftIcon={<FaPlus/>} onClick={() => setIsCreateModalOpen(true)}>New Backtest</Button>
      </div>
      
      <BacktestConfigurationForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSessionCreated={handleSessionCreated} />
      
      <div style={subheaderStyle}>
        <FaHistory />
        <h2 style={{fontSize:'1.5rem', fontWeight:theme.fontWeightSemibold}}>Your Sessions</h2>
      </div>

      {status === 'loading' && sessions.length === 0 && (
        <div style={{padding:'40px', display:'flex', justifyContent:'center'}}>
          <Loader size="lg" message="Loading your sessions..."/>
        </div>
      )}

      {status === 'succeeded' && sessions.length === 0 && (
        <motion.div style={emptyStateStyle} initial={{opacity: 0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay:0.2, duration: 0.4}}>
            <FaRocket style={emptyIconStyle}/>
            <h3 style={{fontSize: '1.2rem', fontWeight: theme.fontWeightSemibold, color: theme.textPrimary, marginBottom: theme.spacing.sm}}>Ready to Test Your Strategy?</h3>
            <p>You have no backtest sessions. Click "New Backtest" to get started.</p>
        </motion.div>
      )}
      
      
        <motion.div 
          style={gridStyle}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {sessions.map(session => 
              <motion.div key={session._id} variants={itemVariants}>
                  <BacktestSessionCard session={session} />
              </motion.div>
          )}
        </motion.div>
      

      {pagination?.hasMore && status !== 'loading' && 
        <div style={{textAlign:'center', marginTop: theme.spacing.lg}}>
            <Button 
                onClick={() => dispatch(fetchBacktestSessions({page: pagination.currentPage + 1}))}
                variant="secondary"
            >
                Load More Sessions
            </Button>
        </div>
      }
       {status === 'loading' && sessions.length > 0 && (
         <div style={{display: 'flex', justifyContent: 'center', padding: `${theme.spacing.lg}px 0`}}>
            <Loader message="Loading more..." />
         </div>
      )}

    </motion.div>
  );
};
export default BacktestDashboardPage;
