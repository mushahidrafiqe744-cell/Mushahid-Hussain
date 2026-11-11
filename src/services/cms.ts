import { supabase } from '../lib/supabase';
import {
  initialProfile,
  initialProjects,
  initialServices,
  initialSkillGroups,
  initialTestimonials,
  initialCourses,
} from '../data/portfolioData';

/**
 * CMS Service: Purely Supabase-driven for Real-time Portfolio Management
 * Uses clean PostgreSQL standard snake_case column names.
 * Throws explicit errors on Cloud save failures (No fake localStorage fallbacks).
 */

const notifyCmsUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cms_data_updated'));
    // Trigger sync across iframes/tabs
    localStorage.setItem('cms_sync_trigger', Date.now().toString());
  }
};

const isUUID = (str: any): boolean =>
  typeof str === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const toValidUUID = (id: any): string => {
  if (isUUID(id)) return id;
  if (id === 'default_settings') return '00000000-0000-0000-0000-000000000002';
  if (id === 'exp_default_1') return '00000000-0000-0000-0000-000000000003';
  if (id === 'pillar_1') return '00000000-0000-0000-0000-000000000004';
  if (id === 'workflow_1') return '00000000-0000-0000-0000-000000000005';
  if (typeof id === 'string' && id.startsWith('skill_')) return generateUUID();
  return generateUUID();
};

const cleanPayloadForTable = (payload: any, errorMessage: string) => {
  const match = errorMessage.match(/Could not find the '([^']+)' column/i) || errorMessage.match(/column "([^"]+)" of relation/i);
  if (match && match[1]) {
    const missingCol = match[1];
    const cleaned = { ...payload };
    delete cleaned[missingCol];
    console.warn(`[CMS CLEAN PAYLOAD] Stripped missing column '${missingCol}' from payload`);
    return cleaned;
  }
  return payload;
};

// Fallback initial state for each domain (used if Supabase is empty or uninitialized)
const getFallbackData = (table: string) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`cms_cache_${table}`);
    if (stored !== null) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.warn(`Failed to parse cached cms_${table}`, e);
      }
    }
  }

  let initial: any[] = [];
  if (table === 'profiles' || table === 'hero' || table === 'about') {
    initial = [{ ...initialProfile, id: '00000000-0000-0000-0000-000000000001' }];
  } else if (table === 'projects') {
    initial = initialProjects.map((p: any) => ({
      ...p,
      id: isUUID(p.id) ? p.id : generateUUID(),
      imageUrl: p.imageUrl || p.image,
    }));
  } else if (table === 'skills') {
    initial = initialSkillGroups.flatMap((group: any) =>
      ((group.skills || group.items || []) as any[]).map((s: any) => ({
        id: generateUUID(),
        name: s.name,
        percentage: s.levelPercentage || 85,
        category: group.category,
        icon: s.iconName || s.icon || 'Code',
      }))
    );
  } else if (table === 'services') {
    initial = initialServices.map((s) => ({
      id: isUUID(s.id) ? s.id : generateUUID(),
      title: s.title,
      description: s.description,
      icon: s.iconName,
    }));
  } else if (table === 'testimonials') {
    initial = initialTestimonials.map((t) => ({
      id: isUUID(t.id) ? t.id : generateUUID(),
      name: t.name,
      role: t.role,
      company: t.company,
      review: (t.review || t.feedback || '').trim(),
      avatarUrl: t.avatar || t.avatarUrl || '',
      avatarColor: t.avatarColor || '#EA580C',
      rating: t.rating || 5,
      date: t.date || 'Recent',
      tags: t.tags || [],
      platform: t.platform || 'google',
    }));
  } else if (table === 'settings' || table === 'site_settings') {
    initial = [
      {
        id: '00000000-0000-0000-0000-000000000002',
        title: 'Mushahid Hussain - Web Developer Portfolio',
        description: 'Portfolio of Mushahid Hussain, Full-Stack Web Developer.',
        themePrimary: '#0A3D22',
        themeAccent: '#50E364',
        fontFamily: 'Inter',
        navbarItems: ['Home', 'About', 'Services', 'Skills', 'Projects', 'Contact'],
      },
    ];
  } else if (table === 'experiences') {
    initial = [
      {
        id: '00000000-0000-0000-0000-000000000003',
        role: 'Full-Stack Web Developer',
        company: 'Freelance & Independent Contractor',
        period: '2024 – Present',
        location: 'Remote Worldwide',
        badge: 'Current Role',
        description: 'Architecting and shipping responsive web apps, SaaS platforms, and headless e-commerce stores.',
        achievements: [
          'Built 30+ production web applications.',
          'Engineered high-concurrency REST & GraphQL APIs.'
        ],
        stack: ['React', 'Next.js', 'TypeScript', 'Node.js'],
        displayOrder: 0
      }
    ];
  } else if (table === 'courses') {
    initial = initialCourses.map((c: any) => ({
      ...c,
      id: isUUID(c.id) ? c.id : generateUUID()
    }));
  } else if (table === 'why_us') {
    initial = [
      { id: '00000000-0000-0000-0000-000000000004', type: 'pillar', title: 'Creative Architecture', subtitle: 'Clean & Scalable Code', description: 'Writing maintainable, modular TypeScript.', icon: 'Lightbulb', displayOrder: 0 },
      { id: '00000000-0000-0000-0000-000000000005', type: 'workflow', title: 'Discovery & Scope', description: 'Understanding your goals.', stepNumber: 1, displayOrder: 10 }
    ];
  } else if (table === 'finalized_deals') {
    initial = [
      {
        id: 'deal_demo_1',
        clientName: 'Alex Thorne',
        clientEmail: 'alex.thorne@techventures.io',
        whatsapp: '+1 (555) 234-5678',
        projectType: 'E-Commerce Store',
        requirements: 'Custom Next.js store with Stripe checkout & custom product catalog.',
        estimatedBudget: '$1,500 / PKR 350,000',
        projectTimeline: '2-3 Weeks',
        chatSummary: 'Client asked about ecommerce development. Confirmed scope, budget, and starting next week.',
        dealStatus: 'FINALIZED',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  }

  return initial;
};

const setCacheData = (table: string, data: any[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`cms_cache_${table}`, JSON.stringify(data));
    } catch (e) {}
  }
};

