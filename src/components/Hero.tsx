import React, { useState } from 'react';
import { ArrowRight, Download, Github, Linkedin, Mail, Sparkles, Code2, Layers, Award, Star, Zap, Phone, MessageCircle } from 'lucide-react';
import { DeveloperProfile, SectionId } from '../types/portfolio';
import { EmblemLogo } from './EmblemLogo';
import { HoverCounter } from './HoverCounter';
import pin1Img from '../assets/images/pin1_new.jpg';
import pin2Img from '../assets/images/pin2_new.jpg';
import heroPortrait from '../assets/images/mushahid_hero_portrait_1790420656343.jpg';
import homePinterestImg from '../assets/images/home_pinterest_image.jpg';

interface HeroProps {
  profile: DeveloperProfile;
  onOpenSection: (section: SectionId) => void;
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ profile, onOpenSection, onOpenResume }) => {
  // Split name letters for interactive letter animation
  const nameLetters = profile.firstName.split('');

  // Hover states for the 3 quick metric buttons
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  // Extract numerical targets
  const projectsCount = parseInt(profile.projectsCompleted.replace(/\D/g, ''), 10) || 30;
  const experienceCount = parseInt(profile.yearsOfExperience.replace(/\D/g, ''), 10) || 8;
  const satisfactionCount = parseInt(profile.happyClients.replace(/\D/g, ''), 10) || 99;

  return (
    <section id="hero" className="relative pt-8 pb-14 md:pt-12 md:pb-20 overflow-hidden">
      {/* Background Animated Floating Ambient Orbs */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#C5A059]/10 rounded-full blur-3xl animate-float-slow pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#11261B]/15 rounded-full blur-3xl animate-float-delayed pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & Bio & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            
            {/* Small Kicker with Pulse Sparkle */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#11261B]/5 border border-[#11261B]/10 text-xs font-bold tracking-[0.2em] uppercase text-[#11261B]/90 mb-3 animate-shimmer hover:scale-105 transition-transform duration-300">
              <span>HELLO, I'M</span>
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
            </div>

            {/* Massive Display Name with Interactive Letter Bouncing */}
            <div className="relative mb-6 group cursor-default">
              <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#11261B] leading-[0.95] select-none">
                {nameLetters.map((char, index) => (
                  <span
                    key={index}
                    className="hover-letter-bounce cursor-pointer inline-block"
                    style={{ transitionDelay: `${index * 20}ms` }}
                  >
                    {char}
                  </span>
                ))}
              </h1>
              
              <div className="font-script text-5xl sm:text-6xl lg:text-7xl text-[#C5A059] -mt-3 sm:-mt-5 ml-4 sm:ml-8 transform -rotate-2 select-none pointer-events-none drop-shadow-xs animate-float">
                {profile.scriptSubhead}
              </div>
            </div>

            {/* Dark Pill Motto with Shimmer Reflection */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-[#11261B] text-[#F8F5EE] text-xs sm:text-sm font-semibold tracking-wider uppercase px-5 py-2.5 rounded-full shadow-md border border-[#C5A059]/30 animate-shimmer hover:scale-105 transition-all duration-300">
                <Zap className="w-3.5 h-3.5 text-[#C5A059] animate-bounce" />
                <span>{profile.badge}</span>
              </div>
              <button
                onClick={() => onOpenSection('services')}
                className="inline-flex items-center gap-2 bg-[#11261B]/5 hover:bg-[#11261B]/10 border border-[#11261B]/15 text-[#11261B] text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-2xs hover:scale-105 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Websites Starting From ₨ 20,000</span>
              </button>
            </div>

            {/* Bio Paragraph */}
            <p className="text-[#5C6E61] text-base sm:text-lg leading-relaxed max-w-xl mb-8 font-normal">
              {profile.bioHero}
            </p>

            {/* CTA Buttons with Active Shimmer Beams */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenSection('projects')}
                className="group relative overflow-hidden inline-flex items-center gap-3 px-6 py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase text-white bg-[#11261B] hover:bg-[#1A3828] rounded-full transition-all shadow-md hover:shadow-xl hover:scale-[1.03] cursor-pointer animate-shimmer"
              >
                <span>View Projects</span>
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
                </div>
              </button>

              <button
                onClick={() => onOpenSection('services')}
                className="group inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase text-[#11261B] bg-white border border-[#11261B]/20 hover:border-[#C5A059] hover:bg-[#F2EDE2] rounded-full transition-all shadow-xs hover:scale-105 hover:shadow-md cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#C5A059] group-hover:rotate-12 transition-transform duration-300" />
                <span>My Services</span>
              </button>

              <button
                onClick={onOpenResume}
                className="group inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase text-[#11261B] bg-white border border-[#11261B]/20 hover:border-[#C5A059] hover:bg-[#F2EDE2] rounded-full transition-all shadow-xs hover:scale-105 hover:shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#C5A059] group-hover:translate-y-0.5 transition-transform duration-300" />
                <span>Download CV</span>
              </button>
            </div>

            {/* Interactive Metric Numbers Bar */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-10 pt-8 border-t border-[#11261B]/10 w-full max-w-lg">
              
              {/* Stat 1: Projects Delivered (50+) */}
              <button
                onClick={() => onOpenSection('projects')}
                onMouseEnter={() => setHoveredMetric(1)}
                onMouseLeave={() => setHoveredMetric(null)}
                className="text-left group cursor-pointer p-1 transition-all duration-300 select-none"
              >
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#11261B] group-hover:text-[#C5A059] transition-colors tabular-nums leading-none">
                    <HoverCounter target={projectsCount} suffix="+" isParentHovered={hoveredMetric === 1} />
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs text-[#5C6E61] font-semibold mt-1.5 group-hover:text-[#11261B] transition-colors">
                  Projects Delivered ↗
                </div>
              </button>

              {/* Stat 2: Experience (8+ Years) */}
              <button
                onClick={() => onOpenSection('experience')}
                onMouseEnter={() => setHoveredMetric(2)}
                onMouseLeave={() => setHoveredMetric(null)}
                className="text-left group cursor-pointer p-1 transition-all duration-300 select-none"
              >
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#11261B] group-hover:text-[#C5A059] transition-colors tabular-nums leading-none">
                    <HoverCounter target={experienceCount} suffix="+" isParentHovered={hoveredMetric === 2} />
                  </span>
                  <span className="font-display font-bold text-lg sm:text-xl lg:text-2xl text-[#11261B] group-hover:text-[#C5A059] transition-colors">
                    Yrs
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs text-[#5C6E61] font-semibold mt-1.5 group-hover:text-[#11261B] transition-colors">
                  Experience ↗
                </div>
              </button>

              {/* Stat 3: Satisfaction (99%) */}
              <button
                onClick={() => onOpenSection('why-choose-me')}
                onMouseEnter={() => setHoveredMetric(3)}
                onMouseLeave={() => setHoveredMetric(null)}
                className="text-left group cursor-pointer p-1 transition-all duration-300 select-none"
              >
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#11261B] group-hover:text-[#C5A059] transition-colors tabular-nums leading-none">
                    <HoverCounter target={satisfactionCount} suffix="%" isParentHovered={hoveredMetric === 3} />
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs text-[#5C6E61] font-semibold mt-1.5 group-hover:text-[#11261B] transition-colors">
                  Satisfaction ↗
                </div>
              </button>
            </div>

          </div>

          {/* Right Column: Arch Portrait with Animated Image & Floating Badges */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Background Decorative Arch Glow */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#DFC285]/40 via-transparent to-[#11261B]/20 rounded-[180px_180px_40px_40px] blur-2xl -z-10 animate-pulse-glow" />
            
            {/* Arch Container with Float Animation & Exact Matching Gold-to-Forest Gradient Border */}
            <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] aspect-[4/5] p-[3px] sm:p-[4px] rounded-t-[190px] rounded-b-[28px] bg-gradient-to-b from-[#E2C785] via-[#C5A059] via-35% via-[#7B8B67] via-65% to-[#11261B] shadow-[0_25px_60px_-15px_rgba(17,38,27,0.35)] interactive-image-card">
              
              {/* Inner Arch Background */}
              <div className="w-full h-full rounded-t-[186px] rounded-b-[24px] overflow-hidden relative bg-[#11261B] group cursor-pointer shadow-inner">
                
                {/* Hero Developer Portrait */}
                <img
                  src={
                    (homePinterestImg as any)?.src ||
                    (typeof homePinterestImg === 'string' ? homePinterestImg : '') ||
                    '/assets/images/home_pinterest_image.jpg'
                  }
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/home_pinterest_image.jpg';
                  }}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Gentle Ambient Gold Glow Highlight on Top Arch */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/10 via-transparent to-black/30 pointer-events-none" />

                {/* Shimmer Light Reflection on Image Hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>

            {/* Left Side: Floating Emblem Badge with Running 360° Circular Text & Dashed Line */}
            <div className="hidden sm:block absolute -top-4 -left-6 z-20 transition-transform duration-300 hover:scale-110 cursor-pointer drop-shadow-2xl animate-float">
              <EmblemLogo size="md" showSubtitle={true} interactive={true} name={profile.name} title={profile.title} />
            </div>

            {/* Right Side: Floating Full-Stack Developer Badge */}
            <button
              onClick={() => onOpenSection('skills')}
              className="flex absolute -top-3 -right-2 sm:-right-4 bg-[#11261B] text-[#C5A059] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-xl border border-[#C5A059]/40 items-center gap-2 sm:gap-2.5 z-20 cursor-pointer hover:scale-108 transition-all duration-300 group backdrop-blur-md animate-float-delayed animate-shimmer"
              title="Click to view Skills"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/5 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#11261B] group-hover:rotate-12 transition-all">
                <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-bold text-white tracking-wide">Full-Stack</div>
                <div className="text-[10px] font-semibold text-[#DFC285] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  Developer ↗
                </div>
              </div>
            </button>

            {/* Bottom-Right: Floating Social Glass Badge Card */}
            <div className="absolute -bottom-6 right-0 sm:right-2 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-[#11261B]/10 flex flex-col gap-2 z-20 min-w-[190px] sm:min-w-[210px] animate-float hover:scale-105 transition-all duration-300">
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#5C6E61] px-1 flex items-center justify-between">
                <span>Direct Channels</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* GitHub Link */}
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 sm:gap-3 p-1 rounded-lg hover:bg-[#F8F5EE] transition-all group hover:translate-x-1"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#11261B] text-white flex items-center justify-center group-hover:bg-[#C5A059] group-hover:scale-110 transition-all">
                  <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#11261B] leading-none">GitHub</span>
                  <span className="text-[10px] text-[#5C6E61] truncate max-w-[120px]">@mushahidhussain</span>
                </div>
              </a>

              {/* WhatsApp Link */}
              <a
                href={`https://wa.me/92${profile.phone.replace(/^0+/, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 sm:gap-3 p-1 rounded-lg hover:bg-[#F8F5EE] transition-all group hover:translate-x-1"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center group-hover:scale-110 transition-all shadow-2xs">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#11261B] leading-none flex items-center gap-1">
                    <span>WhatsApp</span>
                    <span className="text-[9px] text-[#25D366] font-bold">Online</span>
                  </span>
                  <span className="text-[10px] text-[#5C6E61] truncate max-w-[120px] font-mono">{profile.phone}</span>
                </div>
              </a>

              {/* LinkedIn Link */}
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 sm:gap-3 p-1 rounded-lg hover:bg-[#F8F5EE] transition-all group hover:translate-x-1"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0A66C2] text-white flex items-center justify-center group-hover:scale-110 transition-all">
                  <Linkedin className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#11261B] leading-none">LinkedIn</span>
                  <span className="text-[10px] text-[#5C6E61] truncate max-w-[120px]">mushahid-rafiqe</span>
                </div>
              </a>

              {/* TikTok Link */}
              {profile.tiktok && (
                <a
                  href={profile.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[#F8F5EE] transition-all group hover:translate-x-1"
                >
                  <div className="w-7 h-7 rounded-full bg-[#000000] text-white flex items-center justify-center group-hover:scale-110 transition-all border border-[#11261B]/10">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49V8.5a8.27 8.27 0 0 0 4.84 1.56V6.69z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#11261B] leading-none">TikTok</span>
                    <span className="text-[10px] text-[#5C6E61] truncate max-w-[130px]">@mushahidrafiqe699</span>
                  </div>
                </a>
              )}

              {/* Email Link */}
              <button
                onClick={() => onOpenSection('contact')}
                className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[#F8F5EE] transition-all group text-left cursor-pointer w-full hover:translate-x-1"
              >
                <div className="w-7 h-7 rounded-full bg-[#C5A059] text-[#11261B] flex items-center justify-center group-hover:bg-[#11261B] group-hover:text-[#C5A059] group-hover:scale-110 transition-all">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#11261B] leading-none">Send Message</span>
                  <span className="text-[10px] text-[#5C6E61] truncate max-w-[130px]">Open Contact Form ↗</span>
                </div>
              </button>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
