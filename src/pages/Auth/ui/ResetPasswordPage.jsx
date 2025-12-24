// frontend/src/pages/Auth/ui/ResetPasswordPage.jsx
import React from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import ResetPasswordForm from '@/features/Auth/ui/ResetPasswordForm';
import AuthLayout from '@/shared/layouts/AuthLayout';
import { PATHS } from '@/app/routing/paths';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    // This toast might be better placed inside the form or if redirection happens immediately
    // toast.error("Invalid or missing password reset token."); 
    return <Navigate to={PATHS.LOGIN} state={{ error: "Invalid or missing password reset token."}} replace />;
  }

  return (
    <AuthLayout>
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
};
export default ResetPasswordPage;