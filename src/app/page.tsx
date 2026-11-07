'use client';

import React, { useState, useEffect } from 'react';
import { cmsService } from '../services/cms';
import {
  initialProfile,
  initialServices,
  initialSkillGroups,
  initialProjects,
  initialCourses,
  initialTestimonials,
  initialExperiences,
  initialWhyUsPillars,
  initialWhyUsWorkflow,
} from '../data/portfolioData';
import { SectionId, Project, SkillGroup } from '../types/portfolio';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { AboutSection } from '../components/AboutSection';
import { ServicesSection } from '../components/ServicesSection';
import { SkillsSection } from '../components/SkillsSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { CoursesSection } from '../components/CoursesSection';
import { WhyChooseMeSection } from '../components/WhyChooseMeSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { ResumeSection } from '../components/ResumeSection';
import { ContactSection } from '../components/ContactSection';
import { FeedbackModal } from '../components/FeedbackModal';
import { Footer } from '../components/Footer';
import { ProjectModal } from '../components/ProjectModal';
import { ResumeModal } from '../components/ResumeModal';
import { ScrollIsland } from '../components/ScrollIsland';
import { LiveChatWidget } from '../components/LiveChatWidget';
import { SCROLL_TOPICS } from '../data/scrollTopics';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SECTION_HASH_MAP: Record<string, SectionId> = {
  hero: 'hero', home: 'hero', about: 'about', services: 'services',
  skills: 'skills', experience: 'experience', courses: 'courses',
  'why-choose-me': 'why-choose-me', 'why-us': 'why-choose-me',
  testimonials: 'testimonials', reviews: 'testimonials',
  projects: 'projects', resume: 'resume', contact: 'contact',
};

const SECTIONS_ORDER: { id: SectionId; name: string }[] = [
  { id: 'hero', name: 'Home' },
  { id: 'about', name: 'About' },
  { id: 'services', name: 'Services' },
  { id: 'skills', name: 'Skills' },
  { id: 'experience', name: 'Experience' },
  { id: 'courses', name: 'Courses' },
  { id: 'why-choose-me', name: 'Why Us' },
  { id: 'projects', name: 'Projects' },
  { id: 'testimonials', name: 'Reviews' },
  { id: 'resume', name: 'Resume' },
  { id: 'contact', name: 'Contact' },
];

const getInitialSection = (): SectionId => {
  if (typeof window === 'undefined') return 'hero';
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
  return hash && SECTION_HASH_MAP[hash] ? SECTION_HASH_MAP[hash] : 'hero';
};

