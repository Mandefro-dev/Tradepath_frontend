import React from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '../model/authSlice';
import { PATHS } from '@/app/routing/paths';
import { Button, Input, FormError } from '@/shared/ui';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({ 'string.empty': 'Email is required', 'string.email': 'Email must be a valid email address' }),
  password: Joi.string().required().messages({ 'string.empty': 'Password is required' }),
});

 const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error: apiError } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: joiResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate(PATHS.HOME);
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
      <h2 className="text-2xl font-semibold text-light mb-2">Welcome Back</h2>
      <p className="text-medium-text mb-6">Log in to access your dashboard.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-left">
        <div>
          <Input type="email" placeholder="you@example.com" {...register("email")} leftIcon={<FaEnvelope />} error={!!errors.email} />
          {errors.email && <FormError>{errors.email.message}</FormError>}
        </div>
        <div>
          <Input type="password" placeholder="••••••••" {...register("password")} leftIcon={<FaLock />} error={!!errors.password} />
          {errors.password && <FormError>{errors.password.message}</FormError>}
        </div>
        <Link to={PATHS.FORGOT_PASSWORD} className="text-sm text-primary hover:underline text-right -mt-2">Forgot password?</Link>
        {apiError && <FormError>{apiError}</FormError>}
        <Button type="submit" variant="primary" className="w-full mt-2" isLoading={status === 'loading'}>Log In</Button>
      </form>
      <p className="mt-6 text-sm text-medium-text">Don't have an account? <Link to={PATHS.SIGNUP} className="font-semibold text-primary hover:underline">Sign up</Link></p>
    </motion.div>
  );
};
export default LoginForm