import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { SkillGroup } from '../types/portfolio';

interface SkillItemData {
  name: string;
  category: string;
  level: string;
  score: number;
  exp: string;
  short: string;
  bg: string;
  color: string;
  desc: string;
}

interface SkillsSectionProps {
  skillGroups: SkillGroup[];
}

const SkillCard: React.FC<{ skill: SkillItemData }> = ({ skill }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 1200;

    if (isHovered) {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setDisplayScore(Math.round(easeOut * skill.score));
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        }
      };
      animationFrameId = requestAnimationFrame(step);
    } else {
      setDisplayScore(0);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, skill.score]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white p-5 rounded-2xl border border-[#11261B]/10 shadow-xs hover:border-[#C5A059] hover:shadow-xl transition-all duration-500 group cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: skill.bg, color: skill.color }}
          >
            {skill.short}
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#11261B] leading-tight group-hover:text-[#C5A059] transition-colors">
              {skill.name}
            </h4>
            <span className="text-[10px] text-[#5C6E61] font-medium">{skill.exp}</span>
          </div>
        </div>

        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-2xs transition-all duration-300 ${
          isHovered
            ? 'bg-[#C5A059] text-[#11261B]'
            : 'bg-[#11261B] text-[#C5A059]'
        }`}>
          {skill.level}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center text-[10px] font-bold text-[#11261B] mb-1.5">
          <span className="text-[#5C6E61] uppercase tracking-wider text-[9px]">
            {isHovered ? 'Running Proficiency' : 'Hover to Fill'}
          </span>
          <span className={`font-mono text-xs transition-all duration-200 ${
            isHovered ? 'text-[#C5A059] font-extrabold scale-110' : 'text-[#5C6E61]'
          }`}>
            {displayScore}%
          </span>
        </div>

        <div className="relative w-full bg-[#E5DEC9] h-2.5 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full relative overflow-hidden bg-gradient-to-r from-[#B0893F] via-[#C5A059] to-[#DFC285]"
            style={{
              width: isHovered ? `${skill.score}%` : '0%',
              transition: isHovered 
                ? 'width 1.2s cubic-bezier(0.25, 1, 0.5, 1), filter 0.3s ease' 
                : 'width 0.4s ease-out',
              filter: isHovered ? 'brightness(1.1) drop-shadow(0 0 5px rgba(197, 160, 89, 0.7))' : 'none',
            }}
          >
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent w-full h-full -skew-x-12 running-line-beam" />
            )}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#5C6E61] leading-snug group-hover:text-[#11261B] transition-colors">
        {skill.desc}
      </p>

      <div
        className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-[#C5A059] via-[#DFC285] to-[#11261B]"
        style={{
          width: isHovered ? '100%' : '0%',
          transition: 'width 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      />
    </div>
  );
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skillGroups }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Convert skillGroups into flat detailedSkills
  const detailedSkills: SkillItemData[] = skillGroups.flatMap(group => 
    (group.skills || group.items || []).map(item => {
        const score = item.levelPercentage || 85;
        let level = 'Intermediate';
        if (score >= 90) level = 'Expert';
        else if (score >= 80) level = 'Advanced';
        else if (score >= 70) level = 'Proficient';
        
        // Simple color generation based on name
        const colors = [
            { bg: '#23272f', color: '#149eca' }, // Dark Blue
            { bg: '#3178c6', color: '#ffffff' }, // Blue
            { bg: '#1f2937', color: '#e5e7eb' }, // Gray
            { bg: '#339933', color: '#ffffff' }, // Green
            { bg: '#dc382d', color: '#ffffff' }, // Red
            { bg: '#4169e1', color: '#ffffff' }, // Royal Blue
            { bg: '#e535ab', color: '#ffffff' }, // Pink
            { bg: '#38bdf8', color: '#ffffff' }, // Light Blue
        ];
        const colorIdx = (item.name.length + item.name.charCodeAt(0)) % colors.length;
        const colorSet = colors[colorIdx];

        return {
            name: item.name,
            category: group.category.toLowerCase(),
            level: level,
            score: score,
            exp: 'Professional',
            short: item.name.substring(0, 2),
            bg: colorSet.bg,
            color: colorSet.color,
            desc: `Specialized expertise in ${item.name} development and architectural implementation.`
        };
    })
  );

  const categories = Array.from(new Set(['all', ...skillGroups.map(g => g.category.toLowerCase())]));

  const engineeringPractices = [
    { title: 'Modular Architecture', desc: 'DRY, SOLID, reusable component design patterns.' },
    { title: 'Type Safety & Verification', desc: 'End-to-end type safety from database to UI components.' },
    { title: 'Web Vitals & Performance', desc: 'Bundle splitting, image compression, sub-second LCP.' },
    { title: 'Security & Auth Standards', desc: 'OAuth, JWT, CSRF protection, and CORS policies.' },
    { title: 'Automated Testing', desc: 'Unit & component testing using Vitest, Jest & React Testing Lib.' },
    { title: 'SEO & Structured Data', desc: 'Full Schema.org, OpenGraph, dynamic sitemaps, and robots.txt.' },
  ];

  const filtered = detailedSkills.filter(
    (s) => selectedCategory === 'all' || s.category === selectedCategory
  );

  return (
    <section id="skills" className="py-20 bg-[#F2EDE2] border-b border-[#11261B]/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#C5A059] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TECHNICAL EXPERTISE</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#11261B] mb-4">
            My Skills & Tech Stack
          </h2>
          <div className="w-16 h-1 bg-[#C5A059] mx-auto mb-4 rounded-full" />
          <p className="text-[#5C6E61] text-base sm:text-lg leading-relaxed">
            A battle-tested set of languages, frameworks, libraries, and engineering practices.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shadow-2xs cursor-pointer capitalize ${
                selectedCategory === cat
                  ? 'bg-[#11261B] text-white shadow-sm'
                  : 'bg-white text-[#5C6E61] hover:text-[#11261B] hover:bg-[#F8F5EE] border border-[#11261B]/10'
              }`}
            >
              {cat === 'all' ? 'All Technologies' : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-16">
          {filtered.map((skill, index) => (
            <SkillCard key={`${skill.category}-${skill.name}-${index}`} skill={skill} />
          ))}
        </div>

        <div className="bg-[#11261B] text-white p-8 sm:p-10 rounded-2xl border border-[#C5A059]/30 shadow-lg relative overflow-hidden">
          <div className="max-w-3xl mb-8">
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059] mb-1">
              ENGINEERING STANDARDS
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
              Core Principles & Architectural Rigor
            </h3>
            <p className="text-xs sm:text-sm text-[#A3B8A8]">
              Writing code is more than syntax; it's about building maintainable, readable, and future-proof systems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {engineeringPractices.map((practice, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:border-[#C5A059]/50 hover:bg-white/10 transition-all duration-300 group"
              >
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="text-xs font-bold text-white mb-1 group-hover:text-[#C5A059] transition-colors">{practice.title}</h4>
                  <p className="text-[11px] text-[#A3B8A8] leading-relaxed">{practice.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