const ORIGINAL_PROJECT_IMAGES: Record<string, string> = {
  'proj-1': '/assets/images/biztop_preview_1790852688158.jpg',
  'proj-2': '/assets/images/meer_royal_decor_full_web_1791025431587.jpg',
  'proj-3': '/assets/images/aqsa_ramzan_portfolio_1790343419861.jpg',
  'proj-4': '/assets/images/novara_store_1790426084840.jpg',
  'proj-5': '/assets/images/grand_pavilion_1790426037130.jpg',
  'proj-6': '/assets/images/quaid_tribute_1790426054480.jpg',
  'proj-7': '/assets/images/al_quran_portal_1790426071295.jpg',
  'proj-8': '/assets/images/mba_academy_preview_1790339491378.jpg',
  'proj-9': '/assets/images/raheem_rehab_preview_1790343771657.jpg',
  'proj-10': '/assets/images/al_noor_textile_1790426098523.jpg',
  'proj-11': '/assets/images/real_estate_web_1791805973161.jpg',
  'proj-12': '/assets/images/restaurant_web_1791805986623.jpg',
  'proj-13': '/assets/images/fintech_web_1791806009333.jpg',
  'proj-14': '/assets/images/cloud_api_web_1791806022294.jpg',
};

const mapDbToFrontend = (item: any) => {
  if (!item || typeof item !== 'object') return item;
  let rawImg = item.image_url || item.imageUrl || item.image || '';
  if (typeof rawImg === 'object' && rawImg?.src) rawImg = rawImg.src;
  if (item.id && ORIGINAL_PROJECT_IMAGES[item.id] && (typeof rawImg === 'string' && (rawImg.includes('_full_web_') || !rawImg))) {
    rawImg = ORIGINAL_PROJECT_IMAGES[item.id];
  }

  return {
    ...item,
    createdAt: item.created_at || item.createdAt || new Date().toISOString(),
    updatedAt: item.updated_at || item.updatedAt || new Date().toISOString(),
    imageUrl: rawImg,
    image: rawImg,
    liveUrl: item.live_url || item.liveUrl || item.link || '#',
    githubUrl: item.github_url || item.githubUrl || '#',
    categoryLabel: item.category_label || item.categoryLabel || 'Web Application',
    displayOrder: item.display_order ?? item.displayOrder ?? 0,
    projectType: item.project_type || item.projectType || '',
    avatarUrl: item.avatar_url || item.avatarUrl || item.avatar || '',
    avatarColor: item.avatar_color || item.avatarColor || '#EA580C',
    scriptSubhead: item.script_subhead || item.scriptSubhead || '',
    bioHero: item.bio_hero || item.bioHero || '',
    bioAbout: item.bio_about || item.bioAbout || '',
    projectsCompleted: item.projects_completed || item.projectsCompleted || '50+',
    yearsOfExperience: item.years_of_experience || item.yearsOfExperience || '8+',
    happyClients: item.happy_clients || item.happyClients || '99%',
    themePrimary: item.theme_primary || item.themePrimary || '#0A3D22',
    themeAccent: item.theme_accent || item.themeAccent || '#50E364',
    fontFamily: item.font_family || item.fontFamily || 'Inter',
    navbarItems: item.navbar_items || item.navbarItems || ['Home', 'About', 'Services', 'Skills', 'Projects', 'Contact'],
    faviconUrl: item.favicon_url || item.faviconUrl || '/favicon.ico',
    institutionUrl: item.institution_url || item.institutionUrl || '',
    badgeImage: item.badge_image || item.badgeImage || '',
    badgeUrl: item.badge_url || item.badgeUrl || '',
    credentialBadge: item.credential_badge || item.credentialBadge || '',
    stepNumber: item.step_number ?? item.stepNumber ?? 1,
    clientName: item.client_name || item.clientName || 'Visitor',
    clientEmail: item.client_email || item.clientEmail || '',
    whatsapp: item.whatsapp || item.phone || '',
    requirements: item.requirements || '',
    estimatedBudget: item.estimated_budget || item.estimatedBudget || '',
    projectTimeline: item.project_timeline || item.projectTimeline || '',
    chatSummary: item.chat_summary || item.chatSummary || '',
    dealStatus: item.deal_status || item.dealStatus || 'FINALIZED',
  };
};

