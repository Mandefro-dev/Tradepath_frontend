import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PATHS } from '@/app/routing/paths';
import { FaChartPie } from 'react-icons/fa';

  const AuthLayout = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-dark-950">
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full max-w-md p-8 bg-dark-900 rounded-xl shadow-2xl border border-dark-700"
    >
      <Link to={PATHS.LANDING} className="flex items-center justify-center gap-2 mb-8 text-3xl font-bold text-primary">
        <FaChartPie /><span>TradePath X</span>
      </Link>
      <Outlet />
    </motion.div>
  </div>
);
export default AuthLayout