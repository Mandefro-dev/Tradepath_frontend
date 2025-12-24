import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resetPassword } from '../model/authSlice';
import { PATHS } from '@/app/routing/paths';
import { Button, Input, Form, FormGroup, FormLabel, FormError } from '@/shared/ui';
import { theme } from '@/styles/theme';
import { toast } from 'react-toastify';
import { FaLock } from 'react-icons/fa';

const ResetPasswordForm = ({ token }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (passwords.password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
    }

    try {
      await dispatch(resetPassword({ token, password: passwords.password })).unwrap();
      // Toast handled in slice
      navigate(PATHS.LOGIN, { state: { passwordResetSuccess: true } });
    } catch (rejectedValueOrSerializedError) {
      // Toast handled in slice
    }
  };

  const formContainerStyle = { textAlign: 'center' };
  const titleStyle = { color: theme.textPrimary, marginBottom: theme.spacing.xs, fontSize: '1.75rem', fontWeight: theme.fontWeightSemibold };
  const subtitleStyle = { color: theme.textSecondary, marginBottom: theme.spacing.lg, fontSize: '0.95rem' };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={formContainerStyle}>
      <h2 style={titleStyle}>Set New Password</h2>
      <p style={subtitleStyle}>Enter and confirm your new password below.</p>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel htmlFor="password">New Password</FormLabel>
          <Input type="password" name="password" id="password" value={passwords.password} onChange={handleChange} placeholder="Min. 8 characters" required leftIcon={<FaLock />} />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
          <Input type="password" name="confirmPassword" id="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} placeholder="Re-enter new password" required leftIcon={<FaLock />} />
        </FormGroup>
        {error && status === 'failed' && <FormError>{typeof error === 'string' ? error : "Failed to reset password."}</FormError>}
        <Button type="submit" variant="primary" style={{width: '100%', marginTop: theme.spacing.md, padding: `${theme.spacing.md}px 0`}} isLoading={status === 'loading'} disabled={status === 'loading'}>
          {status === 'loading' ? 'Resetting...' : 'Reset Password'}
        </Button>
      </Form>
    </motion.div>
  );
};
export default ResetPasswordForm;