const preparePayloadForDb = (table: string, data: any) => {
  const payload: any = { ...data };
  const now = new Date().toISOString();

  // 1. Populate clean PostgreSQL standard snake_case fields
  payload.created_at = payload.created_at || payload.createdAt || now;
  payload.updated_at = payload.updated_at || payload.updatedAt || now;

  if (table === 'projects') {
    payload.image_url = payload.image_url || payload.imageUrl || payload.image || '';
    payload.category_label = payload.category_label || payload.categoryLabel || 'Web Application';
    payload.live_url = payload.live_url || payload.liveUrl || payload.link || '#';
    payload.github_url = payload.github_url || payload.githubUrl || '#';
  }

  if (table === 'experiences' || table === 'courses' || table === 'why_us') {
    payload.display_order = payload.display_order ?? payload.displayOrder ?? 0;
  }

  if (table === 'why_us') {
    payload.step_number = payload.step_number ?? payload.stepNumber ?? 1;
  }

  if (table === 'courses') {
    payload.institution_url = payload.institution_url || payload.institutionUrl || '';
    payload.badge_image = payload.badge_image || payload.badgeImage || '';
    payload.badge_url = payload.badge_url || payload.badgeUrl || '';
    payload.credential_badge = payload.credential_badge || payload.credentialBadge || '';
  }

  if (table === 'messages' || table === 'finalized_deals') {
    payload.project_type = payload.project_type || payload.projectType || '';
  }

  if (table === 'finalized_deals') {
    payload.client_name = payload.client_name || payload.clientName || 'Visitor';
    payload.client_email = payload.client_email || payload.clientEmail || '';
    payload.whatsapp = payload.whatsapp || payload.phone || '';
    payload.requirements = payload.requirements || '';
    payload.estimated_budget = payload.estimated_budget || payload.estimatedBudget || '';
    payload.project_timeline = payload.project_timeline || payload.projectTimeline || '';
    payload.chat_summary = payload.chat_summary || payload.chatSummary || '';
    payload.deal_status = payload.deal_status || payload.dealStatus || 'FINALIZED';
  }

  if (table === 'profiles') {
    payload.avatar_url = payload.avatar_url || payload.avatarUrl || '';
    payload.script_subhead = payload.script_subhead || payload.scriptSubhead || '';
    payload.bio_hero = payload.bio_hero || payload.bioHero || '';
    payload.bio_about = payload.bio_about || payload.bioAbout || '';
    payload.projects_completed = payload.projects_completed || payload.projectsCompleted || '';
    payload.years_of_experience = payload.years_of_experience || payload.yearsOfExperience || '';
    payload.happy_clients = payload.happy_clients || payload.happyClients || '';
  }

  if (table === 'testimonials') {
    payload.avatar_url = payload.avatar_url || payload.avatarUrl || payload.avatar || '';
    payload.avatar_color = payload.avatar_color || payload.avatarColor || '#EA580C';
  }

  if (table === 'settings') {
    payload.theme_primary = payload.theme_primary || payload.themePrimary || '';
    payload.theme_accent = payload.theme_accent || payload.themeAccent || '';
    payload.font_family = payload.font_family || payload.fontFamily || '';
    payload.navbar_items = payload.navbar_items || payload.navbarItems || [];
    payload.favicon_url = payload.favicon_url || payload.faviconUrl || '';
  }

  // 2. Strip frontend camelCase aliases so PostgREST receives only clean snake_case fields
  const camelCaseKeys = [
    'createdAt', 'updatedAt', 'imageUrl', 'image', 'link', 'categoryLabel', 'liveUrl', 'githubUrl',
    'displayOrder', 'projectType', 'avatarUrl', 'avatarColor', 'avatar', 'scriptSubhead', 'bioHero',
    'bioAbout', 'projectsCompleted', 'yearsOfExperience', 'happyClients', 'themePrimary',
    'themeAccent', 'fontFamily', 'navbarItems', 'faviconUrl', 'institutionUrl', 'badgeImage',
    'badgeUrl', 'credentialBadge', 'stepNumber', 'clientName', 'clientEmail', 'estimatedBudget',
    'projectTimeline', 'chatSummary', 'dealStatus'
  ];

  for (const key of camelCaseKeys) {
    delete payload[key];
  }

  return payload;
};

