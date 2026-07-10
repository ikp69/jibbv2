-- migration: 20260711_add_collaboration_fields.sql
-- Goal: Add missing fields to collaboration_opportunities table for partnerships, delegations, trade missions, and investment tracking

ALTER TABLE public.collaboration_opportunities
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'partnerships' CHECK (category = ANY (ARRAY['partnerships', 'delegations', 'tradeMissions', 'investment'])),
  ADD COLUMN IF NOT EXISTS direction text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS location text NOT NULL DEFAULT '';

-- Create index for better performance on category lookups
CREATE INDEX IF NOT EXISTS idx_collaboration_opportunities_category ON public.collaboration_opportunities(category);
