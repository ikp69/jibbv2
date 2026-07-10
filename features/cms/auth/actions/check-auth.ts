"use server";

import { createClient } from "@/lib/supabase/server";

export type AuthStatus = {
  isAuthenticated: boolean;
  role?: "admin" | "member";
  dashboardUrl?: string;
};

export async function checkAuthStatus(): Promise<AuthStatus> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        isAuthenticated: false,
      };
    }

    // Fetch profile to get role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();

    if (!profile || profile.status !== "active") {
      return {
        isAuthenticated: false,
      };
    }

    const role = profile.role as "admin" | "member";
    const dashboardUrl = role === "admin" ? "/admin/dashboard" : "/portal/dashboard";

    return {
      isAuthenticated: true,
      role,
      dashboardUrl,
    };
  } catch (err) {
    console.error("[CHECK_AUTH] Error:", err);
    return {
      isAuthenticated: false,
    };
  }
}
