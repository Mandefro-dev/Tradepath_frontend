// import React, { useEffect } from 'react';
// import { ToastContainer } from 'react-toastify';

// import 'react-toastify/dist/ReactToastify.css';

// import { useDispatch, useSelector } from 'react-redux';
// import { AnimatePresence } from 'framer-motion'; // For page transitions

// import AppRouter from './routing/AppRouter';
// import { fetchCurrentUser, logout } from '@/features/Auth/model/authSlice';
// import { SocketProvider } from '@/core/socket/socketContext'; // For later phases
// import { Loader } from '@/shared/ui'; // Your styled Loader component
// import { theme } from '@/styles/theme';// For styling the global loader
// import { useSocketListeners } from '@/core/hooks/useSocektListeners';


// const App = () => {
//   useSocketListeners()

//   const dispatch = useDispatch();
//   const { token, status: authStatus, isAuthenticated } = useSelector((state) => state.auth);

//   useEffect(() => {
//     // Attempt to fetch current user if a token exists but user object isn't in state
//     // This handles refreshing the page or returning to the app
//     if (token && !isAuthenticated && authStatus !== 'loading' && authStatus !== 'succeeded') {
//       dispatch(fetchCurrentUser());
//     } else if (!token && isAuthenticated) {
//       // This case handles if token is manually removed from localStorage
//       // but Redux state still thinks user is authenticated. Forcing a logout.
//       dispatch(logout());
//     }
//   }, [dispatch, token, isAuthenticated, authStatus]);

//   // Global loading indicator while initially verifying token on app load
//   if (authStatus === 'loading' && token && !isAuthenticated) {
//     const loaderContainerStyle = {
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         backgroundColor: theme.backgroundMain, // Use theme variable
//         color: theme.textPrimary,      // Use theme variable
//     };
//     return (
//       <div style={loaderContainerStyle}>
//         <Loader size="lg" message="Authenticating session..." />
//       </div>
//     );
//   }

//   // Inline styles for Toastify to match our theme
//   const toastContainerStyle = { zIndex: theme.zIndexToast };
//   const toastBaseStyle = {
//     backgroundColor: theme.surface, // Using a slightly lighter surface for toasts
//     color: theme.textPrimary,
//     borderRadius: theme.borderRadiusLg,
//     boxShadow: theme.shadowModal,
//     fontFamily: theme.fontFamilySans,
//     padding: `${theme.spacing.md}px`,
//   };
//   const toastBodyStyle = { fontSize: '0.95rem', margin: 0, padding: 0 }; // Reset default padding/margin
//   const toastProgressStyle = { background: theme.primary };


//   return (
//     <SocketProvider> {/* Socket context for real-time features later */}
//       <AnimatePresence mode="wait"> {/* For page transitions, ensure child has a key */}
//         {/* AppRouter itself doesn't need a key for AnimatePresence here, 
//             but individual <Route element={<Page key={location.pathname}/>} /> could use it */}
//         <AppRouter />
//       </AnimatePresence>
//       <ToastContainer
//         position="bottom-right"
//         autoClose={4000}
//         hideProgressBar={false}
//         newestOnTop={true}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         style={toastContainerStyle} // Container style
//         toastStyle={toastBaseStyle} // Individual toast style
//         bodyStyle={toastBodyStyle}   // Body style
//         progressStyle={toastProgressStyle} // Progress bar style
//       />
//     </SocketProvider>
//   );
// };
// export default App;


import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import AppRouter from './routing/AppRouter';
import { fetchCurrentUser, logout } from '@/features/Auth/model/authSlice';
import { SocketProvider } from '@/core/socket/socketContext';
import { Loader } from '@/shared/ui';
// import { useSocketListeners } from '@/core/hooks/useSocketListeners';
import { useSocketListeners } from '@/core/hooks/useSocektListeners'; // Corrected import path if needed

const App = () => {
  // Activate global socket listeners (only active when authenticated)
  useSocketListeners();

  const dispatch = useDispatch();
  const { token, status: authStatus, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Attempt to fetch current user if a token exists but user object isn't in state
    if (token && !isAuthenticated && authStatus !== 'loading' && authStatus !== 'succeeded') {
      dispatch(fetchCurrentUser());
    } else if (!token && isAuthenticated) {
      // Handle scenario where token is manually removed from storage but Redux is stale
      dispatch(logout());
    }
  }, [dispatch, token, isAuthenticated, authStatus]);

  // Global full-screen loader during initial authentication check
  if (authStatus === 'loading' && token && !isAuthenticated) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-dark-950">
        <Loader size="lg" className="text-primary" />
        <p className="mt-4 text-sm font-medium text-medium-text animate-pulse">
          Authenticating session...
        </p>
      </div>
    );
  }

  return (
    <SocketProvider>
      <AnimatePresence mode="wait">
        {/* AppRouter handles the page rendering */}
        <AppRouter />
      </AnimatePresence>
      
      {/* Customized ToastContainer to match the Dark Theme 
          Using Tailwind classes via toastClassName to override default white styles
      */}
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!bg-dark-900 !text-light !font-sans !rounded-xl !border !border-dark-700 !shadow-2xl"
        bodyClassName="!text-sm !font-medium"
        progressClassName="!bg-primary"
      />
    </SocketProvider>
  );
};

export default App;