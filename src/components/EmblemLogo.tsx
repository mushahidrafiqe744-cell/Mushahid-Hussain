import React, { useId } from 'react';

interface EmblemLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  showSubtitle?: boolean;
  interactive?: boolean;
  name?: string;
  title?: string;
}

export const EmblemLogo: React.FC<EmblemLogoProps> = ({
  size = 'md',
  className = '',
  showSubtitle = true,
  interactive = true,
  name = 'Mushahid Hussain',
  title = 'Web Developer',
}) => {
  const uniqueId = useId().replace(/:/g, '-');
  const textPathId = `circle-text-path-${uniqueId}`;

  // Create circular text: "• Name • Title •"
  const nameAround = `• ${name} • ${title} •`;
  
  // Get initials
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const firstName = name.split(' ')[0];

  // Dimensions & typography scale configs for various sizes
  const config = {
    sm: {
      dimension: 58,
      initialsSize: 'text-base',
      scriptSize: 'text-[9.5px] -mt-1',
      lineWidth: 'w-4',
      subtextSize: 'text-[5px] tracking-wider',
      radiusOuter: 95,
      radiusText: 79,
      radiusInnerBg: 65,
      radiusDashed: 63,
      fontSizeText: 11,
      letterSpacing: '1.5px',
    },
    md: {
      dimension: 96,
      initialsSize: 'text-2xl',
      scriptSize: 'text-sm -mt-1.5',
      lineWidth: 'w-8',
      subtextSize: 'text-[7px] tracking-widest',
      radiusOuter: 95,
      radiusText: 79,
      radiusInnerBg: 65,
      radiusDashed: 63,
      fontSizeText: 12,
      letterSpacing: '2px',
    },
    lg: {
      dimension: 140,
      initialsSize: 'text-4xl',
      scriptSize: 'text-xl -mt-2',
      lineWidth: 'w-14',
      subtextSize: 'text-[9.5px] tracking-[0.2em]',
      radiusOuter: 95,
      radiusText: 79,
      radiusInnerBg: 65,
      radiusDashed: 63,
      fontSizeText: 12.5,
      letterSpacing: '2.5px',
    },
    hero: {
      dimension: 195,
      initialsSize: 'text-6xl',
      scriptSize: 'text-3xl -mt-3.5',
      lineWidth: 'w-20',
      subtextSize: 'text-[11px] tracking-[0.25em]',
      radiusOuter: 95,
      radiusText: 79,
      radiusInnerBg: 65,
      radiusDashed: 63,
      fontSizeText: 13,
      letterSpacing: '3px',
    },
  }[size];

  // Circle path for the outer rotating text (radius: config.radiusText)
  const r = config.radiusText;
  const pathD = `M 100,100 m -${r},0 a ${r},${r} 0 1,1 ${r * 2},0 a ${r},${r} 0 1,1 -${r * 2},0`;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none group shrink-0 ${className}`}
      style={{ width: config.dimension, height: config.dimension }}
    >
      {/* Outer ambient golden glow on hover */}
      <div className="absolute inset-0 rounded-full bg-[#C5A059]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* SVG Container with concentric rings, rotating text, and running dashed line */}
      <svg
        className="w-full h-full drop-shadow-xl overflow-visible pointer-events-none"
        viewBox="0 0 200 200"
      >
        <defs>
          {/* Circular path for rotating styled name text around 360 degrees */}
          <path id={textPathId} d={pathD} />

          {/* Gold Gradient for outer rings & text */}
          <linearGradient id={`goldGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFC285" />
            <stop offset="50%" stopColor="#C5A059" />
            <stop offset="100%" stopColor="#9E7A32" />
          </linearGradient>

          {/* Soft Gold Glow Filter */}
          <filter id={`goldGlow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Dark Green Base Circle */}
        <circle
          cx="100"
          cy="100"
          r={config.radiusOuter}
          fill="#11261B"
          className="transition-colors duration-300 group-hover:fill-[#0A1A10]"
        />

        {/* Outer Solid Golden Border Ring */}
        <circle
          cx="100"
          cy="100"
          r={config.radiusOuter - 1}
          fill="none"
          stroke={`url(#goldGrad-${uniqueId})`}
          strokeWidth="1.8"
          className="transition-all duration-300 group-hover:stroke-[#DFC285]"
        />

        {/* 360-Degree Running Styled Name Text Around the Circle */}
        <g
          className={`origin-[100px_100px] ${
            interactive
              ? 'animate-spin-slow group-hover:animate-spin-fast'
              : 'animate-spin-slow'
          }`}
        >
          <text
            fill="#DFC285"
            fontSize={config.fontSizeText}
            fontWeight="600"
            letterSpacing={config.letterSpacing}
            className="select-none drop-shadow-xs"
            style={{ fontFamily: "serif, system-ui, -apple-system, sans-serif" }}
          >
            <textPath
              href={`#${textPathId}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {nameAround}
            </textPath>
          </text>
        </g>

        {/* Inner Dark Center Background Circle */}
        <circle
          cx="100"
          cy="100"
          r={config.radiusInnerBg}
          fill="#0C1F15"
          stroke={`url(#goldGrad-${uniqueId})`}
          strokeWidth="1.2"
        />

        {/* Inner Running Dashed Ring */}
        <circle
          cx="100"
          cy="100"
          r={config.radiusDashed}
          fill="none"
          stroke="#DFC285"
          strokeWidth="1.2"
          strokeDasharray="4 5"
          strokeLinecap="round"
          opacity="0.85"
          className={`origin-[100px_100px] ${
            interactive
              ? 'animate-dash-run group-hover:animate-dash-run-fast group-hover:opacity-100'
              : 'animate-dash-run'
          }`}
          filter={`url(#goldGlow-${uniqueId})`}
        />
      </svg>

      {/* Center Core Monogram Content (Initials, First Name, Divider, Title) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10 px-2">
        {/* Monogram Initials */}
        <div
          className={`font-display font-black leading-none tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#EBD8A8] via-[#C5A059] to-[#A38038] drop-shadow-xs transition-transform duration-300 ${
            interactive ? 'group-hover:scale-105' : ''
          } ${config.initialsSize}`}
          style={{ letterSpacing: '0.06em' }}
        >
          {initials}
        </div>

        {/* Cursive Name */}
        <div
          className={`font-script text-white font-normal leading-none select-none drop-shadow-xs transition-colors duration-300 ${
            interactive ? 'group-hover:text-[#DFC285]' : ''
          } ${config.scriptSize}`}
        >
          {firstName}
        </div>

        {/* Small Divider Line & Subtitle */}
        {showSubtitle && (
          <>
            <div className={`h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent my-1 ${config.lineWidth}`} />

            {/* Subtext Title */}
            <div
              className={`font-sans font-bold uppercase text-[#DFC285]/90 select-none leading-none ${config.subtextSize}`}
            >
              {title}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
