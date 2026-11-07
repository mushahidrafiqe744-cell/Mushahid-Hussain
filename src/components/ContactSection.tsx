import React, { useState } from 'react';
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
  FileText,
  Sparkles,
  MessageSquare,
  CheckCircle,
  Zap,
  Clock,
  ShieldCheck,
  ArrowRight,
  SendHorizontal,
  Linkedin,
  Github,
  Calendar,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { SaveToggle } from './SaveToggle';
import { DeveloperProfile } from '../types/portfolio';
import { HoverCounter } from './HoverCounter';
import { CountryCurrency, WORLD_COUNTRIES } from '../data/worldCountries';
import { CountryCurrencyModal } from './CountryCurrencyModal';
import { cmsService } from '../services/cms';

interface ContactSectionProps {
  profile: DeveloperProfile;
  onOpenResume: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile, onOpenResume }) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCurrency>(WORLD_COUNTRIES[0]);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Custom Website (Business / Portfolio)',
    budget: WORLD_COUNTRIES[0].defaultBudget,
    message: '',
  });
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'email'>('whatsapp');

  React.useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const savedCode = localStorage.getItem('user_selected_country_code');
      if (savedCode) {
        const found = WORLD_COUNTRIES.find((c) => c.code === savedCode);
        if (found) {
          setSelectedCountry(found);
          setFormData((prev) => ({ ...prev, budget: found.defaultBudget }));
          return;
        }
      }

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let matched: CountryCurrency | undefined;
      if (timeZone.includes('Karachi') || timeZone.includes('Pakistan')) {
        matched = WORLD_COUNTRIES.find((c) => c.code === 'PKR');
      } else if (timeZone.includes('Dubai') || timeZone.includes('Muscat')) {
        matched = WORLD_COUNTRIES.find((c) => c.code === 'AED');
      } else if (timeZone.includes('Riyadh')) {
        matched = WORLD_COUNTRIES.find((c) => c.code === 'SAR');
      } else if (timeZone.includes('London')) {
        matched = WORLD_COUNTRIES.find((c) => c.code === 'GBP');
      } else if (timeZone.includes('Europe') || timeZone.includes('Berlin') || timeZone.includes('Paris')) {
        matched = WORLD_COUNTRIES.find((c) => c.code === 'EUR');
      } else if (timeZone.includes('Calcutta') || timeZone.includes('Kolkata') || timeZone.includes('India')) {
        matched = WORLD_COUNTRIES.find((c) => c.code === 'INR');
      } else if (timeZone.includes('Toronto') || timeZone.includes('Vancouver')) {
        matched = WORLD_COUNTRIES.find((c) => c.code === 'CAD');
      } else if (timeZone.includes('Sydney') || timeZone.includes('Melbourne')) {
        matched = WORLD_COUNTRIES.find((c) => c.code === 'AUD');
      } else if (timeZone.includes('America') || timeZone.includes('US')) {
        matched = WORLD_COUNTRIES.find((c) => c.code === 'USD');
      }

      if (matched) {
        setSelectedCountry(matched);
        setFormData((prev) => ({ ...prev, budget: matched!.defaultBudget }));
      }
    } catch (e) {}
  }, []);

  // Handle country selection
  const handleSelectCountry = (country: CountryCurrency) => {
    setSelectedCountry(country);
    setFormData((prev) => ({
      ...prev,
      budget: country.defaultBudget,
    }));
  };

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryRefId, setInquiryRefId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null);

  interface ProjectTypeDetail {
    id: string;
    label: string;
    icon: string;
    pricePKR: string;
    priceUSD: string;
    timeline: string;
    description: string;
    features: string[];
    recommendedBudgetPKR: string;
    recommendedBudgetUSD: string;
  }

  const projectTypeDetails: ProjectTypeDetail[] = [
    {
      id: 'Custom Website (Business / Portfolio)',
      label: 'Custom Website (Business / Portfolio)',
      icon: '🌐',
      pricePKR: '₨ 20,000 – 45,000',
      priceUSD: '$150 – $320',
      timeline: '4 – 7 Days',
      description: 'Professional, mobile-responsive custom website for your brand, business, or portfolio. Clean code, lightning speed, WhatsApp chat integration & SEO ready.',
      features: ['Modern React & Tailwind Architecture', '100% Mobile & Tablet Responsive', 'Direct WhatsApp & Inquiry Integration', 'Fast 4–7 Days Delivery Guarantee'],
      recommendedBudgetPKR: '₨ 20,000 – 50,000',
      recommendedBudgetUSD: '< $1,000',
    },
    {
      id: 'Full-Stack Web App',
      label: 'Full-Stack Web App',
      icon: '⚡',
      pricePKR: '₨ 40,000 – 120,000+',
      priceUSD: '$300 – $950+',
      timeline: '2 – 4 Weeks',
      description: 'End-to-end full-stack web application with React/Next.js frontend, Node.js backend, database, user authentication & admin panel.',
      features: ['Modern React/Next.js Frontend', 'Custom Backend API & Database', 'User Auth & Protected Dashboard', 'Cloud Deployment & Monitoring'],
      recommendedBudgetPKR: '₨ 50,000 – 150,000',
      recommendedBudgetUSD: '$1,000 - $3,000',
    },
    {
      id: 'Frontend (React/Next.js)',
      label: 'Frontend (React/Next.js)',
      icon: '🎨',
      pricePKR: '₨ 20,000 – 50,000',
      priceUSD: '$150 – $380',
      timeline: '4 – 8 Days',
      description: 'Pixel-perfect, high-performance UI built with Tailwind CSS, responsive animations, Figma-to-code conversion & SEO optimization.',
      features: ['Figma to Pixel-Perfect Code', 'Tailwind CSS & Smooth Animations', 'Mobile-First Responsive Layout', 'Lighthouse Score 95+ Performance'],
      recommendedBudgetPKR: '₨ 20,000 – 50,000',
      recommendedBudgetUSD: '< $1,000',
    },
    {
      id: 'Business & Agency Website',
      label: 'Business & Agency Website',
      icon: '🏢',
      pricePKR: '₨ 20,000 – 55,000',
      priceUSD: '$150 – $400',
      timeline: '5 – 10 Days',
      description: 'High-converting corporate company or creative agency website with lead capture, portfolio showcase, SEO, and WhatsApp inquiry.',
      features: ['Corporate Branding & Animations', 'Interactive Service Packages', 'WhatsApp & Email Lead Inquiries', 'Speed & Google SEO Tuning'],
      recommendedBudgetPKR: '₨ 20,000 – 50,000',
      recommendedBudgetUSD: '< $1,000',
    },
    {
      id: 'E-Commerce Store',
      label: 'E-Commerce Store',
      icon: '🛒',
      pricePKR: '₨ 45,000 – 140,000',
      priceUSD: '$350 – $1,100',
      timeline: '2 – 3 Weeks',
      description: 'Complete online store with product catalog, cart & checkout, payment gateway integration (Stripe/JazzCash/EasyPaisa), order management.',
      features: ['Dynamic Products & Categories', 'Cart, Checkout & Coupons', 'Payment Gateway Integration', 'Customer & Order Management'],
      recommendedBudgetPKR: '₨ 50,000 – 150,000',
      recommendedBudgetUSD: '$1,000 - $3,000',
    },
    {
      id: 'Real Estate & Property Portal',
      label: 'Real Estate & Property Portal',
      icon: '🏡',
      pricePKR: '₨ 55,000 – 140,000',
      priceUSD: '$400 – $1,050',
      timeline: '2 – 3 Weeks',
      description: 'Comprehensive property marketplace with listings, price filters, virtual tours, map integration, and direct agent booking.',
      features: ['Property Filters & Mapbox Search', 'Virtual Video & Gallery Tours', 'Agent WhatsApp Schedule Booking', 'Admin Property Management'],
      recommendedBudgetPKR: '150,000 - 400,000 PKR',
      recommendedBudgetUSD: '$1,000 - $3,000',
    },
    {
      id: 'Restaurant & Food Delivery',
      label: 'Restaurant & Food Delivery',
      icon: '🍽️',
      pricePKR: '₨ 35,000 – 80,000',
      priceUSD: '$250 – $600',
      timeline: '1 – 2 Weeks',
      description: 'Mouth-watering gourmet dining website with digital food menu, table reservation calendar, and direct WhatsApp takeaway checkout.',
      features: ['Digital Menu with Dietary Filters', 'Table Reservation Booking System', 'Takeaway WhatsApp Checkout Form', 'Customer Reviews Carousel'],
      recommendedBudgetPKR: '< 150,000 PKR',
      recommendedBudgetUSD: '< $1,000',
    },
    {
      id: 'REST/GraphQL API',
      label: 'REST/GraphQL API',
      icon: '🔌',
      pricePKR: '₨ 20,000 – 55,000',
      priceUSD: '$150 – $400',
      timeline: '4 – 10 Days',
      description: 'Secure, scalable backend REST or GraphQL API with PostgreSQL/MongoDB, JWT authentication, rate limiting, and Swagger documentation.',
      features: ['Clean Architecture & MVC', 'Database Schema & Migrations', 'JWT & OAuth Authentication', 'Complete Swagger / Postman Docs'],
      recommendedBudgetPKR: '< 150,000 PKR',
      recommendedBudgetUSD: '< $1,000',
    },
    {
      id: 'Performance & SEO',
      label: 'Performance & SEO',
      icon: '🚀',
      pricePKR: '₨ 15,000 – 40,000',
      priceUSD: '$100 – $300',
      timeline: '3 – 7 Days',
      description: 'Comprehensive speed audit, Core Web Vitals optimization, bundle compression, server caching, and schema markup for Google ranking.',
      features: ['Core Web Vitals 95+ Green', 'Image Compression & Lazy Load', 'SEO Tags, OpenGraph & JSON-LD', 'Server-Side Caching Setup'],
      recommendedBudgetPKR: '< 150,000 PKR',
      recommendedBudgetUSD: '< $1,000',
    },
    {
      id: 'Contract Role',
      label: 'Contract Role',
      icon: '💼',
      pricePKR: 'Discuss / Monthly',
      priceUSD: '$20 – $40 / hr or Monthly',
      timeline: 'Part-Time / Full-Time Contract',
      description: 'Dedicated software engineering contract for sprints, feature development, bug fixing, or ongoing project maintenance.',
      features: ['Daily Standups & Git Commits', 'Direct Slack/WhatsApp Access', 'Flexible Milestone or Hourly', 'Code Reviews & Mentorship'],
      recommendedBudgetPKR: '400,000 - 1,000,000 PKR',
      recommendedBudgetUSD: '$3,000 - $7,000',
    },
  ];

  const currentProjectDetail = projectTypeDetails.find((p) => p.id === formData.projectType) || projectTypeDetails[0];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateForm = (): boolean => {
    setSubmitError(null);
    if (!formData.name.trim()) {
      setSubmitError('Please enter your name.');
      return false;
    }
    if (!formData.email.trim()) {
      setSubmitError('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setSubmitError('Please enter a valid email address.');
      return false;
    }
    if (!formData.projectType.trim()) {
      setSubmitError('Please select a project type.');
      return false;
    }
    if (!formData.budget.trim()) {
      setSubmitError('Please select an estimated budget.');
      return false;
    }
    if (!formData.message.trim()) {
      setSubmitError('Please enter your project details and requirements.');
      return false;
    }
    return true;
  };

  const handleSendInquiry = async () => {
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      projectType: formData.projectType,
      budget: formData.budget,
      message: formData.message.trim(),
      country: selectedCountry.country,
      currency: selectedCountry.code,
    };

    // Format phone for WhatsApp (Pakistan code +92)
    const rawPhone = profile.whatsapp || profile.phone || '03290725117';
    let cleanPhone = rawPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '92' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('92')) {
      cleanPhone = '92' + cleanPhone;
    }

    const whatsappMessage = `*🔥 NEW PROJECT INQUIRY (PORTFOLIO)*

👤 *Name:* ${payload.name}
📧 *Email:* ${payload.email}
🌍 *Country:* ${selectedCountry.flag} ${selectedCountry.country}
🛠️ *Project Type:* ${payload.projectType}
💰 *Budget Range:* ${payload.budget} (${selectedCountry.name})

📝 *Project Details & Requirements:*
${payload.message}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(whatsappMessage)}`;

    const emailSubject = `New Project Inquiry: ${payload.projectType}`;
    const emailBody = `Name: ${payload.name}
Email: ${payload.email}
Project: ${payload.projectType}
Budget: ${payload.budget}
Country: ${selectedCountry.country} (${selectedCountry.code})

Message:
${payload.message}`;
    const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // 1. Send to Supabase database in background
    try {
      await cmsService.insertData('messages', {
        name: payload.name,
        email: payload.email,
        projectType: payload.projectType,
        budget: payload.budget,
        country: payload.country,
        currency: payload.currency,
        message: payload.message,
        status: 'unread'
      });
    } catch (e) {
      console.warn('Supabase sync note:', e);
    }

    const ref = `INQ-${Date.now().toString().slice(-4)}`;
    setInquiryRefId(ref);

    // Open WhatsApp/Email and switch to completed screen
    if (contactMethod === 'whatsapp') {
      window.open(whatsappUrl, '_blank');
    } else {
      window.location.href = mailtoUrl;
    }
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      projectType: 'Full-Stack Web App',
      budget: selectedCountry.defaultBudget,
      message: '',
    });
  };

  const titleChars = "Let's Work Together!".split('');

  return (
    <section id="contact" className="py-20 bg-[#F2EDE2] border-t border-[#11261B]/10 relative overflow-hidden">
      
      {/* Background Animated Floating Ambient Orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#11261B]/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-delayed" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info, Metrics & Editorial Pitch */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#C5A059] mb-2 px-3.5 py-1 rounded-full bg-white border border-[#C5A059]/30 animate-shimmer shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin-slow" />
                <span>GET IN TOUCH</span>
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin-slow" />
              </div>
              
              {/* Interactive Title with Letter-by-Letter Bouncing */}
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#11261B] mb-4 select-none">
                {titleChars.map((char, index) => (
                  <span key={index} className="hover-letter-bounce cursor-pointer">
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </h2>

              <p className="text-[#5C6E61] text-base leading-relaxed mb-6">
                Have a project in mind, need a full-stack web developer for your team, or want to discuss architecture and development? Send me a message and let's bring your vision to life.
              </p>

              {/* Dynamic Animated Response Metrics (0 -> Target Count-up on hover) */}
              <div className="grid grid-cols-3 gap-3 mb-8 p-3 rounded-2xl bg-white/70 border border-[#11261B]/10 shadow-xs">
                
                {/* Metric 1: Avg Response Time */}
                <div
                  onMouseEnter={() => setHoveredMetric(1)}
                  onMouseLeave={() => setHoveredMetric(null)}
                  className={`p-2.5 rounded-xl text-center transition-all duration-300 cursor-pointer ${
                    hoveredMetric === 1 ? 'bg-white shadow-md border border-[#C5A059] scale-105' : 'bg-transparent'
                  }`}
                >
                  <div className="text-lg font-bold font-mono text-[#11261B] leading-none mb-1 flex items-center justify-center gap-0.5">
                    <span>&lt;</span>
                    <HoverCounter target={1} suffix=" Hr" isParentHovered={hoveredMetric === 1} />
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#5C6E61] tracking-wider">Response</div>
                </div>

                {/* Metric 2: Reply Rate */}
                <div
                  onMouseEnter={() => setHoveredMetric(2)}
                  onMouseLeave={() => setHoveredMetric(null)}
                  className={`p-2.5 rounded-xl text-center transition-all duration-300 cursor-pointer border-x border-[#11261B]/10 ${
                    hoveredMetric === 2 ? 'bg-white shadow-md border border-[#C5A059] scale-105' : 'bg-transparent'
                  }`}
                >
                  <div className="text-lg font-bold font-mono text-[#11261B] leading-none mb-1">
                    <HoverCounter target={100} suffix="%" isParentHovered={hoveredMetric === 2} />
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#5C6E61] tracking-wider">Reply Rate</div>
                </div>

                {/* Metric 3: Availability */}
                <div
                  onMouseEnter={() => setHoveredMetric(3)}
                  onMouseLeave={() => setHoveredMetric(null)}
                  className={`p-2.5 rounded-xl text-center transition-all duration-300 cursor-pointer ${
                    hoveredMetric === 3 ? 'bg-white shadow-md border border-[#C5A059] scale-105' : 'bg-transparent'
                  }`}
                >
                  <div className="text-lg font-bold font-mono text-[#25D366] leading-none mb-1 flex items-center justify-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
                    <span>24/7</span>
                  </div>
                  <div className="text-[10px] uppercase font-bold text-[#5C6E61] tracking-wider">Online</div>
                </div>

              </div>

              {/* Direct Contact Cards with Shimmer & Spring Effects */}
              <div className="space-y-4 mb-8">
                
                {/* WhatsApp & Phone Card with Live Pulse */}
                <div className="p-4 rounded-xl bg-white border border-[#11261B]/10 shadow-xs flex items-center justify-between gap-4 hover:border-[#25D366] hover:shadow-xl transition-all duration-300 animate-shimmer group hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#5C6E61] tracking-wider flex items-center gap-1.5">
                        <span>WhatsApp & Phone</span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-[9px] font-bold text-[#25D366]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-ping" />
                          Online
                        </span>
                      </div>
                      <a
                        href={`https://wa.me/92${profile.phone.replace(/^0+/, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-bold text-[#11261B] hover:text-[#25D366] transition-colors block font-mono"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/92${profile.phone.replace(/^0+/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-105 cursor-pointer"
                  >
                    <span>Chat ↗</span>
                  </a>
                </div>

                {/* Email Card with Copy Button */}
                <div className="p-4 rounded-xl bg-white border border-[#11261B]/10 shadow-xs flex items-center justify-between gap-4 hover:border-[#C5A059] hover:shadow-xl transition-all duration-300 animate-shimmer group hover:-translate-y-1">
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-11 h-11 rounded-full bg-[#11261B] text-[#C5A059] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:bg-[#1A3828] transition-transform duration-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] uppercase font-bold text-[#5C6E61] tracking-wider">Email Address</div>
                      <a href={`mailto:${profile.email}`} className="text-xs sm:text-sm font-bold text-[#11261B] hover:text-[#C5A059] transition-colors truncate block">
                        {profile.email}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyEmail}
                    title="Copy Email"
                    className="px-3 py-1.5 rounded-lg bg-[#F8F5EE] hover:bg-[#11261B] text-[#11261B] hover:text-white transition-all text-xs flex items-center gap-1 font-semibold shrink-0 cursor-pointer hover:scale-105 shadow-2xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                        <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Base Location Card */}
                <div className="p-4 rounded-xl bg-white border border-[#11261B]/10 shadow-xs flex items-center gap-3 hover:border-[#C5A059] hover:shadow-xl transition-all duration-300 animate-shimmer group hover:-translate-y-1">
                  <div className="w-11 h-11 rounded-full bg-[#11261B] text-[#C5A059] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:bg-[#1A3828] transition-transform duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#5C6E61] tracking-wider">Base Location</div>
                    <div className="text-xs sm:text-sm font-bold text-[#11261B]">
                      {profile.location} (Open to Global Remote Projects)
                    </div>
                  </div>
                </div>

                {/* Social Profiles: LinkedIn & TikTok Card */}
                <div className="p-4 rounded-xl bg-white border border-[#11261B]/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 hover:border-[#C5A059] hover:shadow-xl transition-all duration-300 animate-shimmer">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#5C6E61] tracking-wider">Social Channels:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* LinkedIn */}
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-bold transition-all shadow-2xs hover:scale-105"
                      title="Connect on LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>

                    {/* TikTok */}
                    {profile.tiktok && (
                      <a
                        href={profile.tiktok}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-2xs hover:scale-105"
                        title="Follow on TikTok"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49V8.5a8.27 8.27 0 0 0 4.84 1.56V6.69z" />
                        </svg>
                        <span>TikTok</span>
                      </a>
                    )}

                    {/* GitHub */}
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#11261B] hover:bg-[#1A3828] text-white text-xs font-bold transition-all shadow-2xs hover:scale-105"
                      title="View GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Download CV Banner */}
              <div className="p-5 rounded-2xl bg-[#11261B] text-white flex items-center justify-between gap-4 border border-[#C5A059]/30 shadow-xl animate-shimmer hover:scale-[1.01] transition-all">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#DFC285] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Verified Credentials</span>
                  </div>
                  <div className="text-xs text-[#A3B8A8] mt-0.5">
                    Download complete PDF resume & technical achievements
                  </div>
                </div>
                <button
                  onClick={onOpenResume}
                  className="px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#DFC285] text-[#11261B] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 shadow-md hover:scale-105 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Interactive Animated Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#11261B]/10 shadow-2xl relative overflow-hidden animate-shimmer">
            
            {submitted ? (
              <div className="py-12 text-center flex flex-col items-center justify-center animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-lg animate-bounce">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11261B] text-[#DFC285] text-xs font-mono mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#50E364]" />
                  <span>Server Recorded: {inquiryRefId}</span>
                </div>
                <h3 className="font-display text-3xl font-bold text-[#11261B] mb-2">Project Inquiry Transmitted!</h3>
                <p className="text-sm text-[#5C6E61] max-w-md mb-6 leading-relaxed">
                  Thank you for reaching out! Your project inquiry has been securely stored on the backend server and forwarded to <span className="font-bold text-[#11261B]">Mushahid Hussain</span>. You will receive a response within 24 hours.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 rounded-full bg-[#11261B] hover:bg-[#1A3828] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:scale-105 cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>

                  {profile.whatsapp && (
                    <a
                      href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi Mushahid, I just submitted project inquiry #${inquiryRefId} on your portfolio website.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#1fb355] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:scale-105 flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Instant WhatsApp Alert</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <span className="font-bold">Error:</span>
                    <span>{submitError}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pb-4 border-b border-[#11261B]/10">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#11261B]">Direct Project Inquiry</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#5C6E61]">Fast Response Guaranteed</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="group">
                    <label className="block text-xs font-bold text-[#11261B] uppercase tracking-wider mb-1.5 group-focus-within:text-[#C5A059] transition-colors">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 text-xs sm:text-sm bg-[#F8F5EE] border border-[#11261B]/15 rounded-xl text-[#11261B] placeholder-[#5C6E61]/60 focus:outline-hidden focus:border-[#C5A059] focus:bg-white transition-all shadow-2xs focus:ring-2 focus:ring-[#C5A059]/25 hover:border-[#C5A059]/50"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="group">
                    <label className="block text-xs font-bold text-[#11261B] uppercase tracking-wider mb-1.5 group-focus-within:text-[#C5A059] transition-colors">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 text-xs sm:text-sm bg-[#F8F5EE] border border-[#11261B]/15 rounded-xl text-[#11261B] placeholder-[#5C6E61]/60 focus:outline-hidden focus:border-[#C5A059] focus:bg-white transition-all shadow-2xs focus:ring-2 focus:ring-[#C5A059]/25 hover:border-[#C5A059]/50"
                    />
                  </div>
                </div>

                {/* Project Type Interactive Pills with Price & Timeline */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-[#11261B] uppercase tracking-wider">
                      Select Project Type <span className="text-[#C5A059] font-normal lowercase">(click to view price & timeline)</span>
                    </label>
                    <span className="text-[11px] font-mono text-[#5C6E61]">
                      {projectTypeDetails.length} Options
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {projectTypeDetails.map((item) => {
                      const isSelected = formData.projectType === item.id;
                      const displayPrice = selectedCountry.code === 'PKR' ? item.pricePKR : item.priceUSD;
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              projectType: item.id,
                              budget: selectedCountry.code === 'PKR' ? item.recommendedBudgetPKR : item.recommendedBudgetUSD,
                            }));
                          }}
                          className={`p-3 rounded-2xl text-left transition-all duration-300 border cursor-pointer relative group flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#11261B] text-[#DFC285] border-[#C5A059] shadow-lg scale-[1.02] ring-2 ring-[#C5A059]/40'
                              : 'bg-[#F8F5EE] text-[#11261B] border-[#11261B]/10 hover:border-[#C5A059]/60 hover:bg-white hover:shadow-md'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className="text-base">{item.icon}</span>
                              {isSelected && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#C5A059] text-[#11261B]">
                                  Selected
                                </span>
                              )}
                            </div>
                            <div className={`text-xs font-bold leading-tight mb-2 ${isSelected ? 'text-white' : 'text-[#11261B]'}`}>
                              {item.label}
                            </div>
                          </div>

                          {/* Quick Mini Badges for Price & Timeline */}
                          <div className="pt-2 border-t border-current/10 space-y-1">
                            <div className="flex items-center gap-1 text-[11px] font-mono font-semibold">
                              <Tag className={`w-3 h-3 shrink-0 ${isSelected ? 'text-[#DFC285]' : 'text-[#C5A059]'}`} />
                              <span className={`truncate ${isSelected ? 'text-[#DFC285]' : 'text-[#11261B] font-bold'}`}>
                                {displayPrice}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-medium">
                              <Clock className={`w-3 h-3 shrink-0 ${isSelected ? 'text-[#A3B8A8]' : 'text-[#5C6E61]'}`} />
                              <span className={`truncate ${isSelected ? 'text-[#A3B8A8]' : 'text-[#5C6E61]'}`}>
                                {item.timeline}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Selected Project Details Box showing Price, Timeline & Deliverables */}
                  {currentProjectDetail && (
                    <div className="mt-3.5 p-4 rounded-2xl bg-[#11261B] text-white border border-[#C5A059]/40 shadow-xl animate-fade-in relative overflow-hidden">
                      {/* Decorative ambient glow */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{currentProjectDetail.icon}</span>
                          <div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059]">
                              Selected Project Package
                            </div>
                            <div className="text-sm sm:text-base font-bold text-white">
                              {currentProjectDetail.label}
                            </div>
                          </div>
                        </div>

                        {/* Highlighted Price & Timeline Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Price Tag */}
                          <div className="px-3 py-1.5 rounded-xl bg-[#C5A059] text-[#11261B] font-bold text-xs flex items-center gap-1.5 shadow-sm">
                            <Tag className="w-3.5 h-3.5" />
                            <span>
                              {selectedCountry.code === 'PKR' ? currentProjectDetail.pricePKR : currentProjectDetail.priceUSD}
                            </span>
                          </div>

                          {/* Timeline Tag */}
                          <div className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-bold text-xs flex items-center gap-1.5 border border-white/15">
                            <Clock className="w-3.5 h-3.5 text-[#DFC285]" />
                            <span>{currentProjectDetail.timeline}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description & Deliverables */}
                      <div className="mt-3">
                        <p className="text-xs text-[#D1DDD4] leading-relaxed mb-3">
                          {currentProjectDetail.description}
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#A3B8A8]">
                          {currentProjectDetail.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#50E364] shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Estimated Budget Interactive Selector with Multi-Country Currency Switcher */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <label className="block text-xs font-bold text-[#11261B] uppercase tracking-wider">
                        Estimated Budget Range
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCountryModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#11261B] text-[#DFC285] hover:bg-[#1A3828] text-[11px] font-bold transition-all shadow-2xs hover:scale-105 cursor-pointer border border-[#C5A059]/40"
                        title="Click to view all countries with flags"
                      >
                        <span className="text-sm select-none">{selectedCountry.flag}</span>
                        <span>{selectedCountry.code}</span>
                        <span className="text-[#8A9B8F] text-[10px]">▼</span>
                      </button>
                    </div>

                    {/* All Countries Button + Quick Shortcut Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsCountryModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DFC285]/20 hover:bg-[#C5A059] text-[#11261B] hover:text-[#11261B] text-xs font-bold transition-all border border-[#C5A059] shadow-2xs hover:scale-105 cursor-pointer group"
                      >
                        <span className="text-base select-none group-hover:rotate-12 transition-transform">🌍</span>
                        <span>All Countries & Flags</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-[#11261B] text-[#DFC285] text-[10px] font-mono">
                          {WORLD_COUNTRIES.length}+
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Contact Method Selector */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-[#11261B] uppercase tracking-wider mb-2">
                      Send Inquiry Via:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setContactMethod('whatsapp')}
                        className={`py-3 px-4 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          contactMethod === 'whatsapp'
                            ? 'bg-[#25D366] text-white border-[#25D366]'
                            : 'bg-[#F8F5EE] text-[#11261B] border-[#11261B]/10 hover:border-[#25D366]'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={() => setContactMethod('email')}
                        className={`py-3 px-4 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          contactMethod === 'email'
                            ? 'bg-[#C5A059] text-[#11261B] border-[#C5A059]'
                            : 'bg-[#F8F5EE] text-[#11261B] border-[#11261B]/10 hover:border-[#C5A059]'
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </button>
                    </div>
                  </div>

                  {/* Active Selected Country & Currency Notice Banner */}
                  <div className="mb-3 px-3.5 py-2 rounded-xl bg-[#F8F5EE] border border-[#11261B]/10 flex items-center justify-between text-xs text-[#5C6E61]">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-lg select-none shrink-0">{selectedCountry.flag}</span>
                      <span className="font-semibold text-[#11261B] truncate">
                        {selectedCountry.country} ({selectedCountry.name} - {selectedCountry.code} {selectedCountry.symbol})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCountryModalOpen(true)}
                      className="text-[#C5A059] hover:underline font-bold text-[11px] shrink-0 ml-2 cursor-pointer"
                    >
                      Change Country ▾
                    </button>
                  </div>

                  {/* Dynamic Budget Range Pills based on Selected Country Currency */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {selectedCountry.options.map((budget) => {
                      const isSelected = formData.budget === budget;
                      return (
                        <button
                          type="button"
                          key={budget}
                          onClick={() => setFormData({ ...formData, budget })}
                          className={`p-2.5 rounded-xl text-center text-xs font-bold font-mono transition-all duration-200 border cursor-pointer ${
                            isSelected
                              ? 'bg-[#C5A059] text-[#11261B] border-[#DFC285] shadow-md scale-[1.03]'
                              : 'bg-[#F8F5EE] text-[#5C6E61] border-[#11261B]/10 hover:border-[#C5A059]/50 hover:bg-white'
                          }`}
                        >
                          {budget}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message Input */}
                <div className="group">
                  <label className="block text-xs font-bold text-[#11261B] uppercase tracking-wider mb-1.5 group-focus-within:text-[#C5A059] transition-colors">
                    Project Details & Requirements <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about your product requirements, desired timeline, stack, and goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-[#F8F5EE] border border-[#11261B]/15 rounded-xl text-[#11261B] placeholder-[#5C6E61]/60 focus:outline-hidden focus:border-[#C5A059] focus:bg-white transition-all shadow-2xs focus:ring-2 focus:ring-[#C5A059]/25 hover:border-[#C5A059]/50 resize-y"
                  />
                </div>

                {/* SaveToggle replacement for the flight button */}
                <SaveToggle
                  idleText={`SEND PROJECT INQUIRY (VIA ${contactMethod === 'whatsapp' ? 'WHATSAPP' : 'EMAIL'})`}
                  savedText={`Opening ${contactMethod === 'whatsapp' ? 'WhatsApp' : 'Email'}...`}
                  loadingDuration={1400}
                  onValidate={validateForm}
                  onClick={handleSendInquiry}
                  className="mt-4"
                />
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Full World Country & Currency Selector Modal */}
      <CountryCurrencyModal
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        selectedCountryId={selectedCountry.id}
        onSelectCountry={handleSelectCountry}
      />
    </section>
  );
};
