import React, { useEffect } from 'react';
import { X, Printer, Download, Mail, Phone, MapPin, Globe, Github, Linkedin, Briefcase, GraduationCap, Award, Code2, ArrowUpRight } from 'lucide-react';
import { CourseCertification, DeveloperProfile, Project, SkillGroup } from '../types/portfolio';
import cvPortrait from '../assets/images/cv_portrait_new.jpg';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DeveloperProfile;
  projects: Project[];
  skillGroups: SkillGroup[];
  experiences: any[];
  courses?: CourseCertification[];
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  profile,
  projects,
  skillGroups,
  experiences,
  courses = [],
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const skillLines = skillGroups.map(group => {
      const skills = (group.skills || group.items || []).map((s: any) => s.name).join(', ');
      return `- **${group.category}**: ${skills}`;
    }).join('\n');

    const expLines = experiences.map(exp => {
      return `### ${exp.role} (${exp.period})\n- ${exp.company}\n- ${exp.description}`;
    }).join('\n\n');

    const content = `# ${profile.name} - ${profile.title}
Email: ${profile.email} | Phone: ${profile.phone} | Location: ${profile.location}
GitHub: ${profile.github} | LinkedIn: ${profile.linkedin}

---

## PROFESSIONAL SUMMARY
${profile.bioAbout}

---

## TECHNICAL SKILLS
${skillLines}

---

## WORK EXPERIENCE
${expLines}

---

## FEATURED PROJECTS
${projects
  .map(
    (p) => `### ${p.title} (${p.categoryLabel}, ${p.year})
- **Stack**: ${p.technologies.join(', ')}
- **Description**: ${p.description}
- **GitHub**: ${p.githubUrl}
- **Live Demo**: ${p.liveUrl}
- **Key Highlights**:
${(p.features || []).map((f) => `  * ${f}`).join('\n')}`
  )
  .join('\n\n')}

---

## EDUCATION & VERIFIED ACCREDITATIONS
- **Bachelor of Science in Computer Science** (2020 – 2024)
${courses.map((c) => `- **${c.title}** — ${c.institution} (${c.period}) | Link: ${c.institutionUrl}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${profile.name.replace(/\s+/g, '_')}_Resume.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#11261B]/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#11261B]/20 overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#11261B] text-white border-b border-[#C5A059]/30 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              Curriculum Vitae Preview
            </span>
            <span className="text-white/40">·</span>
            <span className="text-xs text-[#A3B8A8]">Printable & PDF Export</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">Markdown (.md)</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#DFC285] text-xs font-bold text-[#11261B] transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors ml-2"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Resume Document Canvas */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-white text-[#11261B] font-sans printable-resume">
          
          {/* Header */}
          <div className="border-b-2 border-[#11261B] pb-6 mb-6 flex gap-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-[#C5A059]/20">
              <img src={profile.avatarUrl || cvPortrait} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 flex-1">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#11261B] leading-none">
                  {profile.name}
                </h1>
                <p className="text-sm font-bold uppercase tracking-widest text-[#C5A059] mt-1.5">
                  {profile.title} & Full-Stack Engineer
                </p>
              </div>

              {/* Contact Chips */}
              <div className="text-xs text-[#5C6E61] space-y-1 sm:text-right">
                <div>{profile.email} · {profile.phone}</div>
                <div>{profile.location} · {profile.github?.replace('https://', '')}</div>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#11261B] border-b border-[#11261B]/15 pb-1 mb-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              <span>Professional Summary</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#11261B]/80 leading-relaxed">
              {profile.bioAbout}
            </p>
          </div>

          {/* Technical Skills */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#11261B] border-b border-[#11261B]/15 pb-1 mb-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              <span>Technical Skills</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-xs">
              {skillGroups.map((group, idx) => (
                <div key={idx}>
                  <span className="font-bold text-[#11261B]">{group.category}: </span>
                  <span className="text-[#5C6E61]">
                    {(group.skills || group.items || []).map((s: any) => s.name).join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#11261B] border-b border-[#11261B]/15 pb-1 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              <span>Professional Experience</span>
            </h2>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-sm text-[#11261B]">{exp.role}</span>
                    <span className="text-[#5C6E61] font-medium">{exp.period}</span>
                  </div>
                  <div className="text-xs text-[#C5A059] font-semibold mb-1.5">{exp.company}</div>
                  <p className="text-xs text-[#11261B]/80 leading-relaxed pl-1">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#11261B] border-b border-[#11261B]/15 pb-1 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              <span>Selected Key Projects</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.slice(0, 4).map((p) => (
                <div key={p.id} className="p-3 rounded-lg bg-[#F8F5EE] border border-[#11261B]/10">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#11261B]">{p.title}</span>
                    <span className="text-[10px] text-[#5C6E61]">{p.year}</span>
                  </div>
                  <div className="text-[11px] text-[#C5A059] font-medium mb-1 truncate">
                    {p.technologies.slice(0, 4).join(', ')}
                  </div>
                  <p className="text-[11px] text-[#5C6E61] line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Verified Courses */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#11261B] border-b border-[#11261B]/15 pb-1 mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                <span>Education & Professional Courses</span>
              </div>
              <span className="text-[10px] text-[#5C6E61] print:hidden">Official Links Included</span>
            </h2>

            <div className="p-3 bg-[#F8F5EE] rounded-lg border border-[#11261B]/10 mb-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5">
              <div>
                <span className="font-bold text-[#11261B]">Bachelor of Science in Computer Science</span>
                <div className="text-[#5C6E61]">Software Engineering & Web Architecture (2020 – 2024)</div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start sm:self-auto">
                Graduated with Honors
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {courses.map((course) => (
                <div key={course.id} className="p-2.5 rounded-lg bg-[#F8F5EE] border border-[#11261B]/10 flex flex-col justify-between">
                  <div className="flex items-start gap-2 mb-1.5">
                    {course.badgeImage && (
                      <img
                        src={course.badgeImage}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[#C5A059]/40 shadow-xs"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[9px] text-[#5C6E61] mb-0.5">
                        <span className="font-bold text-[#C5A059] uppercase truncate max-w-[120px]">{course.institution}</span>
                        <span className="font-mono shrink-0">{course.period}</span>
                      </div>
                      <div className="font-bold text-[#11261B] text-xs leading-tight">{course.title}</div>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-[#11261B]/5 flex items-center justify-between text-[10px]">
                    <span className="text-[#5C6E61]">{course.category}</span>
                    <a
                      href={course.badgeUrl || course.institutionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#11261B] hover:text-[#C5A059] flex items-center gap-0.5 underline print:no-underline"
                    >
                      <span>{course.badgeUrl && course.badgeUrl.includes('academy.claude.com') ? 'Verify Badge' : 'Official Link'}</span>
                      <ArrowUpRight className="w-2.5 h-2.5 text-[#C5A059]" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
