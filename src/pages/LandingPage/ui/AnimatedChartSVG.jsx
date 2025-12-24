import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedChartSVG = () => (
  <motion.svg 
    className="absolute inset-0 w-full h-full"
    width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#22c55e" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <motion.polyline
      fill="none"
      stroke="url(#glowGradient)"
      strokeWidth="3"
      points="50,600 150,550 250,580 350,500 450,540 550,450 650,510 750,400 850,470 950,350 1050,420 1150,300"
      variants={{
        hidden: { pathLength: 0, opacity: 0 },
        visible: { pathLength: 1, opacity: 0.6, transition: { duration: 3, ease: "easeInOut", delay: 0.8 } }
      }}
      initial="hidden"
      animate="visible"
      filter="url(#glow)"
    />
  </motion.svg>
);