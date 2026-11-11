import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const SYSTEM_INSTRUCTION = `You are the official AI Assistant for Mushahid Hussain, an expert Full-Stack Web Developer & Software Engineer based in Pakistan with 8+ years of professional experience.
Your primary role is to interact warmly, professionally, and persuasively with website visitors, provide detailed information about Mushahid's portfolio, featured projects, services, technical skills, pricing, and certifications, and convert visitors into project clients.

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

Complete Portfolio Projects Knowledge (Include live demo links & details when asked about portfolio or projects):
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    let replyText =
      response.text ||
      "Mushahid Hussain has built 50+ high-performance web applications including B2B portals, E-commerce stores, healthcare systems, and SaaS platforms! You can reach Mushahid directly on WhatsApp (+92 329 0725117) or email (mushahidrafiqe744@gmail.com) for a free quote.";

    let dealFinalized = false;
    let dealMetadata: any = null;

    // Check for [[DEAL_FINALIZED: ...]] tag in response
    const dealMatch = replyText.match(/\[\[DEAL_FINALIZED:\s*(\{.*?\})\s*\]\]/s);
    if (dealMatch && dealMatch[1]) {
      try {
        dealMetadata = JSON.parse(dealMatch[1]);
        dealFinalized = true;
        // Strip the tag from clean display text
        replyText = replyText.replace(/\[\[DEAL_FINALIZED:\s*\{.*?\}\s*\]\]/s, '').trim();
      } catch (e) {
        console.warn('Failed to parse DEAL_FINALIZED JSON from Gemini:', e);
      }
    }

    // Secondary Intent Check: If client message explicitly confirms deal (e.g. "i confirm", "let's proceed", "deal finalized")
    const lastUserText = (typeof message === 'string' ? message : contents[contents.length - 1]?.parts[0]?.text || '').toLowerCase();
    const explicitConfirmationPhrases = ['i confirm', 'deal finalized', 'let\'s start the project', 'i want to proceed now', 'book my project', 'confirm deal'];
    if (!dealFinalized && explicitConfirmationPhrases.some(phrase => lastUserText.includes(phrase))) {
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

        const baseUrl = req.headers.get('origin') || 'http://localhost:3000';
        await fetch(`${baseUrl}/api/deal/notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: clientInfo?.name || 'Visitor',
            clientEmail: clientInfo?.email || '',
            whatsapp: clientInfo?.phone || '',
            projectType: dealMetadata?.projectType || 'Web Development Project',
            requirements: dealMetadata?.requirements || 'Confirmed in AI Chat',
            estimatedBudget: dealMetadata?.estimatedBudget || 'Quote pending',
            projectTimeline: dealMetadata?.projectTimeline || 'Standard Timeline',
            chatSummary: fullChatSummary,
            dealStatus: 'FINALIZED',
          }),
        }).catch((err) => console.warn('Deal notify trigger warning:', err));
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
    console.error('[GEMINI CHAT ROUTE ERROR]', err);

    const fallbackPortfolioReply =
      "Mushahid Hussain is an expert Full-Stack Web Developer with 8+ years of experience. Featured portfolio projects include:\n\n" +
      "1. **BizTop Enterprise Portal** - B2B corporate platform (https://biztop.org/)\n" +
      "2. **Meer Royal Decor** - Luxury E-Commerce interior showroom (https://meerroyaldecor.com/)\n" +
      "3. **Dr. Aqsa Ramzan Healthcare** - Medical booking portal (https://draqsaramzan.com/)\n" +
      "4. **Novara Apparel Global** - International apparel store with Stripe (https://novarastore.com/)\n" +
      "5. **The Grand Pavilion** - 3D Event hall booking suite (https://grandpavilion.com/)\n\n" +
      "Websites start from PKR 20,000 / $100+. Contact Mushahid directly on **WhatsApp (+92 329 0725117)** or **Email (mushahidrafiqe744@gmail.com)** for a quick quote!";

    return NextResponse.json(
      {
        error: err.message || 'Internal Server Error',
        text: fallbackPortfolioReply,
        success: false,
      },
      { status: 500 }
    );
  }
}
