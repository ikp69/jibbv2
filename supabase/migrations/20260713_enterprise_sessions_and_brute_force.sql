-- Migration: 20260713_enterprise_sessions_and_brute_force.sql
-- Goal: Create sessions table for device tracking, session management, and brute-force tracking fields.

-- 1. Create sessions table
CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id text NOT NULL UNIQUE, -- Maps to JWT 'sid' claim
  device_name text,
  browser text,
  operating_system text,
  user_agent text NOT NULL,
  ip_address inet,
  country text,
  city text,
  login_at timestamptz NOT NULL DEFAULT now(),
  last_activity timestamptz NOT NULL DEFAULT now(),
  logout_at timestamptz,
  revoked_at timestamptz,
  revoked_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  revoke_reason text CHECK (revoke_reason IN (
    'user_logout', 'new_login', 'admin_logout', 'password_changed', 
    'account_disabled', 'account_deleted', 'security_event', 'expired', 
    'manual', 'system'
  )),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Compound and single optimizing indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_revoked ON public.sessions(user_id, revoked_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user_activity ON public.sessions(user_id, last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_login_at ON public.sessions(login_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_lookup ON public.sessions(session_id);

-- 3. Add brute-force tracking columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS failed_attempts integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS locked_until timestamptz,
  ADD COLUMN IF NOT EXISTS last_failed_login timestamptz,
  ADD COLUMN IF NOT EXISTS successful_login timestamptz;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for sessions table
DROP POLICY IF EXISTS sessions_select_policy ON public.sessions;
CREATE POLICY sessions_select_policy ON public.sessions
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS sessions_update_policy ON public.sessions;
CREATE POLICY sessions_update_policy ON public.sessions
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS sessions_insert_policy ON public.sessions;
CREATE POLICY sessions_insert_policy ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 6. Grant rights to authenticated and helper roles
GRANT ALL ON TABLE public.sessions TO postgres, service_role, authenticated;

-- 7. Database transaction RPC for single session creation
CREATE OR REPLACE FUNCTION public.create_new_session_tx(
  p_user_id uuid,
  p_session_id text,
  p_device_name text,
  p_browser text,
  p_operating_system text,
  p_user_agent text,
  p_ip_address inet,
  p_country text,
  p_city text
)
RETURNS void AS $$
BEGIN
  -- 1. Revoke all previous active sessions
  UPDATE public.sessions
  SET revoked_at = now(),
      revoked_by = p_user_id,
      revoke_reason = 'new_login'
  WHERE user_id = p_user_id AND revoked_at IS NULL;

  -- 2. Insert new session
  INSERT INTO public.sessions (
    user_id, session_id, device_name, browser, operating_system, user_agent, ip_address, country, city
  ) VALUES (
    p_user_id, p_session_id, p_device_name, p_browser, p_operating_system, p_user_agent, p_ip_address, p_country, p_city
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

