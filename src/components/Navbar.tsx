import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  Menu as MenuIcon, 
  X,
  MessageCircle,
  Inbox,
  Circle,
  Crosshair,
  Download,
} from 'lucide-react';
import { DeveloperProfile, SectionId } from '../types/portfolio';
import { EmblemLogo } from './EmblemLogo';
import { TooltipNavbar, TooltipNavbarItem } from './TooltipNavbar';
import { DiscreteTabs, DiscreteTab } from './DiscreteTabs';
import { MdWorkOutline, MdPsychology, MdDesignServices, MdChatBubbleOutline, MdRateReview } from 'react-icons/md';
import { HiOutlineLightBulb } from 'react-icons/hi2';
import { Star } from 'lucide-react';

interface NavbarProps {
  profile: DeveloperProfile;
  activeSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  onOpenResume: () => void;
  onOpenFeedback: () => void;
  customLinks?: string[];
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeSection,
  onSelectSection,
  onOpenResume,
  onOpenFeedback,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: SectionId) => {
    setMobileMenuOpen(false);
    onSelectSection(id);
  };

  const topTabs: DiscreteTab[] = [
    { id: 'hero', label: 'Home', icon: <MdPsychology size={20} />, activeColor: 'text-[#C5A059]' },
    { id: 'about', label: 'About', icon: <MdPsychology size={20} />, activeColor: 'text-[#C5A059]' },
    { id: 'services', label: 'Services', icon: <MdDesignServices size={20} />, activeColor: 'text-[#C5A059]' },
    { id: 'skills', label: 'Skills', icon: <HiOutlineLightBulb size={20} />, activeColor: 'text-[#C5A059]' },
    { id: 'experience', label: 'Experience', icon: <MdWorkOutline size={20} />, activeColor: 'text-[#C5A059]' },
    { id: 'courses', label: 'Courses', icon: <Star size={20} />, activeColor: 'text-[#C5A059]' },
    { id: 'why-choose-me', label: 'Why Us', icon: <HiOutlineLightBulb size={20} />, activeColor: 'text-[#C5A059]' },
    { id: 'projects', label: 'Projects', icon: <MdWorkOutline size={20} />, activeColor: 'text-[#C5A059]' },
    { id: 'testimonials', label: 'Reviews', icon: <MdRateReview size={20} />, activeColor: 'text-[#C5A059]' },
    { id: 'contact', label: 'Contact', icon: <MdChatBubbleOutline size={20} />, activeColor: 'text-[#C5A059]' },
  ];

  const navItems: TooltipNavbarItem[] = [
    {
      icon: <MessageCircle className="h-full w-full" />,
      label: 'About',
      labelHasKeyword: ['A'],
      isActive: activeSection === 'about',
      onClick: () => handleNavClick('about'),
    },
    {
      icon: <Crosshair className="h-full w-full" />,
      label: 'Services',
      labelHasKeyword: ['S'],
      isActive: activeSection === 'services',
      onClick: () => handleNavClick('services'),
    },
    {
      icon: <Circle className="h-full w-full" />,
      label: 'Skills',
      labelHasKeyword: ['S'],
      isActive: activeSection === 'skills',
      onClick: () => handleNavClick('skills'),
    },
    {
      icon: <Inbox className="h-full w-full" />,
      label: 'Projects',
      labelHasKeyword: ['P'],
      hasBadge: true,
      isActive: activeSection === 'projects',
      onClick: () => handleNavClick('projects'),
    },
    {
      icon: <Download className="h-full w-full" />,
      label: 'CV / Resume',
      labelHasKeyword: ['C'],
      isActive: activeSection === 'resume',
      onClick: onOpenResume,
    },
    {
      icon: <MenuIcon className="h-full w-full" />,
      label: 'Contact',
      labelHasKeyword: ['C'],
      isActive: activeSection === 'contact',
      onClick: () => handleNavClick('contact'),
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F8F5EE]/95 backdrop-blur-md border-b border-[#11261B]/10 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 flex items-center justify-between h-14 sm:h-16">
          
          {/* Brand Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('hero');
            }}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none py-0.5"
            title="Click to go to Home Section"
          >
            <div className="relative transition-transform duration-300 group-hover:scale-105 shrink-0 scale-90 -ml-1">
              <EmblemLogo size="sm" showSubtitle={false} interactive={true} name={profile?.name || 'Mushahid Hussain'} title={profile?.title || 'Web Developer'} />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1">
                <span className="font-display font-bold text-base sm:text-lg tracking-tight text-[#C5A059] group-hover:text-[#DFC285] transition-colors leading-none">
                  {profile?.name || 'Mushahid Hussain'}
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-bold text-[#5C6E61] mt-0.5 leading-none whitespace-nowrap">
                {profile?.title || 'WEB DEVELOPER'}
              </span>
            </div>
          </a>

          {/* Main Nav Links (DiscreteTabs style) */}
          <div className="hidden lg:block">
            <DiscreteTabs 
              tabs={topTabs} 
              activeTab={activeSection} 
            onTabChange={(id) => handleNavClick(id as SectionId)} 
          />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <a
              href="#resume"
              onClick={(e) => {
                e.preventDefault();
                onOpenResume();
              }}
              className={`hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold tracking-wide rounded-lg border transition-all shadow-2xs cursor-pointer ${
                activeSection === 'resume'
                  ? 'bg-[#11261B] text-[#C5A059] border-[#11261B]'
                  : 'bg-white text-[#11261B] border-[#11261B]/15 hover:border-[#C5A059] hover:bg-[#F2EDE2]'
              }`}
            >
              <FileText className="w-3 h-3 text-[#C5A059]" />
              <span>CV</span>
            </a>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('contact');
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold tracking-wider uppercase rounded-lg transition-all shadow-xs hover:scale-[1.02] cursor-pointer ${
                activeSection === 'contact'
                  ? 'bg-[#C5A059] text-[#11261B]'
                  : 'bg-[#11261B] text-white hover:bg-[#1A3828]'
              }`}
            >
              <span>Let's Talk</span>
              <Send className="w-3 h-3" />
            </a>

            {/* Mobile Menu Button - Keeping it for small devices that might find floating bar too much */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#11261B] hover:bg-[#11261B]/5 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#F8F5EE] border-b border-[#11261B]/10 px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-fade-in">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={item.onClick}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                  item.isActive
                    ? 'bg-[#11261B] text-[#C5A059]'
                    : 'text-[#11261B] hover:bg-[#F2EDE2]'
                }`}
              >
                <span>{item.label}</span>
                {item.isActive && <span className="w-2 h-2 rounded-full bg-[#C5A059]" />}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* New Tooltip Floating Navbar - visible on all screens */}
      <TooltipNavbar items={navItems} className="bottom-4 sm:bottom-8" />
    </>
  );
};

