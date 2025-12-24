import React from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/app/routing/paths';
import { theme } from '@/styles/theme';
import { Button } from '@/shared/ui';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
  const containerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 70px)', textAlign: 'center', padding: theme.spacing.xl, color: theme.textPrimary };
  const iconStyle = { fontSize: '5rem', color: theme.warning, marginBottom: theme.spacing.md };
  const h1Style = { fontSize: '2.5rem', fontWeight: theme.fontWeightBold, color: theme.textPrimary, marginBottom: theme.spacing.sm };
  const pStyle = { fontSize: '1.1rem', color: theme.textSecondary, marginBottom: theme.spacing.lg, maxWidth: '450px' };

  return (
    <div style={containerStyle}>
      <FaExclamationTriangle style={iconStyle} />
      <h1 style={h1Style}>404 - Page Not Found</h1>
      <p style={pStyle}>Oops! The page you're looking for doesn't exist or has been moved.</p>
      <Link to={PATHS.HOME}>
        <Button variant="primary" size="lg">Go to Homepage</Button>
      </Link>
    </div>
  );
};
export default NotFoundPage;
