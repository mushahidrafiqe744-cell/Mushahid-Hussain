import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

interface SaveToggleProps {
  size?: 'sm' | 'md' | 'lg';
  idleText?: string;
  savedText?: string;
  loadingDuration?: number;
  successDuration?: number;
  onValidate?: () => boolean;
  onClick?: () => void;
  className?: string;
}

export const SaveToggle: React.FC<SaveToggleProps> = ({
  size = 'md',
  idleText = 'Send Order',
  savedText = 'Order Sent',
  loadingDuration = 1200,
  successDuration = 1500,
  onValidate,
  onClick,
  className = '',
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleClick = async () => {
    if (status !== 'idle') return;

    // Optional validation before starting animation
    if (onValidate && !onValidate()) {
      return;
    }

    setStatus('loading');

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, loadingDuration));

    setStatus('success');

    // Trigger the actual action (like opening WhatsApp) after success state
    if (onClick) onClick();

    // Reset back to idle after success duration
    setTimeout(() => {
      setStatus('idle');
    }, successDuration);
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3.5 text-sm sm:text-base',
    lg: 'px-8 py-4 text-base sm:text-lg',
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={status !== 'idle'}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full overflow-hidden rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl cursor-pointer group flex items-center justify-center gap-3 ${
        status === 'success' 
          ? 'bg-emerald-600 text-white' 
          : 'bg-[#11261B] text-white hover:bg-[#1A3828]'
      } ${sizes[size]} ${className}`}
    >
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-3"
          >
            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>{idleText}</span>
          </motion.div>
        )}

        {status === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3"
          >
            <Loader2 className="w-5 h-5 animate-spin text-[#50E364]" />
            <span>Sending...</span>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center justify-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-[#50E364]" />
            <span>{savedText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress background bar during loading */}
      {status === 'loading' && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: loadingDuration / 1000, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-1 bg-[#50E364]"
        />
      )}
    </motion.button>
  );
};
