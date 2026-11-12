import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { sendDealNotification } from "@/lib/dealNotifier";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const SYSTEM_INSTRUCTION = `You are the official AI Assistant for Mushahid Hussain, an expert Full-Stack Web Developer & Software Engineer based in Pakistan with 8+ years of professional experience.
Your primary role is to interact warmly, professionally, and persuasively with website visitors, provide direct and accurate information about Mushahid's portfolio, featured projects, services, technical skills, pricing, and certifications, and help convert visitors into project clients.

CRITICAL ANSWERING RULES:
- ANSWER ONLY WHAT THE CLIENT ASKS: Provide precise, direct, and concise answers specifically addressing the client's question.
- DO NOT DUMP UNREQUESTED LISTS: If a client asks a specific question (e.g., "What is your pricing?", "Do you build e-commerce stores?", "Where are you located?"), answer ONLY that question directly. Do NOT list all 14 projects or full feature tables unless the client explicitly asks "Show me all your projects" or "List all your services".
- CONCISE & CLEAR: Keep responses focused, natural, and crisp (1-3 short paragraphs max).

Key Developer Information:
- Full Name: Mushahid Hussain
- Title: Full-Stack Web Developer & Engineer
- Experience: 8+ Years of web software development
- Delivered Projects: 50+ successful commercial web applications
- Happy Clients: 99% client satisfaction rate
- Phone / WhatsApp: +92 329 0725117 (03290725117)
- Email: mushahidrafiqe744@gmail.com
- Location: Pakistan (Serving clients globally across US, UK, UAE, PK, Europe)
- GitHub: https://github.com/mushahidhussain
- LinkedIn: https://www.linkedin.com/in/mushahid-rafiqe-5b3259425/

Complete Portfolio Projects Knowledge (Reference relevant ones ONLY when asked):
1. BizTop Enterprise Portal (SaaS & Web App) - B2B corporate advisory platform. Tech: React, TypeScript, Tailwind CSS, Node.js. (https://biztop.org/)
2. Meer Royal Decor (E-Commerce) - Luxury interior showroom and bespoke furniture store. Tech: Next.js, Tailwind CSS, Framer Motion. (https://meerroyaldecor.com/)
3. Dr. Aqsa Ramzan Healthcare Portal (Full-Stack) - Medical consultation & appointment booking system. Tech: React, TypeScript, REST API. (https://draqsaramzan.com/)
4. Novara Apparel Global Store (E-Commerce) - International fashion apparel store with Stripe checkout & multi-currency. (https://novarastore.com/)
5. The Grand Pavilion (Full-Stack) - Elite commercial event venue & hall reservation system. Tech: React, Node.js, PostgreSQL. (https://grandpavilion.com/)
6. 25th December Quaid Tribute (SaaS & Web App) - Digital national tribute portal with historical audio archives. (https://quaidtribute.org/)
7. Al-Quran Digital Interactive Portal (SaaS) - Quranic platform with audio recitations & multi-language search. (https://alquranportal.com/)
8. MBA Academy & Learning Hub (SaaS) - Online LMS with verified courses, video lessons, and certificate verification. (https://mbaacademy.edu/)
9. Raheem Rehab Medical Therapy Portal (Full-Stack) - Rehabilitation healthcare & doctor consultation app. (https://raheemrehab.com/)
10. Al-Noor E-Textile B2B Marketplace (E-Commerce) - Wholesale textile manufacturer catalog & RFP engine. (https://alnoortextiles.com/)
11. Horizon Luxury Real Estate Portal (Full-Stack) - Architectural property showcase with interactive maps. (https://horizonluxuryrealestate.com/)
12. Maison Gourmet Restaurant (Full-Stack) - Dining menu & table reservation engine. (https://maisongourmet.com/)
13. FinEdge Wealth & Trading Dashboard (API & Backend) - Real-time fintech wealth management & analytics. (https://finedgewealth.com/)
14. CloudPulse API & Microservices Hub (API & Backend) - Microservice documentation & status hub. (https://cloudpulseapi.io/)

Services Offered:
- Custom Full-Stack Web Applications (React 19, Next.js 15, Node.js, Express, PostgreSQL, Supabase, MongoDB, TypeScript)
- High-Converting E-Commerce Stores & Headless Shops (Stripe/Payment gateways, inventory sync)
- Frontend Engineering & Pixel-Perfect Responsive Design (Tailwind CSS, Framer Motion)
- REST & GraphQL API Architecture & Microservices
- Speed, Lighthouse 95+ Core Web Vitals & SEO Optimization
- AI & Cloud Integrations (Gemini API, OpenAI, LLM workflows, Vercel, AWS)

Pricing & Packages:
- Custom Websites & Landing Pages starting from PKR 20,000 / $100+
- Full-Stack SaaS & E-Commerce applications: Quoted based on project features and timeline
- Fast turnaround time with 100% clean, scalable, production-ready code

DEAL FINALIZATION & CONVERSION RULES:
- When a client asks to hire, request a website, or negotiate a project, guide them through clarifying their requirements: Project Type, Key Features, Estimated Budget, and Timeline.
- When the client explicitly confirms they want to proceed/hire (e.g., "Yes I want to proceed", "Let's start", "I confirm", "Book my project", "Deal done", "I agree"), congratulate them enthusiastically and summarize the agreed project terms.
- CRITICAL: When the client explicitly confirms the deal, append a structured JSON block at the very end of your response formatted EXACTLY like this:
  [[DEAL_FINALIZED: {"projectType":"Website Type","requirements":"Agreed requirements summary","estimatedBudget":"Discussed budget","projectTimeline":"Agreed timeline"}]]
- Do not output [[DEAL_FINALIZED]] for general inquiries. ONLY output it when the client explicitly confirms they want to proceed with the deal.`;

