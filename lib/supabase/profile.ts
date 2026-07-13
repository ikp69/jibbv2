import { cache } from "react";
import { createClient } from "./server";

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  designation: string | null;
  membership_tier: string;
  role: string;
  status: string;
  country: string | null;
  city: string | null;
  website: string | null;
  company_logo: string | null;
}

export interface AuthContext {
  user: any | null;
  profile: UserProfile | null;
  role: string | null;
  membershipTier: string | null;
  locale: "en" | "ja";
  status: string | null;
  country: string | null;
  permissions: any[];
  error: any | null;
}

/**
 * Retrieves the current authenticated user and their profile from Supabase.
 * Wrapped in React's cache() to ensure a single request lifecycle executes 
 * at most one database query. Returns a unified AuthContext object.
 */
export const getCachedProfile = cache(async (): Promise<AuthContext> => {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        user: null,
        profile: null,
        role: null,
        membershipTier: null,
        locale: "en",
        status: null,
        country: null,
        permissions: [],
        error: authError,
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, full_name, company_name, designation, membership_tier, role, status, country, city, website, company_logo")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return {
        user,
        profile: null,
        role: null,
        membershipTier: null,
        locale: "en",
        status: null,
        country: null,
        permissions: [],
        error: profileError,
      };
    }

    const isFromJapan = profile.country && profile.country.trim().toLowerCase() === "japan";
    const inferredLocale = isFromJapan ? "ja" : "en";

    return {
      user,
      profile: profile as UserProfile,
      role: profile.role,
      membershipTier: profile.membership_tier,
      locale: inferredLocale,
      status: profile.status,
      country: profile.country,
      permissions: [], // Can be populated with permissions from admins table if required
      error: null,
    };
  } catch (err) {
    return {
      user: null,
      profile: null,
      role: null,
      membershipTier: null,
      locale: "en",
      status: null,
      country: null,
      permissions: [],
      error: err instanceof Error ? err : new Error("Failed to load profile"),
    };
  }
});
