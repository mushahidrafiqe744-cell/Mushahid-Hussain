export type SectionId =
  | 'hero'
  | 'about'
  | 'services'
  | 'skills'
  | 'experience'
  | 'courses'
  | 'why-choose-me'
  | 'testimonials'
  | 'projects'
  | 'resume'
  | 'feedback'
  | 'contact'
  | 'all';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  project?: string;
  avatar: string | any;
  avatarUrl?: string | any;
  flag?: string;
  location?: string;
  rating: number;
  review: string;
  feedback?: string;
  message?: string;
  date: string;
  verified?: boolean;
  metricsResult?: string;
  tags?: string[];
  avatarColor?: string;
  avatarLetter?: string;
  platform?: 'google' | 'weversity' | 'upwork' | 'client';
}

export interface VisitorLog {
  id: string;
  name: string;
  email: string;
  company?: string;
  purpose: string;
  timestamp: string;
  dateStr: string;
  device?: string;
  location?: string;
  notes?: string;
}

export interface Project {
  id: string;
  title: string;
  tagline?: string;
  category: 'saas' | 'ecommerce' | 'fullstack' | 'api' | 'mobile' | string;
  categoryLabel?: string;
  year?: string;
  metrics?: string;
  description: string;
  longDescription?: string;
  fullOverview?: string;
  image?: string | any;
  imageUrl?: string | any;
  tags?: string[];
  technologies: string[];
  features?: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  hidden?: boolean;
  highlights?: string[];
  architecture?: string[];
}

export interface Service {
  id: string;
  title: string;
  iconName?: string;
  description: string;
}

export interface SkillItem {
  name: string;
  level?: string; // 'Expert' | 'Advanced' | 'Proficient'
  levelPercentage?: number;
  iconName?: string;
  yearsOfExp?: string;
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  short?: string;
}

export interface SkillGroup {
  category: string;
  skills: SkillItem[];
  items?: SkillItem[];
}

export interface CourseCertification {
  id: string;
  title: string;
  institution: string;
  institutionUrl: string;
  category: string;
  period: string;
  description: string;
  skills: string[];
  verified: boolean;
  credentialBadge?: string;
  badgeUrl?: string;
  badgeImage?: string | any;
  featured?: boolean;
}

export interface DeveloperProfile {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  scriptSubhead: string;
  badge: string;
  bioHero: string;
  bioAbout: string;
  location: string;
  dob?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  github: string;
  linkedin: string;
  twitter?: string;
  tiktok?: string;
  avatarUrl: string | any;
  yearsOfExperience: string;
  projectsCompleted: string;
  happyClients: string;
}
