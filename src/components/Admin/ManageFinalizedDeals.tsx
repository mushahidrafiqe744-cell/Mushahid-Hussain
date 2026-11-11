'use client';

import React, { useState, useEffect } from 'react';
import {
  Handshake,
  Mail,
  Phone,
  Search,
  Trash2,
  CheckCircle2,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { cmsService } from '../../services/cms';

export interface FinalizedDeal {
  id: string;
  clientName: string;
  clientEmail: string;
  whatsapp?: string;
  projectType: string;
  requirements: string;
  estimatedBudget: string;
  projectTimeline: string;
  chatSummary: string;
  dealStatus: 'FINALIZED' | 'PENDING' | 'CONTACTED';
  createdAt: string;
}

export const ManageFinalizedDeals: React.FC = () => {
  const [deals, setDeals] = useState<FinalizedDeal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDealModal, setSelectedDealModal] = useState<FinalizedDeal | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadDeals = async () => {
    setLoading(true);
    try {
      const data = await cmsService.fetchData('finalized_deals');
      setDeals(data || []);
    } catch (err) {
      console.error('Failed to load finalized deals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();

    const handleUpdate = () => {
      loadDeals();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('cms_data_updated', handleUpdate);
      return () => window.removeEventListener('cms_data_updated', handleUpdate);
    }
  }, []);

  const handleDeleteDeal = async (id: string) => {
    try {
      await cmsService.deleteData('finalized_deals', id);
      setDeals((prev) => prev.filter((d) => d.id !== id));
      if (selectedDealModal?.id === id) {
        setSelectedDealModal(null);
      }
    } catch (err) {
      console.error('Failed to delete deal:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDeals = deals.filter((deal) => {
    const q = searchQuery.toLowerCase();
    return (
      deal.clientName.toLowerCase().includes(q) ||
      deal.clientEmail.toLowerCase().includes(q) ||
      deal.projectType.toLowerCase().includes(q) ||
      deal.requirements.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Finalized Deals
            </h1>
            <span className="px-3 py-1 rounded-full bg-[#EAF9EE] text-[#0A3D22] text-xs font-bold border border-[#50E364]/40 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              Auto-Notification Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Website client deals finalized via AI Chatbot with instant email dispatch to <strong className="text-gray-800">mushahidrafiqe744@gmail.com</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={loadDeals}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Deals</span>
        </button>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0A3D22] to-[#14532D] text-white shadow-md relative overflow-hidden">
          <div className="absolute top-3 right-3 p-3 rounded-2xl bg-white/10">
            <Handshake className="w-6 h-6 text-[#50E364]" />
          </div>
          <p className="text-xs font-semibold text-[#DFC285] uppercase tracking-wider">Total Finalized Deals</p>
          <h3 className="text-3xl font-black mt-2 text-white">{deals.length}</h3>
          <p className="text-[11px] text-emerald-200 mt-1">High-converting portfolio leads</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-xs relative overflow-hidden">
          <div className="absolute top-3 right-3 p-3 rounded-2xl bg-amber-50 text-amber-600">
            <Mail className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Email Status</p>
          <h3 className="text-sm font-bold text-gray-900 mt-2 truncate">mushahidrafiqe744@gmail.com</h3>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
            🟢 Real-Time Delivery Active
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-xs relative overflow-hidden">
          <div className="absolute top-3 right-3 p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Conversion Guard</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">100% Verified</h3>
          <p className="text-[11px] text-gray-500 mt-1">Zero Duplicate Dispatch Protection</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search finalized deals by client name, email, or project type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#0A3D22] shadow-2xs"
        />
      </div>

      {/* DEALS LIST */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-100">
          <div className="w-8 h-8 border-4 border-[#0A3D22] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500 font-semibold">Loading finalized deals...</p>
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0A3D22] flex items-center justify-center mx-auto">
            <Handshake className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-800">No Finalized Deals Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery
              ? 'No deals match your search criteria.'
              : 'When website clients confirm project scope with the portfolio AI chatbot, their deals will automatically appear here and notify your email.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white p-5 rounded-3xl border border-gray-150 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0A3D22] text-[#50E364] font-bold text-base flex items-center justify-center shadow-xs">
                    {deal.clientName ? deal.clientName.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">
                      {deal.clientName || 'Visitor Client'}
                    </h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span>{deal.clientEmail || 'No email specified'}</span>
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-wider uppercase border border-emerald-200 shrink-0">
                  FINALIZED
                </span>
              </div>

              {/* Deal Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Project Type</span>
                  <span className="font-semibold text-gray-800 truncate block mt-0.5">{deal.projectType}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Estimated Budget</span>
                  <span className="font-bold text-[#10B981] truncate block mt-0.5">{deal.estimatedBudget || 'Quote Agreed'}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-gray-200/60 mt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Timeline</span>
                  <span className="font-semibold text-gray-700 block mt-0.5">{deal.projectTimeline || 'Standard Timeline'}</span>
                </div>
              </div>

              {/* Requirements preview */}
              <div className="text-xs text-gray-600 space-y-1">
                <span className="font-bold text-gray-800 text-[11px] block">Requirements Summary:</span>
                <p className="line-clamp-2 text-gray-600 bg-white p-2 rounded-xl border border-gray-100 text-[11px]">
                  {deal.requirements || deal.chatSummary}
                </p>
              </div>

              {/* Actions & Timestamp */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(deal.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDealModal(deal)}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    View Chat Summary
                  </button>

                  {deal.clientEmail && (
                    <a
                      href={`mailto:${deal.clientEmail}?subject=Regarding Your Website Deal - Mushahid Hussain`}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0A3D22] transition-colors"
                      title="Email Client"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setDeletingId(deal.id)}
                    className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Deal Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CHAT SUMMARY MODAL */}
      {selectedDealModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span>Deal Summary:</span>
                  <span className="text-[#0A3D22]">{selectedDealModal.clientName}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{selectedDealModal.projectType} • {selectedDealModal.estimatedBudget}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDealModal(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 space-y-1">
                <p><strong>Client Email:</strong> {selectedDealModal.clientEmail || 'N/A'}</p>
                <p><strong>WhatsApp:</strong> {selectedDealModal.whatsapp || 'N/A'}</p>
                <p><strong>Timeline:</strong> {selectedDealModal.projectTimeline}</p>
                <p><strong>Status:</strong> <span className="font-bold text-emerald-700">FINALIZED</span></p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 text-xs mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#0A3D22]" />
                  <span>Conversation Transcript:</span>
                </h4>
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 font-mono text-[11px] text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedDealModal.chatSummary || 'Client finalized deal during AI conversation.'}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setSelectedDealModal(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Delete Finalized Deal?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to remove this deal record? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteDeal(deletingId)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
