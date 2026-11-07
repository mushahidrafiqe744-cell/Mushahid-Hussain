# Implementation Plan: Portfolio CMS Integration

I will transform your existing portfolio into a fully manageable CMS using Supabase as the backend.

## Phase 1: Database Architecture (Supabase)
1.  **Define Schema:** Create tables in Supabase for:
    - `profiles` (Hero, About, Contact info)
    - `projects`
    - `skills`
    - `services`
    - `testimonials`
    - `settings` (Theme, SEO, Navbar)
2.  **Enable RLS:** Set up Row Level Security policies to ensure only authenticated admins can perform CRUD operations.
3.  **Storage Buckets:** Create a storage bucket in Supabase for project images, profile pictures, and favicons.

## Phase 2: Backend/Service Layer
1.  **Supabase Client:** Refine `src/lib/supabase.ts` for full CRUD operations.
2.  **CMS Service API:** Create a central service `src/services/cms.ts` to fetch and update data from Supabase, bridging the gap between the DB and your UI components.

## Phase 3: Admin CMS Implementation (The UI)
1.  **Refine Dashboard:** Expand `DashboardLayout` and `AdminDashboard` into a full CMS.
2.  **Management Modules:** Build React forms for each section (Hero, Projects, etc.) that interact with Supabase.
3.  **File Upload:** Integrate Supabase Storage uploads within the Admin forms.

## Phase 4: Portfolio Integration
1.  **Dynamic Loading:** Replace the static `data/portfolioData.ts` and component hardcoded data with dynamic fetching from Supabase in your `App.tsx` or main `PortfolioMain` component using `useEffect`.
2.  **Live Updates:** Use Supabase Realtime to update the website instantly when data is saved in the Admin Panel.

## Phase 5: Build & Verification
1.  Verify RLS policies.
2.  Test CRUD functionality for all sections.
3.  Ensure existing layout remains unchanged.

---
**Note:** This plan requires you to have a Supabase project ready. Please ensure your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured in your environment variables.
