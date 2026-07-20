-- Create introduction_requests table
CREATE TABLE IF NOT EXISTS public.introduction_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_member_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  objective text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending', 'approved', 'rejected'])),
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.introduction_requests ENABLE ROW LEVEL SECURITY;

-- Select Policy: Admins or the owner (requester) can view
CREATE POLICY introduction_requests_select_policy ON public.introduction_requests
  FOR SELECT USING (public.is_admin() OR requester_id = auth.uid());

-- Insert Policy: Authenticated members inserting their own connection requests
CREATE POLICY introduction_requests_insert_policy ON public.introduction_requests
  FOR INSERT WITH CHECK (requester_id = auth.uid());

-- Update Policy: Admins only (for changing status)
CREATE POLICY introduction_requests_update_policy ON public.introduction_requests
  FOR UPDATE USING (public.is_admin());

-- Delete Policy: Admins only
CREATE POLICY introduction_requests_delete_policy ON public.introduction_requests
  FOR DELETE USING (public.is_admin());

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_intro_requests_requester ON public.introduction_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_intro_requests_target ON public.introduction_requests(target_member_id);
CREATE INDEX IF NOT EXISTS idx_intro_requests_status ON public.introduction_requests(status);

-- Grant privileges
GRANT ALL ON TABLE public.introduction_requests TO postgres, service_role, authenticated;
