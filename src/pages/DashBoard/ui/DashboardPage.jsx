// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchCurrentUser } from '@/features/Auth/model/authSlice';
// import { motion } from 'framer-motion';
// import { theme } from '@/styles/theme';
// import { Link } from 'react-router-dom';
// import { PATHS } from '@/app/routing/paths';
// import { Button, Loader } from '@/shared/ui'; // Assuming Loader is styled
// import { FaBookOpen, FaMicroscope, FaUsers, } from 'react-icons/fa';
// import { useSocketListeners } from '@/core/hooks/useSocektListeners';
// import { FaCog,FaBolt } from 'react-icons/fa';


// const DashboardPage = () => {
//   useSocketListeners()
//   const dispatch = useDispatch();
//   const { user, token, status: authStatus } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (token && !user && authStatus !== 'loading') {
//       dispatch(fetchCurrentUser());
//     }
//   }, [dispatch, token, user, authStatus]);

//   const pageStyle = { padding: theme.spacing.lg, color: theme.textPrimary };
//   const titleStyle = { fontSize: '2rem', fontWeight: theme.fontWeightBold, marginBottom: theme.spacing.sm, color: theme.primary };
//   const subtitleStyle = { fontSize: '1.1rem', color: theme.textSecondary, marginBottom: theme.spacing.xl };
//   const quickLinksContainerStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: `${theme.spacing.lg}px`, marginTop: theme.spacing.xl };
//   const linkCardStyle = { backgroundColor: theme.backgroundAlt, padding: theme.spacing.lg, borderRadius: theme.borderRadiusLg, border: `1px solid ${theme.border}`, textAlign: 'center', boxShadow: theme.shadowCard, transition: 'transform 0.2s ease, box-shadow 0.2s ease' };
//   const linkCardTitleStyle = { fontSize: '1.25rem', fontWeight: theme.fontWeightSemibold, marginBottom: theme.spacing.sm, color: theme.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm };
//   const linkCardDescStyle = { fontSize: theme.fontSizeSm, color: theme.textMuted, marginBottom: theme.spacing.md };

//   if (authStatus === 'loading' && !user) {
//     return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 65px)'}}><Loader size="lg" message="Loading dashboard..." /></div>;
//   }

//   return (
//     <div style={pageStyle}>
//       <motion.h1 style={titleStyle} initial={{opacity:0, y: -10}} animate={{opacity:1, y:0}} transition={{delay: 0.1}}>Welcome, {user?.name || 'Trader'}!</motion.h1>
//       <motion.p style={subtitleStyle} initial={{opacity:0, y: -10}} animate={{opacity:1, y:0}} transition={{delay: 0.2}}>This is your command center. Track, analyze, and conquer the markets.</motion.p>
      
//       <div style={quickLinksContainerStyle}>
//         <motion.div style={linkCardStyle} whileHover={{y: -5, boxShadow: theme.shadowModal}}>
//           <h2 style={linkCardTitleStyle}><FaBookOpen style={{color: theme.primary}}/> Journal</h2>
//           <p style={linkCardDescStyle}>Log your trades, analyze performance, and refine your strategy.</p>
//           <Link to={PATHS.JOURNAL || '/journal'}><Button variant="primary" size="sm">Go to Journal</Button></Link>
//         </motion.div>
//         <motion.div style={linkCardStyle} whileHover={{y: -5, boxShadow: theme.shadowModal}}>
//           <h2 style={linkCardTitleStyle}><FaMicroscope style={{color: theme.info}}/> Backtest</h2>
//           <p style={linkCardDescStyle}>Test your ideas against historical data with our powerful replay engine.</p>
//           <Link to={PATHS.BACKTEST_DASHBOARD || '/backtesting'}><Button variant="secondary" size="sm" style={{borderColor: theme.info, color: theme.info}}>Start Backtesting</Button></Link>
//         </motion.div>
//         <motion.div style={linkCardStyle} whileHover={{y: -5, boxShadow: theme.shadowModal}}>
//           <h2 style={linkCardTitleStyle}><FaUsers style={{color: theme.success}}/> Community</h2>
//           <p style={linkCardDescStyle}>Connect with fellow traders, share insights, and grow together.</p>
//           <Link to={PATHS.COMMUNITY_FEED || '/community'}><Button variant="secondary" size="sm" style={{borderColor: theme.success, color: theme.success}}>Explore Feed</Button></Link>
//         </motion.div>
//       </div>
//     </div>
//   );
// };
// export default DashboardPage;


// frontend/src/pages/DashboardPage/ui/DashboardPage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBookOpen, FaMicroscope, FaUsers, FaChartLine, FaArrowRight, FaWallet, FaTrophy } from 'react-icons/fa';
import { fetchCurrentUser } from '@/features/Auth/model/authSlice';
import { PATHS } from '@/app/routing/paths';
import { Loader, Button } from '@/shared/ui'; // Ensure these are the Tailwind versions
// import { useSocketListeners } from '@/core/hooks/useSocketListeners';
import { useSocketListeners } from '@/core/hooks/useSocektListeners';
import { FaCog,FaBolt } from 'react-icons/fa';
// --- Sub-components for internal organization ---

