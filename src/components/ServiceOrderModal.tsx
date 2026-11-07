import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  CheckCircle,
  Sparkles,
  Send,
  Zap,
  Clock,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Mail,
} from 'lucide-react';
import { SaveToggle } from './SaveToggle';

export interface ServiceItemData {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  deliverables: string[];
  stack: string[];
  targetNum: number;
  startingPricePKR?: string;
  startingPriceUSD?: string;
  estimatedTimeline?: string;
}

interface ServiceOrderModalProps {
  service: ServiceItemData | null;
  isOpen: boolean;
  onClose: () => void;
  adminPhone?: string;
}

export const ServiceOrderModal: React.FC<ServiceOrderModalProps> = ({
  service,
  isOpen,
  onClose,
  adminPhone = '923290725117',
}) => {
  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [websiteType, setWebsiteType] = useState('');
  const [budgetTier, setBudgetTier] = useState('Standard (Rs. 35,000 – 65,000)');
  const [timeline, setTimeline] = useState('Standard (1 - 2 Weeks)');
  const [customNotes, setCustomNotes] = useState('');
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'email'>('whatsapp');

  // Initialize/reset form when service opens
  useEffect(() => {
    if (service) {
      setWebsiteType(`I want a high-performance website based on ${service.title}`);
      setCustomNotes(`Hi Mushahid, I am interested in getting a website developed under your "${service.title}" service. Please let me know how we can get started.`);
      setBudgetTier(currency === 'PKR' ? 'Standard (Rs. 35,000 – 65,000)' : 'Standard ($200 – $450)');
    }
  }, [service, currency]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !service) return null;

  const Icon = service.icon;
  const cleanAdminPhone = adminPhone.replace(/\D/g, '').replace(/^0+/, '92');

  const pkrBudgetOptions = [
    { label: 'Starter (Rs. 15,000 – 30,000)', desc: 'Fast turnaround, landing page / single page' },
    { label: 'Standard (Rs. 35,000 – 65,000)', desc: 'Multi-page, dynamic features, full styling' },
    { label: 'Premium (Rs. 70,000 – 140,000+)', desc: 'Full-stack, custom backend, DB & integrations' },
    { label: 'Custom Discussion (Rs. Discuss)', desc: 'Discuss custom scope & tailored quotation' },
  ];

  const usdBudgetOptions = [
    { label: 'Starter ($100 – $200)', desc: 'Fast turnaround, landing page / single page' },
    { label: 'Standard ($200 – $450)', desc: 'Multi-page, dynamic features, full styling' },
    { label: 'Premium ($450 – $900+)', desc: 'Full-stack, custom backend, DB & integrations' },
    { label: 'Custom Discussion ($ Discuss)', desc: 'Discuss custom scope & pricing' },
  ];

  const activeBudgetOptions = currency === 'PKR' ? pkrBudgetOptions : usdBudgetOptions;

  const timelineOptions = [
    { label: '⚡ Urgent (2 - 4 Days)', value: 'Urgent (2 - 4 Days)' },
    { label: '⏱️ Standard (1 - 2 Weeks)', value: 'Standard (1 - 2 Weeks)' },
    { label: '🎯 Flexible', value: 'Flexible' },
  ];

  const generateMessage = () => {
    const namePart = clientName.trim() ? clientName.trim() : 'Prospective Client';
    const contactPart = clientPhone.trim() ? clientPhone.trim() : 'Contact via this chat';

    return `🚀 NEW WEBSITE / SERVICE ORDER
━━━━━━━━━━━━━━━━━━━━
📌 Selected Service: ${service.title}
👤 Client Name: ${namePart}
📱 Client Contact: ${contactPart}
💼 Budget Tier: ${budgetTier}
⏱️ Timeline: ${timeline}

📝 Project Requirement:
${customNotes || websiteType}

✨ Included Deliverables:
${service.deliverables.slice(0, 3).map((d) => `• ${d}`).join('\n')}
━━━━━━━━━━━━━━━━━━━━
_Order submitted via Developer Portfolio_`;
  };

  const validateForm = (): boolean => {
    if (!clientName.trim()) {
      return false;
    }
    return true;
  };

  const handleSendOrder = () => {
    const message = generateMessage();
    
    if (contactMethod === 'whatsapp') {
      const encoded = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${cleanAdminPhone}?text=${encoded}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } else {
      const subject = encodeURIComponent(`New Project Inquiry: ${service.title}`);
      const body = encodeURIComponent(message);
      window.location.href = `mailto:mushahidrafiqe744@gmail.com?subject=${subject}&body=${body}`;
    }
  };

  const handleQuickChat = () => {
    const quickMsg = encodeURIComponent(
      `Hello Mushahid! I want to order a website for "${service.title}". Please share details and pricing.`
    );
    window.open(`https://wa.me/${cleanAdminPhone}?text=${quickMsg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-[#11261B]/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#F8F5EE] rounded-3xl shadow-2xl border border-[#C5A059]/40 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with WhatsApp Branding & Admin Badge */}
        <div className="bg-[#11261B] text-white p-5 sm:p-6 border-b border-[#C5A059]/30 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059] text-[#11261B] flex items-center justify-center shadow-lg shadow-[#C5A059]/30 shrink-0">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C5A059]" />
                    Direct Order
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Open for orders
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
                  Send Your Order
                </h3>
                <p className="text-xs text-[#A3B8A8] mt-0.5">
                  Fill in your requirements and choose how you want to send it.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Selected Service Snippet Banner */}
          <div className="mt-4 p-3.5 rounded-xl bg-white/5 border border-[#C5A059]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#C5A059] text-[#11261B] flex items-center justify-center shrink-0 font-bold">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-[#DFC285] font-semibold">
                  Selected Service #{String(service.targetNum).padStart(2, '0')}
                </div>
                <div className="text-sm font-bold text-white truncate">{service.title}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {service.startingPricePKR && (
                <div className="px-2.5 py-1 rounded-lg bg-[#C5A059] text-[#11261B] text-xs font-bold font-mono">
                  {currency === 'PKR' ? service.startingPricePKR : (service.startingPriceUSD || '$150+')}
                </div>
              )}
              {service.estimatedTimeline && (
                <div className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-medium border border-white/15 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#DFC285]" />
                  <span>{service.estimatedTimeline}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Form Content */}
        <div className="p-5 sm:p-7 max-h-[72vh] overflow-y-auto space-y-5">
          {/* Deliverables summary */}
          <div className="bg-[#F2EDE2] p-3.5 rounded-xl border border-[#11261B]/10">
            <div className="text-xs font-bold text-[#11261B] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>What's Included in this Service:</span>
              <span className="text-[11px] font-normal text-[#5C6E61]">Guaranteed Standards</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {service.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#11261B]/85">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Client Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#11261B] mb-1.5">
                Aapka Naam / Client Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Ali Khan / John"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#11261B]/15 text-[#11261B] text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all placeholder:text-[#11261B]/35 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#11261B] mb-1.5">
                Aapka WhatsApp / Contact <span className="text-[#5C6E61] font-normal text-[11px]">(Optional)</span>
              </label>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="e.g. 0300 1234567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#11261B]/15 text-[#11261B] text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all placeholder:text-[#11261B]/35 shadow-xs"
              />
            </div>
          </div>

          {/* Budget Tier Selector with Rs. (PKR) by default */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#11261B]">
                Estimated Budget / Package:
              </label>
              
              {/* Currency Selector (Rs PKR by default) */}
              <div className="inline-flex items-center p-0.5 rounded-lg bg-[#11261B]/10 text-xs border border-[#11261B]/15">
                <button
                  type="button"
                  onClick={() => {
                    setCurrency('PKR');
                    setBudgetTier('Standard (Rs. 35,000 – 65,000)');
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    currency === 'PKR'
                      ? 'bg-[#11261B] text-[#DFC285] shadow-xs'
                      : 'text-[#11261B]/70 hover:text-[#11261B]'
                  }`}
                >
                  🇵🇰 Rs (PKR)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrency('USD');
                    setBudgetTier('Standard ($200 – $450)');
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    currency === 'USD'
                      ? 'bg-[#11261B] text-[#DFC285] shadow-xs'
                      : 'text-[#11261B]/70 hover:text-[#11261B]'
                  }`}
                >
                  🌐 $ (USD)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeBudgetOptions.map((opt) => {
                const isSelected = budgetTier === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setBudgetTier(opt.label)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#11261B] text-white border-[#C5A059] shadow-md ring-2 ring-[#C5A059]/20'
                        : 'bg-white text-[#11261B] border-[#11261B]/10 hover:border-[#C5A059]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={isSelected ? 'text-[#DFC285]' : 'text-[#11261B]'}>
                        {opt.label}
                      </span>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-[#C5A059]" />}
                    </div>
                    <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-[#A3B8A8]' : 'text-[#5C6E61]'}`}>
                      {opt.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeline Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#11261B] mb-2">
              Required Timeline:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timelineOptions.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTimeline(t.value)}
                  className={`py-2 px-2 text-center rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    timeline === t.value
                      ? 'bg-[#11261B] text-[#DFC285] border-[#C5A059]'
                      : 'bg-white text-[#11261B] border-[#11261B]/10 hover:border-[#C5A059]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#11261B] mb-2">
              Send Order Via:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setContactMethod('whatsapp')}
                className={`py-3 px-4 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  contactMethod === 'whatsapp'
                    ? 'bg-[#25D366] text-white border-[#25D366]'
                    : 'bg-white text-[#11261B] border-[#11261B]/10 hover:border-[#25D366]'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setContactMethod('email')}
                className={`py-3 px-4 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  contactMethod === 'email'
                    ? 'bg-[#C5A059] text-[#11261B] border-[#C5A059]'
                    : 'bg-white text-[#11261B] border-[#11261B]/10 hover:border-[#C5A059]'
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#11261B] mb-1.5 flex items-center justify-between">
              <span>Project Requirements / Details:</span>
              <span className="text-[11px] text-[#5C6E61] font-normal">What kind of website do you need?</span>
            </label>
            <textarea
              rows={3}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Tell us about the website (e.g. pages needed, features, branding, examples)..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#11261B]/15 text-[#11261B] text-sm focus:outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all placeholder:text-[#11261B]/35 shadow-xs"
            />
          </div>

          {/* Buttons: Submit & Quick Action */}
          <div className="pt-2 space-y-2.5">
            <SaveToggle
              idleText={`Send Order via ${contactMethod === 'whatsapp' ? 'WhatsApp' : 'Email'}`}
              savedText="Opening Application..."
              loadingDuration={1400}
              onValidate={validateForm}
              onClick={handleSendOrder}
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleQuickChat}
                className="text-xs text-[#11261B] hover:text-[#C5A059] font-medium flex items-center gap-1.5 underline decoration-[#C5A059]/50 cursor-pointer"
              >
                <span>Or direct 1-click WhatsApp message (skip form)</span>
                <ExternalLink className="w-3 h-3 text-[#C5A059]" />
              </button>

              <span className="text-[11px] text-[#5C6E61] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Admin: +92 329 0725117
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
