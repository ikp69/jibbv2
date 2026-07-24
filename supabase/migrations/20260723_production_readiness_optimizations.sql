-- Migration: 20260723_production_readiness_optimizations.sql
-- Goal: Production Readiness Phase 8 - Optimize indexes, improve RLS policies, atomic helpers, and rollback safety.

BEGIN;

-- 1. Optimized GIN & Partial Indexes for CMS Filtering
CREATE INDEX IF NOT EXISTS idx_resources_visible_tiers_gin ON public.resources USING GIN (visible_tiers);
CREATE INDEX IF NOT EXISTS idx_announcements_status_tiers_gin ON public.announcements USING GIN (visible_tiers) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_business_opps_status_tiers_gin ON public.business_opportunities USING GIN (visible_tiers) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_collaboration_opps_status_tiers_gin ON public.collaboration_opportunities USING GIN (visible_tiers) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_events_status_tiers_gin ON public.events USING GIN (visible_tiers) WHERE status = 'open';
CREATE INDEX IF NOT EXISTS idx_training_status_tiers_gin ON public.training_programs USING GIN (visible_tiers) WHERE status = 'open';

-- 2. Foreign Key Indexes for Fast Member Joins & Interest Queries
CREATE INDEX IF NOT EXISTS idx_opp_interest_opp_id ON public.opportunity_interest(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opp_interest_member_id ON public.opportunity_interest(member_id);
CREATE INDEX IF NOT EXISTS idx_collab_interest_collab_id ON public.collaboration_interest(collaboration_id);
CREATE INDEX IF NOT EXISTS idx_collab_interest_member_id ON public.collaboration_interest(member_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_member_id ON public.event_registrations(member_id);
CREATE INDEX IF NOT EXISTS idx_training_reg_training_id ON public.training_registrations(training_id);
CREATE INDEX IF NOT EXISTS idx_training_reg_member_id ON public.training_registrations(member_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_table ON public.audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);

-- 3. Atomic Resource Download Count Increment Helper
CREATE OR REPLACE FUNCTION public.increment_resource_download_count(resource_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.resources
  SET download_count = COALESCE(download_count, 0) + 1,
      updated_at = now()
  WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RLS Compatibility Optimization for Session Security
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sessions_select_policy ON public.sessions;
CREATE POLICY sessions_select_policy ON public.sessions
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS sessions_update_policy ON public.sessions;
CREATE POLICY sessions_update_policy ON public.sessions
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS sessions_insert_policy ON public.sessions;
CREATE POLICY sessions_insert_policy ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 5. Grant Permissions to Service Roles
GRANT EXECUTE ON FUNCTION public.increment_resource_download_count(uuid) TO postgres, service_role, authenticated;

COMMIT;
