import React, { useState, useEffect, useRef } from 'react';

interface HoverCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  isParentHovered?: boolean;
}

export const HoverCounter: React.FC<HoverCounterProps> = ({
  target,
  suffix = '',
  prefix = '',
  className = '',
  isParentHovered = false,
}) => {
  const [internalHover, setInternalHover] = useState(false);
  const [displayValue, setDisplayValue] = useState(target);
  const animationFrameRef = useRef<number | null>(null);

  const active = isParentHovered || internalHover;

  // Run initial smooth count-up once on mount
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 900;
    setDisplayValue(0);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.min(Math.round(easeOut * target), target);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(target);
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [target]);

  // Re-animate count-up whenever hovered
  useEffect(() => {
    if (active) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      let startTime: number | null = null;
      const duration = 600;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.min(Math.round(easeOut * target), target);
        setDisplayValue(current);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(step);
        } else {
          setDisplayValue(target);
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = requestAnimationFrame(step);
    }
  }, [active, target]);

  return (
    <span
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
      className={`tabular-nums transition-colors duration-300 ${className}`}
    >
      {prefix}{displayValue}{suffix}
    </span>
  );
};
