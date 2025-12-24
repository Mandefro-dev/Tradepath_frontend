// frontend/src/pages/Journal/ui/JournalPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlusSquare, FaListAlt, FaChartLine, FaBrain } from 'react-icons/fa';

import InlineTradeEntry from '@/features/Journaling/ui/InlineTradeEntry';
import TradeLogDisplay from '@/features/Journaling/ui/TradeLogDisplay';
import JournalPerformanceDashboard from '@/features/Journaling/ui/JournalPerformanceDashboard';
import JournalInsights from '@/features/Journaling/ui/JournalInsights';

const tabs = [
  { id: 'newTrade', label: 'Log Trade', icon: FaPlusSquare, component: InlineTradeEntry },
  { id: 'tradeLog', label: 'Trade Log', icon: FaListAlt, component: TradeLogDisplay },
  { id: 'performance', label: 'Performance', icon: FaChartLine, component: JournalPerformanceDashboard },
  { id: 'insights', label: 'Insights', icon: FaBrain, component: JournalInsights },
];

const JournalPage = () => {
  const [activeTab, setActiveTab] = useState('tradeLog');

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white">
      {/* ambient glass blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="sticky top-0 z-20 backdrop-blur-xl bg-white/5 border-b border-white/10"
      >
        <div className="px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-wide">Trading Journal</h1>
          <p className="text-sm text-white/60 mt-1">Track. Review. Improve.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all rounded-t-xl
                  ${isActive
                    ? 'text-white'
                    : 'text-white/50 hover:text-white'}
                `}
              >
                <Icon className={`text-base ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                {tab.label}

                {isActive && (
                  <motion.span
                    layoutId="activeJournalTab"
                    className="absolute inset-0 rounded-t-xl bg-white/10 backdrop-blur-xl border border-white/20"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.header>

      {/* Content */}
      <div className="relative z-10 h-[calc(100%-140px)] px-6 py-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-full"
          >
            <div className="h-full rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-6">
              {ActiveComponent ? <ActiveComponent /> : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JournalPage;
