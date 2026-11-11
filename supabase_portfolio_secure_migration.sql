-- ==============================================================================
-- NARROWLY SCOPED SECURE RLS MIGRATION FOR PORTFOLIO & TESTIMONIALS ONLY
-- Tables affected: profiles, projects, skills, services, testimonials, settings, experiences, courses, why_us
-- Unrelated tables (e.g. messages) and their policies are 100% untouched.
-- ==============================================================================

-- 1. Ensure RLS is enabled on portfolio & feedback tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_us ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing portfolio & feedback policies safely if they exist
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
    EXECUTE format('DROP POLICY IF EXISTS "Public Read Portfolio %s" ON %I;', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Admin Insert Portfolio %s" ON %I;', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Admin Update Portfolio %s" ON %I;', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Admin Delete Portfolio %s" ON %I;', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Public Full Access Portfolio" ON %I;', tbl, tbl);
  END LOOP;
END $$;

-- 3. Create Strict Secure Policies: Public Read-Only, Admin Write-Only (mushahidrafiqe744@gmail.com)
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
    -- Public Visitors: Read-Only (SELECT)
    EXECUTE format('CREATE POLICY "Public Read Portfolio %s" ON %I FOR SELECT TO anon, authenticated, public USING (true);', tbl, tbl);
    
    -- Authenticated Admin Only: INSERT, UPDATE, DELETE (mushahidrafiqe744@gmail.com)
    EXECUTE format('CREATE POLICY "Admin Insert Portfolio %s" ON %I FOR INSERT TO authenticated WITH CHECK ((auth.jwt() ->> ''email'') = ''mushahidrafiqe744@gmail.com'' OR auth.role() = ''service_role'');', tbl, tbl);
    EXECUTE format('CREATE POLICY "Admin Update Portfolio %s" ON %I FOR UPDATE TO authenticated USING ((auth.jwt() ->> ''email'') = ''mushahidrafiqe744@gmail.com'' OR auth.role() = ''service_role'') WITH CHECK ((auth.jwt() ->> ''email'') = ''mushahidrafiqe744@gmail.com'' OR auth.role() = ''service_role'');', tbl, tbl);
    EXECUTE format('CREATE POLICY "Admin Delete Portfolio %s" ON %I FOR DELETE TO authenticated USING ((auth.jwt() ->> ''email'') = ''mushahidrafiqe744@gmail.com'' OR auth.role() = ''service_role'');', tbl, tbl);
  END LOOP;
END $$;
