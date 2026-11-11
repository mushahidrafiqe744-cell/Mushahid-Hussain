-- ==============================================================================
-- COMPLETE, SECURE & IDEMPOTENT SUPABASE SQL MIGRATION SCRIPT
-- Creates missing tables, ensures standard columns, enables strict RLS policies,
-- and restricts write/modify access strictly to mushahidrafiqe744@gmail.com.
-- Copy and paste this entire script into your Supabase Dashboard -> SQL Editor and click RUN.
-- ==============================================================================

-- STEP 1: Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STEP 2: Create Tables (If they do not exist)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT DEFAULT 'Mushahid Hussain',
  title TEXT DEFAULT 'Web Developer',
  script_subhead TEXT DEFAULT 'Web Developer & Engineer',
  badge TEXT DEFAULT 'CRAFTING SCALABLE & INTUITIVE WEB EXPERIENCES.',
  bio_hero TEXT DEFAULT 'I build high-performance web applications, responsive interfaces, and robust backend services.',
  bio_about TEXT DEFAULT 'I am a passionate Full-Stack Web Developer specializing in modern React ecosystems...',
  location TEXT DEFAULT 'Pakistan',
  email TEXT DEFAULT 'mushahidrafiqe744@gmail.com',
  phone TEXT DEFAULT '03290725117',
  whatsapp TEXT DEFAULT '03290725117',
  github TEXT DEFAULT 'https://github.com/mushahidhussain',
  linkedin TEXT DEFAULT 'https://www.linkedin.com/in/mushahid-rafiqe-5b3259425/',
  tiktok TEXT DEFAULT 'https://www.tiktok.com/@mushahidrafiqe699',
  avatar_url TEXT DEFAULT 'https://i.pinimg.com/736x/69/0e/ee/690eee1da722bcf952fa4893995ac008.jpg',
  projects_completed TEXT DEFAULT '50+',
  years_of_experience TEXT DEFAULT '8+',
  happy_clients TEXT DEFAULT '99%',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'saas',
  category_label TEXT DEFAULT 'Web Application',
  technologies TEXT[],
  image_url TEXT,
  live_url TEXT DEFAULT '#',
  github_url TEXT DEFAULT '#',
  featured BOOLEAN DEFAULT true,
  hidden BOOLEAN DEFAULT false,
  year TEXT DEFAULT '2025',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  percentage INTEGER DEFAULT 85,
  category TEXT DEFAULT 'Frontend',
  icon TEXT DEFAULT 'Code',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Code',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Client',
  company TEXT DEFAULT '',
  review TEXT,
  avatar_url TEXT,
  avatar_color TEXT DEFAULT '#EA580C',
  rating INTEGER DEFAULT 5,
  date TEXT DEFAULT 'Recent',
  tags TEXT[],
  platform TEXT DEFAULT 'google',
  flag TEXT DEFAULT '🇵🇰',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT DEFAULT 'Mushahid Hussain - Web Developer Portfolio',
  description TEXT DEFAULT 'Portfolio of Mushahid Hussain, Full-Stack Web Developer.',
  theme_primary TEXT DEFAULT '#0A3D22',
  theme_accent TEXT DEFAULT '#50E364',
  font_family TEXT DEFAULT 'Inter',
  navbar_items TEXT[] DEFAULT ARRAY['Home', 'About', 'Services', 'Skills', 'Projects', 'Contact'],
  favicon_url TEXT DEFAULT '/favicon.ico',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT,
  budget TEXT,
  country TEXT,
  currency TEXT,
  message TEXT,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  location TEXT,
  badge TEXT,
  description TEXT,
  achievements TEXT[],
  stack TEXT[],
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  institution_url TEXT,
  category TEXT DEFAULT 'Development',
  period TEXT,
  description TEXT,
  skills TEXT[],
  badge_image TEXT,
  badge_url TEXT,
  credential_badge TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS why_us (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  icon TEXT,
  step_number INTEGER,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 3: Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_us ENABLE ROW LEVEL SECURITY;

-- STEP 4: Drop Existing Policies Safely
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname, tablename 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename IN ('profiles', 'projects', 'skills', 'services', 'testimonials', 'settings', 'messages', 'experiences', 'courses', 'why_us')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I;', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- STEP 5: Re-Create Strict Secure Policies

-- 5A. Portfolio & Testimonials Tables: Public READ (SELECT), Admin WRITE (INSERT, UPDATE, DELETE) for mushahidrafiqe744@gmail.com
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'profiles',
      'projects',
      'skills',
      'services',
      'testimonials',
      'settings',
      'experiences',
      'courses',
      'why_us'
    ]::TEXT[])
  LOOP
    -- Public Read-Only Policy
    EXECUTE format('CREATE POLICY "Public Read Portfolio %s" ON %I FOR SELECT TO anon, authenticated, public USING (true);', tbl, tbl);
    
    -- Admin Modify Policies (Insert, Update, Delete restricted to admin email or service role)
    EXECUTE format('CREATE POLICY "Admin Insert Portfolio %s" ON %I FOR INSERT TO authenticated WITH CHECK ((auth.jwt() ->> ''email'') = ''mushahidrafiqe744@gmail.com'' OR auth.role() = ''service_role'');', tbl, tbl);
    EXECUTE format('CREATE POLICY "Admin Update Portfolio %s" ON %I FOR UPDATE TO authenticated USING ((auth.jwt() ->> ''email'') = ''mushahidrafiqe744@gmail.com'' OR auth.role() = ''service_role'') WITH CHECK ((auth.jwt() ->> ''email'') = ''mushahidrafiqe744@gmail.com'' OR auth.role() = ''service_role'');', tbl, tbl);
    EXECUTE format('CREATE POLICY "Admin Delete Portfolio %s" ON %I FOR DELETE TO authenticated USING ((auth.jwt() ->> ''email'') = ''mushahidrafiqe744@gmail.com'' OR auth.role() = ''service_role'');', tbl, tbl);
  END LOOP;
