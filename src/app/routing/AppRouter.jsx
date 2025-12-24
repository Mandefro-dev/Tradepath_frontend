// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux'; // To check initial auth state for root redirect

// import { PATHS } from './paths';
// import { ProtectedRoute, PublicOnlyRoute } from './routeGuards';

// // Layouts
// import LandingLayout from '@/shared/layouts/LandingLayout';
// import AuthLayout from '@/shared/layouts/AuthLayout';
// import MainAppLayout from '@/shared/layouts/MainAppLayout';

// // Page Components (Ensure these are created in their respective folders)
// import LandingPage from '@/pages/LandingPage/ui/LandingPage';
// // import LoginPage from '@/pages/Auth/ui/LoginPage';
// import LoginPage from '@/pages/Auth/ui/LoignPage';
// import SignupPage from '@/pages/Auth/ui/SignupPage';
// import ForgotPasswordPage from '@/pages/Auth/ui/ForgotPasswordPage';
// import ResetPasswordPage from '@/pages/Auth/ui/ResetPasswordPage';
// import VerifyEmailPage from '@/pages/Auth/ui/VerifyEmailPage';
// // import DashboardPage from '@/pages/DashboardPage/ui/DashboardPage';
// import DashboardPage from '@/pages/DashBoard/ui/DashboardPage';
// import NotFoundPage from '@/pages/NotFoundPage'; // Assume this exists
// import JournalPage from '@/pages/Journal';
// // Placeholder pages for features not yet built in Phase 1
// const JournalPagePlaceholder = () => <div style={{padding: '20px', color: theme.textPrimary}}>Journal Page (Coming Soon)</div>;
// const BacktestDashboardPlaceholder = () => <div style={{padding: '20px', color: theme.textPrimary}}>Backtesting Dashboard (Coming Soon)</div>;
// const CommunityFeedPlaceholder = () => <div style={{padding: '20px', color: theme.textPrimary}}>Community Feed (Coming Soon)</div>;
// // ... and so on for other future pages

// import { theme } from '@/styles/theme'; // For any inline styles if needed

// const AppRouter = () => {
//   const { isAuthenticated, token, status } = useSelector((state) => state.auth);

//   // This initial redirect logic at the root path '/'
//   // needs to consider the auth loading state to avoid premature redirection.
//   const getInitialRedirectPath = () => {
//     if (status === 'loading' && token) {
//       return null; // Let App.jsx show global loader, or AppRouter can show its own
//     }
//     if (isAuthenticated) {
//       return PATHS.HOME;
//     }
//     return PATHS.LANDING;
//   };

//   const initialRedirect = getInitialRedirectPath();
//   if (status === 'loading') {
//     return (
//       <div style={{
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '100vh', 
//         backgroundColor: theme.backgroundMain, 
//         color: theme.textPrimary
//       }}>
//         Loading App...
//       </div>
//     );
//   }

//   return (
//     <Routes>

// <Route 
//         path="/" 
//         element={<Navigate to={initialRedirect || PATHS.LANDING} replace />} 
//       />
//       {/* Landing Page (Public) */}
//       <Route element={<LandingLayout />}>
//         <Route path={PATHS.LANDING} element={<LandingPage />} />
//       </Route>

//       {/* Authentication Routes (Only accessible if NOT logged in) */}
//       <Route element={<AuthLayout />}>
//           {/* <Route path={PATHS.LOGIN} element={<LoginPage />} /> */}
//           <Route 
//           path={PATHS.LOGIN} 
//           element={
//             isAuthenticated ? (
//               <Navigate to={PATHS.HOME} replace />
//             ) : (
//               <LoginPage />
//             )
//           } 
//         />
//          <Route 
//           path={PATHS.SIGNUP} 
//           element={
//             isAuthenticated ? (
//               <Navigate to={PATHS.HOME} replace />
//             ) : (
//               <SignupPage />
//             )
//           } 
//         />
//           {/* <Route path={PATHS.SIGNUP} element={<SignupPage />} /> */}
//           {/* <Route path={PATHS.FORGOT_PASSWORD} element={<ForgotPasswordPage />} /> */}

//           <Route 
//           path={PATHS.FORGOT_PASSWORD} 
//           element={
//             isAuthenticated ? (
//               <Navigate to={PATHS.HOME} replace />
//             ) : (
//               <ForgotPasswordPage />
//             )
//           } 
//         />
//           <Route path={PATHS.RESET_PASSWORD} element={<ResetPasswordPage />} />
//         </Route>
//       {/* <Route element={<PublicOnlyRoute />}>
       