export default function HomePage() {
  const [profile, setProfile] = useState<any>(() => initialProfile);
  const [projects, setProjects] = useState<any[]>(() => initialProjects);
  const [services, setServices] = useState<any[]>(() => initialServices);
  const [testimonials, setTestimonials] = useState<any[]>(() => initialTestimonials);
  const [skills, setSkills] = useState<SkillGroup[]>(() => initialSkillGroups);
  const [experiences, setExperiences] = useState<any[]>(() => initialExperiences);
  const [courses, setCourses] = useState<any[]>(() => initialCourses);
  const [whyUs, setWhyUs] = useState<{ pillars: any[], workflow: any[] }>({
    pillars: initialWhyUsPillars,
    workflow: initialWhyUsWorkflow,
  });
  const [settings, setSettings] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const loadCmsFrontendData = async () => {
    try {
      const [pData, projData, sData, tData, skData, eData, cData, wData, setData] = await Promise.all([
        cmsService.fetchData('profiles'),
        cmsService.fetchData('projects'),
        cmsService.fetchData('services'),
        cmsService.fetchData('testimonials'),
        cmsService.fetchData('skills'),
        cmsService.fetchData('experiences'),
        cmsService.fetchData('courses'),
        cmsService.fetchData('why_us'),
        cmsService.fetchData('settings')
      ]);

      if (pData?.[0]) {
        const p = pData[0];
        setProfile((prev: any) => ({
          ...prev, ...p,
          projectsCompleted: p.projectsCompleted || prev?.projectsCompleted,
          yearsOfExperience: p.yearsOfExperience || prev?.yearsOfExperience,
          happyClients: p.happyClients || prev?.happyClients
        }));
      }

      if (projData?.length) setProjects(projData.map((p: any) => ({
        ...p,
        imageUrl: p.imageUrl || p.image,
        technologies: Array.isArray(p.technologies) ? p.technologies : []
      })));

      if (sData?.length) setServices(sData);
      if (tData?.length) setTestimonials(tData);

      if (skData?.length) {
        const groups: Record<string, any[]> = {};
        skData.forEach((s: any) => {
          const cat = s.category || 'Technical';
          if (!groups[cat]) groups[cat] = [];
          groups[cat].push({ name: s.name, levelPercentage: s.percentage, iconName: s.icon });
        });
        setSkills(Object.keys(groups).map(cat => ({ category: cat, skills: groups[cat], items: groups[cat] })));
      }

      if (eData?.length) setExperiences(eData);
      if (cData?.length) setCourses(cData);

      if (wData?.length) {
        const pList = wData.filter((i: any) => i.type === 'pillar');
        const wList = wData.filter((i: any) => i.type === 'workflow');
        setWhyUs({
          pillars: pList.length > 0 ? pList : initialWhyUsPillars,
          workflow: wList.length > 0 ? wList : initialWhyUsWorkflow,
        });
      }

      if (setData?.[0]) {
        const s = setData[0];
        setSettings(s);
        if (s.themePrimary) document.documentElement.style.setProperty('--primary-dark', s.themePrimary);
        if (s.themeAccent) document.documentElement.style.setProperty('--accent-green', s.themeAccent);
        if (s.title) document.title = s.title;
      }
    } catch (err) {
      console.warn('Frontend CMS sync error', err);
    }
  };

  useEffect(() => {
    loadCmsFrontendData();
    window.addEventListener('cms_data_updated', loadCmsFrontendData);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cms_sync_trigger') {
        loadCmsFrontendData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('cms_data_updated', loadCmsFrontendData);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
      if (!hash) return;
      const mapped = SECTION_HASH_MAP[hash] || (hash as SectionId);
      if (mapped) {
        setActiveSection(mapped);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectSection = (section: SectionId) => {
    setActiveSection(section);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        if (section === 'hero') {
          window.history.replaceState(null, '', ' ');
        } else {
          window.history.replaceState(null, '', `#${section}`);
        }
      } catch (_) {}
    }
  };

  const currentSectionIdx = Math.max(0, SECTIONS_ORDER.findIndex(s => s.id === activeSection));

  const navigateNext = () => {
    if (currentSectionIdx < SECTIONS_ORDER.length - 1) {
      handleSelectSection(SECTIONS_ORDER[currentSectionIdx + 1].id);
    }
  };

  const navigatePrev = () => {
    if (currentSectionIdx > 0) {
      handleSelectSection(SECTIONS_ORDER[currentSectionIdx - 1].id);
    }
  };

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'hero':
        return <Hero profile={profile} onOpenSection={handleSelectSection} onOpenResume={() => setIsResumeModalOpen(true)} />;
      case 'about':
        return <AboutSection profile={profile} />;
      case 'services':
        return <ServicesSection services={services} adminPhone={profile?.whatsapp || profile?.phone} />;
      case 'skills':
        return <SkillsSection skillGroups={skills} />;
      case 'experience':
        return <ExperienceSection profile={profile} experiences={experiences} />;
      case 'courses':
        return <CoursesSection courses={courses} />;
      case 'why-choose-me':
        return <WhyChooseMeSection pillars={whyUs.pillars} workflow={whyUs.workflow} />;
      case 'projects':
        return <ProjectsSection projects={projects.filter((p: any) => !p.hidden)} onSelectProject={setSelectedProject} />;
      case 'testimonials':
        return <TestimonialsSection testimonials={testimonials} onOpenContact={() => handleSelectSection('contact')} onOpenFeedback={() => setIsFeedbackModalOpen(true)} />;
      case 'resume':
        return <ResumeSection profile={profile} projects={projects.filter((p: any) => !p.hidden)} skillGroups={skills} experiences={experiences} courses={courses} onOpenFullModal={() => setIsResumeModalOpen(true)} />;
      case 'contact':
        return <ContactSection profile={profile} onOpenResume={() => setIsResumeModalOpen(true)} />;
      default:
        return <Hero profile={profile} onOpenSection={handleSelectSection} onOpenResume={() => setIsResumeModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EE] text-[#11261B]" style={{ fontFamily: settings?.fontFamily || 'Inter, sans-serif' }}>
      <Navbar
        profile={profile}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onOpenResume={() => setIsResumeModalOpen(true)}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        customLinks={settings?.navbarItems}
      />

      <main className="flex-1 space-y-0 relative min-h-[70vh]">
        {/* Isolated Section Container */}
        <div key={activeSection} className="animate-fade-in">
          {renderCurrentSection()}
        </div>

        {/* Section Navigation Controller (Previous / Next) */}
        <div className="max-w-4xl mx-auto my-8 px-4">
          <div className="bg-white/90 backdrop-blur-md border border-[#11261B]/15 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 flex-wrap">
            <button
              onClick={navigatePrev}
              disabled={currentSectionIdx <= 0}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                currentSectionIdx <= 0
                  ? 'opacity-30 cursor-not-allowed border-gray-200 text-gray-400'
                  : 'border-[#11261B]/15 text-[#11261B] hover:bg-[#11261B] hover:text-[#C5A059] cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>
                {currentSectionIdx > 0
                  ? `Previous: ${SECTIONS_ORDER[currentSectionIdx - 1]?.name}`
                  : 'Previous'}
              </span>
            </button>

            <div className="text-center">
              <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider block">
                {SECTIONS_ORDER[currentSectionIdx]?.name || 'Section'}
              </span>
              <span className="text-[11px] text-[#5C6E61] font-semibold">
                Section {Math.max(1, currentSectionIdx + 1)} of {SECTIONS_ORDER.length}
              </span>
            </div>

            <button
              onClick={navigateNext}
              disabled={currentSectionIdx >= SECTIONS_ORDER.length - 1}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                currentSectionIdx >= SECTIONS_ORDER.length - 1
                  ? 'opacity-30 cursor-not-allowed border-gray-200 text-gray-400'
                  : 'border-[#11261B]/15 text-[#11261B] hover:bg-[#11261B] hover:text-[#C5A059] cursor-pointer'
              }`}
            >
              <span>
                {currentSectionIdx < SECTIONS_ORDER.length - 1
                  ? `Next: ${SECTIONS_ORDER[currentSectionIdx + 1]?.name}`
                  : 'Next'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
      <Footer profile={profile} onSelectSection={handleSelectSection} />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} profile={profile} projects={projects} skillGroups={skills} experiences={experiences} courses={courses} />
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
      <ScrollIsland topics={SCROLL_TOPICS} />
      <LiveChatWidget profile={profile} onOpenOwnerPanel={() => { if (typeof window !== 'undefined') window.location.href = '/admin'; }} />
    </div>
  );
}

