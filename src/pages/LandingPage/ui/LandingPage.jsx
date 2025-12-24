import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaChartLine, FaUsers, FaFlask, FaShieldAlt, FaBolt, FaComments } from 'react-icons/fa';
import { PATHS } from '@/app/routing/paths';
import { Button } from '@/shared/ui';
import ParticlesBackground from './ParticlesBackground';

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    className="bg-dark-900/50 p-8 rounded-xl border border-dark-700 text-center flex flex-col items-center shadow-lg hover:border-primary/50 hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    viewport={{ once: true, amount: 0.3 }}
  >
    <div className="text-4xl text-primary mb-6 p-4 bg-dark-surface rounded-full border border-dark-border">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-light">{title}</h3>
    <p className="text-medium-text leading-relaxed">{description}</p>
  </motion.div>
);

const AnimatedTradingSVG = () => {
    // An advanced animated SVG representing market data flow
    const { scrollYProgress } = useScroll();
    const pathLength = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

    return (
        <svg className="w-full h-auto" viewBox="0 0 500 150">
            <motion.path
                d="M 20 130 C 80 130, 100 50, 150 50 S 220 130, 280 130 S 350 20, 400 20 S 450 130, 480 130"
                fill="transparent"
                stroke="url(#line-gradient)"
                strokeWidth="2"
                style={{ pathLength }}
                transition={{ duration: 1, ease: "easeInOut" }}
            />
            <defs>
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
            </defs>
        </svg>
    );
};


export const LandingPage = () => {
  return (
    <div>
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        <ParticlesBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/50 via-dark-950 to-dark-900 z-0"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-light to-medium-text"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
          >
            Master Your Edge.
          </motion.h1>
          <motion.p 
            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-medium-text"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
          >
            The all-in-one platform for serious traders. Advanced journaling, high-fidelity backtesting, and a collaborative community to elevate your performance.
          </motion.p>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="mt-10">
            <Link to={PATHS.SIGNUP}>
              <Button variant="primary" size="lg" className="text-lg shadow-lg shadow-primary/20">Start Your Free Trial</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-20 sm:py-32 bg-dark-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-light">The Edge You've Been Searching For</h2>
            <p className="mt-4 text-lg text-medium-text">From deep analysis to real-time simulation, our tools are built for one purpose: to make you a better trader.</p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={<FaChartLine />} title="Precision Journaling" description="Log every detail with custom tags, emotional tracking, and screenshot uploads. Uncover patterns and refine your approach." delay={0} />
            <FeatureCard icon={<FaFlask />} title="Realistic Backtesting" description="Simulate trades like never before. Test strategies on historical data with a TradingView-like experience and detailed analytics." delay={1} />
            <FeatureCard icon={<FaUsers />} title="Collaborative Community" description="Connect, share, and learn. Discuss trade ideas, join groups, and build your network in a dedicated space." delay={2} />
            <FeatureCard icon={<FaShieldAlt />} title="Secure & Private" description="Your data is yours. Control what you share with robust privacy settings and a secure platform." delay={3} />
            <FeatureCard icon={<FaBolt />} title="Performance Insights" description="Go beyond P&L. Understand your win rates, R:R, best setups, and emotional impact with comprehensive analytics." delay={4} />
            <FeatureCard icon={<FaComments />} title="Real-Time Interaction" description="Engage in group chats, direct messages, and get instant notifications for community activities." delay={5} />
          </div>
        </div>
      </section>
      
      {/* --- HOW IT WORKS SECTION --- */}
      <section className="py-20 sm:py-32 bg-dark-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-light">A Seamless Workflow</h2>
                <p className="mt-4 text-lg text-medium-text">From idea to analysis, all in one place.</p>
            </div>
            <div className="mt-16 max-w-4xl mx-auto">
                <AnimatedTradingSVG />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 text-center">
                    <motion.div initial={{opacity:0}} whileInView={{opacity:1}} transition={{delay:0.2, duration:0.5}} viewport={{once:true}}>
                        <h3 className="text-lg font-semibold text-primary">1. Backtest</h3>
                        <p className="text-medium-text text-sm">Validate your strategy with our high-fidelity replay engine.</p>
                    </motion.div>
                    <motion.div initial={{opacity:0}} whileInView={{opacity:1}} transition={{delay:0.4, duration:0.5}} viewport={{once:true}}>
                        <h3 className="text-lg font-semibold text-primary">2. Journal</h3>
                        <p className="text-medium-text text-sm">Log your live trades with rich data points and notes.</p>
                    </motion.div>
                    <motion.div initial={{opacity:0}} whileInView={{opacity:1}} transition={{delay:0.6, duration:0.5}} viewport={{once:true}}>
                        <h3 className="text-lg font-semibold text-primary">3. Analyze</h3>
                        <p className="text-medium-text text-sm">Discover your edge with our advanced performance analytics.</p>
                    </motion.div>
                </div>
            </div>
          </div>
      </section>

    </div>
  );
};
export default LandingPage;