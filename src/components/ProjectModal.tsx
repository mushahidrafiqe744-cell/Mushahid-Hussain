import React, { useState, useEffect } from 'react';
import { X, Github, ExternalLink, Check, Layers, Zap, Calendar, Sparkles, MessageCircle } from 'lucide-react';
import { Project } from '../types/portfolio';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const resolveProjectImage = (project: Project): string => {
  const rawUrl =
    typeof project.imageUrl === 'object' && (project.imageUrl as any)?.src
      ? (project.imageUrl as any).src
      : typeof project.image === 'object' && (project.image as any)?.src
      ? (project.image as any).src
      : typeof project.imageUrl === 'string' && project.imageUrl
      ? project.imageUrl
      : typeof project.image === 'string' && project.image
      ? project.image
      : '';

  const titleLower = (project.title || '').toLowerCase();
  if (titleLower.includes('quran')) return '/assets/images/al_quran_full_web_1790428789923.jpg';
  if (titleLower.includes('gourmet') || titleLower.includes('restaurant')) return '/assets/images/restaurant_web_1791805986623.jpg';
  if (titleLower.includes('mba') || titleLower.includes('academy')) return '/assets/images/mba_academy_full_web_1790428843333.jpg';
  if (titleLower.includes('textile') || titleLower.includes('noor')) return '/assets/images/al_noor_textile_full_web_1790428824308.jpg';
  if (titleLower.includes('rehab') || titleLower.includes('raheem')) return '/assets/images/raheem_rehab_full_web_1790428879741.jpg';
  if (titleLower.includes('pavilion')) return '/assets/images/grand_pavilion_full_web_1790428751763.jpg';
  if (titleLower.includes('quaid') || titleLower.includes('25th')) return '/assets/images/quaid_tribute_full_web_1790428772996.jpg';
  if (titleLower.includes('aqsa')) return '/assets/images/aqsa_ramzan_full_web_1790428861081.jpg';
  if (titleLower.includes('novara')) return '/assets/images/novara_store_full_web_1790428808211.jpg';
  if (titleLower.includes('meer') || titleLower.includes('decor')) return '/assets/images/meer_royal_decor_full_web_1791025431587.jpg';
  if (titleLower.includes('estate') || titleLower.includes('horizon')) return '/assets/images/real_estate_web_1791805973161.jpg';
  if (titleLower.includes('finedge') || titleLower.includes('wealth')) return '/assets/images/fintech_web_1791806009333.jpg';
  if (titleLower.includes('cloudpulse') || titleLower.includes('microservice')) return '/assets/images/cloud_api_web_1791806022294.jpg';
  if (titleLower.includes('biztop')) return '/assets/images/biztop_full_web_1790852703068.jpg';

  const PROJECT_ID_MAP: Record<string, string> = {
    'proj-1': '/assets/images/biztop_full_web_1790852703068.jpg',
    'proj-2': '/assets/images/meer_royal_decor_full_web_1791025431587.jpg',
    'proj-3': '/assets/images/aqsa_ramzan_full_web_1790428861081.jpg',
    'proj-4': '/assets/images/novara_store_full_web_1790428808211.jpg',
    'proj-5': '/assets/images/grand_pavilion_full_web_1790428751763.jpg',
    'proj-6': '/assets/images/quaid_tribute_full_web_1790428772996.jpg',
    'proj-7': '/assets/images/al_quran_full_web_1790428789923.jpg',
    'proj-8': '/assets/images/mba_academy_full_web_1790428843333.jpg',
    'proj-9': '/assets/images/raheem_rehab_full_web_1790428879741.jpg',
    'proj-10': '/assets/images/al_noor_textile_full_web_1790428824308.jpg',
    'proj-11': '/assets/images/real_estate_web_1791805973161.jpg',
    'proj-12': '/assets/images/restaurant_web_1791805986623.jpg',
    'proj-13': '/assets/images/fintech_web_1791806009333.jpg',
    'proj-14': '/assets/images/cloud_api_web_1791806022294.jpg',
  };

  if (PROJECT_ID_MAP[project.id]) {
    return PROJECT_ID_MAP[project.id];
  }

  return rawUrl || '/assets/images/biztop_full_web_1790852703068.jpg';
};

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [isImgHovered, setIsImgHovered] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const cleanDomain = (() => {
    const url = project.liveUrl || (project as any).link || '';
    if (url) {
      try {
        const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
        return parsed.hostname.replace(/^www\./, '');
      } catch (_) {
        return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      }
    }
    return `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  })();

  const modalImg = resolveProjectImage(project);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#11261B]/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-[#F8F5EE] rounded-2xl shadow-2xl border border-[#11261B]/20 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#11261B] text-white border-b border-[#C5A059]/30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              {project.categoryLabel}
            </span>
            <span className="text-white/40">·</span>
            <span className="text-xs text-[#A3B8A8]">{project.year}</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          
          {/* Project Image with Interactive Browser Mockup */}
          <div className="rounded-2xl overflow-hidden mb-6 bg-[#07130A] border border-[#C5A059]/30 shadow-xl">
            {/* Top Browser Bar */}
            <div className="bg-[#0C1F15] px-4 py-2.5 flex items-center justify-between border-b border-white/5 select-none">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block shadow-2xs" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block shadow-2xs" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block shadow-2xs" />
              </div>

              <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/40 border border-white/5 text-[11px] font-mono text-[#DFC285]/90 max-w-[240px] truncate shadow-inner">
                <span className="text-[9px] text-[#5C6E61]">🔒</span>
                <span className="truncate">{cleanDomain}</span>
              </div>

              <div className="text-[9px] font-bold tracking-wider uppercase text-[#C5A059] bg-[#11261B] px-2 py-0.5 rounded border border-[#C5A059]/30">
                FULL PREVIEW
              </div>
            </div>

            {/* Scrollable image viewport */}
            <div className="relative max-h-[440px] overflow-y-auto bg-[#07130A] scrollbar-thin">
              <img
                src={modalImg}
                alt={project.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = modalImg;
                }}
                className="w-full h-auto block select-none"
              />

              {project.metrics && (
                <div className="sticky bottom-3 left-3 inline-flex bg-[#11261B]/90 backdrop-blur-xs text-[#C5A059] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#C5A059]/40 items-center gap-1.5 z-20 shadow-md ml-3 mb-3">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{project.metrics}</span>
                </div>
              )}
            </div>
          </div>

          {/* Title & Tagline */}
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#11261B] mb-2">
            {project.title}
          </h3>
          <p className="text-sm sm:text-base text-[#5C6E61] font-medium mb-6">
            {project.tagline}
          </p>

          {/* Action Links (GitHub & Live Demo) */}
          <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-[#11261B]/10">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#11261B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1A3828] transition-all shadow-sm"
              >
                <Github className="w-4 h-4 text-[#C5A059]" />
                <span>View GitHub Repository</span>
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#11261B]/20 text-[#11261B] text-xs font-bold uppercase tracking-wider hover:border-[#C5A059] hover:bg-[#F2EDE2] transition-all shadow-xs"
              >
                <ExternalLink className="w-4 h-4 text-[#C5A059]" />
                <span>Live Project Demo</span>
              </a>
            )}
          </div>

          {/* Full Overview */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#11261B] mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C5A059]" />
              <span>Project Overview & Architecture</span>
            </h4>
            <p className="text-sm text-[#11261B]/80 leading-relaxed bg-[#F2EDE2] p-4 rounded-xl border border-[#11261B]/5">
              {project.fullOverview || project.description}
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#11261B] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Key Features & Engineering Highlights</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(project.features || []).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#11261B]/5">
                  <div className="w-5 h-5 rounded-full bg-[#11261B] text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs text-[#11261B]/90 font-medium leading-tight">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies Used */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#11261B] mb-2.5">
              Tech Stack & Tools
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-medium text-[#11261B] bg-white px-3 py-1 rounded-lg border border-[#11261B]/10 shadow-2xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F2EDE2] border-t border-[#11261B]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              Starts from ₨ 20,000
            </span>
            <a
              href={`https://wa.me/923290725117?text=${encodeURIComponent(
                `Hi Mushahid! I saw your "${project.title}" (${project.categoryLabel || 'Web'}) project on your portfolio and I want to order a similar website starting from ₨ 20,000. Please share quotation and timeline.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/20 hover:scale-105 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Order Web on WhatsApp</span>
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#11261B] hover:text-black transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
