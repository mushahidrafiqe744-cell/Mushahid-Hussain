import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface TooltipNavbarItem {
  icon: React.ReactNode;
  label: string;
  labelHasKeyword?: string[];
  hasBadge?: boolean;
  onClick?: () => void;
  isActive?: boolean;
}

interface TooltipNavbarProps {
  items: TooltipNavbarItem[];
  className?: string;
}

export const TooltipNavbar: React.FC<TooltipNavbarProps> = ({ items, className = '' }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const highlightKeyword = (text: string, keywords?: string[]) => {
    if (!keywords || keywords.length === 0) return text;
    
    // Create a regex to match keywords (case insensitive)
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isKeyword = keywords.some(k => k.toLowerCase() === part.toLowerCase());
      return isKeyword ? (
        <span key={i} className="text-[#C5A059] font-bold">
          {part}
        </span>
      ) : (
        part
      );
    });
  };

  return (
    <div className={`fixed left-1/2 -translate-x-1/2 z-50 w-auto px-4 ${className}`}>
      <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-[#11261B]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl ring-1 ring-black/20 overflow-x-auto no-scrollbar max-w-[95vw]">
        {items.map((item, index) => {
          const isHovered = hoveredIndex === index;
          
          return (
            <div
              key={index}
              className="relative flex items-center justify-center shrink-0"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: -45, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute z-10 px-3 py-1.5 bg-[#F8F5EE] text-[#11261B] text-[10px] sm:text-xs font-bold rounded-lg shadow-xl border border-[#C5A059]/30 whitespace-nowrap pointer-events-none"
                  >
                    <div className="flex items-center gap-1.5">
                      {highlightKeyword(item.label, item.labelHasKeyword)}
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#F8F5EE] border-r border-b border-[#C5A059]/30 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={item.onClick}
                whileTap={{ scale: 0.92 }}
                className={`relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl transition-all duration-200 group cursor-pointer ${
                  item.isActive 
                    ? 'bg-[#C5A059] text-[#11261B]' 
                    : 'text-[#DFC285] hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </div>

                {item.hasBadge && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#50E364] rounded-full border border-[#11261B] shadow-sm animate-pulse" />
                )}

                {isMounted && item.isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute -bottom-1.5 w-1 h-1 bg-[#C5A059] rounded-full"
                  />
                )}
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
