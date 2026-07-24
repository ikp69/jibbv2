"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";

export type AuthStatus = {
  isAuthenticated: boolean;
  role?: "admin" | "member";
  dashboardUrl?: string;
};

export async function checkAuthStatus(): Promise<AuthStatus> {
  try {
    const authResult = await verifyServerRequest();

    if (!authResult.valid) {
      return {
        isAuthenticated: false,
      };
    }

    const { profile } = authResult;
    const role = profile.role as "admin" | "member";
    const dashboardUrl = role === "admin" ? "/admin/dashboard" : "/portal/dashboard";

    return {
      isAuthenticated: true,
      role,
      dashboardUrl,
    };
  } catch (err) {
    console.error("[CHECK_AUTH] Exception during checkAuthStatus:", err);
    return {
      isAuthenticated: false,
    };
  }
}

