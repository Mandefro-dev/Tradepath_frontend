import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { PATHS } from './paths';
import { theme } from '@/styles/theme'; // For styling the loader message
import { Loader } from '@/shared/ui'; // Assuming your Loader component

// For TypeScript, you would import RootState:
// import type { RootState } from '@/app/store';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, status, token } = useSelector((state /*: RootState*/) => state.auth);
  const location = useLocation();

  // If we are still trying to determine auth status based on a token (e.g., on app load/refresh)
  if (status === 'loading' && token && !isAuthenticated) {
    const loaderContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.backgroundMain,
        color: theme.textPrimary,
    };
    return (
      <div style={loaderContainerStyle}>
        <Loader size="lg" message="Verifying session..." />
      </div>
    );
  }

  if (!isAuthenticated && status !== 'loading') {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login.
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }

  return children; // Render the children (the protected page)
};

export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, status, token } = useSelector((state /*: RootState*/) => state.auth);

  // Similar loading state check as ProtectedRoute if needed, though usually less critical here.
  if (status === 'loading' && token) {
    const loaderContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.backgroundMain,
        color: theme.textPrimary,
    };
    return (
      <div style={loaderContainerStyle}>
        <Loader size="lg" message="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    // If the user is already authenticated, redirect them from public-only pages (like login/signup)
    // to the main application page (e.g., dashboard/home).
    return <Navigate to={PATHS.HOME} replace />;
  }

  return children; // Render the children (the public-only page)
};

// Example AdminRoute (if you add roles to your User model and auth state)
// export const AdminRoute = ({ children }) => {
//   const { isAuthenticated, user, status, token } = useSelector((state) => state.auth);
//   const location = useLocation();

//   if (status === 'loading' && token) {
//     return <div style={{/* loader styles */}}>Loading session...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
//   }

//   if (user?.role !== 'admin') {
//     // If not an admin, redirect to a "forbidden" page or home
//     // For simplicity, redirecting to home. A dedicated 403 page is better.
//     return <Navigate to={PATHS.HOME} state={{ error: "Access Denied: Admin only." }} replace />;
//   }

//   return children;
// };