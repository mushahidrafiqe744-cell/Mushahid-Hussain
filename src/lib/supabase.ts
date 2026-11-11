import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://mmfbelknbomaoqnlvdgu.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_P7GGPo7KD19rhp1btqrEwA_aGnXoc0B';

const rawUrl = 
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SUPABASE_URL) || 
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) || 
  DEFAULT_SUPABASE_URL;

const rawKey = 
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || 
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || 
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY) || 
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_PUBLISHABLE_KEY) || 
  DEFAULT_SUPABASE_KEY;

const cleanUrl = typeof rawUrl === 'string' ? rawUrl.trim().replace(/^['"](.*)['"]$/, '$1') : DEFAULT_SUPABASE_URL;
const cleanKey = typeof rawKey === 'string' ? rawKey.trim().replace(/^['"](.*)['"]$/, '$1') : DEFAULT_SUPABASE_KEY;

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

let supabaseClient = null;

if (cleanUrl && cleanKey && isValidUrl(cleanUrl)) {
  try {
    supabaseClient = createClient(cleanUrl, cleanKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  } catch (err) {
    console.error('Supabase initialization failed:', err);
  }
}

export const supabase = supabaseClient;

if (!supabase) {
  console.warn('Supabase credentials are missing or invalid URL. Current URL:', cleanUrl || 'Empty');
}