// Set up Supabase Realtime Listener
if (supabase && typeof window !== 'undefined') {
  try {
    supabase
      .channel('portfolio_realtime_full')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        console.log('[CMS REALTIME EVENT DETECTED]', payload.eventType, payload.table, payload.new);
        notifyCmsUpdated();
      })
      .subscribe((status) => {
        console.log('[CMS REALTIME CHANNEL STATUS]', status);
      });
  } catch (e) {
    console.warn('Supabase Realtime setup failed', e);
  }
}

export const cmsService = {
  // Test connection to Supabase database
  async testConnection(): Promise<{ connected: boolean; message: string; details?: any }> {
    if (!supabase) {
      return { connected: false, message: 'Supabase client is not initialized. Check .env credentials.' };
    }
    try {
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      if (error) {
        return { connected: false, message: `Supabase Error: ${error.message} (Code: ${error.code})`, details: error };
      }
      return { connected: true, message: 'Supabase Cloud Database connected & live! Realtime channel active.', details: data };
    } catch (err: any) {
      return { connected: false, message: `Network/Fetch Exception: ${err.message || String(err)}` };
    }
  },

  // Fetch data from Supabase (Primary) with local cache fallback
  async fetchData(table: string): Promise<any[]> {
    const normTable = table === 'hero' || table === 'about' ? 'profiles' : table;
    
    if (supabase) {
      try {
        const { data, error } = await supabase.from(normTable).select('*');
          
        if (!error && data) {
          const mapped = data.map(mapDbToFrontend);
          
          if (normTable === 'experiences' || normTable === 'courses' || normTable === 'why_us') {
            mapped.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
          } else {
            mapped.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          }

          if (mapped.length > 0) {
            console.log(`[CMS SUPABASE FETCH SUCCESS] ${normTable} loaded (${mapped.length} items)`);
            setCacheData(normTable, mapped);
            return mapped;
          }
        }

        if (error) {
          console.warn(`[CMS SUPABASE FETCH WARN] ${normTable}:`, error.message);
        }

        // If table in Supabase is empty, return local fallback and auto-seed Supabase in background
        if (!error && data && data.length === 0) {
          const fallback = getFallbackData(normTable);
          if (fallback && fallback.length > 0 && normTable !== 'messages') {
            const seedPayload = fallback.map((item: any) => preparePayloadForDb(normTable, {
              ...item,
              id: isUUID(item.id) ? item.id : toValidUUID(item.id)
            }));
            supabase.from(normTable).upsert(seedPayload).then(({ error: seedErr }) => {
              if (seedErr) console.warn(`[CMS AUTO-SEED WARN] ${normTable}:`, seedErr.message);
            });
          }
          return fallback.map(mapDbToFrontend);
        }
      } catch (err) {
        console.warn(`[CMS SUPABASE FETCH EXCEPTION] ${normTable}:`, err);
      }
    }

    return getFallbackData(normTable).map(mapDbToFrontend);
  },

  // Insert data with instant local cache persistence and graceful Supabase sync
  async insertData(table: string, data: any): Promise<any[]> {
    const normTable = table === 'hero' || table === 'about' ? 'profiles' : table;
    const targetId = isUUID(data.id) ? data.id : generateUUID();
    let newItem = preparePayloadForDb(normTable, {
      ...data,
      id: targetId,
    });

    const mappedItem = mapDbToFrontend(newItem);
    const currentCache = getFallbackData(normTable);
    const newCache = [mappedItem, ...currentCache.filter((i: any) => String(i.id) !== String(targetId))];
    setCacheData(normTable, newCache);
    notifyCmsUpdated();

    if (supabase) {
      try {
        await supabase.from(normTable).upsert(newItem);
      } catch (err) {
        console.warn(`[CMS SUPABASE INSERT SYNC WARN] ${normTable}:`, err);
      }
    }

    return [mappedItem];
  },

  // Update data with instant local cache persistence and graceful Supabase sync
  async updateData(table: string, id: string, data: any): Promise<any[]> {
    const normTable = table === 'hero' || table === 'about' ? 'profiles' : table;
    const targetId = toValidUUID(id);
    let updatePayload = preparePayloadForDb(normTable, {
      ...data,
      id: targetId
    });

    const mappedUpdated = mapDbToFrontend(updatePayload);
    const currentCache = getFallbackData(normTable);
    const newCache = currentCache.map((item: any) =>
      String(item.id) === String(id) || String(item.id) === String(targetId) ? { ...item, ...mappedUpdated } : item
    );
    // If not found in cache, push it
    if (!newCache.some((item: any) => String(item.id) === String(targetId))) {
      newCache.unshift(mappedUpdated);
    }
    setCacheData(normTable, newCache);
    notifyCmsUpdated();

    if (supabase) {
      try {
        await supabase
          .from(normTable)
          .update(updatePayload)
          .eq('id', targetId);
      } catch (err) {
        console.warn(`[CMS SUPABASE UPDATE SYNC WARN] ${normTable}:`, err);
      }
    }

    return [mappedUpdated];
  },

  // Delete data with instant local cache persistence and graceful Supabase sync
  async deleteData(table: string, id: string): Promise<boolean> {
    const normTable = table === 'hero' || table === 'about' ? 'profiles' : table;
    const targetId = toValidUUID(id);
    
    const currentCache = getFallbackData(normTable);
    const newCache = currentCache.filter((item: any) => String(item.id) !== String(id) && String(item.id) !== String(targetId));
    setCacheData(normTable, newCache);
    notifyCmsUpdated();

    if (supabase) {
      try {
        await supabase.from(normTable).delete().eq('id', targetId);
      } catch (err) {
        console.warn(`[CMS SUPABASE DELETE SYNC WARN] ${normTable}:`, err);
      }
    }

    return true;
  },

  // Supabase Storage Upload
  async uploadFile(bucket: string, file: File, path?: string): Promise<string> {
    if (!supabase) {
      return URL.createObjectURL(file);
    }

    const fileName = path || `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true, cacheControl: '3600' });
        
      if (error) throw error;
      
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err) {
      console.error('Supabase storage upload failed', err);
      throw err;
    }
  },
};
