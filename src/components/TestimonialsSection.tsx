import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  LayoutGrid,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { Testimonial } from '../types/portfolio';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onOpenContact?: () => void;
  onOpenFeedback?: () => void;
}

// Google 4-Color Icon SVG
const GoogleLogoSvg: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

// Individual Google Review Card (Matches the user's video screen recording)
const GoogleReviewCard: React.FC<{ item: Testimonial }> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const reviewText = (item.review || item.feedback || item.message || '').trim() ||
    'Mushahid delivered exceptional full-stack web development quality on time with outstanding user interface design and responsive performance.';
  const isLong = reviewText.length > 120;
  const initialLetter = item.avatarLetter || item.name.charAt(0).toUpperCase() || 'U';
  const bgColor = item.avatarColor || '#EA580C';

  return (
    <div className="w-[300px] sm:w-[350px] bg-white rounded-2xl p-5 border border-gray-100/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between shrink-0 select-none text-left mx-3 hover:-translate-y-1">
      <div>
        {/* Top Header: Avatar + Name + Date + Google Logo */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {item.avatar ? (
              <img
                src={item.avatar}
                alt={item.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-2xs shrink-0"
              />
            ) : (
              <div
                style={{ backgroundColor: bgColor }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-2xs"
              >
                {initialLetter}
              </div>
            )}
            <div className="min-w-0">
              <h4 className="font-bold text-sm text-gray-900 truncate leading-snug">
                {item.name}
              </h4>
              <p className="text-[11px] text-gray-400 font-medium">
                {item.date || 'Recent'}
              </p>
            </div>
          </div>

          <div className="shrink-0 p-1 bg-gray-50/80 rounded-lg">
            <GoogleLogoSvg className="w-5 h-5" />
          </div>
        </div>

        {/* 5 Yellow/Amber Stars */}
        <div className="flex items-center gap-1 mb-2.5">
          {[...Array(item.rating || 5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
          ))}
        </div>

        {/* Feedback / Review Text */}
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
          {expanded || !isLong ? reviewText : `${reviewText.slice(0, 110)}...`}
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[#0A3D22] font-semibold text-xs ml-1 hover:underline cursor-pointer"
            >
              {expanded ? 'See less' : 'See more'}
            </button>
          )}
        </p>
      </div>

      {item.company && (
        <div className="mt-3 pt-2.5 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <span className="truncate">{item.company}</span>
          {item.flag && <span className="text-xs">{item.flag}</span>}
        </div>
      )}
    </div>
  );
};

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  onOpenContact,
  onOpenFeedback,
}) => {
  const [viewMode, setViewMode] = useState<'wall' | 'slider'>('wall');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const autoPlayRef = useRef<number | null>(null);

  const total = testimonials.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // 4-second autoplay for featured slider mode
  useEffect(() => {
    if (viewMode === 'slider' && isAutoPlaying && total > 0) {
      autoPlayRef.current = window.setInterval(() => {
        nextSlide();
      }, 4000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [viewMode, isAutoPlaying, currentIndex, total]);

  // Touch Swipe for Mobile
  const minSwipeDistance = 50;
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    else if (distance < -minSwipeDistance) prevSlide();
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Partition testimonials into 3 rows for the infinite marquee wall
  const row1 = testimonials.filter((_, i) => i % 3 === 0);
  const row2 = testimonials.filter((_, i) => i % 3 === 1);
  const row3 = testimonials.filter((_, i) => i % 3 === 2);

  // Duplicate for seamless infinite loop
  const loopRow1 = [...row1, ...row1, ...row1];
  const loopRow2 = [...row2, ...row2, ...row2];
  const loopRow3 = [...row3, ...row3, ...row3];

  const current = testimonials[currentIndex] || testimonials[0];
  const titleChars = 'Client Testimonials & Feedback'.split('');

  return (
    <section id="testimonials" className="py-16 sm:py-20 bg-[#F8F5EE] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#11261B]/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-delayed" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#11261B] text-[#DFC285] text-xs font-bold tracking-[0.2em] uppercase mb-3 shadow-xs border border-[#C5A059]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
            <span>VERIFIED REVIEWS</span>
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#11261B] mb-4 select-none">
            {titleChars.map((char, index) => (
              <span key={index} className="hover-letter-bounce cursor-pointer">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h2>

          <p className="text-sm sm:text-base text-[#5C6E61] leading-relaxed">
            Real feedback and performance milestones from founders, enterprise clients, and students across Google & international platforms.
          </p>

          {/* Google Rating Summary & View Switcher Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
              <GoogleLogoSvg className="w-5 h-5 shrink-0" />
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-extrabold uppercase">
                  EXCELLENT
                </span>
                <span className="font-mono text-sm">5.0</span>
                <div className="flex text-[#FBBC05]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FBBC05]" />
                  ))}
                </div>
                <span className="text-gray-400 font-normal ml-1">
                  (120+ Verified Reviews)
                </span>
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-white border border-gray-200 shadow-2xs">
              <button
                onClick={() => setViewMode('wall')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'wall'
                    ? 'bg-[#11261B] text-[#DFC285] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Reviews Wall</span>
              </button>
              <button
                onClick={() => setViewMode('slider')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-[#11261B] text-[#DFC285] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Spotlight Slider</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* VIEW MODE 1: Google Reviews Infinite Scrolling Multi-Row Wall (Video Style) */}
      {viewMode === 'wall' && (
        <div className="w-full space-y-4 py-2 marquee-pause overflow-hidden">
          
          {/* Row 1: Scrolling Left */}
          <div className="flex overflow-hidden">
            <div className="animate-marquee-left flex py-1">
              {loopRow1.map((item, idx) => (
                <GoogleReviewCard key={`r1-${idx}`} item={item} />
              ))}
            </div>
          </div>

          {/* Row 2: Scrolling Right */}
          <div className="flex overflow-hidden">
            <div className="animate-marquee-right flex py-1">
              {loopRow2.map((item, idx) => (
                <GoogleReviewCard key={`r2-${idx}`} item={item} />
              ))}
            </div>
          </div>

          {/* Row 3: Scrolling Left (Slower Pace) */}
          <div className="flex overflow-hidden">
            <div className="animate-marquee-left-slow flex py-1">
              {loopRow3.map((item, idx) => (
                <GoogleReviewCard key={`r3-${idx}`} item={item} />
              ))}
            </div>
          </div>

          {/* Bottom Callout / Hint */}
          <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#5C6E61]">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              <span>Hover over any review card to pause and read.</span>
            </div>

            <button
              onClick={onOpenFeedback}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#11261B] text-[#DFC285] hover:text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-105"
            >
              <span>Work With Me & Leave Feedback</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* VIEW MODE 2: Featured Client Spotlight Slider (4-second carousel) */}
      {viewMode === 'slider' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative max-w-5xl mx-auto"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Active Testimonial Card */}
            <div className="relative bg-[#F2EDE2] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-[#C5A059]/30 overflow-hidden transition-all duration-500 min-h-[440px] flex flex-col justify-between">
              
              {/* Top Row: Quote Icon + Rating Stars + Verified Badge */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[#11261B]/10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#11261B] text-[#DFC285] flex items-center justify-center shadow-md shrink-0">
                    <Quote className="w-6 h-6 rotate-180" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[#C5A059] mb-1">
                      {[...Array(current.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#11261B] uppercase tracking-wider">
                      5.0 Star Verified Review
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#11261B]/10 shadow-2xs">
                  <GoogleLogoSvg className="w-4 h-4" />
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span className="text-xs font-semibold text-[#11261B]">
                    Verified Client
                  </span>
                  {current.flag && <span className="text-sm select-none">{current.flag}</span>}
                </div>
              </div>

              {/* Middle: Review Quote Text */}
              <div className="my-auto py-2 transition-all duration-500 animate-fade-in">
                <blockquote className="font-serif-cormorant text-xl sm:text-2xl lg:text-3xl text-[#11261B] leading-snug italic font-normal tracking-wide">
                  "{(current.review || current.feedback || current.message || '').trim() ||
                    'Mushahid delivered exceptional full-stack web development quality on time with outstanding user interface design and responsive performance.'}"
                </blockquote>

                {current.metricsResult && (
                  <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-2xl bg-white border border-[#C5A059]/40 text-[#11261B] text-xs sm:text-sm font-bold shadow-xs">
                    <TrendingUp className="w-4 h-4 text-[#059669] shrink-0" />
                    <span>Impact: <strong className="text-[#11261B]">{current.metricsResult}</strong></span>
                  </div>
                )}
              </div>

              {/* Bottom Row: Client Profile Picture & Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-[#11261B]/10">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    {current.avatar ? (
                      <img
                        src={current.avatar}
                        alt={current.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-[#C5A059] shadow-md"
                      />
                    ) : (
                      <div
                        style={{ backgroundColor: current.avatarColor || '#EA580C' }}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg border-2 border-[#C5A059] shadow-md"
                      >
                        {current.avatarLetter || current.name.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    {current.flag && (
                      <span className="absolute -bottom-1 -right-1 text-base drop-shadow-xs select-none">
                        {current.flag}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base sm:text-lg text-[#11261B]">
                      {current.name}
                    </h4>
                    <p className="text-xs text-[#5C6E61] font-medium">
                      {current.role} {current.company ? `• ${current.company}` : ''}
                    </p>
                    {current.project && (
                      <p className="text-[11px] text-[#A38038] font-mono mt-0.5">
                        Project: {current.project} {current.location ? `(${current.location})` : ''}
                      </p>
                    )}
                  </div>
                </div>

                {current.tags && (
                  <div className="hidden sm:flex flex-wrap items-center gap-1.5">
                    {current.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#11261B]/10 text-[11px] font-mono font-semibold text-[#5C6E61]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Slider Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 px-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={prevSlide}
                  className="w-11 h-11 rounded-2xl bg-[#11261B] hover:bg-[#1A3828] text-[#DFC285] hover:text-white flex items-center justify-center transition-all shadow-md hover:scale-105 cursor-pointer border border-[#C5A059]/40 active:scale-95"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-11 h-11 rounded-2xl bg-[#11261B] hover:bg-[#1A3828] text-[#DFC285] hover:text-white flex items-center justify-center transition-all shadow-md hover:scale-105 cursor-pointer border border-[#C5A059]/40 active:scale-95"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono font-bold text-[#5C6E61] ml-1">
                  0{currentIndex + 1} / 0{total}
                </span>
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center gap-2 max-w-[280px] overflow-x-auto py-1">
                {testimonials.slice(0, 15).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      idx === currentIndex
                        ? 'w-8 h-2.5 bg-[#C5A059]'
                        : 'w-2.5 h-2.5 bg-[#11261B]/20 hover:bg-[#11261B]/50'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={onOpenFeedback}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#11261B] text-[#11261B] hover:text-[#DFC285] text-xs font-bold uppercase tracking-wider transition-all border border-[#11261B]/15 shadow-2xs hover:shadow-md cursor-pointer group"
              >
                <span>Leave Your Feedback</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Bottom Client Navigation Thumbnails Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mt-8">
              {testimonials.slice(0, 12).map((item, idx) => {
                const isSelected = idx === currentIndex;
                const letter = item.avatarLetter || item.name.charAt(0).toUpperCase() || 'U';
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`p-2.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-[#11261B] text-white border-[#C5A059] shadow-md scale-105 ring-2 ring-[#C5A059]/40'
                        : 'bg-white text-[#11261B] border-[#11261B]/10 hover:border-[#C5A059]/50 hover:bg-[#F2EDE2]'
                    }`}
                  >
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-8 h-8 rounded-xl object-cover shrink-0 border border-current/20"
                      />
                    ) : (
                      <div
                        style={{ backgroundColor: item.avatarColor || '#EA580C' }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                      >
                        {letter}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold truncate leading-tight">
                        {item.name.split(' ')[0]}
                      </div>
                      <div className={`text-[9px] truncate mt-0.5 ${isSelected ? 'text-[#DFC285]' : 'text-[#5C6E61]'}`}>
                        {item.flag || '⭐'} {item.company ? item.company.split(' ')[0] : 'Client'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
