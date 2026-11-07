import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cms';
import { Trash2, MessageSquare, Mail, Phone, CheckCircle, Clock, Search, Filter, RefreshCw } from 'lucide-react';

export const ManageMessages: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await cmsService.fetchData('messages');
      setMessages(data || []);
    } catch (e) {
      console.warn('Failed to load messages', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (msg: any) => {
    const newStatus = msg.status === 'read' ? 'unread' : 'read';
    await cmsService.updateData('messages', msg.id, { status: newStatus });
    loadMessages();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact message?')) {
      await cmsService.deleteData('messages', id);
      loadMessages();
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      (msg.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.projectType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.message || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'unread' && msg.status !== 'read') ||
      (statusFilter === 'read' && msg.status === 'read');

    return matchesSearch && matchesStatus;
  });

  const unreadCount = messages.filter((m) => m.status !== 'read').length;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#C5A059]" />
            <span>Contact Messages & Inquiries</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Real-time messages sent from your portfolio contact form (Stored in Supabase)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
            {unreadCount} Unread
          </span>
          <button
            onClick={loadMessages}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
            title="Refresh Messages"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, project type or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all"
          />
        </div>

        <div className="sm:col-span-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="w-full py-2.5 px-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059] focus:bg-white font-medium"
          >
            <option value="all">All Messages ({messages.length})</option>
            <option value="unread">Unread Only ({unreadCount})</option>
            <option value="read">Read Only ({messages.length - unreadCount})</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="py-12 text-center text-gray-400 text-sm">
          Loading messages from Supabase...
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="py-12 text-center text-gray-400 space-y-2 border-2 border-dashed border-gray-100 rounded-2xl">
          <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="font-semibold text-gray-600 text-sm">No messages found</p>
          <p className="text-xs text-gray-400">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter'
              : 'Contact form submissions will appear here'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMessages.map((msg: any) => {
            const isUnread = msg.status !== 'read';
            const formattedDate = msg.createdAt
              ? new Date(msg.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent';

            return (
              <div
                key={msg.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isUnread
                    ? 'bg-amber-50/40 border-amber-200/80 shadow-xs ring-1 ring-amber-400/20'
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    {/* Header line with Name, Status, Date */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{msg.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isUnread
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {isUnread ? 'Unread' : 'Read'}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {formattedDate}
                      </span>
                    </div>

                    {/* Email & Details Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {msg.email}
                      </a>

                      {msg.projectType && (
                        <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800 text-[11px] font-medium border border-gray-200">
                          🛠️ {msg.projectType}
                        </span>
                      )}

                      {msg.budget && (
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold font-mono border border-emerald-200">
                          💰 {msg.budget}
                        </span>
                      )}

                      {msg.country && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-medium">
                          🌍 {msg.country} ({msg.currency || ''})
                        </span>
                      )}
                    </div>

                    {/* Message Body */}
                    <div className="mt-3 p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">
                      {msg.message}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleStatus(msg)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                        isUnread
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{isUnread ? 'Mark Read' : 'Mark Unread'}</span>
                    </button>

                    <a
                      href={`mailto:${msg.email}?subject=Re: Project Inquiry (${msg.projectType || 'Portfolio'})&body=Hi ${msg.name},%0D%0A%0D%0AThank you for reaching out!`}
                      className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply Email</span>
                    </a>

                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

