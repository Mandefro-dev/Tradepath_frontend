import React from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerUser } from '../model/authSlice';
import { PATHS } from '@/app/routing/paths';
import { Button, Input, FormError } from '@/shared/ui';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const signupSchema = Joi.object({
  name: Joi.string().required().messages({ 'string.empty': 'Name is required' }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({ 'string.empty': 'Email is required', 'string.email': 'Email must be valid' }),
  password: Joi.string().min(8).required().messages({ 'string.empty': 'Password is required', 'string.min': 'Password must be at least 8 characters' }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match', 'string.empty': 'Please confirm your password' }),
});

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error: apiError } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: joiResolver(signupSchema) });

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser({ name: data.name, email: data.email, password: data.password })).unwrap();
      navigate(PATHS.LOGIN, { state: { registrationSuccess: true } });
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
      <h2 className="text-2xl font-semibold text-light mb-2">Create Your Account</h2>
      <p className="text-medium-text mb-6">Join the community and start your journey.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-left">
        <div><Input placeholder="Full Name" {...register("name")} leftIcon={<FaUser />} error={!!errors.name} /><FormError>{errors.name?.message}</FormError></div>
        <div><Input type="email" placeholder="Email Address" {...register("email")} leftIcon={<FaEnvelope />} error={!!errors.email} /><FormError>{errors.email?.message}</FormError></div>
        <div><Input type="password" placeholder="Password (min. 8 characters)" {...register("password")} leftIcon={<FaLock />} error={!!errors.password} /><FormError>{errors.password?.message}</FormError></div>
        <div><Input type="password" placeholder="Confirm Password" {...register("confirmPassword")} leftIcon={<FaLock />} error={!!errors.confirmPassword} /><FormError>{errors.confirmPassword?.message}</FormError></div>
        {apiError && <FormError>{apiError}</FormError>}
        <Button type="submit" variant="primary" className="w-full mt-2" isLoading={status === 'loading'}>Create Account</Button>
      </form>
      <p className="mt-6 text-sm text-medium-text">Already have an account? <Link to={PATHS.LOGIN} className="font-semibold text-primary hover:underline">Log in</Link></p>
    </motion.div>
  );
};
export default SignupForm