END $$;

-- 5B. Messages Table: Public Submit (INSERT), Admin Read/Delete
CREATE POLICY "Public Insert Messages" ON messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin Select Messages" ON messages FOR SELECT TO authenticated USING ((auth.jwt() ->> 'email') = 'mushahidrafiqe744@gmail.com' OR auth.role() = 'service_role');
CREATE POLICY "Admin Update Messages" ON messages FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') = 'mushahidrafiqe744@gmail.com' OR auth.role() = 'service_role') WITH CHECK ((auth.jwt() ->> 'email') = 'mushahidrafiqe744@gmail.com' OR auth.role() = 'service_role');
CREATE POLICY "Admin Delete Messages" ON messages FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') = 'mushahidrafiqe744@gmail.com' OR auth.role() = 'service_role');

-- STEP 6: Configure Supabase Realtime Publication
DO $$
DECLARE
  tbl TEXT;
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    FOR tbl IN
      SELECT unnest(ARRAY[
        'profiles',
        'projects',
        'skills',
        'services',
        'testimonials',
        'settings',
        'experiences',
        'courses',
        'why_us'
      ]::TEXT[])
    LOOP
      BEGIN
        EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I;', tbl);
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
    END LOOP;
  END IF;
END $$;

-- STEP 7: Seed Initial Profile Record
INSERT INTO profiles (id, name, title, email, phone, whatsapp, avatar_url, projects_completed, years_of_experience, happy_clients)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Mushahid Hussain',
  'Web Developer',
  'mushahidrafiqe744@gmail.com',
  '03290725117',
  '03290725117',
  'https://i.pinimg.com/736x/69/0e/ee/690eee1da722bcf952fa4893995ac008.jpg',
  '50+',
  '8+',
  '99%'
) ON CONFLICT (id) DO NOTHING;
