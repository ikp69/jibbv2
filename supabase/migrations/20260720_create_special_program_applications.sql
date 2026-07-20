-- Migration: Create special_program_applications table for delegations and exhibition forms
CREATE TABLE IF NOT EXISTS public.special_program_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  form_type text NOT NULL CHECK (form_type = ANY (ARRAY['exhibition_support', 'delegation_japan', 'delegation_meet'])),
  status text NOT NULL DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending', 'approved', 'rejected'])),
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.special_program_applications ENABLE ROW LEVEL SECURITY;

-- Select Policy: Admins or the owning member
CREATE POLICY special_program_applications_select_policy ON public.special_program_applications
  FOR SELECT USING (public.is_admin() OR member_id = auth.uid());

-- Insert Policy: Authenticated members inserting their own record
CREATE POLICY special_program_applications_insert_policy ON public.special_program_applications
  FOR INSERT WITH CHECK (member_id = auth.uid());

-- Update Policy: Admins only (for changing status)
CREATE POLICY special_program_applications_update_policy ON public.special_program_applications
  FOR UPDATE USING (public.is_admin());

-- Delete Policy: Admins only
CREATE POLICY special_program_applications_delete_policy ON public.special_program_applications
  FOR DELETE USING (public.is_admin());

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_special_program_apps_member_id ON public.special_program_applications(member_id);
CREATE INDEX IF NOT EXISTS idx_special_program_apps_form_type ON public.special_program_applications(form_type);
CREATE INDEX IF NOT EXISTS idx_special_program_apps_status ON public.special_program_applications(status);

-- Grant privileges
GRANT ALL ON TABLE public.special_program_applications TO postgres, service_role, authenticated;
