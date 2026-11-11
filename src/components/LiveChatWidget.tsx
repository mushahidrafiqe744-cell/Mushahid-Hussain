import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Paperclip,
  Smile,
  Volume2,
  VolumeX,
  CheckCheck,
  Check,
  User,
  Lock,
} from 'lucide-react';
import { DeveloperProfile } from '../types/portfolio';
import { ChatMessage } from '../types/chat';
import { chatSound } from '../services/chatSound';
import { cmsService } from '../services/cms';

interface LiveChatWidgetProps {
  profile: DeveloperProfile;
  onOpenOwnerPanel: () => void;
}

const QUICK_ACTIONS = [
  'I need a website',
  'I want to see your portfolio',
  'I have a question',
  'I want to hire you',
];

const POPULAR_EMOJIS = ['👋', '💻', '🚀', '🔥', '⚡', '💼', '👍', '✨', '🎯', '📱', '🙌', '🤝'];

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome_1',
  sender: 'owner',
  senderName: 'Mushahid Hussain AI',
  text: "👋 Hi there! Welcome to Mushahid Hussain's portfolio. How can I help you today? Ask me about web development services, past projects, pricing, or request a custom quote!",
  timestamp: new Date().toISOString(),
  timeFormatted: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  read: true,
};

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  profile,
  onOpenOwnerPanel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [showIdentityForm, setShowIdentityForm] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('portfolio_chat_messages');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [pendingAttachment, setPendingAttachment] = useState<{
    name: string;
    url: string;
    type: 'image' | 'file';
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dealFinalizedRef = useRef<boolean>(false);

  // Load stored preferences & sound mute state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedName = localStorage.getItem('portfolio_chat_client_name') || '';
      const savedEmail = localStorage.getItem('portfolio_chat_client_email') || '';
      setClientName(savedName);
      setClientEmail(savedEmail);

      setIsMuted(chatSound.getMuted());
    } catch (e) {}
  }, []);

  // Save messages to sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem('portfolio_chat_messages', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // Auto-scroll to bottom whenever messages update or AI typing changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiTyping, isOpen]);

  // Open Chat Widget
  const handleOpenWidget = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  const handleCloseWidget = () => {
    setIsOpen(false);
    setShowEmojiPicker(false);
  };

  // Handle Send Message & Call Gemini AI API
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend !== undefined ? textToSend : inputValue;
    if ((!text || !text.trim()) && !pendingAttachment) return;

    const trimmed = (text || '').trim();

    const clientMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sender: 'client',
      senderName: clientName.trim() || 'Visitor',
      text: trimmed,
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: true,
      attachment: pendingAttachment || undefined,
    };

    // Update conversation with user message
    const updatedMessages = [...messages, clientMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setPendingAttachment(null);
    setShowEmojiPicker(false);
    setIsSending(true);
    setIsAiTyping(true);

    try {
      // Format messages history for server-side Gemini API
      const apiHistory = updatedMessages.map((m) => ({
        sender: m.sender === 'client' ? 'client' : 'owner',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          messages: apiHistory,
          clientInfo: {
            name: clientName,
            email: clientEmail,
          },
        }),
      });

      const data = await res.json();
      const aiReplyText =
        data.text ||
        data.reply ||
        "Thank you for your message! Feel free to reach out directly to Mushahid on WhatsApp (+92 329 0725117) or email (mushahidrafiqe744@gmail.com).";

      if (data.dealFinalized && !dealFinalizedRef.current) {
        dealFinalizedRef.current = true;
        const dealPayload = {
          clientName: clientName.trim() || 'Visitor',
          clientEmail: clientEmail.trim() || '',
          whatsapp: '',
          projectType: data.dealMetadata?.projectType || 'Custom Website Development',
          requirements: data.dealMetadata?.requirements || trimmed,
          estimatedBudget: data.dealMetadata?.estimatedBudget || 'Quote agreed in chat',
          projectTimeline: data.dealMetadata?.projectTimeline || 'As agreed',
          chatSummary: updatedMessages.map((m) => `${m.sender === 'client' ? 'Client' : 'AI'}: ${m.text}`).join('\n'),
          dealStatus: 'FINALIZED',
        };
        cmsService.insertData('finalized_deals', dealPayload).catch((err) => console.warn('CMS Deal Insert Warn:', err));
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        sender: 'owner',
        senderName: 'Mushahid Hussain AI',
        text: aiReplyText,
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        read: true,
      };

      setMessages((prev) => [...prev, aiMsg]);
      chatSound.playNotification();

      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }
    } catch (err) {
      console.error('Gemini AI Chat Error:', err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'owner',
        senderName: 'Mushahid Hussain AI',
        text: "I'm having a brief connection issue. Please feel free to message Mushahid directly on WhatsApp (+92 329 0725117) or email mushahidrafiqe744@gmail.com!",
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        read: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
      setIsAiTyping(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Attachment upload (Image or file)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const isImg = file.type.startsWith('image/');
      setPendingAttachment({
        name: file.name,
        url: reader.result as string,
        type: isImg ? 'image' : 'file',
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Toggle Sound Mute
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    chatSound.setMuted(next);
  };

  // Save Name & Email
  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('portfolio_chat_client_name', clientName.trim());
    localStorage.setItem('portfolio_chat_client_email', clientEmail.trim());
    setShowIdentityForm(false);
  };

  return (
    <>
      {/* ========================================================
          1. FLOATING CIRCULAR CHAT BUTTON (Bottom-Right Corner)
          ======================================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
        
        {/* Floating Notification Alert if chat is closed and unread > 0 */}
        {!isOpen && unreadCount > 0 && (
          <div
            onClick={handleOpenWidget}
            className="mb-2 max-w-[290px] p-3 rounded-2xl bg-[#11261B] text-white shadow-2xl border-2 border-[#10B981] cursor-pointer hover:scale-105 transition-all duration-300 animate-bounce flex items-center gap-3 backdrop-blur-md"
            role="alert"
          >
            <div className="relative shrink-0">
              <img
                src={profile.avatarUrl}
                alt="Mushahid Hussain"
                className="w-10 h-10 rounded-xl object-cover object-top border border-[#C5A059]"
              />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#10B981] border-2 border-[#11261B] animate-ping" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#DFC285]">
                <span>Mushahid Hussain</span>
                <span className="text-[10px] text-[#A3B8A8]">New response</span>
              </div>
              <p className="text-xs text-white/95 truncate mt-0.5 font-medium">
                {messages[messages.length - 1]?.text || '👋 How can I help you today?'}
              </p>
            </div>
          </div>
        )}

        {/* Floating "Online" Tooltip hint if chat is closed and idle */}
        {!isOpen && unreadCount === 0 && (
          <div
            onClick={handleOpenWidget}
            className="hidden sm:flex items-center gap-2 mb-2 px-3 py-1.5 rounded-full bg-white/95 text-[#11261B] text-xs font-semibold shadow-lg border border-[#C5A059]/40 cursor-pointer hover:scale-105 transition-all duration-300 animate-bounce"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span>Chat with AI Assistant</span>
          </div>
        )}

        {/* Circular Floating Chat Button */}
        <button
          onClick={isOpen ? handleCloseWidget : handleOpenWidget}
          aria-label={isOpen ? 'Close Live Chat' : 'Open Live Chat'}
          className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#0D1F16] via-[#11261B] to-[#1E4D2B] text-white flex items-center justify-center shadow-2xl hover:shadow-[0_10px_35px_-5px_rgba(16,185,129,0.5)] border-2 border-[#C5A059]/50 transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer"
        >
          {/* Animated Ring Ripple */}
          <div className="absolute -inset-1 rounded-full bg-[#10B981]/25 blur-sm opacity-75 group-hover:opacity-100 animate-pulse pointer-events-none" />

          {/* Unread Badge */}
          {unreadCount > 0 && !isOpen && (
            <div className="absolute -top-1 -right-1 z-10 w-6 h-6 rounded-full bg-[#EF4444] text-white text-[11px] font-black flex items-center justify-center shadow-md animate-pulse border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}

          {/* Icon Switcher */}
          {isOpen ? (
            <X className="w-6 h-6 text-[#DFC285] transition-transform duration-300 rotate-0 group-hover:rotate-90" />
          ) : (
            <div className="relative">
              <MessageCircle className="w-7 h-7 text-[#DFC285] group-hover:scale-110 transition-transform duration-300" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10B981] border-2 border-[#11261B]" />
            </div>
          )}
        </button>
      </div>

      {/* ========================================================
          2. CHAT WINDOW / MODAL
          ======================================================== */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[400px] h-[580px] max-h-[82vh] bg-[#F8F5EE] rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.45)] border border-[#C5A059]/40 flex flex-col overflow-hidden backdrop-blur-xl animate-scale-up">
          
          {/* ---------------- CHAT HEADER ---------------- */}
          <div className="p-4 bg-gradient-to-r from-[#0C1F15] via-[#11261B] to-[#1A3828] text-white flex items-center justify-between border-b border-[#C5A059]/30 relative z-10 shadow-sm">
            
            <div className="flex items-center gap-3">
              {/* Profile Avatar */}
              <div className="relative">
                <img
                  src={profile.avatarUrl}
                  alt="Mushahid Hussain"
                  className="w-11 h-11 rounded-2xl object-cover object-top border-2 border-[#C5A059] shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-[#11261B] shadow-xs animate-pulse" />
              </div>

              {/* Name & Role */}
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-sm sm:text-base text-white tracking-wide">
                    Mushahid Hussain
                  </h3>
                  <Sparkles className="w-3.5 h-3.5 text-[#DFC285]" />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#A3B8A8]">
                  <span className="font-semibold text-[#DFC285]">AI Developer Assistant</span>
                  <span>•</span>
                  <span className="text-[#34D399] flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 text-[#DFC285]">
              {/* Audio Sound Toggle */}
              <button
                onClick={toggleSound}
                className="p-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute sound' : 'Mute sound'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-white/50" /> : <Volume2 className="w-4 h-4 text-[#DFC285]" />}
              </button>

              {/* User Info Edit */}
              <button
                onClick={() => setShowIdentityForm((prev) => !prev)}
                className="p-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Your Contact Info"
              >
                <User className="w-4 h-4 text-[#DFC285]" />
              </button>

              {/* Admin Portal Access */}
              <button
                onClick={onOpenOwnerPanel}
                className="p-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Admin Dashboard"
              >
                <Lock className="w-4 h-4 text-[#DFC285]" />
              </button>

              {/* Close Window */}
              <button
                onClick={handleCloseWidget}
                className="p-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors cursor-pointer ml-1"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ---------------- CLIENT IDENTITY FORM ---------------- */}
          {showIdentityForm && (
            <form
              onSubmit={handleSaveIdentity}
              className="p-3.5 bg-white border-b border-[#11261B]/10 flex flex-col gap-2 text-xs animate-fade-in shadow-xs"
            >
              <div className="flex items-center justify-between text-[#11261B] font-bold text-[11px] uppercase tracking-wider">
                <span>Your Information (Optional)</span>
                <span className="text-[10px] text-[#5C6E61]">Helps us stay connected</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="px-2.5 py-1.5 bg-[#F8F5EE] border border-[#11261B]/15 rounded-lg text-xs text-[#11261B] focus:outline-hidden focus:border-[#C5A059]"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="px-2.5 py-1.5 bg-[#F8F5EE] border border-[#11261B]/15 rounded-lg text-xs text-[#11261B] focus:outline-hidden focus:border-[#C5A059]"
                />
              </div>
              <button
                type="submit"
                className="py-1 px-3 rounded-lg bg-[#11261B] text-[#DFC285] font-bold hover:bg-[#1A3828] text-center cursor-pointer transition-colors"
              >
                Save Info
              </button>
            </form>
          )}

          {/* ---------------- MESSAGE HISTORY AREA ---------------- */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#FDFBF7] to-[#F5EFEB]">
            
            <div className="text-center my-1">
              <span className="px-3 py-1 rounded-full bg-black/5 text-[#5C6E61] text-[10px] font-semibold tracking-wider uppercase">
                Direct Client-to-Developer Chat
              </span>
            </div>

            {/* Messages List */}
            {messages.map((msg) => {
              const isMe = msg.sender === 'client';
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img
                      src={profile.avatarUrl}
                      alt="Mushahid"
                      className="w-7 h-7 rounded-xl object-cover object-top border border-[#C5A059] shrink-0 mb-1"
                    />
                  )}

                  <div className={`max-w-[82%] sm:max-w-[78%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-sm transition-all duration-200 ${
                        isMe
                          ? 'bg-[#11261B] text-white rounded-br-xs border border-[#C5A059]/40'
                          : 'bg-white text-[#11261B] rounded-bl-xs border border-[#11261B]/10 shadow-xs'
                      }`}
                    >
                      {msg.attachment && msg.attachment.type === 'image' && (
                        <div className="mb-2 rounded-xl overflow-hidden border border-black/10 cursor-pointer">
                          <img
                            src={msg.attachment.url}
                            alt={msg.attachment.name}
                            onClick={() => setSelectedImageModal(msg.attachment!.url)}
                            className="max-h-48 w-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}

                      {msg.attachment && msg.attachment.type === 'file' && (
                        <a
                          href={msg.attachment.url}
                          download={msg.attachment.name}
                          className="flex items-center gap-2 p-2 mb-2 rounded-lg bg-black/5 hover:bg-black/10 text-xs font-mono underline"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                          <span className="truncate">{msg.attachment.name}</span>
                        </a>
                      )}

                      {msg.text && (
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-[#8A9B8F] mt-1 px-1">
                      <span>{msg.timeFormatted}</span>
                      {isMe && (
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

            {/* AI Generating Response Typing Indicator */}
            {isAiTyping && (
              <div className="flex items-end gap-2 justify-start animate-fade-in">
                <img
                  src={profile.avatarUrl}
                  alt="Mushahid"
                  className="w-7 h-7 rounded-xl object-cover object-top border border-[#C5A059] shrink-0"
                />
                <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-xs bg-white border border-[#11261B]/10 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[11px] text-[#5C6E61] ml-1 font-semibold">Generating AI response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ---------------- QUICK SUGGESTIONS BAR ---------------- */}
          {messages.length <= 3 && (
            <div className="p-2.5 bg-white/90 border-t border-[#11261B]/10 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  type="button"
                  disabled={isSending}
                  onClick={() => handleSendMessage(action)}
                  className="px-3 py-1.5 rounded-full bg-[#F8F5EE] hover:bg-[#11261B] hover:text-[#DFC285] text-[#11261B] border border-[#11261B]/15 text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 shadow-2xs hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* ---------------- EMOJI PICKER POPUP ---------------- */}
          {showEmojiPicker && (
            <div className="p-2.5 bg-white border-t border-[#11261B]/10 grid grid-cols-6 gap-2 text-xl select-none animate-fade-in shadow-inner">
              {POPULAR_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setInputValue((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                    inputRef.current?.focus();
                  }}
                  className="p-1 rounded-lg hover:bg-[#F8F5EE] transition-colors cursor-pointer text-center"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* ---------------- ATTACHMENT PREVIEW ---------------- */}
          {pendingAttachment && (
            <div className="px-3 py-1.5 bg-[#DFC285]/20 border-t border-[#C5A059]/40 flex items-center justify-between text-xs text-[#11261B]">
              <div className="flex items-center gap-2 truncate">
                <Paperclip className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span className="font-semibold truncate">{pendingAttachment.name}</span>
              </div>
              <button
                onClick={() => setPendingAttachment(null)}
                className="text-[#EF4444] hover:text-red-700 font-bold p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ---------------- MESSAGE INPUT FOOTER ---------------- */}
          <div className="p-3 bg-white border-t border-[#11261B]/10 flex items-center gap-2 relative">
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-[#5C6E61] hover:text-[#11261B] hover:bg-[#F8F5EE] transition-colors cursor-pointer"
              title="Attach image or file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />

            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="p-2 rounded-xl text-[#5C6E61] hover:text-[#11261B] hover:bg-[#F8F5EE] transition-colors cursor-pointer"
              title="Insert Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[#F8F5EE] border border-[#11261B]/15 rounded-2xl text-[#11261B] placeholder-[#5C6E61]/60 focus:outline-hidden focus:border-[#C5A059] focus:bg-white transition-all shadow-2xs"
            />

            <button
              type="button"
              disabled={isSending || (!inputValue.trim() && !pendingAttachment)}
              onClick={() => handleSendMessage()}
              className="w-10 h-10 rounded-2xl bg-[#11261B] hover:bg-[#1A3828] disabled:opacity-40 text-[#DFC285] hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer disabled:cursor-not-allowed hover:scale-105 active:scale-95 shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* FULL IMAGE PREVIEW MODAL */}
      {selectedImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedImageModal(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] p-2">
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImageModal}
              alt="Enlarged preview"
              className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};
