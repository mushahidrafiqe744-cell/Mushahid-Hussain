import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Sparkles, 
  User, 
  ArrowRight,
  Github,
  Linkedin,
  Instagram,
  Youtube
} from 'lucide-react';
import { DeveloperProfile } from '../types/portfolio';
import aboutImage from '../assets/images/about_primary_new.jpg';
import aboutHoverImage from '../assets/images/about_new_portrait.jpg';
import cvPortrait from '../assets/images/about_new_portrait_2.jpg';
interface AboutSectionProps {
  profile: DeveloperProfile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section id="about" className="relative py-20 bg-[#030C06] text-white border-y border-[#50E364]/10 overflow-hidden">
      
      {/* 1. Subtle code matrix grids behind */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#50E364_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* 2. Slanted Glowing Parallelogram Bars behind the portrait */}
      <div className="absolute right-[-10%] sm:right-[5%] md:right-[10%] top-[-10%] bottom-[-10%] w-[35%] opacity-15 pointer-events-none select-none z-0 overflow-hidden flex gap-4 md:gap-6">
        <div className="w-[45px] h-[140%] bg-gradient-to-b from-[#50E364] via-[#C5A059] to-transparent transform rotate-[22deg] shrink-0" />
        <div className="w-[75px] h-[140%] bg-gradient-to-b from-[#11261B] via-[#50E364] to-transparent transform rotate-[22deg] shrink-0" />
        <div className="w-[35px] h-[140%] bg-gradient-to-b from-[#C5A059] via-transparent to-transparent transform rotate-[22deg] shrink-0" />
      </div>

      {/* 3. Glowing Ambient Lights */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-[#50E364]/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ================= LEFT COLUMN: INTRO & BIO & CTAs ================= */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            
            {/* ABOUT ME Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#11261B]/40 border border-[#50E364]/30 text-[11px] font-bold tracking-[0.2em] text-[#50E364] mb-5">
              <User className="w-3.5 h-3.5 text-[#50E364]" />
              <span>ABOUT ME</span>
            </div>

            {/* Massive Display Name: I'm {profile.name}! */}
            <h2 className="font-display text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] text-white mb-6 select-none">
              I'm <span className="bg-gradient-to-r from-white via-[#DFC285] to-[#C5A059] bg-clip-text text-transparent drop-shadow-sm font-extrabold">{profile.name.split(' ')[0]}!</span>
            </h2>

            {/* Small green bar separator */}
            <div className="w-16 h-[2px] bg-[#50E364] mb-6 rounded-full" />

            {/* Bio Paragraph */}
            <p className="text-[#A3B8A8] text-sm sm:text-base leading-relaxed mb-4 max-w-lg">
              {profile.bioAbout}
            </p>
            <p className="text-[#5C6E61] text-xs sm:text-sm leading-relaxed mb-8 max-w-lg">
              {profile.bioHero}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              {/* View My Work (Vibrant green spring capsule) */}
              <a
                href="#projects"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#50E364] hover:bg-[#60EA77] text-[#030F07] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(80,227,100,0.25)] hover:shadow-[0_4px_30px_rgba(80,227,100,0.4)] hover:scale-[1.03] cursor-pointer"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
              </a>

              {/* Contact Me (Transparent border pill) */}
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-transparent border border-white/20 hover:border-[#C5A059] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all hover:bg-white/5 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#C5A059]" />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Social Links with Horizontal Lines at bottom */}
            <div className="flex items-center gap-4 w-full mt-10">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C5A059]/30" />
              
              <div className="flex items-center gap-4">
                <a 
                  href={profile.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-white/60 hover:text-[#50E364] transition-colors"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a 
                  href={profile.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-white/60 hover:text-[#50E364] transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href="https://x.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-white/60 hover:text-[#50E364] transition-colors"
                  title="Twitter / X"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-white/60 hover:text-[#50E364] transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-white/60 hover:text-[#50E364] transition-colors"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>

              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C5A059]/30" />
            </div>

          </div>

          {/* ================= CENTER COLUMN: METADATA OUTLINE CARD ================= */}
          <div className="lg:col-span-3 flex justify-center w-full">
            <div className="w-full max-w-sm bg-[#05140A]/60 backdrop-blur-md border border-[#11261B]/80 rounded-2xl p-6 md:p-7 flex flex-col gap-6 shadow-[0_12px_40px_rgba(3,15,7,0.8)] relative before:absolute before:inset-0 before:rounded-2xl before:border before:border-[#50E364]/10 before:pointer-events-none">
              
              {/* Card 1: Experience Start */}
              <div className="flex items-center gap-4 transition-transform duration-300 hover:translate-x-1">
                <div className="w-10 h-10 rounded-xl bg-[#11261B]/40 border border-[#50E364]/30 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-[#50E364]" />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[9px] uppercase tracking-widest text-[#5C6E61] font-bold">EXPERIENCE START</span>
                  <span className="text-sm font-bold text-white mt-0.5 tracking-wide">{profile.dob}</span>
                </div>
              </div>

              {/* Decorative separator line */}
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#11261B]/80 to-transparent" />

              {/* Card 2: Location */}
              <div className="flex items-center gap-4 transition-transform duration-300 hover:translate-x-1">
                <div className="w-10 h-10 rounded-xl bg-[#11261B]/40 border border-[#50E364]/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#50E364]" />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[9px] uppercase tracking-widest text-[#5C6E61] font-bold">LOCATION</span>
                  <span className="text-sm font-bold text-white mt-0.5 tracking-wide">{profile.location}</span>
                </div>
              </div>

              {/* Decorative separator line */}
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#11261B]/80 to-transparent" />

              {/* Card 3: Email */}
              <div className="flex items-center gap-4 transition-transform duration-300 hover:translate-x-1 group">
                <div className="w-10 h-10 rounded-xl bg-[#11261B]/40 border border-[#50E364]/30 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#50E364]" />
                </div>
                <div className="flex flex-col text-left leading-tight truncate">
                  <span className="text-[9px] uppercase tracking-widest text-[#5C6E61] font-bold">EMAIL</span>
                  <a href={`mailto:${profile.email}`} className="text-sm font-bold text-white hover:text-[#50E364] mt-0.5 tracking-wide truncate max-w-[170px] transition-colors">
                    {profile.email}
                  </a>
                </div>
              </div>

              {/* Decorative separator line */}
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#11261B]/80 to-transparent" />

              {/* Card 4: WhatsApp / Phone */}
              <div className="flex items-center gap-4 transition-transform duration-300 hover:translate-x-1">
                <div className="w-10 h-10 rounded-xl bg-[#11261B]/40 border border-[#50E364]/30 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#50E364]" />
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[9px] uppercase tracking-widest text-[#5C6E61] font-bold">WHATSAPP / PHONE</span>
                  <a 
                    href={`https://wa.me/92${profile.phone.replace(/^0+/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-[#50E364] hover:underline mt-0.5 tracking-wide flex items-center gap-1.5"
                  >
                    <span>{profile.phone}</span>
                    <span className="text-xs">↗</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* ================= RIGHT COLUMN: PORTRAIT WITH GOLDEN SIGNATURE ================= */}
          <div className="lg:col-span-4 flex justify-center items-center relative">
            
            {/* Main portrait image wrapper matching Pinterest pin */}
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-[4/5] overflow-hidden rounded-2xl group shadow-[0_20px_50px_rgba(3,12,6,0.9)] border border-white/10 cursor-pointer">
              
              {/* Portrait Image */}
              <img 
                src={
                  (cvPortrait as any)?.src ||
                  cvPortrait ||
                  profile.avatarUrl ||
                  '/assets/images/about_new_portrait_2.jpg'
                } 
                alt={`${profile.name} Portrait`} 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/assets/images/about_new_portrait_2.jpg';
                }}
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-108"
              />

              {/* Premium dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030C06] via-transparent to-transparent opacity-80 z-10 pointer-events-none" />

              {/* Overlay Golden Signature & Title */}
              <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center justify-center select-none text-center pointer-events-none">
                <span 
                  className="text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#DFC285] via-[#FFF5D6] to-[#C5A059] leading-tight drop-shadow-[0_2px_4px_rgba(3,12,6,0.9)]"
                  style={{ fontFamily: "'Alex Brush', cursive" }}
                >
                  {profile.name}
                </span>
                
                <span className="text-[9px] uppercase tracking-[0.35em] text-white/80 font-bold mt-1.5 drop-shadow-md">
                  {profile.title || 'WEB DEVELOPER'}
                </span>
              </div>
            </div>

            {/* Vertical slogan ribbon on far right */}
            <div className="absolute right-[-4%] top-1/2 -translate-y-1/2 translate-x-1/2 rotate-90 hidden xl:flex items-center gap-2.5 text-[9px] font-bold tracking-[0.4em] uppercase text-white/30 whitespace-nowrap">
              <span>CODE</span>
              <span className="w-1 h-1 rounded-full bg-[#50E364]" />
              <span>CREATE</span>
              <span className="w-1 h-1 rounded-full bg-[#50E364]" />
              <span>INNOVATE</span>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