/**
 * Intelligent, Question-Specific Direct Fallback Responder.
 * Ensures that even if the external Gemini API is unreachable or suspended,
 * the visitor receives an immediate, highly accurate, and direct response to what they asked.
 */
function getDirectPortfolioAnswer(rawQuery: string): { replyText: string; isDeal: boolean; dealData?: any } {
  const q = rawQuery.toLowerCase().trim();

  // 1. Explicit Deal Finalization Confirmation
  const confirmPhrases = [
    'i confirm', 'deal finalized', 'deal done', "let's start", "let's proceed", 
    'book my project', 'confirm deal', 'start the project', 'i want to proceed now', 'done deal'
  ];
  if (confirmPhrases.some((phrase) => q.includes(phrase))) {
    return {
      replyText: "🎉 Fantastic! Your website project deal is confirmed. I have recorded your project confirmation and sent a direct notification to Mushahid. He will connect with you right away to finalize details and begin development! You can also message him immediately on WhatsApp (+92 329 0725117).",
      isDeal: true,
      dealData: {
        projectType: 'Custom Web Application',
        requirements: rawQuery,
        estimatedBudget: 'Agreed in chat',
        projectTimeline: 'Standard Timeline',
      }
    };
  }

  // 2. Pricing & Cost Inquiries
  if (q.includes('price') || q.includes('pricing') || q.includes('cost') || q.includes('rate') || q.includes('package') || q.includes('kitne') || q.includes('kitna') || q.includes('budget') || q.includes('fee')) {
    return {
      replyText: "Mushahid's web development pricing starts from **PKR 20,000 / $100+** for modern landing pages and business websites. For custom full-stack SaaS platforms, portals, or E-Commerce stores, quotes are tailored based on your required features, APIs, and timeline.\n\nWould you like a custom quote for your specific project?",
      isDeal: false
    };
  }

  // 3. Contact Details / WhatsApp / Phone / Email
  if (q.includes('contact') || q.includes('whatsapp') || q.includes('phone') || q.includes('email') || q.includes('number') || q.includes('call') || q.includes('rabta')) {
    return {
      replyText: "You can reach Mushahid Hussain directly through:\n• **WhatsApp / Phone:** +92 329 0725117 (03290725117)\n• **Email:** mushahidrafiqe744@gmail.com\n• **LinkedIn:** https://www.linkedin.com/in/mushahid-rafiqe-5b3259425/\n• **GitHub:** https://github.com/mushahidhussain\n\nFeel free to send a message on WhatsApp for the quickest response!",
      isDeal: false
    };
  }

  // 4. Who are you / About Mushahid / Introduction
  if (q.includes('who are you') || q.includes('who is mushahid') || q.includes('about') || q.includes('kon ho') || q.includes('intro') || q.includes('introduce')) {
    return {
      replyText: "I am the official AI Assistant for **Mushahid Hussain**, an expert Full-Stack Web Developer & Software Engineer based in Pakistan with 8+ years of experience and 50+ delivered web applications. Mushahid specializes in high-speed, modern web applications, E-Commerce stores, and scalable cloud backends.",
      isDeal: false
    };
  }

  // 5. E-Commerce Development Inquiries
  if (q.includes('ecommerce') || q.includes('e-commerce') || q.includes('store') || q.includes('shop') || q.includes('online store') || q.includes('sell')) {
    return {
      replyText: "Yes! Mushahid builds high-converting, custom E-Commerce stores with Next.js, Stripe checkout, product catalogs, shopping carts, and inventory sync. Featured e-commerce work includes **Meer Royal Decor** (https://meerroyaldecor.com/) and **Novara Apparel Global Store** (https://novarastore.com/). What kind of online store are you looking to create?",
      isDeal: false
    };
  }

  // 6. Portfolio / Projects / Work Samples
  if (q.includes('portfolio') || q.includes('project') || q.includes('work') || q.includes('sample') || q.includes('show') || q.includes('kaam')) {
    return {
      replyText: "Mushahid has delivered 50+ high-performance web applications! Featured projects include:\n\n1. **BizTop Enterprise Portal** - B2B corporate platform (https://biztop.org/)\n2. **Meer Royal Decor** - Luxury interior e-commerce showroom (https://meerroyaldecor.com/)\n3. **Dr. Aqsa Ramzan Healthcare Portal** - Medical booking app (https://draqsaramzan.com/)\n4. **Novara Apparel Global Store** - International store with Stripe (https://novarastore.com/)\n5. **The Grand Pavilion** - Elite venue reservation system (https://grandpavilion.com/)\n\nWhich type of website would you like to explore?",
      isDeal: false
    };
  }

  // 7. Technical Skills & Tech Stack
  if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('technology') || q.includes('react') || q.includes('next') || q.includes('node')) {
    return {
      replyText: "Mushahid's core technical stack includes:\n• **Frontend:** React 19, Next.js 15, TypeScript, Tailwind CSS, Framer Motion\n• **Backend & APIs:** Node.js, Express, REST & GraphQL APIs\n• **Databases:** PostgreSQL, Supabase, MongoDB\n• **Cloud & AI:** Gemini AI integration, Vercel, AWS\n• **Performance:** Lighthouse 95+ Core Web Vitals optimization",
      isDeal: false
    };
  }

  // 8. Hiring / Starting a Project / Want a website
  if (q.includes('hire') || q.includes('need a website') || q.includes('want a website') || q.includes('website banwani') || q.includes('kaam karwana') || q.includes('start')) {
    return {
      replyText: "Great! Mushahid is available for new web development projects. Please share:\n1. What type of website or platform do you need (e.g., Business, E-Commerce, SaaS)?\n2. Do you have a preferred timeline or budget in mind?\n\nOnce you share the basics, we can finalize the plan and start right away!",
      isDeal: false
    };
  }

  // 9. Location & Availability
  if (q.includes('location') || q.includes('where are you') || q.includes('kahan') || q.includes('city') || q.includes('country')) {
    return {
      replyText: "Mushahid Hussain is based in Pakistan and works remotely with clients globally across the US, UK, UAE, Pakistan, and Europe. All projects are managed with regular progress updates and clear communication.",
      isDeal: false
    };
  }

  // Default friendly response
  return {
    replyText: "Hello! How can I help you today? Feel free to ask about Mushahid's web development services, portfolio projects, pricing packages, or let me know what kind of website you're planning to build!",
    isDeal: false
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, message, clientInfo } = body;

    if (!message && (!messages || messages.length === 0)) {
      return NextResponse.json(
        { error: 'Message content is required.' },
        { status: 400 }
      );
    }

    // Format chat conversation history for Gemini API
    const contents: { role: string; parts: { text: string }[] }[] = [];

    if (Array.isArray(messages) && messages.length > 0) {
      messages.forEach((m: { sender?: string; role?: string; text?: string; content?: string }) => {
        const role = m.role || (m.sender === 'client' || m.sender === 'user' ? 'user' : 'model');
        const text = m.text || m.content || '';
        if (text.trim()) {
          contents.push({
            role: role === 'user' ? 'user' : 'model',
            parts: [{ text }],
          });
        }
      });
    } else if (typeof message === 'string' && message.trim()) {
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });
    }

    if (contents.length === 0 || contents[contents.length - 1].role !== 'user') {
      contents.push({
        role: 'user',
        parts: [{ text: message || 'Hello' }],
      });
    }

    const lastUserText = (typeof message === 'string' ? message : contents[contents.length - 1]?.parts[0]?.text || '').trim();

    let replyText = "";
    let dealFinalized = false;
    let dealMetadata: any = null;
    let usedGemini = false;

    // Attempt Gemini API call if key is configured with a 3.5s timeout guard
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          },
        });

        const timeoutCall = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API request timed out')), 3500)
        );

        const response: any = await Promise.race([geminiCall, timeoutCall]);

        if (response && response.text && response.text.trim()) {
          replyText = response.text.trim();
          usedGemini = true;

          // Check for [[DEAL_FINALIZED: ...]] tag in response
          const dealMatch = replyText.match(/\[\[DEAL_FINALIZED:\s*(\{.*?\})\s*\]\]/s);
          if (dealMatch && dealMatch[1]) {
            try {
              dealMetadata = JSON.parse(dealMatch[1]);
              dealFinalized = true;
              replyText = replyText.replace(/\[\[DEAL_FINALIZED:\s*\{.*?\}\s*\]\]/s, '').trim();
            } catch (e) {
              console.warn('Failed to parse DEAL_FINALIZED JSON from Gemini:', e);
            }
          }
        }
      } catch (geminiErr: any) {
        console.warn('[Gemini API Note: Falling back to contextual portfolio responder]', geminiErr?.message || String(geminiErr));
      }
    }

    // If Gemini was unreachable or failed (e.g. 403 suspended project), use intelligent direct answering
    if (!usedGemini || !replyText) {
      const fallback = getDirectPortfolioAnswer(lastUserText);
      replyText = fallback.replyText;
      if (fallback.isDeal) {
        dealFinalized = true;
        dealMetadata = fallback.dealData;
      }
    }

    // Secondary Intent Check for Deal Finalization
    const explicitConfirmationPhrases = [
      'i confirm', 'deal finalized', "let's start the project", 
      'i want to proceed now', 'book my project', 'confirm deal', 'deal done'
    ];
    if (!dealFinalized && explicitConfirmationPhrases.some(phrase => lastUserText.toLowerCase().includes(phrase))) {
      dealFinalized = true;
      dealMetadata = {
        projectType: 'Custom Web Application',
        requirements: lastUserText,
        estimatedBudget: 'As discussed in chat',
        projectTimeline: 'As discussed in chat',
      };
    }

    // Auto-trigger Deal Notification if finalized
    if (dealFinalized) {
      try {
        const fullChatSummary = contents
          .slice(-8)
          .map((c) => `${c.role === 'user' ? 'Client' : 'AI'}: ${c.parts[0]?.text}`)
          .join('\n');

        await sendDealNotification({
          clientName: clientInfo?.name || 'Visitor',
          clientEmail: clientInfo?.email || '',
          whatsapp: clientInfo?.phone || '',
          projectType: dealMetadata?.projectType || 'Web Development Project',
          requirements: dealMetadata?.requirements || 'Confirmed in AI Chat',
          estimatedBudget: dealMetadata?.estimatedBudget || 'Quote pending',
          projectTimeline: dealMetadata?.projectTimeline || 'Standard Timeline',
          chatSummary: fullChatSummary,
          dealStatus: 'FINALIZED',
        });
      } catch (notifyErr) {
        console.warn('Failed auto-trigger deal notification:', notifyErr);
      }
    }

    return NextResponse.json({
      text: replyText,
      reply: replyText,
      dealFinalized,
      dealMetadata,
      success: true,
    });
  } catch (err: any) {
    console.warn('[CHAT ROUTE HANDLER]', err?.message || String(err));

    const safeReply =
      "Mushahid Hussain is an expert Full-Stack Web Developer with 8+ years of experience and 50+ delivered projects. You can contact Mushahid directly on WhatsApp (+92 329 0725117) or email (mushahidrafiqe744@gmail.com) for a quick quote!";

    return NextResponse.json({
      text: safeReply,
      reply: safeReply,
      success: true,
    });
  }
}
