import React, { useState } from 'react';
import { Briefcase, Calendar, CheckCircle2, Award, Sparkles, Star, Clock, ArrowUpRight, TrendingUp } from 'lucide-react';
import { DeveloperProfile } from '../types/portfolio';
import { HoverCounter } from './HoverCounter';

interface ExperienceSectionProps {
  profile: DeveloperProfile;
  experiences: any[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ profile, experiences }) => {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const projectsTarget = parseInt(profile.projectsCompleted.replace(/\D/g, ''), 10) || 30;
  const expTarget = parseInt(profile.yearsOfExperience.replace(/\D/g, ''), 10) || 3;
  const satTarget = parseInt(profile.happyClients.replace(/\D/g, ''), 10) || 99;

  const stats = [
    { label: 'Completed Projects', target: projectsTarget, suffix: '+', icon: Briefcase },
    { label: 'Client Satisfaction', target: satTarget, suffix: '%', icon: Star },
    { label: 'Years of Experience', target: expTarget, suffix: '+ Years', icon: Clock },
    { label: 'Code Quality Rating', target: 100, suffix: '%', icon: TrendingUp },
  ];

  const titleChars = 'Experience & Journey'.split('');

  return (
    <section id="experience" className="py-20 bg-[#F8F5EE] border-b border-[#11261B]/10 relative overflow-hidden">
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#C5A059] mb-2 px-3 py-1 rounded-full bg-white border border-[#C5A059]/30 animate-shimmer">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin-slow" />
            <span>CAREER & TRACK RECORD</span>
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin-slow" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#11261B] mb-4 select-none">
            {titleChars.map((char, index) => (
              <span key={index} className="hover-letter-bounce cursor-pointer">{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </h2>
          <div className="w-16 h-1 bg-[#C5A059] mx-auto mb-4 rounded-full" />
          <p className="text-[#5C6E61] text-base sm:text-lg leading-relaxed">
            A proven record of delivering reliable web software and collaborating across timezones.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const isHovered = hoveredStat === idx;
            return (
              <div key={idx} onMouseEnter={() => setHoveredStat(idx)} onMouseLeave={() => setHoveredStat(null)} className={`bg-[#F2EDE2] p-6 rounded-2xl border shadow-xs flex items-center gap-4 transition-all duration-500 group hover:-translate-y-1.5 cursor-pointer ${isHovered ? 'border-[#C5A059] shadow-xl bg-white' : 'border-[#11261B]/10 hover:border-[#C5A059]'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-all duration-300 ${isHovered ? 'bg-[#C5A059] text-[#11261B] scale-110 rotate-6' : 'bg-[#11261B] text-[#C5A059]'}`}><Icon className="w-6 h-6" /></div>
                <div>
                  <div className="font-display font-bold text-2xl sm:text-3xl text-[#11261B] group-hover:text-[#C5A059] tabular-nums leading-none mb-1 transition-colors"><HoverCounter target={stat.target} suffix={stat.suffix} isParentHovered={isHovered} /></div>
                  <div className="text-xs text-[#5C6E61] font-semibold">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-8 relative">
          <div className="hidden lg:block absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#C5A059] via-[#11261B]/30 to-transparent" />
          {experiences.map((exp, idx) => (
            <div key={exp.id || idx} className="relative lg:pl-16 group">
              <div className="hidden lg:flex absolute left-6 top-8 w-5 h-5 rounded-full bg-[#11261B] border-2 border-[#C5A059] items-center justify-center shadow-md group-hover:scale-125 transition-all group-hover:bg-[#C5A059]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DFC285] group-hover:bg-[#11261B]" />
              </div>
              <div className="bg-[#F2EDE2] p-6 sm:p-8 rounded-2xl border border-[#11261B]/10 hover:border-[#C5A059] shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-shimmer">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-[#11261B]/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-xl sm:text-2xl font-bold text-[#11261B] group-hover:text-[#C5A059] transition-colors">{exp.role}</span>
                      {exp.badge && <span className="text-[10px] font-bold uppercase tracking-wider bg-[#11261B] text-[#DFC285] px-2.5 py-0.5 rounded-full">{exp.badge}</span>}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-[#5C6E61]">{exp.company} · <span className="font-normal text-[#11261B]">{exp.location}</span></div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#11261B] bg-white px-3 py-1.5 rounded-lg border border-[#11261B]/10 shrink-0"><Calendar className="w-3.5 h-3.5 text-[#C5A059]" /><span>{exp.period}</span></div>
                </div>
                <p className="text-xs sm:text-sm text-[#5C6E61] leading-relaxed mb-5">{exp.description}</p>
                {exp.achievements && Array.isArray(exp.achievements) && (
                    <div className="space-y-2 mb-6">
                        {exp.achievements.map((item: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#11261B]/85 group-hover:translate-x-1 transition-transform"><CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" /><span>{item}</span></div>
                        ))}
                    </div>
                )}
                {exp.stack && Array.isArray(exp.stack) && (
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#11261B]/10">
                        {exp.stack.map((t: string) => (
                            <span key={t} className="text-[11px] font-medium text-[#11261B] bg-white px-2.5 py-1 rounded-md border border-[#11261B]/10 hover:border-[#C5A059] hover:bg-[#11261B] hover:text-[#DFC285] transition-all">{t}</span>
                        ))}
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-white border border-[#11261B]/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-[#C5A059] transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#11261B] text-[#C5A059] flex items-center justify-center shrink-0 group-hover:bg-[#C5A059] group-hover:text-[#11261B] transition-all"><Award className="w-6 h-6" /></div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] block">Continuous Development</span>
              <h4 className="text-base sm:text-lg font-bold text-[#11261B] mt-0.5">Verified Global Courses & Accreditations</h4>
            </div>
          </div>
          <a href="#courses" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#11261B] hover:bg-[#C5A059] text-white hover:text-[#11261B] text-xs font-bold tracking-wider uppercase transition-all shadow-sm shrink-0 hover:scale-105"><span>Explore Courses</span><ArrowUpRight className="w-4 h-4 text-[#C5A059]" /></a>
        </div>
      </div>
    </section>
  );
};
