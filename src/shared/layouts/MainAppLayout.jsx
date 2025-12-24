// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Header from '@/widgets/Header/ui/Header'; // Will create this widget
// import { theme } from '@/styles/theme';
// import { useSocketListeners } from '@/core/hooks/useSocektListeners';
// const layoutStyle = {
//   display: 'flex',
//   flexDirection: 'column',
//   minHeight: '100vh',
//   backgroundColor: theme.backgroundMain,
// };

// const appBodyStyle = {
//   display: 'flex',
//   flexGrow: 1,
//   paddingTop: '65px', // Assuming header is fixed and has this height
// };

// const contentAreaStyle = {
//   flexGrow: 1,
//   padding: theme.spacing(6), // e.g., 24px
//   overflowY: 'auto', // If content might overflow
//   // Example of centered content for wider screens
//   // maxWidth: '1600px',
//   // margin: '0 auto',
//   // width: '100%',
// };

// const MainAppLayout = () => {
//   useSocketListeners()
//   return (
//     <div style={layoutStyle}>
//       <Header /> {/* Header will be sticky/fixed via its own styles */}
//       <div style={appBodyStyle}>
//         {/* <Sidebar /> Placeholder for potential sidebar */}
//         <main style={contentAreaStyle}>
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };
// export default MainAppLayout;import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/widgets/Header/ui/Header';
import { useSocketListeners } from '@/core/hooks/useSocektListeners';

const MainAppLayout = () => {
  useSocketListeners();

  return (
    <div className="min-h-screen bg-dark-950 text-light flex flex-col overflow-hidden">
      
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="
          flex-1
          pt-[65px] 
          bg-dark-950
          relative
          overflow-y-auto
        "
      >
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[1200px] bg-primary/5 blur-[140px] rounded-full" />

        {/* Page Content Wrapper */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default MainAppLayout;
