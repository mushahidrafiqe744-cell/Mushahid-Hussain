import React, { useState, useEffect } from 'react';
import {
  Layout,
  Layers,
  Server,
  Database,
  Zap,
  Smartphone,
  ShoppingBag,
  Cpu,
  Sparkles,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Tag,
  Clock,
} from 'lucide-react';
import { Service } from '../types/portfolio';
import { ServiceOrderModal, ServiceItemData } from './ServiceOrderModal';

interface ServicesSectionProps {
  services: Service[];
  adminPhone?: string;
}

const ServiceCard: React.FC<{
  service: ServiceItemData;
  onOrder: (service: ServiceItemData) => void;
}> = ({ service, onOrder }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentNum, setCurrentNum] = useState(0);
  const Icon = service.icon;

  // Smooth count-up animation from 00 to target on hover
  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 500; // 0.5s smooth count

    if (isHovered) {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(easeOut * service.targetNum);
        setCurrentNum(value);

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
  }, [isHovered, service.targetNum]);

  const formattedNumber = String(currentNum).padStart(2, '0');

  return (
    <div
      onClick={() => onOrder(service)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group bg-[#F2EDE2] rounded-2xl p-6 border transition-all duration-500 flex flex-col justify-between hover:-translate-y-2 animate-shimmer relative overflow-hidden cursor-pointer ${
        isHovered
          ? 'border-[#C5A059] shadow-xl bg-white/95 ring-2 ring-[#C5A059]/30'
          : 'border-[#11261B]/10 shadow-xs hover:border-[#C5A059]'
      }`}
    >
      {/* Dynamic Animated Number at Top Right: 00 -> 01, 02, 03... on hover */}
      <div
        className={`absolute top-4 right-4 font-mono font-black text-2xl transition-all duration-300 tabular-nums select-none ${
          isHovered
            ? 'text-[#C5A059] scale-125 drop-shadow-md'
            : 'text-[#11261B]/15'
        }`}
      >
        {formattedNumber}
      </div>

      <div>
        {/* Service Icon with Hover Bounce & Shadow */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-sm transition-all duration-300 ${
            isHovered
              ? 'bg-[#C5A059] text-[#11261B] scale-110 rotate-6 shadow-md shadow-[#C5A059]/20'
              : 'bg-[#11261B] text-[#C5A059]'
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3
          className={`font-display text-xl font-bold transition-colors mb-2.5 ${
            isHovered ? 'text-[#C5A059]' : 'text-[#11261B]'
          }`}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#5C6E61] leading-relaxed mb-4">
          {service.description}
        </p>

        {/* Price & Timeline Quick Snapshot */}
        {(service.startingPricePKR || service.estimatedTimeline) && (
          <div className="flex items-center gap-2 mb-3.5 flex-wrap">
            {service.startingPricePKR && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-colors ${
                isHovered
                  ? 'bg-[#C5A059] text-[#11261B]'
                  : 'bg-[#11261B]/5 text-[#11261B] border border-[#11261B]/10'
              }`}>
                <Tag className="w-3 h-3 text-[#C5A059]" />
                <span>From {service.startingPricePKR}</span>
              </span>
            )}
            {service.estimatedTimeline && (
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                isHovered
                  ? 'bg-[#11261B] text-[#DFC285]'
                  : 'bg-white text-[#5C6E61] border border-[#11261B]/10'
              }`}>
                <Clock className="w-3 h-3 text-[#C5A059]" />
                <span>{service.estimatedTimeline}</span>
              </span>
            )}
          </div>
        )}

        {/* Deliverables List with Checkmark Animations */}
        <div className="space-y-1.5 mb-4 pt-3 border-t border-[#11261B]/10">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#11261B] mb-1">
            Deliverables:
          </div>
          {service.deliverables.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-1.5 text-[11px] text-[#11261B]/80 transition-transform duration-200 ${
                isHovered ? 'translate-x-1' : ''
              }`}
              style={{ transitionDelay: `${i * 25}ms` }}
            >
              <CheckCircle
                className={`w-3.5 h-3.5 shrink-0 mt-0.5 transition-all duration-200 ${
                  isHovered ? 'text-[#C5A059] scale-110' : 'text-[#C5A059]'
                }`}
              />
              <span className="leading-tight">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Tags & Dedicated WhatsApp Order CTA */}
      <div className="pt-3 border-t border-[#11261B]/10">
        <div className="flex flex-wrap gap-1 mb-3">
          {service.stack.map((t) => (
            <span
              key={t}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-md border transition-all duration-200 cursor-default ${
                isHovered
                  ? 'bg-[#11261B] text-[#DFC285] border-[#C5A059]/40 scale-105'
                  : 'bg-white text-[#11261B] border-[#11261B]/5 hover:border-[#C5A059]'
              }`}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Prominent WhatsApp Order Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOrder(service);
          }}
          className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all duration-300 shadow-xs cursor-pointer group/btn ${
            isHovered
              ? 'bg-[#25D366] text-white shadow-md shadow-[#25D366]/25 hover:bg-[#20ba59]'
              : 'bg-[#11261B] text-[#DFC285] hover:bg-[#1A3828] hover:text-white border border-[#C5A059]/40'
          }`}
          title="Click to place order via WhatsApp"
        >
          <span className="flex items-center gap-1.5">
            <MessageCircle className={`w-3.5 h-3.5 ${isHovered ? 'fill-white text-[#25D366]' : 'text-emerald-400'}`} />
            <span>Order on WhatsApp</span>
          </span>
          <span className="text-[10px] font-semibold opacity-90 flex items-center gap-0.5 group-hover/btn:translate-x-1 transition-transform">
            Book Website ↗
          </span>
        </button>
      </div>
    </div>
  );
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, adminPhone = '923290725117' }) => {
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<ServiceItemData | null>(null);
  const serviceDetails: ServiceItemData[] = [
    {
      id: 'frontend',
      title: 'Website & Frontend Engineering',
      icon: Layout,
      description: 'Pixel-perfect, accessible, and ultra-fast custom websites & modern web apps engineered using React, Next.js, and TypeScript with state-of-the-art responsiveness.',
      deliverables: ['Custom Business & Portfolio Websites', 'React & Next.js Web Applications', 'Tailwind CSS & Smooth Animations', 'Mobile-First & 95+ Google Lighthouse'],
      stack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Motion'],
      targetNum: 1,
      startingPricePKR: '₨ 20,000+',
      startingPriceUSD: '$150+',
      estimatedTimeline: '4 – 7 Days',
    },
    {
      id: 'fullstack',
      title: 'Full-Stack Web Apps',
      icon: Layers,
      description: 'End-to-end web applications architected with robust server-side logic, secure authentication, database persistence, and clean REST/GraphQL APIs.',
      deliverables: ['Single Page Apps (SPA) & SSR', 'Role-Based Access Control (RBAC)', 'State Management (Zustand/Redux)', 'Real-time WebSocket Sync'],
      stack: ['Node.js', 'Express', 'React', 'PostgreSQL', 'Prisma'],
      targetNum: 2,
      startingPricePKR: '₨ 45,000+',
      startingPriceUSD: '$350+',
      estimatedTimeline: '2 – 4 Weeks',
    },
    {
      id: 'api',
      title: 'REST & GraphQL APIs',
      icon: Server,
      description: 'High-throughput, enterprise-grade backend APIs with clean middleware, rate limiting, data validation, and comprehensive documentation.',
      deliverables: ['Microservice & Monolith Endpoints', 'JWT & OAuth Authentication', 'Swagger / OpenAPI Specs', 'Automated Jest Unit Tests'],
      stack: ['Node.js', 'Express', 'TypeScript', 'Redis', 'Swagger'],
      targetNum: 3,
      startingPricePKR: '₨ 20,000+',
      startingPriceUSD: '$150+',
      estimatedTimeline: '4 – 10 Days',
    },
    {
      id: 'database',
      title: 'Database Architecture',
      icon: Database,
      description: 'Scalable data models, indexing, transaction safety, and caching strategies for relational (PostgreSQL) and NoSQL (MongoDB) databases.',
      deliverables: ['Schema Design & Migrations', 'Query Optimization & Indexing', 'Redis Caching Layers', 'Database Backups & Resilience'],
      stack: ['PostgreSQL', 'Supabase', 'MongoDB', 'Redis', 'Drizzle'],
      targetNum: 4,
      startingPricePKR: '₨ 20,000+',
      startingPriceUSD: '$150+',
      estimatedTimeline: '3 – 7 Days',
    },
    {
      id: 'performance',
      title: 'Speed & SEO Optimization',
      icon: Zap,
      description: 'Auditing and re-architecting web apps to consistently score 95+ on Google Lighthouse, improve Core Web Vitals, and dominate search rankings.',
      deliverables: ['Core Web Vitals Optimization', 'Server-Side Rendering & SSG', 'Image & Bundle Minification', 'Dynamic OpenGraph & Schema.org'],
      stack: ['Lighthouse', 'Next.js', 'Web Vitals', 'Vercel Analytics'],
      targetNum: 5,
      startingPricePKR: '₨ 15,000+',
      startingPriceUSD: '$100+',
      estimatedTimeline: '3 – 6 Days',
    },
    {
      id: 'responsive',
      title: 'Responsive & Mobile First',
      icon: Smartphone,
      description: 'Seamless cross-device experiences ensuring your web product renders flawlessly on everything from smartphones to ultra-wide 4K monitors.',
      deliverables: ['Fluid Multi-Breakpoint Layouts', 'Touch-Friendly UI Components', 'Progressive Web App (PWA) Support', 'Cross-Browser Testing'],
      stack: ['CSS Grid/Flexbox', 'Tailwind CSS', 'PWA Manifests'],
      targetNum: 6,
      startingPricePKR: '₨ 15,000+',
      startingPriceUSD: '$100+',
      estimatedTimeline: '3 – 5 Days',
    },
    {
      id: 'ecommerce',
      title: 'E-Commerce Platforms',
      icon: ShoppingBag,
      description: 'Headless e-commerce stores with instant search, multi-currency cart systems, dynamic checkout workflows, and Stripe payment gateways.',
      deliverables: ['Custom Storefronts & Catalogs', 'Stripe / Apple Pay / Google Pay', 'Inventory & Order Tracking', 'Conversion-Rate Optimization'],
      stack: ['Next.js', 'Stripe API', 'Zustand', 'Tailwind CSS'],
      targetNum: 7,
      startingPricePKR: '₨ 50,000+',
      startingPriceUSD: '$400+',
      estimatedTimeline: '2 – 3 Weeks',
    },
    {
      id: 'ai-integration',
      title: 'AI & Cloud Integrations',
      icon: Cpu,
      description: 'Integrating modern AI models (Gemini, OpenAI, Claude), LLM workflow automation, vector search, and cloud deployments on Vercel or AWS.',
      deliverables: ['Gemini / AI Agent Integration', 'Document & Text Embeddings', 'Automated CI/CD Deployment', 'Cloud Run & Docker Containers'],
      stack: ['Google GenAI SDK', 'Docker', 'Vercel', 'Cloud Run'],
      targetNum: 8,
      startingPricePKR: '₨ 35,000+',
      startingPriceUSD: '$280+',
      estimatedTimeline: '1 – 2 Weeks',
    },
  ];

  const titleLetters = 'My Services'.split('');

  return (
    <section id="services" className="py-20 bg-[#F8F5EE] border-b border-[#11261B]/10 relative overflow-hidden">
      
      {/* Background Ambient Orbs */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#C5A059] mb-2 px-3 py-1 rounded-full bg-white border border-[#C5A059]/30 animate-shimmer">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin-slow" />
            <span>SPECIALIZED OFFERINGS</span>
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin-slow" />
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#11261B] mb-4 select-none">
            {titleLetters.map((char, index) => (
              <span key={index} className="hover-letter-bounce cursor-pointer">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h2>
          <div className="w-16 h-1 bg-[#C5A059] mx-auto mb-4 rounded-full" />
          <p className="text-[#5C6E61] text-base sm:text-lg leading-relaxed mb-4">
            Comprehensive web engineering services tailored to bring high-performance web applications from concept to production.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#11261B] text-[#DFC285] border border-[#C5A059]/40 text-xs sm:text-sm font-bold shadow-md animate-shimmer">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>✨ Custom Website Development Starting from ₨ 20,000 (PKR) / $150</span>
          </div>
        </div>

        {/* Services Grid (8 dedicated cards with 00 -> 01/02/03/04/05/06/07/08 dynamic count-up on hover) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceDetails.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onOrder={(srv) => setSelectedServiceForOrder(srv)}
            />
          ))}
        </div>

        {/* Bottom CTA Bar with Pulse & Direct WhatsApp Order Action */}
        <div className="mt-12 p-6 rounded-2xl bg-[#11261B] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-[#C5A059]/30 animate-shimmer hover:scale-[1.01] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Want to build a custom website or application?</span>
                <span className="text-[10px] bg-[#25D366] text-white font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 fill-white" />
                  WhatsApp Direct
                </span>
              </div>
              <div className="text-xs text-[#A3B8A8]">Click any card above to place an order, or discuss directly with the developer.</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedServiceForOrder(serviceDetails[0])}
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shrink-0 shadow-lg shadow-[#25D366]/25 hover:scale-105 hover:shadow-2xl cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Order Website on WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* WhatsApp Order Modal */}
      <ServiceOrderModal
        service={selectedServiceForOrder}
        isOpen={!!selectedServiceForOrder}
        onClose={() => setSelectedServiceForOrder(null)}
        adminPhone={adminPhone}
      />
    </section>
  );
};
