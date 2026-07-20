-- Migration: Fix opportunity_interest select policy to allow opportunity creators to view approved incoming pitches
DROP POLICY IF EXISTS opportunity_interest_select_policy ON public.opportunity_interest;

CREATE POLICY opportunity_interest_select_policy ON public.opportunity_interest
  FOR SELECT USING (
    public.is_admin() OR 
    member_id = auth.uid() OR 
    (
      status = 'approved' AND
      EXISTS (
        SELECT 1 FROM public.business_opportunities 
        WHERE public.business_opportunities.id = opportunity_id 
        AND public.business_opportunities.created_by = auth.uid()
      )
    )
  );
