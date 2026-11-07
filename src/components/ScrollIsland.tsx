import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { Sparkles, ChevronRight, BookOpen } from 'lucide-react';

export interface Topic {
  id: string;
  title: string;
  content: string;
}

interface ScrollIslandProps {
  topics: Topic[];
  className?: string;
}

export const ScrollIsland: React.FC<ScrollIslandProps> = ({ topics, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 300);
      
      // Calculate active topic based on scroll progress
      // We divide the page into equal segments for each topic
      const progress = scrollPosition / (document.documentElement.scrollHeight - window.innerHeight);
      const index = Math.min(
        Math.floor(progress * topics.length),
        topics.length - 1
      );
      
      if (index >= 0) {
        setActiveTopicIndex(index);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [topics.length]);

  const activeTopic = topics[activeTopicIndex];

  if (!activeTopic) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className={`fixed bottom-20 sm:bottom-24 left-1/2 z-50 w-full max-w-xs sm:max-w-sm ${className}`}
        >
          <div className="mx-4 overflow-hidden bg-[#11261B]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl ring-1 ring-black/20">
            {/* Progress Bar */}
            <motion.div 
              className="h-1 bg-[#C5A059] origin-left"
              style={{ scaleX }}
            />
            
            <div className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#C5A059]/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#DFC285]/70">Design Principle</p>
                    <h4 className="text-xs font-bold text-white truncate">{activeTopic.title}</h4>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="w-4 h-4 text-[#DFC285]" />
                  </motion.div>
                </button>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 border-t border-white/5">
                      <p className="text-[11px] leading-relaxed text-[#D1DDD4]">
                        {activeTopic.content}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Small Sparkle decoration */}
            <div className="absolute top-2 right-12 pointer-events-none opacity-50">
              <Sparkles className="w-3 h-3 text-[#C5A059] animate-pulse" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