const DashboardCard = ({ title, description, icon, link, colorClass, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl bg-dark-900 border border-dark-700 p-6 shadow-lg hover:shadow-2xl hover:border-dark-600 transition-all duration-300"
    >
      {/* Background Gradient Effect */}
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-10 blur-3xl transition-all group-hover:opacity-20 ${colorClass}`}></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-dark-800 border border-dark-700 shadow-inner group-hover:scale-110 transition-transform duration-300 ${colorClass.replace('bg-', 'text-')}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        
        <h3 className="mb-2 text-xl font-bold text-light group-hover:text-white transition-colors">{title}</h3>
        <p className="mb-6 text-sm text-medium-text leading-relaxed flex-grow">
          {description}
        </p>

        <Link to={link} className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
          Open {title} <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

const QuickStatWidget = ({ label, value, icon, trend }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-dark-700/50 backdrop-blur-sm"
  >
    <div>
      <p className="text-xs font-medium text-muted-text uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-light mt-1">{value}</p>
    </div>
    <div className={`p-3 rounded-full bg-dark-700/50 text-light`}>
      {icon}
    </div>
  </motion.div>
);

// --- Main Dashboard Component ---

const DashboardPage = () => {
  useSocketListeners();
  const dispatch = useDispatch();
  const { user, token, status: authStatus } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user && authStatus !== 'loading') {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user, authStatus]);

  if (authStatus === 'loading' && !user) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-dark-950">
        <Loader size="lg" message="Initializing Command Center..." />
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 px-4 py-6 lg:px-6 text-light relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[1000px] bg-primary/5 blur-[120px] rounded-full"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full"
      >
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold text-white tracking-tight"
            >
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">{user?.name?.split(' ')[0] || 'Trader'}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-2 text-lg text-medium-text"
            >
              Market conditions are volatile today. Stay sharp.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
             {/* Placeholder for a "Quick Trade" or "Settings" button */}
            <Button variant="secondary" className="shadow-lg shadow-dark-950/50">
              <FaCog className="mr-2"/> Workspace Settings
            </Button>
          </motion.div>
        </header>

        {/* Quick Stats Row (Placeholder Data - connect to Redux later) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <QuickStatWidget label="Total P&L" value="$0.00" icon={<FaWallet />} />
          <QuickStatWidget label="Win Rate" value="0%" icon={<FaChartLine />} />
          <QuickStatWidget label="Active Streaks" value="0" icon={<FaBolt className="text-yellow-500" />} />
          <QuickStatWidget label="Journal Rank" value="Novice" icon={<FaTrophy className="text-orange-500" />} />
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          <DashboardCard 
            title="Trading Journal"
            description="Log your daily trades, analyze your emotional state, and review detailed performance metrics to refine your edge."
            icon={<FaBookOpen />}
            link={PATHS.JOURNAL || '/journal'}
            colorClass="bg-primary"
            delay={0.1}
          />

          <DashboardCard 
            title="Backtest Engine"
            description="Test strategies on historical data with our high-fidelity replay engine. Validate your ideas before risking capital."
            icon={<FaMicroscope />}
            link={PATHS.BACKTEST_DASHBOARD || '/backtesting'}
            colorClass="bg-purple-500" // Custom color for visual distinction
            delay={0.2}
          />

          <DashboardCard 
            title="Community Feed"
            description="Connect with other traders. Share your setups, discuss market movements, and learn from the collective intelligence."
            icon={<FaUsers />}
            link={PATHS.COMMUNITY_FEED || '/community'}
            colorClass="bg-emerald-500" // Custom color
            delay={0.3}
          />
        </div>

        {/* Recent Activity / Widgets Section (Placeholder for future expansion) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Example of an "Upcoming" widget */}
          <div className="rounded-2xl border border-dark-700 bg-dark-900/50 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-light mb-4">Recent Market Notes</h3>
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-dark-600 bg-dark-800/30 text-muted-text">
              No notes added today.
            </div>
          </div>

          {/* Example of a "Status" widget */}
          <div className="rounded-2xl border border-dark-700 bg-dark-900/50 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-light mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-medium-text">Data Feeds</span>
                <span className="flex items-center text-success"><span className="mr-2 h-2 w-2 rounded-full bg-success animate-pulse"></span> Operational</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-medium-text">Backtest Engine</span>
                <span className="flex items-center text-success"><span className="mr-2 h-2 w-2 rounded-full bg-success animate-pulse"></span> Ready</span>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

// Helper icon component if needed, or import from react-icons


export default DashboardPage;