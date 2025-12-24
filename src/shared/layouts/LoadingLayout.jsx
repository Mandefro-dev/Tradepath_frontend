// File: frontend/src/shared/layouts/LandingLayout.jsx (COMPLETE)
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PATHS } from '@/app/routing/paths';
import { FaChartPie } from 'react-icons/fa';
import { Button } from '@/shared/ui';

const LandingHeader = () => (
  <motion.header
    initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
    className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-lg border-b border-dark-700"
  >
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
      <Link to={PATHS.LANDING} className="flex items-center gap-2 text-2xl font-bold text-primary">
        <FaChartPie /><span>TradePath X</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <a href="#features" className="text-medium-text hover:text-light transition-colors">Features</a>
        <Link to={PATHS.LOGIN}><Button variant="ghost" size="sm">Login</Button></Link>
        <Link to={PATHS.SIGNUP}><Button variant="primary" size="sm">Sign Up Free</Button></Link>
      </nav>
    </div>
  </motion.header>
);

const LandingFooter = () => (
  <footer className="bg-dark-900 border-t border-dark-700">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-text text-sm">
      <p>&copy; {new Date().getFullYear()} TradePath X. All Rights Reserved.</p>
    </div>
  </footer>
);

export const LandingLayout = () => (
  <div className="bg-dark-950 min-h-screen">
    <LandingHeader />
    <main className="pt-20"> {/* Offset for fixed header */}
        <Outlet />
    </main>
    <LandingFooter />
  </div>
);