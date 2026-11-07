import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  User,
  Mail,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { SaveToggle } from './SaveToggle';
import { cmsService } from '../services/cms';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.feedback.trim()) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      await cmsService.insertData('testimonials', {
        name: formData.name,
        email: formData.email,
        review: formData.feedback,
        rating: rating,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        verified: false,
        platform: 'client'
      });
      setIsSubmitted(true);
      
      // Auto close after success message
      setTimeout(() => {
        onClose();
        // Reset after animation
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '', feedback: '' });
          setRating(5);
        }, 500);
      }, 3000);
    } catch (error) {
      console.error('Feedback submission error:', error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#11261B]/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#F8F5EE] rounded-3xl shadow-2xl border border-[#C5A059]/40 overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#11261B] text-white p-5 border-b border-[#C5A059]/30 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059] text-[#11261B] flex items-center justify-center shadow-lg shrink-0">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">Client Feedback</h3>
                <p className="text-[10px] text-[#DFC285] uppercase tracking-widest font-bold">Share Your Experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {!isSubmitted ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#11261B] flex items-center gap-1.5">
                    <User className="w-3 h-3 text-[#C5A059]" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abdullah Khan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#11261B]/10 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all outline-none text-sm shadow-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#11261B] flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-[#C5A059]" />
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#11261B]/10 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all outline-none text-sm shadow-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#11261B]">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star
                            ? 'fill-[#C5A059] text-[#C5A059]'
                            : 'text-[#11261B]/10'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-bold text-[#11261B]">
                    {rating}.0
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#11261B] flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3 text-[#C5A059]" />
                  Feedback Message
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about your experience..."
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#11261B]/10 focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 transition-all outline-none text-sm shadow-xs resize-none"
                />
              </div>

              <div className="pt-2">
                <SaveToggle
                  idleText="Submit My Feedback"
                  savedText="Recording Review..."
                  onValidate={validateForm}
                  onClick={handleSubmit}
                  loadingDuration={1500}
                />
              </div>
              
              <p className="text-[9px] text-[#5C6E61] text-center italic">
                * Your feedback helps me improve and may be featured in the testimonials.
              </p>
            </div>
          ) : (
            <div className="text-center py-8 animate-scale-up">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#11261B] text-[#DFC285] text-[10px] font-mono mb-3">
                <ShieldCheck className="w-3 h-3 text-[#50E364]" />
                <span>Recorded Securely</span>
              </div>
              <h3 className="text-xl font-bold text-[#11261B] mb-2">Review Submitted!</h3>
              <p className="text-xs text-[#5C6E61]">
                Thank you for your feedback! It means a lot to me.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
