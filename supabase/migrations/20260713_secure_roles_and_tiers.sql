-- migration: 20260713_secure_roles_and_tiers.sql
-- Goal: Prevent non-admins from changing their role or membership_tier in public.profiles.

CREATE OR REPLACE FUNCTION public.check_profile_update_restrictions()
RETURNS trigger AS $$
BEGIN
  -- We check if the current user is an admin.
  -- public.is_admin() checks if the auth.uid() has role = 'admin' in profiles table.
  IF NOT public.is_admin() THEN
    -- If they are not an admin, they are not allowed to change role or membership_tier.
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'You do not have permission to modify your role.';
    END IF;
    IF NEW.membership_tier IS DISTINCT FROM OLD.membership_tier THEN
      RAISE EXCEPTION 'You do not have permission to modify your membership tier.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS trg_check_profile_update_restrictions ON public.profiles;

CREATE TRIGGER trg_check_profile_update_restrictions
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_profile_update_restrictions();
