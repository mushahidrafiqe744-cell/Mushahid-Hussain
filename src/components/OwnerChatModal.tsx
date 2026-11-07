import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Search,
  Trash2,
  Send,
  Lock,
  Unlock,
  User,
  Clock,
  Sparkles,
  CheckCheck,
  Check,
  Shield,
  Smartphone,
  Monitor,
  RefreshCw,
  Mail,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { ChatConversation, ChatMessage } from '../types/chat';

interface OwnerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OWNER_QUICK_PRESETS = [
  'Hi! Thanks for reaching out. What kind of website or tech stack are you looking for?',
  'I would love to collaborate! What is your estimated timeline and budget?',
  'Feel free to also message me directly on WhatsApp at 03290725117.',
  'Thanks for the details! I will review your requirements and get back to you shortly.',
];

export const OwnerChatModal: React.FC<OwnerChatModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('owner_chat_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const activeMessagesEndRef = useRef<HTMLDivElement>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);

  // Fetch all conversations from backend
  const fetchConversations = async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/chat/admin/conversations?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && data.conversations) {
        setConversations(data.conversations);
        if (!activeSessionId && data.conversations.length > 0) {
          setActiveSessionId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchConversations();
    }
  }, [isOpen, isAuthenticated, searchQuery]);

  // Connect to SSE stream for live updates
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/chat/stream?isOwner=true');

      eventSource.addEventListener('new_message', (e: any) => {
        try {
          const data = JSON.parse(e.data);
          setConversations((prev) => {
            const exists = prev.find((c) => c.id === data.sessionId);
            if (exists) {
              return prev.map((c) =>
                c.id === data.sessionId
                  ? {
                      ...c,
                      messages: [...c.messages, data.message],
                      updatedAt: new Date().toISOString(),
                      unreadByOwner: c.id === activeSessionId ? 0 : c.unreadByOwner + 1,
                    }
                  : c
              );
            } else if (data.conversation) {
              return [data.conversation, ...prev];
            }
            return prev;
          });
        } catch (err) {}
      });

      eventSource.addEventListener('conversation_deleted', (e: any) => {
        try {
          const data = JSON.parse(e.data);
          setConversations((prev) => prev.filter((c) => c.id !== data.sessionId));
          if (activeSessionId === data.sessionId) {
            setActiveSessionId(null);
          }
        } catch (err) {}
      });
    } catch (e) {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [isOpen, isAuthenticated, activeSessionId]);

  // Scroll active conversation to bottom
  const activeConversation = conversations.find((c) => c.id === activeSessionId) || null;

  useEffect(() => {
    activeMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Mark as read by owner
    if (activeSessionId && activeConversation && activeConversation.unreadByOwner > 0) {
      fetch(`/api/chat/read/${activeSessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reader: 'owner' }),
      }).catch(() => {});

      setConversations((prev) =>
        prev.map((c) => (c.id === activeSessionId ? { ...c, unreadByOwner: 0 } : c))
      );
    }
  }, [activeSessionId, activeConversation?.messages.length]);

  // Verify PIN
  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    try {
      const res = await fetch('/api/chat/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        sessionStorage.setItem('owner_chat_auth', 'true');
        setPinInput('');
      } else {
        setPinError('Incorrect PIN. Try default PIN: 7860');
      }
    } catch (err) {
      setPinError('Server error validating PIN');
    }
  };

  // Owner sends message
  const handleSendReply = async (textToSend?: string) => {
    const text = textToSend !== undefined ? textToSend : replyText;
    if (!text || !text.trim() || !activeSessionId) return;

    setIsSending(true);
    const trimmed = text.trim();

    try {
      const res = await fetch(`/api/chat/messages/${activeSessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'owner',
          senderName: 'Mushahid Hussain',
          text: trimmed,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setReplyText('');
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeSessionId
              ? {
                  ...c,
                  messages: [...c.messages, data.message],
                  updatedAt: new Date().toISOString(),
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error('Failed to send owner reply:', err);
    } finally {
      setIsSending(false);
      replyInputRef.current?.focus();
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this client conversation?')) return;

    try {
      await fetch(`/api/chat/admin/conversations/${sessionId}`, {
        method: 'DELETE',
      });
      setConversations((prev) => prev.filter((c) => c.id !== sessionId));
      if (activeSessionId === sessionId) {
        const remaining = conversations.filter((c) => c.id !== sessionId);
        setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err) {
      alert('Failed to delete conversation');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      {/* Background click */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl h-[88vh] max-h-[750px] bg-[#F8F5EE] rounded-3xl shadow-2xl border border-[#C5A059]/40 overflow-hidden z-10 flex flex-col animate-scale-up">
        
        {/* ========================================================
            HEADER
            ======================================================== */}
        <div className="p-4 sm:p-5 bg-[#11261B] text-white flex items-center justify-between border-b border-[#C5A059]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/20 flex items-center justify-center border border-[#C5A059]/40 text-[#DFC285]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-white">
                  Owner Live Chat Dashboard
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] text-[10px] font-mono font-bold uppercase tracking-wider">
                  Admin Real-Time
                </span>
              </div>
              <p className="text-xs text-[#A3B8A8]">
                Reply to clients live, manage inquiries, and track incoming messages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={fetchConversations}
                className="p-2 rounded-xl text-[#DFC285] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Refresh conversations"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#DFC285] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================
            AUTHENTICATION LOCK SCREEN IF NOT VERIFIED
            ======================================================== */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-[#FDFBF7] to-[#F5EFEB]">
            <form
              onSubmit={handleVerifyPin}
              className="w-full max-w-sm p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-[#11261B]/10 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#11261B] text-[#DFC285] flex items-center justify-center mx-auto mb-4 shadow-md">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="font-display font-bold text-lg text-[#11261B] mb-1">
                Owner Authentication
              </h4>
              <p className="text-xs text-[#5C6E61] mb-5">
                Enter your secure PIN to access live client conversations
              </p>

              <div className="space-y-3">
                <input
                  type="password"
                  autoFocus
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN (e.g. 7860)"
                  className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest bg-[#F8F5EE] border border-[#11261B]/20 rounded-xl text-[#11261B] focus:outline-hidden focus:border-[#C5A059]"
                />

                {pinError && (
                  <p className="text-xs text-red-500 font-semibold flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{pinError}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#11261B] hover:bg-[#1A3828] text-[#DFC285] font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Unlock Owner Panel
                </button>

                <p className="text-[11px] text-[#8A9B8F] mt-2">
                  Default PIN: <strong className="text-[#11261B]">7860</strong>
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* ========================================================
             TWO-COLUMN OWNER CHAT WORKSPACE
             ======================================================== */
          <div className="flex-1 flex overflow-hidden">
            
            {/* ---------------- LEFT COLUMN: CONVERSATION LIST ---------------- */}
            <div className="w-full sm:w-80 md:w-96 bg-white border-r border-[#11261B]/10 flex flex-col shrink-0">
              
              {/* Search Bar */}
              <div className="p-3 bg-[#F8F5EE] border-b border-[#11261B]/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6E61]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by client or keyword..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#11261B]/15 rounded-xl text-xs text-[#11261B] placeholder-[#5C6E61]/60 focus:outline-hidden focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#11261B]/5">
                {conversations.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#5C6E61] p-4">
                    <MessageSquare className="w-8 h-8 text-[#A3B8A8] mx-auto mb-2 opacity-50" />
                    <p className="font-semibold">No active conversations</p>
                    <p className="text-[11px] text-[#A3B8A8] mt-1">Client chats will appear here live</p>
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const isSelected = conv.id === activeSessionId;
                    const lastMsg = conv.messages[conv.messages.length - 1];

                    return (
                      <div
                        key={conv.id}
                        onClick={() => setActiveSessionId(conv.id)}
                        className={`p-3.5 transition-all cursor-pointer relative flex items-start gap-3 hover:bg-[#F8F5EE] ${
                          isSelected ? 'bg-[#F2EDE2] border-l-4 border-l-[#C5A059]' : ''
                        }`}
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-2xl bg-[#11261B] text-[#DFC285] font-bold text-sm flex items-center justify-center shadow-xs">
                            {conv.clientName.charAt(0).toUpperCase()}
                          </div>
                          {conv.clientOnline && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10B981] border-2 border-white" />
                          )}
                        </div>

                        {/* Summary */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h5 className="font-bold text-xs text-[#11261B] truncate">
                              {conv.clientName}
                            </h5>
                            <span className="text-[10px] text-[#8A9B8F] shrink-0">
                              {lastMsg?.timeFormatted || ''}
                            </span>
                          </div>

                          {conv.clientEmail && (
                            <p className="text-[10px] text-[#5C6E61] truncate flex items-center gap-1 mb-1">
                              <Mail className="w-2.5 h-2.5" />
                              <span>{conv.clientEmail}</span>
                            </p>
                          )}

                          <p className="text-xs text-[#5C6E61] truncate">
                            {lastMsg?.text || (lastMsg?.attachment ? '📎 Attachment' : 'No messages yet')}
                          </p>
                        </div>

                        {/* Unread badge & delete */}
                        <div className="flex flex-col items-end gap-1 shrink-0 ml-1">
                          {conv.unreadByOwner > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-[#EF4444] text-white text-[10px] font-bold">
                              {conv.unreadByOwner}
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConversation(conv.id);
                            }}
                            className="p-1 text-[#8A9B8F] hover:text-[#EF4444] transition-colors rounded-md"
                            title="Delete thread"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ---------------- RIGHT COLUMN: ACTIVE THREAD & REPLY ---------------- */}
            <div className="flex-1 flex flex-col bg-[#FDFBF7] overflow-hidden">
              {activeConversation ? (
                <>
                  {/* Active Header */}
                  <div className="p-3.5 bg-white border-b border-[#11261B]/10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-[#11261B] text-[#DFC285] font-bold text-xs flex items-center justify-center">
                        {activeConversation.clientName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#11261B]">
                            {activeConversation.clientName}
                          </h4>
                          {activeConversation.clientOnline ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] text-[10px] font-semibold">
                              Client Online
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-black/5 text-[#5C6E61] text-[10px]">
                              Offline
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#5C6E61] flex items-center gap-3 mt-0.5">
                          {activeConversation.clientEmail && (
                            <span>{activeConversation.clientEmail}</span>
                          )}
                          <span>•</span>
                          <span>{activeConversation.clientDevice}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteConversation(activeConversation.id)}
                      className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#FDFBF7] to-[#F5EFEB]">
                    {activeConversation.messages.map((msg) => {
                      const isOwnerMsg = msg.sender === 'owner';
                      return (
                        <div
                          key={msg.id}
                          className={`flex items-end gap-2 ${isOwnerMsg ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[78%] flex flex-col ${isOwnerMsg ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                                isOwnerMsg
                                  ? 'bg-[#11261B] text-white rounded-br-xs border border-[#C5A059]/40'
                                  : 'bg-white text-[#11261B] rounded-bl-xs border border-[#11261B]/10 shadow-xs'
                              }`}
                            >
                              {msg.attachment && msg.attachment.type === 'image' && (
                                <img
                                  src={msg.attachment.url}
                                  alt={msg.attachment.name}
                                  className="max-h-48 rounded-xl mb-2 object-cover"
                                />
                              )}
                              {msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>}
                            </div>

                            <div className="flex items-center gap-1 text-[10px] text-[#8A9B8F] mt-1 px-1">
                              <span>{msg.timeFormatted}</span>
                              {isOwnerMsg && (
                                <span>
                                  {msg.read ? (
                                    <CheckCheck className="w-3 h-3 text-[#10B981]" />
                                  ) : (
                                    <Check className="w-3 h-3 text-[#8A9B8F]" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={activeMessagesEndRef} />
                  </div>

                  {/* Quick Presets Bar */}
                  <div className="p-2 bg-white/90 border-t border-[#11261B]/10 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
                    {OWNER_QUICK_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendReply(preset)}
                        className="px-2.5 py-1 rounded-full bg-[#F8F5EE] hover:bg-[#11261B] hover:text-[#DFC285] text-[#11261B] border border-[#11261B]/10 text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 truncate max-w-xs"
                      >
                        {preset.slice(0, 36)}...
                      </button>
                    ))}
                  </div>

                  {/* Owner Reply Input */}
                  <div className="p-3 bg-white border-t border-[#11261B]/10 flex items-center gap-2">
                    <input
                      ref={replyInputRef}
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                      placeholder={`Reply as Mushahid Hussain to ${activeConversation.clientName}...`}
                      className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-[#F8F5EE] border border-[#11261B]/15 rounded-2xl text-[#11261B] focus:outline-hidden focus:border-[#C5A059] focus:bg-white transition-all"
                    />

                    <button
                      type="button"
                      disabled={isSending || !replyText.trim()}
                      onClick={() => handleSendReply()}
                      className="px-4 py-2.5 rounded-2xl bg-[#11261B] hover:bg-[#1A3828] text-[#DFC285] hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-[#5C6E61]">
                  Select a conversation from the left to start replying
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
