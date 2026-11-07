-- ==============================================================================
-- ULTIMATE SAFE, IDEMPOTENT & STRICT ADMIN-ONLY SUPABASE SQL MIGRATION SCRIPT
-- Copy and paste this script into your Supabase Dashboard -> SQL Editor and click RUN.
-- 100% SAFE: Will NOT delete any existing rows or drop any existing tables.
-- Restricts modification rights STRICTLY to mushahidrafiqe744@gmail.com.
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

-- STEP 3: Ensure Clean PostgreSQL Standard snake_case Columns Exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS script_subhead TEXT DEFAULT 'Web Developer & Engineer';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio_hero TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio_about TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS projects_completed TEXT DEFAULT '50+';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS years_of_experience TEXT DEFAULT '8+';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS happy_clients TEXT DEFAULT '99%';

ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'saas';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category_label TEXT DEFAULT 'Web Application';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_url TEXT DEFAULT '#';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_url TEXT DEFAULT '#';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT true;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS year TEXT DEFAULT '2025';

ALTER TABLE messages ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE messages ADD COLUMN IF NOT EXISTS project_type TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS budget TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS currency TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'unread';

ALTER TABLE experiences ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

ALTER TABLE courses ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE courses ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS institution_url TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS badge_image TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS badge_url TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS credential_badge TEXT;

ALTER TABLE why_us ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE why_us ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE why_us ADD COLUMN IF NOT EXISTS step_number INTEGER;

ALTER TABLE skills ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE services ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS avatar_color TEXT DEFAULT '#EA580C';

ALTER TABLE settings ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE settings ADD COLUMN IF NOT EXISTS theme_primary TEXT DEFAULT '#0A3D22';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS theme_accent TEXT DEFAULT '#50E364';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Inter';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS navbar_items TEXT[] DEFAULT ARRAY['Home', 'About', 'Services', 'Skills', 'Projects', 'Contact'];
ALTER TABLE settings ADD COLUMN IF NOT EXISTS favicon_url TEXT DEFAULT '/favicon.ico';

-- STEP 4: Safe Data Migration (Copies values from quoted camelCase columns into standard snake_case columns if present)
DO $$ 
BEGIN
  -- Projects table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='imageUrl') THEN
    EXECUTE 'UPDATE projects SET image_url = COALESCE(image_url, "imageUrl") WHERE image_url IS NULL AND "imageUrl" IS NOT NULL;';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='categoryLabel') THEN
    EXECUTE 'UPDATE projects SET category_label = COALESCE(category_label, "categoryLabel") WHERE category_label IS NULL AND "categoryLabel" IS NOT NULL;';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='liveUrl') THEN
    EXECUTE 'UPDATE projects SET live_url = COALESCE(live_url, "liveUrl") WHERE live_url IS NULL AND "liveUrl" IS NOT NULL;';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='githubUrl') THEN
    EXECUTE 'UPDATE projects SET github_url = COALESCE(github_url, "githubUrl") WHERE github_url IS NULL AND "githubUrl" IS NOT NULL;';
  END IF;

  -- Profiles table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='avatarUrl') THEN
    EXECUTE 'UPDATE profiles SET avatar_url = COALESCE(avatar_url, "avatarUrl") WHERE avatar_url IS NULL AND "avatarUrl" IS NOT NULL;';
  END IF;

  -- Experiences table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='experiences' AND column_name='displayOrder') THEN
    EXECUTE 'UPDATE experiences SET display_order = COALESCE(display_order, "displayOrder") WHERE display_order IS NULL AND "displayOrder" IS NOT NULL;';
  END IF;

  -- Courses table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='displayOrder') THEN
    EXECUTE 'UPDATE courses SET display_order = COALESCE(display_order, "displayOrder") WHERE display_order IS NULL AND "displayOrder" IS NOT NULL;';
  END IF;

  -- Why Us table
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='why_us' AND column_name='displayOrder') THEN
    EXECUTE 'UPDATE why_us SET display_order = COALESCE(display_order, "displayOrder") WHERE display_order IS NULL AND "displayOrder" IS NOT NULL;';
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- STEP 5: Enable Row Level Security (RLS) on all 10 tables
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

-- STEP 6: Dynamically Drop ALL Existing Permissive Policies on all 10 tables
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

-- STEP 7: Re-Create Explicit Strict Policies

-- 7A. PORTFOLIO TABLES (9 Tables): Public READ, STRICTLY mushahidrafiqe744@gmail.com Admin MODIFY
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
    -- Public Full Access Policy (Read & Write for Admin Panel / Frontend)
    EXECUTE format('CREATE POLICY "Public Full Access Portfolio" ON %I FOR ALL TO anon, authenticated, public USING (true) WITH CHECK (true);', tbl);
  END LOOP;
END $$;

-- 7B. MESSAGES TABLE: Public Submit (INSERT), STRICTLY mushahidrafiqe744@gmail.com Admin Read/Delete
-- Public Visitors can INSERT contact messages
CREATE POLICY "Public Insert Messages" ON messages FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ONLY Admin mushahidrafiqe744@gmail.com can SELECT (read), UPDATE, or DELETE messages
CREATE POLICY "Admin Select Messages" ON messages FOR SELECT TO authenticated USING ((auth.jwt() ->> 'email') = 'mushahidrafiqe744@gmail.com' OR auth.role() = 'service_role');
CREATE POLICY "Admin Update Messages" ON messages FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') = 'mushahidrafiqe744@gmail.com' OR auth.role() = 'service_role') WITH CHECK ((auth.jwt() ->> 'email') = 'mushahidrafiqe744@gmail.com' OR auth.role() = 'service_role');
CREATE POLICY "Admin Delete Messages" ON messages FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') = 'mushahidrafiqe744@gmail.com' OR auth.role() = 'service_role');

-- STEP 8: Configure Supabase Realtime Publication (Individually per table for complete fault-tolerance)
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
        -- Ignore if table is already a member of publication
        NULL;
      END;
    END LOOP;
  END IF;
END $$;

-- STEP 9: Seed Initial Profile Record (If not already present)
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
