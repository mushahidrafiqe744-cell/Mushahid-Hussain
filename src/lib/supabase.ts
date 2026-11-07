import { createClient } from '@supabase/supabase-js';

// Robust lookup for Supabase credentials (Vite env, define replacement, or fallback)
const getEnv = (key: string): string => {
  try {
    return (process.env[key] as string) || '';
  } catch (e) {
    return '';
  }
};

const DEFAULT_SUPABASE_URL = 'https://mmfbelknbomaoqnlvdgu.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_P7GGPo7KD19rhp1btqrEwA_aGnXoc0B';

const rawUrl = 
  getEnv('VITE_SUPABASE_URL') || 
  getEnv('NEXT_PUBLIC_SUPABASE_URL') || 
  DEFAULT_SUPABASE_URL;

const rawKey = 
  getEnv('VITE_SUPABASE_ANON_KEY') || 
  getEnv('VITE_SUPABASE_PUBLISHABLE_KEY') || 
  getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') || 
  getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 
  DEFAULT_SUPABASE_KEY;

// Clean up keys (remove accidental quotes or whitespace)
const cleanUrl = rawUrl?.trim().replace(/^['"](.*)['"]$/, '$1') || '';
const cleanKey = rawKey?.trim().replace(/^['"](.*)['"]$/, '$1') || '';

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

let supabaseClient = null;

if (cleanUrl && cleanKey && isValidUrl(cleanUrl) && !cleanUrl.includes('YOUR_')) {
  try {
    supabaseClient = createClient(cleanUrl, cleanKey);
  } catch (err) {
    console.error('Supabase initialization failed:', err);
  }
}

export const supabase = supabaseClient;

if (!supabase) {
  console.warn('Supabase credentials are missing or invalid URL. Current URL:', cleanUrl || 'Empty');
}

