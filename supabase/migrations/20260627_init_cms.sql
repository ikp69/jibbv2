-- migration: 20260627_init_cms.sql
-- Goal: Set up database tables, RLS policies, helper functions, indexes, and Storage Buckets for Member Portal & Admin CMS.

-- 1. CLEANUP OLD TABLES
DROP TABLE IF EXISTS public.members CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;
DROP TABLE IF EXISTS public.premium_resources CASCADE;
DROP TABLE IF EXISTS public.member_files CASCADE;
DROP TABLE IF EXISTS public.business_matches CASCADE;
DROP TABLE IF EXISTS public.resource_downloads CASCADE;
DROP TABLE IF EXISTS public.opportunity_interest CASCADE;
DROP TABLE IF EXISTS public.business_opportunities CASCADE;
DROP TABLE IF EXISTS public.collaboration_interest CASCADE;
DROP TABLE IF EXISTS public.collaboration_opportunities CASCADE;
DROP TABLE IF EXISTS public.event_registrations CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.training_registrations CASCADE;
DROP TABLE IF EXISTS public.training_programs CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.resources CASCADE;

-- 2. ALTER PROFILES TABLE
-- Temporarily update role values to avoid check constraint violations
UPDATE public.profiles SET role = 'member' WHERE role = 'user' OR role IS NULL;
UPDATE public.profiles SET role = 'admin' WHERE id = '685189d1-a660-48b2-b52c-7b02281dd4ab';

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_membership_tier_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ALTER COLUMN membership_tier SET DEFAULT 'associate',
  ADD CONSTRAINT profiles_membership_tier_check CHECK (membership_tier = ANY (ARRAY['associate', 'silver', 'gold', 'platinum', 'admin'])),
  ALTER COLUMN role SET DEFAULT 'member',
  ADD CONSTRAINT profiles_role_check CHECK (role = ANY (ARRAY['admin', 'member']));

-- Add organization profiles columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text UNIQUE,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status = ANY (ARRAY['active', 'pending', 'expired', 'suspended', 'archived'])),
  ADD COLUMN IF NOT EXISTS show_in_directory boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS company_logo text,
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS company_description text,
  ADD COLUMN IF NOT EXISTS looking_for text[];

-- Ensure the existing admin user has the correct role and is active
UPDATE public.profiles
SET role = 'admin', membership_tier = 'admin', is_active = true
WHERE id = '685189d1-a660-48b2-b52c-7b02281dd4ab';

-- 3. HELPER FUNCTIONS FOR SECURITY
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
ALTER FUNCTION public.is_admin() OWNER TO postgres;

-- 4. CREATE NEW TABLES

-- Resources (unified table)
CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category = ANY (ARRAY['Market Intelligence', 'Reports', 'Training', 'Guidelines', 'Case Studies', 'Forms', 'Other'])),
  resource_type text NOT NULL CHECK (resource_type = ANY (ARRAY['pdf', 'image', 'video', 'spreadsheet', 'presentation', 'document'])),
  thumbnail_url text,
  file_url text NOT NULL,
  file_size bigint,
  tags text[] DEFAULT '{}'::text[],
  visible_tiers text[] NOT NULL DEFAULT '{}'::text[],
  download_count integer DEFAULT 0,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Announcements
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  banner_image text,
  attachment text,
  external_link text,
  visible_tiers text[] NOT NULL DEFAULT '{}'::text[],
  is_pinned boolean DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status = ANY (ARRAY['draft', 'published', 'archived'])),
  publish_date timestamptz DEFAULT timezone('utc'::text, now()),
  expiry_date timestamptz,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Business Opportunities
