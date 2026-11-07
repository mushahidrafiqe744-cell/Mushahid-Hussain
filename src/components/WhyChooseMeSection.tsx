import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, Zap } from 'lucide-react';

interface WorkflowStep {
  targetNum: number;
  title: string;
  desc: string;
}

const WorkflowCard: React.FC<{ step: WorkflowStep }> = ({ step }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentNum, setCurrentNum] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 600;

    if (isHovered) {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(easeOut * step.targetNum);
        setCurrentNum(value);
        if (progress < 1) animationFrameId = requestAnimationFrame(animate);
      };
      animationFrameId = requestAnimationFrame(animate);
    } else {
      setCurrentNum(0);
    }
    return () => { if (animationFrameId) cancelAnimationFrame(animationFrameId); };
  }, [isHovered, step.targetNum]);

  const formattedNumber = String(currentNum).padStart(2, '0');

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={`bg-[#0C1F15] p-5 rounded-xl border transition-all duration-300 group hover:-translate-y-1.5 cursor-pointer relative overflow-hidden ${isHovered ? 'border-[#C5A059] shadow-xl shadow-[#C5A059]/10' : 'border-[#C5A059]/20 shadow-sm'}`}>
      {isHovered && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer pointer-events-none" />}
      <div className="flex items-center justify-between mb-3">
        <span className={`font-mono text-3xl font-black transition-all duration-300 inline-block tabular-nums ${isHovered ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FFA62B] via-[#FFD180] to-[#DFC285] scale-110' : 'text-[#DFC285]/40'}`}>{formattedNumber}</span>
        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${isHovered ? 'bg-[#FFA62B] shadow-lg shadow-[#FFA62B]/80 scale-125 animate-ping' : 'bg-[#C5A059]/40'}`} />
      </div>
      <h4 className={`font-bold text-sm mb-1.5 transition-colors duration-300 ${isHovered ? 'text-[#FFD180]' : 'text-white'}`}>{step.title}</h4>
      <p className="text-xs text-[#A3B8A8] leading-relaxed">{step.desc}</p>
      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
        <span className={isHovered ? 'text-[#C5A059] font-bold' : 'text-[#A3B8A8]/40'}>{isHovered ? 'Step Active' : 'Hover to activate'}</span>
        <span className={isHovered ? 'text-[#C5A059] font-bold' : 'text-[#A3B8A8]/40'}>#{String(step.targetNum).padStart(2, '0')}</span>
      </div>
    </div>
  );
};

interface WhyChooseMeProps {
    pillars: any[];
    workflow: any[];
}

export const WhyChooseMeSection: React.FC<WhyChooseMeProps> = ({ pillars, workflow }) => {
  const titleChars = 'Why Choose Me?'.split('');

  return (
    <section id="why-choose-me" className="py-20 bg-[#F8F5EE] border-b border-[#11261B]/10 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#C5A059] mb-2 px-3 py-1 rounded-full bg-white border border-[#C5A059]/30 animate-shimmer">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin-slow" />
            <span>VALUE PROPOSITION</span>
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin-slow" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#11261B] mb-4 select-none">
            {titleChars.map((char, index) => (
              <span key={index} className="hover-letter-bounce cursor-pointer">{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </h2>
          <div className="w-16 h-1 bg-[#C5A059] mx-auto mb-4 rounded-full" />
          <p className="text-[#5C6E61] text-base sm:text-lg leading-relaxed">
            I craft high-performance digital products engineered to scale with your business goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
          {pillars.map((pillar, idx) => {
            const indexNum = String(idx + 1).padStart(2, '0');
            return (
              <div key={pillar.id || idx} className="bg-[#F2EDE2] p-6 rounded-2xl border border-[#11261B]/10 hover:border-[#C5A059] shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between group hover:-translate-y-2 animate-shimmer relative overflow-hidden">
                <div className="absolute top-3 right-3 font-mono font-bold text-xs text-[#11261B]/20 group-hover:text-[#C5A059] transition-colors">#{indexNum}</div>
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#11261B] text-[#C5A059] flex items-center justify-center mb-4 shadow-sm border border-[#C5A059]/30 group-hover:scale-110 group-hover:bg-[#1A3828] group-hover:rotate-6 transition-all">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#11261B] group-hover:text-[#C5A059] transition-colors mb-1">{pillar.title}</h3>
                  <div className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider mb-2.5">{pillar.subtitle}</div>
                  <p className="text-xs text-[#5C6E61] leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#11261B] text-white p-8 sm:p-10 rounded-2xl border border-[#C5A059]/30 shadow-2xl relative overflow-hidden animate-shimmer">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059] block mb-1">HOW I WORK</span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">The Engineering Workflow</h3>
            <p className="text-xs text-[#A3B8A8] mt-2">Hover over each phase to trigger dynamic milestone count-up</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {workflow.map((step) => (
              <WorkflowCard key={step.id || step.stepNumber} step={{ targetNum: step.stepNumber, title: step.title, desc: step.description }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