//       </Route> */}

//       {/* Email Verification can be public as it's accessed via a link with a token */}
//       <Route path={PATHS.VERIFY_EMAIL} element={<VerifyEmailPage />} />
// {/* protectd routes in the future */}


//  {/* Protected routes (only accessible when logged in) */}
//  <Route 
//         element={isAuthenticated ? <MainAppLayout /> : <Navigate to={PATHS.LOGIN} replace />}
//       >
//         <Route path={PATHS.HOME} element={<DashboardPage />} />
//         <Route path={PATHS.JOURNAL} element={<JournalPage />} />
//         <Route path={PATHS.BACKTEST_DASHBOARD} element={<BacktestDashboardPlaceholder />} />
//         <Route path={PATHS.COMMUNITY_FEED} element={<CommunityFeedPlaceholder />} />
//         {/* Add other protected routes here */}
//              {/* <Route path={PATHS.USER_PROFILE} element={<UserProfilePagePlaceholder />} />
//           <Route path={PATHS.SETTINGS} element={<SettingsPagePlaceholder />} /> */}
//       </Route>
      

    

//       {/* Fallback for unmatched routes */}
//       <Route path={PATHS.NOT_FOUND} element={<NotFoundPage />} />

//       {/* Default redirect from root path "/" */}
//       {initialRedirect ? (
//         <Route path="/" element={<Navigate to={initialRedirect} replace />} />
//       ) : (
//         // If initialRedirect is null (meaning auth is loading),
//         // you might render a minimal loading indicator here or rely on App.jsx's global one.
//         // For simplicity, if App.jsx handles global loading, this route might not be hit
//         // or could also point to a loading component.
//         // However, usually the ProtectedRoute/PublicOnlyRoute handle loading states for their specific contexts.
//         // The App.jsx loader handles the very initial app load with token.
//         <Route path="/" element={ <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: theme.backgroundMain, color: theme.textPrimary}}>Loading App...</div>} />
//       )}
//     </Routes>
//   );
// };
// export default AppRouter;



// {/* <Route element={<MainAppLayout />}>
//           <Route path={PATHS.HOME} element={<DashboardPage />} />
//           {/* Placeholders for Phase 2+ features */}
//           // <Route path={PATHS.JOURNAL} element={<JournalPage />} />
          

          
//           // <Route path={PATHS.BACKTEST_DASHBOARD} element={<BacktestDashboardPlaceholder />} />
//           // <Route path={PATHS.COMMUNITY_FEED} element={<CommunityFeedPlaceholder />} />
     

// // </Route> */}






import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // To check initial auth state for root redirect

import { PATHS } from './paths';
import { ProtectedRoute, PublicOnlyRoute } from './routeGuards';

// Layouts
import LandingLayout from '@/shared/layouts/LandingLayout';
import AuthLayout from '@/shared/layouts/AuthLayout';
import MainAppLayout from '@/shared/layouts/MainAppLayout';

// Page Components (Ensure these are created in their respective folders)
import LandingPage from '@/pages/LandingPage/ui/LandingPage';
// import LoginPage from '@/pages/Auth/ui/LoginPage';
import LoginPage from '@/pages/Auth/ui/LoignPage';
import SignupPage from '@/pages/Auth/ui/SignupPage';
import ForgotPasswordPage from '@/pages/Auth/ui/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/Auth/ui/ResetPasswordPage';
import VerifyEmailPage from '@/pages/Auth/ui/VerifyEmailPage';
// import DashboardPage from '@/pages/DashboardPage/ui/DashboardPage';
import DashboardPage from '@/pages/DashBoard/ui/DashboardPage';
import NotFoundPage from '@/pages/NotFoundPage'; // Assume this exists
import JournalPage from '@/pages/Journal';
import FeedPage from '@/pages/community/ui/FeedPage';
import { theme } from '@/styles/theme';
import UserProfilePage from '@/pages/Profile/ui/UserProfilePage';
import GroupDetailPage from '@/pages/Groups/ui/GroupDetailsPage';
import GroupDiscoveryPage from '@/pages/Groups/ui/GroupDiscoveryPage';
import DirectMessagesPage from '@/pages/Messaging/ui/DirectMessagesPage';
import CreateGroupPage from '@/pages/Groups/ui/CreateGroupPage';
import BacktestDashboardPage from '@/pages/Backtesting/BacktesingDashboardPage';

