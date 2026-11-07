import React from 'react';
import { FileText, Download, Printer, ExternalLink, Sparkles, Check, GraduationCap, Award, Briefcase, Code2, Globe, ArrowUpRight } from 'lucide-react';
import { CourseCertification, DeveloperProfile, Project, SkillGroup } from '../types/portfolio';

interface ResumeSectionProps {
  profile: DeveloperProfile;
  projects: Project[];
  skillGroups: SkillGroup[];
  experiences: any[];
  courses?: CourseCertification[];
  onOpenFullModal: () => void;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({
  profile,
  projects,
  skillGroups,
  experiences,
  courses = [],
  onOpenFullModal,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const courseLines = courses.map(
      (c) => `- **${c.title}** — ${c.institution} (${c.period}) | Official: ${c.institutionUrl}`
    ).join('\n');

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

## EDUCATION & VERIFIED COURSES / ACCREDITATIONS
- **Bachelor of Science in Computer Science** (2020 – 2024)
${courseLines}
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
    <section id="resume" className="py-20 bg-[#F2EDE2] border-b border-[#11261B]/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#C5A059] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CURRICULUM VITAE</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#11261B] mb-4">
            Downloadable Resume
          </h2>
          <div className="w-16 h-1 bg-[#C5A059] mx-auto mb-4 rounded-full" />
          <p className="text-[#5C6E61] text-base sm:text-lg leading-relaxed">
            Review my professional background, education, and technical competencies. Available for instant preview, print export, or file download.
          </p>
        </div>

        {/* Resume Preview Sheet */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-[#11261B]/15 overflow-hidden">
          
          {/* Top Sheet Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#11261B] text-white border-b border-[#C5A059]/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059] text-[#11261B] flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Official Developer Resume</span>
                <span className="text-[10px] text-[#A3B8A8]">Last updated for {new Date().getFullYear()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadMarkdown}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Markdown (.md)</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#DFC285] text-xs font-bold text-[#11261B] transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* Embedded CV Body */}
          <div className="p-8 sm:p-12 text-[#11261B]">
            
            {/* Header Lockup */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b-2 border-[#11261B] mb-8">
              <div>
                <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#11261B]">
                  {profile.name}
                </h3>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#C5A059] mt-1.5">
                  {profile.title} & Full-Stack Engineer
                </p>
              </div>

              <div className="text-xs text-[#5C6E61] space-y-1 sm:text-right font-medium">
                <div>{profile.email} · {profile.phone}</div>
                <div>{profile.location} · {profile.github?.replace('https://', '')}</div>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#11261B] border-b border-[#11261B]/15 pb-1.5 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                <span>Executive Summary</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#11261B]/80 leading-relaxed">
                {profile.bioAbout}
              </p>
            </div>

            {/* Core Skills Matrix */}
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#11261B] border-b border-[#11261B]/15 pb-1.5 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                <span>Technical Skills Matrix</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {skillGroups.map((group, idx) => (
                  <div key={idx} className="p-3 bg-[#F8F5EE] rounded-xl border border-[#11261B]/5">
                    <span className="font-bold text-[#11261B] block mb-1">{group.category}:</span>
                    <span className="text-[#5C6E61]">
                      {(group.skills || group.items || []).map((s: any) => s.name).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Highlights */}
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#11261B] border-b border-[#11261B]/15 pb-1.5 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                <span>Professional Experience</span>
              </h4>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-sm text-[#11261B]">{exp.role}</span>
                      <span className="text-[#5C6E61] font-semibold">{exp.period}</span>
                    </div>
                    <div className="text-xs text-[#C5A059] font-medium mb-1.5">{exp.company}</div>
                    <p className="text-xs text-[#11261B]/80 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Official Accreditations */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#11261B] border-b border-[#11261B]/15 pb-1.5 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                  <span>Education & Verified Accreditations</span>
                </div>
                <span className="text-[10px] text-[#5C6E61] font-mono">With Official Verification Links</span>
              </h4>

              {/* Formal Degree */}
              <div className="p-3.5 bg-[#F8F5EE] rounded-xl border border-[#11261B]/10 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-bold text-sm text-[#11261B]">Bachelor of Science in Computer Science</span>
                  </div>
                  <div className="text-xs text-[#5C6E61] ml-6">Software Engineering, Algorithms & Web Systems (2020 – 2024)</div>
                </div>
                <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0 self-start sm:self-auto">
                  Graduated with Honors
                </div>
              </div>

              {/* Verified Courses List with Official Website Links */}
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#5C6E61] block">
                  Completed Professional Courses & Certifications:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-3 rounded-xl bg-[#F8F5EE] border border-[#11261B]/10 hover:border-[#C5A059] transition-all flex flex-col justify-between group/c"
                    >
                      <div className="flex items-start gap-2.5 mb-2">
                        {course.badgeImage && (
                          <img
                            src={course.badgeImage}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-[#C5A059]/40 shadow-xs"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[10px] font-bold text-[#C5A059] uppercase truncate">
                              {course.institution}
                            </span>
                            <span className="text-[9px] font-mono text-[#5C6E61] shrink-0">{course.period}</span>
                          </div>
                          <h5 className="font-bold text-xs text-[#11261B] group-hover/c:text-[#C5A059] transition-colors leading-tight">
                            {course.title}
                          </h5>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#11261B]/5 flex items-center justify-between">
                        <span className="text-[9px] text-[#5C6E61]">{course.category}</span>
                        <a
                          href={course.badgeUrl || course.institutionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#11261B] hover:text-[#C5A059] transition-colors"
                          title={`Open ${course.badgeUrl ? 'verification badge' : 'official website'}`}
                        >
                          <span>{course.badgeUrl && course.badgeUrl.includes('academy.claude.com') ? 'Verify Badge' : 'Official Website'}</span>
                          <ArrowUpRight className="w-3 h-3 text-[#C5A059]" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Card Footer */}
          <div className="px-6 py-4 bg-[#F8F5EE] border-t border-[#11261B]/10 flex items-center justify-between">
            <span className="text-xs text-[#5C6E61]">Ready to interview or collaborate?</span>
            <button
              onClick={onOpenFullModal}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#11261B] hover:text-[#C5A059] transition-colors"
            >
              <span>Expand Full Modal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
