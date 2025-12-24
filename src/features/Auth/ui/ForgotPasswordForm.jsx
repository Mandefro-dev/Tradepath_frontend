import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { forgotPassword } from '../model/authSlice';
import { PATHS } from '@/app/routing/paths';
import { Button, Input, Form, FormGroup, FormLabel, FormError } from '@/shared/ui';
import { theme } from '@/styles/theme';
import { toast } from 'react-toastify';
import { FaEnvelope } from 'react-icons/fa';

const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
        toast.error("Please enter your email address.");
        return;
    }
    try {
        await dispatch(forgotPassword(email)).unwrap();
        // Toast for success/info is handled in the slice
        setSubmitted(true);
    } catch (rejectedValueOrSerializedError) {
        // Error toast handled by slice
    }
  };
  
  const formContainerStyle = { textAlign: 'center' };
  const titleStyle = { color: theme.textPrimary, marginBottom: theme.spacing.xs, fontSize: '1.75rem', fontWeight: theme.fontWeightSemibold };
  const subtitleStyle = { color: theme.textSecondary, marginBottom: theme.spacing.lg, fontSize: '0.95rem' };
  const authLinkContainerStyle = { marginTop: theme.spacing.lg, fontSize: '0.9rem', color: theme.textSecondary };
  const authLinkStyle = { color: theme.primary, fontWeight: theme.fontWeightMedium, textDecoration: 'none' };
  const confirmationPStyle = {...subtitleStyle, lineHeight: 1.6};


  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={formContainerStyle}>
        <h2 style={titleStyle}>Check Your Email</h2>
        <p style={confirmationPStyle}>
          If an account with <strong>{email}</strong> exists, a password reset link has been sent.
          Please check your inbox (and spam folder).
        </p>
        <Link to={PATHS.LOGIN} style={{...authLinkStyle, display: 'inline-block', marginTop: theme.spacing.md}}>
            <Button variant="secondary">Back to Login</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={formContainerStyle}>
      <h2 style={titleStyle}>Forgot Password?</h2>
      <p style={subtitleStyle}>No worries! Enter your email and we'll send you a reset link.</p>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel htmlFor="email">Email Address</FormLabel>
          <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required leftIcon={<FaEnvelope />} />
        </FormGroup>
        {error && status === 'failed' && <FormError>{typeof error === 'string' ? error : "Failed to send reset link."}</FormError>}
        <Button type="submit" variant="primary" style={{width: '100%', marginTop: theme.spacing.md, padding: `${theme.spacing.md}px 0`}} isLoading={status === 'loading'} disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending Link...' : 'Send Reset Link'}
        </Button>
      </Form>
      <p style={authLinkContainerStyle}>
        Remember your password? <Link to={PATHS.LOGIN} style={authLinkStyle}>Log in</Link>
      </p>
    </motion.div>
  );
};
export default ForgotPasswordForm;