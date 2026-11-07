import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface DiscreteTab {
  id: string;
  icon: React.ReactNode;
  label: string;
  activeColor?: string;
}

interface DiscreteTabsProps {
  tabs: DiscreteTab[];
  defaultTab?: string;
  onTabChange?: (id: string) => void;
  activeTab?: string;
  className?: string;
}

export const DiscreteTabs: React.FC<DiscreteTabsProps> = ({
  tabs,
  defaultTab,
  onTabChange,
  activeTab: controlledActiveTab,
  className = '',
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const [localActiveTab, setLocalActiveTab] = useState(defaultTab || tabs[0]?.id);
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : localActiveTab;

  const handleTabClick = (id: string) => {
    if (controlledActiveTab === undefined) {
      setLocalActiveTab(id);
    }
    if (onTabChange) {
      onTabChange(id);
    }
  };

  return (
    <div className={`flex items-center p-1 bg-[#11261B]/5 rounded-2xl border border-[#11261B]/10 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative flex items-center gap-2 py-2 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer outline-none ${
              isActive 
                ? `${tab.activeColor || 'text-[#C5A059]'} px-4` 
                : 'text-[#5C6E61] hover:text-[#11261B] hover:bg-white/50 px-3'
            }`}
          >
            {isMounted && isActive && (
              <motion.div
                layoutId="discrete-tab-pill"
                className="absolute inset-0 bg-white shadow-sm border border-[#C5A059]/20 rounded-xl"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <span className="relative z-10 w-5 h-5 flex items-center justify-center shrink-0">
              {tab.icon}
            </span>
            
            <AnimatePresence mode="popLayout" initial={false}>
              {isActive && (
                <motion.span
                  initial={{ width: 0, opacity: 0, x: -5 }}
                  animate={{ width: 'auto', opacity: 1, x: 0 }}
                  exit={{ width: 0, opacity: 0, x: -5 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="relative z-10 whitespace-nowrap overflow-hidden"
                >
                  {tab.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
};
