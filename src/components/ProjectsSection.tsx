import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, ArrowUpRight, Search, Code, Filter, Sparkles, Layers, MessageCircle, ChevronLeft, ChevronRight, LayoutGrid, Sliders, FolderGit2, Cpu, ShoppingCart, Terminal } from 'lucide-react';
import { Project } from '../types/portfolio';

interface ProjectsSectionProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
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

const ProjectCard: React.FC<{
  project: Project;
  index: number;
  onSelectProject: (project: Project) => void;
}> = ({ project, index, onSelectProject }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentNum, setCurrentNum] = useState(0);
  const targetNum = index + 1;

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 500;

    if (isHovered) {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCurrentNum(Math.round(easeOut * targetNum));

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };
      animationFrameId = requestAnimationFrame(animate);
    } else {
      setCurrentNum(0);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, targetNum]);

  const formattedNum = String(currentNum).padStart(2, '0');

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

  const imageSrc = resolveProjectImage(project);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-[#F2EDE2] rounded-2xl border border-[#11261B]/10 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between hover:-translate-y-1.5 animate-shimmer"
    >
      <div>
        {/* Realistic Browser Mockup Frame */}
        <div className="relative overflow-hidden bg-[#07130A] border-b border-[#11261B]/15">
          {/* Top Browser Bar */}
          <div className="bg-[#0C1F15] px-3.5 py-2 flex items-center justify-between border-b border-white/5 select-none">
            {/* macOS Window Traffic Lights */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block shadow-2xs" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block shadow-2xs" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block shadow-2xs" />
            </div>

            {/* Address Bar Pill */}
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/40 border border-white/5 text-[10px] font-mono text-[#DFC285]/90 max-w-[170px] sm:max-w-[210px] truncate shadow-inner">
              <span className="text-[8px] text-[#5C6E61]">🔒</span>
              <span className="truncate">{cleanDomain}</span>
            </div>

            {/* Hover to Scroll Pulsing Badge */}
            <div className="flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase text-[#C5A059] bg-[#11261B] px-2 py-0.5 rounded border border-[#C5A059]/30 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping" />
              <span>HOVER TO SCROLL</span>
            </div>
          </div>

          {/* Smooth Vertical Scrolling Screenshot Window */}
          <div
            onClick={() => onSelectProject(project)}
            className="relative h-60 sm:h-64 overflow-hidden bg-[#07130A] cursor-pointer group/frame"
          >
            <img
              src={imageSrc}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-auto block select-none will-change-transform"
              style={{
                transform: isHovered ? 'translateY(calc(-100% + 240px))' : 'translateY(0%)',
                transition: isHovered
                  ? 'transform 7s cubic-bezier(0.25, 0.1, 0.25, 1)'
                  : 'transform 1.8s ease-out',
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/assets/images/biztop_full_web_1790852703068.jpg';
              }}
            />

            {/* Subtle gradient overlay at bottom for badge readability */}
            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#11261B]/80 to-transparent pointer-events-none z-10" />

            {/* Category Label at bottom-left */}
            <div className="absolute bottom-3 left-3 bg-[#11261B]/90 backdrop-blur-xs text-[#C5A059] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-[#C5A059]/30 z-20 shadow-md">
              {project.categoryLabel || project.category}
            </div>

            {/* Number Badge Index at bottom-right */}
            <div
              className={`absolute bottom-3 right-3 text-xs font-mono font-bold px-2 py-0.5 rounded-lg border shadow-md transition-all duration-300 select-none z-20 ${
                isHovered
                  ? 'bg-[#C5A059] text-[#11261B] border-[#DFC285] scale-105 shadow-lg shadow-[#C5A059]/30'
                  : 'bg-[#11261B]/90 text-[#DFC285]/80 border-[#C5A059]/40'
              }`}
            >
              #{formattedNum}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Unboxed Metadata */}
          <div className="flex items-center gap-2 text-[11px] text-[#5C6E61] font-medium mb-2">
            <span className="font-semibold text-[#11261B]">{project.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{project.year}</span>
            {project.metrics && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#C5A059] font-bold bg-[#11261B] px-2 py-0.5 rounded text-[10px]">{project.metrics}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProject(project)}
            className="font-display text-xl sm:text-2xl font-bold text-[#11261B] group-hover:text-[#C5A059] transition-colors cursor-pointer mb-2 leading-snug"
          >
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#5C6E61] leading-relaxed line-clamp-2 mb-4">
            {project.description}
          </p>

          {/* Tech Stack Tags with Hover Bounce */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {project.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-medium text-[#11261B] bg-white px-2.5 py-1 rounded-lg border border-[#11261B]/10 hover:border-[#C5A059] hover:bg-[#11261B] hover:text-[#DFC285] transition-all duration-200 cursor-default hover:scale-105"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 5 && (
              <span className="text-[11px] font-medium text-[#5C6E61] px-1.5 py-1">
                +{project.technologies.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="px-6 py-4 bg-white/70 border-t border-[#11261B]/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              title="View GitHub Repository"
              className="p-2 rounded-lg bg-[#11261B] text-white hover:bg-[#1A3828] hover:text-[#C5A059] transition-all shadow-xs flex items-center gap-1.5 text-xs font-semibold hover:scale-105"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              title="Open Live Preview"
              className="p-2 rounded-lg bg-white border border-[#11261B]/15 text-[#11261B] hover:border-[#C5A059] hover:bg-[#F2EDE2] transition-all shadow-xs flex items-center gap-1.5 text-xs font-semibold hover:scale-105"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">Live Demo</span>
            </a>
          )}

          <a
            href={`https://wa.me/923290725117?text=${encodeURIComponent(
              `Hi Mushahid! I saw your "${project.title}" project on your portfolio and I would like to order a similar website. Please share quotation and timeline.`
            )}`}
            target="_blank"
            rel="noreferrer"
            title="Order a website like this on WhatsApp"
            className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs flex items-center gap-1.5 text-xs font-semibold hover:scale-105"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span className="hidden md:inline">Order Web</span>
          </a>
        </div>

        <button
          onClick={() => onSelectProject(project)}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#11261B] group-hover:text-[#C5A059] transition-all hover:translate-x-1 cursor-pointer"
        >
          <span>Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, onSelectProject }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'slider'>('grid');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  const categories: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'All Projects', icon: FolderGit2 },
    { id: 'saas', label: 'SaaS & Web Apps', icon: Cpu },
    { id: 'ecommerce', label: 'E-Commerce', icon: ShoppingCart },
    { id: 'fullstack', label: 'Full Stack', icon: Layers },
    { id: 'api', label: 'APIs & Backend', icon: Terminal },
  ];

  const normalizeCategory = (cat?: string): 'saas' | 'ecommerce' | 'fullstack' | 'api' => {
    if (!cat) return 'saas';
    const c = cat.toLowerCase();
    if (c.includes('e-com') || c.includes('shop') || c.includes('store') || c.includes('apparel') || c.includes('decor') || c.includes('textile')) {
      return 'ecommerce';
    }
    if (c.includes('api') || c.includes('backend') || c.includes('cloud') || c.includes('microservice') || c.includes('devops') || c.includes('fintech') || c.includes('developer')) {
      return 'api';
    }
    if (c.includes('full') || c.includes('stack') || c.includes('health') || c.includes('medical') || c.includes('hospitality') || c.includes('rehab') || c.includes('estate') || c.includes('restaurant')) {
      return 'fullstack';
    }
    return 'saas';
  };

  const filteredProjects = projects.filter((project) => {
    const projectCatNorm = normalizeCategory(project.category);
    const matchesCategory = activeCategory === 'all' || projectCatNorm === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  // Autoplay effect for Slider View
  useEffect(() => {
    if (viewMode !== 'slider' || isAutoplayPaused || filteredProjects.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [viewMode, isAutoplayPaused, filteredProjects.length]);

  // Reset slider index when filters/searches change
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory, searchQuery]);

  const sectionTitleLetters = 'Featured Projects'.split('');

  return (
    <section id="projects" className="py-16 bg-[#F8F5EE] relative overflow-hidden">
      
      {/* Subtle background ambient light */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#11261B]/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#C5A059] mb-1.5 px-3 py-1 rounded-full bg-white border border-[#C5A059]/30 animate-shimmer">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin-slow" />
              <span>SELECTED WORKS</span>
            </div>
            
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#11261B] select-none">
              {sectionTitleLetters.map((char, index) => (
                <span key={index} className="hover-letter-bounce cursor-pointer">
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h2>
            <p className="text-sm text-[#5C6E61] mt-1 max-w-xl">
              Explore recent web applications, production codebases, and architectural implementations with live previews and open-source GitHub repositories.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-800 mt-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Websites Starting From ₨ 20,000 · Custom Built in 4–7 Days</span>
            </div>
          </div>

          {/* Controls: Search and Layout Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* View Mode Toggle */}
            <div className="flex bg-[#F2EDE2] border border-[#11261B]/15 rounded-xl p-1 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#11261B] text-[#DFC285] shadow-xs'
                    : 'text-[#5C6E61] hover:text-[#11261B]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('slider')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-[#11261B] text-[#DFC285] shadow-xs'
                    : 'text-[#5C6E61] hover:text-[#11261B]'
                }`}
                title="Slider View"
              >
                <Sliders className="w-3.5 h-3.5 rotate-90" />
                <span>Slider</span>
              </button>
            </div>

            {/* Search Bar with Focus Animation */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-[#5C6E61] absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#C5A059] transition-colors" />
              <input
                type="text"
                placeholder="Search tech, stack, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#F2EDE2] border border-[#11261B]/15 rounded-xl text-[#11261B] placeholder-[#5C6E61] focus:outline-hidden focus:border-[#C5A059] focus:bg-white transition-all shadow-xs focus:ring-2 focus:ring-[#C5A059]/20"
              />
            </div>
          </div>
        </div>

        {/* Filter Segmented Buttons (Tabs with Icons and Count Badges) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#F2EDE2] rounded-xl border border-[#11261B]/10 mb-8 overflow-x-auto">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = cat.id === 'all' 
              ? projects.length 
              : projects.filter((p) => normalizeCategory(p.category) === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#11261B] text-[#F8F5EE] shadow-md scale-[1.02] border border-[#C5A059]/40'
                    : 'text-[#5C6E61] hover:text-[#11261B] hover:bg-white/60'
                }`}
              >
                <cat.icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C5A059]' : 'text-[#5C6E61]'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full transition-colors ${
                    isActive
                      ? 'bg-[#C5A059] text-[#11261B] font-bold'
                      : 'bg-black/5 text-[#5C6E61]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Viewport (Grid vs Slider) */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-[#F2EDE2] rounded-2xl border border-dashed border-[#11261B]/20 animate-pulse">
            <Code className="w-10 h-10 text-[#5C6E61] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#11261B]">No projects found matching your search.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-bold text-[#C5A059] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : viewMode === 'slider' ? (
          /* Premium Interactive Carousel Slider */
          <div 
            className="relative select-none"
            onMouseEnter={() => setIsAutoplayPaused(true)}
            onMouseLeave={() => setIsAutoplayPaused(false)}
          >
            {/* Slider Viewport */}
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {filteredProjects.map((project, index) => (
                  <div key={project.id} className="w-full shrink-0 px-1">
                    <div className="max-w-4xl mx-auto">
                      <ProjectCard
                        project={project}
                        index={index}
                        onSelectProject={onSelectProject}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Navigation Chevrons */}
            {filteredProjects.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length)}
                  className="absolute -left-3 sm:-left-6 top-[35%] -translate-y-1/2 p-3 rounded-full bg-[#11261B] border border-[#C5A059]/30 text-[#DFC285] hover:bg-[#1A3828] hover:text-[#C5A059] shadow-xl hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
                  title="Previous Project"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % filteredProjects.length)}
                  className="absolute -right-3 sm:-right-6 top-[35%] -translate-y-1/2 p-3 rounded-full bg-[#11261B] border border-[#C5A059]/30 text-[#DFC285] hover:bg-[#1A3828] hover:text-[#C5A059] shadow-xl hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
                  title="Next Project"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </>
            )}

            {/* Premium Progress Indicators & Dots */}
            {filteredProjects.length > 1 && (
              <div className="flex flex-col items-center gap-3 mt-8">
                {/* Dots */}
                <div className="flex justify-center items-center gap-2">
                  {filteredProjects.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        currentIndex === idx 
                          ? 'w-10 bg-[#11261B]' 
                          : 'w-2 bg-[#11261B]/20 hover:bg-[#11261B]/40'
                      }`}
                    />
                  ))}
                </div>
                {/* Visual Status Indicator */}
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#5C6E61]">
                  Project {currentIndex + 1} of {filteredProjects.length}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Standard Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onSelectProject={onSelectProject}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