import BacktestReplayPage from '@/pages/Backtesting/BacktestReplayPage';
import BacktestResultsPage from '@/pages/Backtesting/BacktestingResultsPage';
// Placeholder pages for features not yet built in Phase 1
// const JournalPagePlaceholder = () => <div style={{padding: '20px', color: theme.textPrimary}}>Journal Page (Coming Soon)</div>;
// const BacktestDashboardPlaceholder = () => <div style={{padding: '20px', color: theme.textPrimary}}>Backtesting Dashboard (Coming Soon)</div>;
// const CommunityFeedPlaceholder = () => <div style={{padding: '20px', color: theme.textPrimary}}>Community Feed (Coming Soon)</div>;
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// // Layouts
// import LandingLayout from '@/shared/layouts/LandingLayout';
// import AuthLayout from '@/shared/layouts/AuthLayout';
// import MainAppLayout from '@/shared/layouts/MainAppLayout';

// // Pages
// import LandingPage from '@/pages/LandingPage/ui/LandingPage';
// // import LoginPage from '@/pages/Auth/ui/LoginPage';
// import SignupPage from '@/pages/Auth/ui/SignupPage';
// import ForgotPasswordPage from '@/pages/Auth/ui/ForgotPasswordPage';
// import ResetPasswordPage from '@/pages/Auth/ui/ResetPasswordPage';
// import VerifyEmailPage from '@/pages/Auth/ui/VerifyEmailPage';
// import LoginPage from '@/pages/Auth/ui/LoignPage';
// import DashboardPage from '@/pages/Dashboard/ui/DashboardPage';
// import NotFoundPage from '@/pages/NotFoundPage';
// import JournalPage from '@/pages/Journal';
// import { PATHS } from './paths';
// // Placeholder components
// const BacktestDashboardPlaceholder = () => <div>Backtesting Dashboard (Coming Soon)</div>;
// const CommunityFeedPlaceholder = () => <div>Community Feed (Coming Soon)</div>;

const AppRouter = () => {
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  // Show loading state while checking auth status
  if (status === 'loading') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Root path redirect */}
    
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? PATHS.HOME : PATHS.LANDING} replace />} 
      />

      {/* Public routes */}
      <Route element={<LandingLayout />}>
        <Route path={PATHS.LANDING} element={<LandingPage />} />
      </Route>

      {/* Auth routes - only accessible when not logged in */}
      <Route element={<AuthLayout />}>
        <Route 
          path={PATHS.LOGIN} 
          element={isAuthenticated ? <Navigate to={PATHS.HOME} replace /> : <LoginPage />} 
        />
        <Route 
          path={PATHS.SIGNUP} 
          element={isAuthenticated ? <Navigate to={PATHS.HOME} replace /> : <SignupPage />} 
        />
        <Route 
          path={PATHS.FORGOT_PASSWORD} 
          element={isAuthenticated ? <Navigate to={PATHS.HOME} replace /> : <ForgotPasswordPage />} 
        />
        <Route path={PATHS.RESET_PASSWORD} element={<ResetPasswordPage />} />
      </Route>

      {/* Public verification route */}
      <Route path={PATHS.VERIFY_EMAIL} element={<VerifyEmailPage />} />

      {/* Protected routes - only accessible when logged in */}
      <Route element={isAuthenticated ? <MainAppLayout /> : <Navigate to={PATHS.LOGIN} replace />}>
        <Route path={PATHS.HOME} element={<DashboardPage />} />
        <Route path={PATHS.JOURNAL} element={<JournalPage />} />
        <Route path={PATHS.BACKTEST_DASHBOARD} element={<BacktestDashboardPage />} />

        <Route path={PATHS.COMMUNITY_FEED} element={<FeedPage />} />
        <Route path={PATHS.USER_PROFILE} element ={<UserProfilePage />} />
        <Route path={PATHS.GROUP_DISCOVERY} element ={<GroupDiscoveryPage />} />
        <Route path={PATHS.GROUP_DETAIL} element ={<GroupDetailPage />} />
        <Route path={PATHS.MESSAGEING} element ={<DirectMessagesPage />} />
        <Route path={PATHS.BACKTEST_DASHBOARD} element={<BacktestDashboardPage />} />
        <Route path={PATHS.BACKTEST_SESSION} element={<BacktestReplayPage />} />
        <Route path={PATHS.BACKTEST_RESULTS} element={<BacktestResultsPage />} /> {/* NEW ROUTE */}
      </Route>
     


      
      {/* Not found route */}
      <Route path={PATHS.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;