CREATE TABLE public.business_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  industry text NOT NULL CHECK (industry = ANY (ARRAY['Semiconductors', 'Manufacturing', 'Healthcare', 'Automotive', 'Electronics', 'Energy', 'Infrastructure', 'Food', 'General'])),
  country text NOT NULL CHECK (country = ANY (ARRAY['Japan', 'India', 'Both'])),
  looking_for text[] NOT NULL DEFAULT '{}'::text[],
  deadline timestamptz NOT NULL,
  visible_tiers text[] NOT NULL DEFAULT '{}'::text[],
  status text NOT NULL DEFAULT 'draft' CHECK (status = ANY (ARRAY['draft', 'published', 'closed'])),
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Opportunity Interest
CREATE TABLE public.opportunity_interest (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.business_opportunities(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  supporting_document_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending', 'reviewed', 'approved', 'closed', 'rejected'])),
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Collaboration Opportunities
CREATE TABLE public.collaboration_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  industry text NOT NULL,
  visible_tiers text[] NOT NULL DEFAULT '{}'::text[],
  status text NOT NULL DEFAULT 'draft' CHECK (status = ANY (ARRAY['draft', 'published', 'closed'])),
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Collaboration Interest
CREATE TABLE public.collaboration_interest (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collaboration_id uuid NOT NULL REFERENCES public.collaboration_opportunities(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending', 'reviewed', 'approved', 'closed', 'rejected'])),
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  banner text,
  location text NOT NULL,
  event_date timestamptz NOT NULL,
  registration_deadline timestamptz NOT NULL,
  capacity integer NOT NULL,
  visible_tiers text[] NOT NULL DEFAULT '{}'::text[],
  status text NOT NULL DEFAULT 'draft' CHECK (status = ANY (ARRAY['draft', 'open', 'closed', 'completed', 'cancelled'])),
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Event Registrations
CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending', 'approved', 'rejected'])),
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Training Programs
CREATE TABLE public.training_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category = ANY (ARRAY['Culture', 'Language', 'Corporate', 'Leadership', 'Problem Solving', 'Workshop', 'Seminar'])),
  duration text NOT NULL,
  location text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  capacity integer NOT NULL,
  visible_tiers text[] NOT NULL DEFAULT '{}'::text[],
  status text NOT NULL DEFAULT 'draft' CHECK (status = ANY (ARRAY['draft', 'open', 'closed', 'completed'])),
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Training Registrations
CREATE TABLE public.training_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id uuid NOT NULL REFERENCES public.training_programs(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending', 'approved', 'rejected'])),
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Resource Downloads
CREATE TABLE public.resource_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Audit Logs
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_interest ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_interest ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 6. CREATE RLS POLICIES

-- Helper to fetch current user's membership tier
CREATE OR REPLACE FUNCTION public.get_my_tier()
RETURNS text AS $$
  SELECT membership_tier FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY profiles_select_policy ON public.profiles
  FOR SELECT USING (auth.uid() = id OR (role = 'member' AND status = 'active') OR public.is_admin());

CREATE POLICY profiles_update_policy ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

CREATE POLICY profiles_insert_policy ON public.profiles
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY profiles_delete_policy ON public.profiles
  FOR DELETE USING (public.is_admin());

-- Resources Policies
CREATE POLICY resources_select_policy ON public.resources
  FOR SELECT USING (public.is_admin() OR visible_tiers && ARRAY[public.get_my_tier()]);

CREATE POLICY resources_write_policy ON public.resources
  FOR ALL USING (public.is_admin());

-- Announcements Policies
CREATE POLICY announcements_select_policy ON public.announcements
  FOR SELECT USING (public.is_admin() OR (status = 'published' AND visible_tiers && ARRAY[public.get_my_tier()]));

CREATE POLICY announcements_write_policy ON public.announcements
  FOR ALL USING (public.is_admin());

-- Business Opportunities Policies
CREATE POLICY business_opportunities_select_policy ON public.business_opportunities
  FOR SELECT USING (public.is_admin() OR (status = 'published' AND visible_tiers && ARRAY[public.get_my_tier()]));

CREATE POLICY business_opportunities_write_policy ON public.business_opportunities
  FOR ALL USING (public.is_admin());

-- Opportunity Interest Policies
CREATE POLICY opportunity_interest_select_policy ON public.opportunity_interest
  FOR SELECT USING (public.is_admin() OR member_id = auth.uid());

CREATE POLICY opportunity_interest_insert_policy ON public.opportunity_interest
  FOR INSERT WITH CHECK (member_id = auth.uid());

CREATE POLICY opportunity_interest_write_policy ON public.opportunity_interest
  FOR ALL USING (public.is_admin() OR member_id = auth.uid());

-- Collaboration Opportunities Policies
CREATE POLICY collaboration_opportunities_select_policy ON public.collaboration_opportunities
  FOR SELECT USING (public.is_admin() OR (status = 'published' AND visible_tiers && ARRAY[public.get_my_tier()]));

CREATE POLICY collaboration_opportunities_write_policy ON public.collaboration_opportunities
  FOR ALL USING (public.is_admin());

-- Collaboration Interest Policies
CREATE POLICY collaboration_interest_select_policy ON public.collaboration_interest
  FOR SELECT USING (public.is_admin() OR member_id = auth.uid());

CREATE POLICY collaboration_interest_insert_policy ON public.collaboration_interest
  FOR INSERT WITH CHECK (member_id = auth.uid());

CREATE POLICY collaboration_interest_write_policy ON public.collaboration_interest
  FOR ALL USING (public.is_admin() OR member_id = auth.uid());

-- Events Policies
CREATE POLICY events_select_policy ON public.events
  FOR SELECT USING (public.is_admin() OR (status = 'open' AND visible_tiers && ARRAY[public.get_my_tier()]));

CREATE POLICY events_write_policy ON public.events
  FOR ALL USING (public.is_admin());

-- Event Registrations Policies
CREATE POLICY event_registrations_select_policy ON public.event_registrations
  FOR SELECT USING (public.is_admin() OR member_id = auth.uid());

CREATE POLICY event_registrations_insert_policy ON public.event_registrations
  FOR INSERT WITH CHECK (member_id = auth.uid());

CREATE POLICY event_registrations_write_policy ON public.event_registrations
  FOR ALL USING (public.is_admin() OR member_id = auth.uid());

-- Training Programs Policies
CREATE POLICY training_programs_select_policy ON public.training_programs
  FOR SELECT USING (public.is_admin() OR (status = 'open' AND visible_tiers && ARRAY[public.get_my_tier()]));

CREATE POLICY training_programs_write_policy ON public.training_programs
  FOR ALL USING (public.is_admin());

-- Training Registrations Policies
CREATE POLICY training_registrations_select_policy ON public.training_registrations
  FOR SELECT USING (public.is_admin() OR member_id = auth.uid());

CREATE POLICY training_registrations_insert_policy ON public.training_registrations
  FOR INSERT WITH CHECK (member_id = auth.uid());

CREATE POLICY training_registrations_write_policy ON public.training_registrations
  FOR ALL USING (public.is_admin() OR member_id = auth.uid());

-- Resource Downloads Policies
CREATE POLICY resource_downloads_select_policy ON public.resource_downloads
  FOR SELECT USING (public.is_admin() OR member_id = auth.uid());

CREATE POLICY resource_downloads_insert_policy ON public.resource_downloads
  FOR INSERT WITH CHECK (member_id = auth.uid());

-- Audit Logs Policies
CREATE POLICY audit_logs_select_policy ON public.audit_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY audit_logs_insert_policy ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- 7. CREATING INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_membership_tier ON public.profiles(membership_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_industry ON public.profiles(industry);
CREATE INDEX IF NOT EXISTS idx_profiles_company_name ON public.profiles(company_name);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_announcements_publish_date ON public.announcements(publish_date);
CREATE INDEX IF NOT EXISTS idx_business_opportunities_deadline ON public.business_opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_training_programs_start_date ON public.training_programs(start_date);

-- 8. GRANT PRIVILEGES to standard Supabase authenticated and helper service roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role, authenticated;

