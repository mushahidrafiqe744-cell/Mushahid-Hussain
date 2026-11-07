import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Globe,
  Building2,
  ArrowUpRight,
  Maximize2,
  X,
  ShieldCheck,
  Check
} from 'lucide-react';
import { CourseCertification } from '../types/portfolio';

interface CoursesSectionProps {
  courses: CourseCertification[];
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ courses }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredCourseId, setHoveredCourseId] = useState<string | null>(null);
  const [activeBadgeModal, setActiveBadgeModal] = useState<CourseCertification | null>(null);

  const categories = ['all', ...Array.from(new Set(courses.map((c) => c.category)))];

  const filteredCourses = selectedCategory === 'all'
    ? courses
    : courses.filter((c) => c.category === selectedCategory);

  const titleChars = 'Courses & Certifications'.split('');

  return (
    <section id="courses" className="py-20 bg-[#F8F5EE] border-b border-[#11261B]/10 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#11261B]/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-delayed" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#C5A059] mb-2 px-3 py-1 rounded-full bg-white border border-[#C5A059]/30 animate-shimmer shadow-xs">
            <GraduationCap className="w-3.5 h-3.5 text-[#C5A059] animate-spin-slow" />
            <span>EDUCATION & ACCREDITATIONS</span>
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin-slow" />
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#11261B] mb-4 select-none">
            {titleChars.map((char, index) => (
              <span key={index} className="hover-letter-bounce cursor-pointer">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h2>
          <div className="w-16 h-1 bg-[#C5A059] mx-auto mb-4 rounded-full" />
          <p className="text-[#5C6E61] text-base sm:text-lg leading-relaxed">
            Professional specializations, official developer academy badges, and accredited web engineering programs with verified badge images and official institution links.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#11261B] text-[#C5A059] shadow-md scale-105 border border-[#C5A059]/40'
                  : 'bg-white text-[#5C6E61] hover:text-[#11261B] border border-[#11261B]/10 hover:border-[#C5A059]/50 shadow-2xs'
              }`}
            >
              {cat === 'all' ? 'All Accreditations' : cat}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {filteredCourses.map((course) => {
            const isHovered = hoveredCourseId === course.id;

            return (
              <div
                key={course.id}
                onMouseEnter={() => setHoveredCourseId(course.id)}
                onMouseLeave={() => setHoveredCourseId(null)}
                className={`relative bg-white rounded-2xl border transition-all duration-500 p-6 flex flex-col justify-between shadow-xs hover:shadow-2xl group ${
                  isHovered
                    ? 'border-[#C5A059] -translate-y-2 bg-gradient-to-b from-white to-[#F8F5EE]'
                    : 'border-[#11261B]/10 hover:border-[#C5A059]/40'
                }`}
              >
                {/* Card Top: Institution Badge & Verification Status */}
                <div>
                  
                  {/* Badge Image Preview Banner (if course has badgeImage) */}
                  {course.badgeImage && (
                    <div className="relative mb-5 rounded-xl overflow-hidden bg-[#11261B] p-4 flex flex-col items-center justify-center border border-[#C5A059]/30 shadow-inner group/img">
                      <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full p-1.5 bg-gradient-to-tr from-[#C5A059] via-amber-200 to-[#11261B] shadow-2xl transition-transform duration-500 group-hover/img:scale-108">
                        <img
                          src={
                            typeof course.badgeImage === 'object' && (course.badgeImage as any)?.src
                              ? (course.badgeImage as any).src
                              : course.badgeImage || '/assets/images/claude_badge_dev_1790595243034.jpg'
                          }
                          alt={`${course.title} Badge`}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/assets/images/claude_badge_dev_1790595243034.jpg';
                          }}
                          className="w-full h-full object-cover rounded-full shadow-md"
                        />
                        <button
                          onClick={() => setActiveBadgeModal(course)}
                          className="absolute inset-0 bg-[#11261B]/50 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                          title="Click to view badge full size"
                        >
                          <Maximize2 className="w-5 h-5 text-[#C5A059]" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold tracking-wider uppercase border border-white/10">
                        <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
                        <span>Official Credential Badge</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#11261B] text-[#C5A059] flex items-center justify-center font-bold shadow-sm group-hover:scale-110 group-hover:bg-[#C5A059] group-hover:text-[#11261B] transition-all duration-300 shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#C5A059] block">
                          {course.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#11261B]">
                          <Building2 className="w-3 h-3 text-[#5C6E61]" />
                          <span>{course.institution}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-mono font-semibold text-[#5C6E61] bg-[#F2EDE2] px-2 py-0.5 rounded-md border border-[#11261B]/10">
                        {course.period}
                      </span>
                    </div>
                  </div>

                  {/* Course Title */}
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#11261B] group-hover:text-[#C5A059] transition-colors mb-2.5 leading-snug">
                    {course.title}
                  </h3>

                  {/* Verified Credential Tag */}
                  {course.credentialBadge && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-800 border border-emerald-200 mb-3.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{course.credentialBadge}</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#5C6E61] leading-relaxed mb-5">
                    {course.description}
                  </p>

                  {/* Skills Covered Pills */}
                  <div className="mb-6">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#11261B] block mb-2">
                      Key Competencies Learned:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {course.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F2EDE2] text-[#11261B] border border-[#11261B]/10 group-hover:border-[#C5A059]/30 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Action Buttons */}
                <div className="pt-4 border-t border-[#11261B]/10 flex flex-col gap-2">
                  
                  {/* Official Direct Badge Verification Link (e.g. Claude Academy badge URL) */}
                  {course.badgeUrl && course.badgeUrl !== course.institutionUrl && (
                    <a
                      href={course.badgeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#11261B] hover:bg-[#C5A059] text-white hover:text-[#11261B] text-xs font-bold transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
                      title="Verify official Claude Academy Badge online"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-[#11261B]" />
                      <span>Verify Official Badge ↗</span>
                    </a>
                  )}

                  {/* Institution Official Website Link (e.g. WeVersity, Claude Academy, Meta) */}
                  <a
                    href={course.institutionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs hover:scale-[1.02] cursor-pointer ${
                      course.badgeUrl && course.badgeUrl !== course.institutionUrl
                        ? 'bg-[#F2EDE2] hover:bg-[#11261B] text-[#11261B] hover:text-white border border-[#11261B]/15'
                        : 'bg-[#11261B] hover:bg-[#C5A059] text-white hover:text-[#11261B]'
                    }`}
                    title={`Visit official ${course.institution} website`}
                  >
                    <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Official Website ({course.institution}) ↗</span>
                  </a>

                </div>

              </div>
            );
          })}
        </div>

        {/* Global Accreditation Guarantee Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#11261B] text-white border border-[#C5A059]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C5A059] text-[#11261B] flex items-center justify-center shrink-0 font-bold shadow-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Verified Continuous Learning & Professional Accreditations</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </h4>
              <p className="text-xs sm:text-sm text-[#A3B8A8] mt-1 leading-relaxed">
                Featuring official completion badges from Anthropic Claude Academy, full-stack web engineering programs from WeVersity, and continuous development across AI and cloud engineering.
              </p>
            </div>
          </div>

          <a
            href="#contact"
            className="px-6 py-3 rounded-full bg-[#C5A059] hover:bg-[#DFC285] text-[#11261B] text-xs font-bold uppercase tracking-wider transition-all shadow-md shrink-0 hover:scale-105 cursor-pointer text-center"
          >
            Inquire Credentials
          </a>
        </div>

      </div>

      {/* Lightbox Modal for Badge Images */}
      {activeBadgeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveBadgeModal(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#11261B] text-white rounded-3xl p-6 sm:p-8 border border-[#C5A059]/40 shadow-2xl flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveBadgeModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badge Image */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full p-2 bg-gradient-to-tr from-[#C5A059] to-amber-200 shadow-2xl mb-6">
              <img
                src={activeBadgeModal.badgeImage}
                alt={activeBadgeModal.title}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-1">
              {activeBadgeModal.institution}
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
              {activeBadgeModal.title}
            </h3>
            <p className="text-xs text-[#A3B8A8] mb-6 leading-relaxed max-w-sm">
              {activeBadgeModal.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              {activeBadgeModal.badgeUrl && (
                <a
                  href={activeBadgeModal.badgeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#DFC285] text-[#11261B] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Open Verification Link ↗</span>
                </a>
              )}
              <a
                href={activeBadgeModal.institutionUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all border border-white/20 flex items-center justify-center gap-1.5"
              >
                <span>Visit Official Website ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
