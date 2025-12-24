import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, resendVerificationEmail } from '@/features/Auth/model/authSlice';
import { PATHS } from '@/app/routing/paths';
import AuthLayout from '@/shared/layouts/AuthLayout'; // Using AuthLayout for consistent card style
import { Loader, Button } from '@/shared/ui';
import { theme } from '@/styles/theme';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaPaperPlane } from 'react-icons/fa';

const VerifyEmailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { status, error } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [emailForResend, setEmailForResend] = useState(''); // In a real app, you might not know this on this page

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token))
        .unwrap()
        .then(() => {
          // Toast is handled by slice
          setMessage('Your email has been successfully verified!');
          setIsError(false);
          setTimeout(() => navigate(PATHS.LOGIN, { state: { emailVerified: true } }), 3000);
        })
        .catch((err) => {
          // Toast handled by slice
          setMessage(err || "Email verification failed. The link may be invalid, expired, or your email is already verified.");
          setIsError(true);
          setCanResend(true); // Allow resend if initial verification fails
        });
    } else {
      setMessage("Invalid or missing verification token.");
      setIsError(true);
      // navigate(PATHS.LOGIN); // Or display message
    }
  }, [dispatch, token, navigate]);

  const handleResendVerification = async () => {
    if (!emailForResend) { // This is a UX challenge - how to get the email here?
                          // Usually, resend is from a login page or user profile if unverified.
                          // For this page, if token failed, we don't know the user's email.
      toast.error("Unable to resend: email address not available on this page after a token failure.");
      return;
    }
    // This part is more conceptual for this page, as resend usually needs an email input.
    // dispatch(resendVerificationEmail(emailForResend));
    // toast.info("If an account exists for that email, a new verification link has been sent.");
  };
  
  const containerStyle = { textAlign: 'center', padding: `${theme.spacing.md}px` };
  const titleStyle = { color: theme.textPrimary, marginBottom: theme.spacing.md, fontSize: '1.75rem', fontWeight: theme.fontWeightSemibold };
  const messageStyle = { color: isError ? theme.error : theme.success, marginBottom: theme.spacing.lg, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm };
  const iconStyle = { fontSize: '1.5rem' };

  let content;

  if (status === 'loading' && !message) {
    content = (
      <>
        <h2 style={titleStyle}>Verifying Your Email...</h2>
        <Loader size="lg" />
        <p style={{color: theme.textMuted, marginTop: theme.spacing.md}}>Please wait a moment.</p>
      </>
    );
  } else if (message) {
    content = (
      <>
        <h2 style={titleStyle}>{isError ? 'Verification Failed' : 'Email Verified!'}</h2>
        <p style={messageStyle}>
          {isError ? <FaTimesCircle style={{...iconStyle, color: theme.error}} /> : <FaCheckCircle style={{...iconStyle, color: theme.success}}/>}
          {message}
        </p>
        <Link to={PATHS.LOGIN}>
          <Button variant="primary" style={{marginTop: theme.spacing.md}}>
            {isError ? 'Try Logging In' : 'Proceed to Login'}
          </Button>
        </Link>
        {/* {isError && canResend && ( // Resend logic needs email context
          <Button variant="secondary" onClick={handleResendVerification} style={{marginTop: theme.spacing.sm}} leftIcon={<FaPaperPlane/>}>
            Resend Verification Email
          </Button>
        )} */}
      </>
    );
  } else if (!token) {
      content = ( // Fallback if somehow no token and useEffect hasn't set message yet
          <>
            <h2 style={titleStyle}>Invalid Link</h2>
            <p style={{...messageStyle, color: theme.error}}>The verification link is missing or invalid.</p>
            <Link to={PATHS.LOGIN}><Button variant="primary" style={{marginTop: theme.spacing.md}}>Back to Login</Button></Link>
          </>
      );
  }


  return (
    <AuthLayout>
      <div style={containerStyle}>
        {content}
      </div>
    </AuthLayout>
  );
};
export default VerifyEmailPage;