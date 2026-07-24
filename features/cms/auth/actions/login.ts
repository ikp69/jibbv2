"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loginSchema, type LoginInput } from "../schemas/login-schema";
import { headers } from "next/headers";
import { getCurrentSessionId } from "@/lib/supabase/auth-guard";
import { SessionService } from "@/lib/services/session-service";
import { AuditService } from "@/lib/services/audit-service";
import { isRateLimited } from "@/lib/utils/rate-limiter";

export type LoginResult = {
  success: boolean;
  error?: string;
  role?: "admin" | "member";
  redirectUrl?: string;
};

// Configuration Parameters
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

function devLog(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}

function parseUserAgent(uaString: string) {
  let browser = "Other";
  let os = "Other";
  const ua = uaString.toLowerCase();

  if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("chrome") && !ua.includes("chromium")) browser = "Chrome";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("edge")) browser = "Edge";
  else if (ua.includes("opera") || ua.includes("opr")) browser = "Opera";

  if (ua.includes("win")) os = "Windows";
  else if (ua.includes("mac")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";

  return { browser, os };
}

export async function login(input: LoginInput): Promise<LoginResult> {
  try {
    const headersList = await headers();
    const clientIp = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const { rateLimited, resetSeconds } = await isRateLimited(`login:${clientIp}`, 5, 60);
    if (rateLimited) {
      return {
        success: false,
        error: `Too many login attempts from your network. Please wait ${resetSeconds} seconds before trying again.`,
      };
    }

    devLog("[LOGIN] 1. Starting login process");

    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
      devLog("[LOGIN] Schema validation failed:", parsed.error.issues);
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input data",
      };
    }

    const { email, password } = parsed.data;
    const adminClient = createAdminClient();

    // 1. Lockout Check before authentication attempt
    const { data: preProfile } = await adminClient
      .from("profiles")
      .select("id, status, failed_attempts, locked_until")
      .eq("email", email)
      .maybeSingle();

    if (preProfile && preProfile.locked_until) {
      const lockedUntil = new Date(preProfile.locked_until);
      if (lockedUntil > new Date()) {
        const remainingMinutes = Math.ceil((lockedUntil.getTime() - Date.now()) / (60 * 1000));
        return {
          success: false,
          error: `This account is temporarily locked due to multiple failed login attempts. Please try again in ${remainingMinutes} minutes.`,
        };
      }
    }

    devLog("[LOGIN] 2. Initializing Supabase auth client");
    const supabase = await createClient();

    // 2. Attempt authentication via Supabase Auth
    devLog("[LOGIN] 3. Authenticating user credentials");
    let authData, authError;
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      authData = result.data;
      authError = result.error;
    } catch (signInException) {
      console.error("[LOGIN] Exception encountered during credential check:", signInException);
      return {
        success: false,
        error: `Authentication service error: ${signInException instanceof Error ? signInException.message : "Unknown error"}`,
      };
    }

    // 3. Handle Auth Failures & Record Failed Attempts
    if (authError || !authData?.user) {
      devLog("[LOGIN] Authentication failed:", authError?.message);

      if (preProfile) {
        const attempts = (preProfile.failed_attempts || 0) + 1;
        const updates: { failed_attempts: number; last_failed_login: string; locked_until?: string } = {
          failed_attempts: attempts,
          last_failed_login: new Date().toISOString(),
        };

        if (attempts >= MAX_LOGIN_ATTEMPTS) {
          updates.locked_until = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000).toISOString();
        }

        await adminClient
          .from("profiles")
          .update(updates)
          .eq("id", preProfile.id);

        await AuditService.log({
          userId: preProfile.id,
          action: "login_failure",
          tableName: "profiles",
          recordId: preProfile.id,
          oldValues: { failed_attempts: preProfile.failed_attempts },
          newValues: { failed_attempts: attempts, locked_until: updates.locked_until || null },
        });
      }

      return {
        success: false,
        error: authError?.message || "Invalid email or password",
      };
    }

    const userId = authData.user.id;
    devLog("[LOGIN] 4. User authenticated successfully:", userId);

    // 4. Fetch linked Profile metadata
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("role, status")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      devLog("[LOGIN] Profile query failed for user:", userId, profileError);
      try {
        await supabase.auth.signOut();
      } catch (e) {
        devLog("[LOGIN] SignOut cleanup failed:", e);
      }
      return {
        success: false,
        error: "No account profile linked to this user.",
      };
    }

    if (profile.status !== "active") {
      devLog("[LOGIN] Account is not active:", profile.status);
      try {
        await supabase.auth.signOut();
      } catch (e) {
        devLog("[LOGIN] SignOut cleanup failed:", e);
      }
      return {
        success: false,
        error: "Your account is currently inactive. Please contact the administrator.",
      };
    }

    // 5. Extract Session Signature (sid) and create Session record
    const token = authData.session?.access_token;
    const sid = getCurrentSessionId(token);

    if (!sid) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        devLog("[LOGIN] SignOut cleanup failed on missing sid:", e);
      }
      return {
        success: false,
        error: "Authentication failed. Could not verify session identifier.",
      };
    }

    const userAgent = headersList.get("user-agent") || "Unknown";
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;
    const country = headersList.get("x-vercel-ip-country") || undefined;
    const city = headersList.get("x-vercel-ip-city") || undefined;

    const { browser, os } = parseUserAgent(userAgent);

    // Register active session via database RPC transaction
    await SessionService.createSession(userId, sid, {
      browser,
      operatingSystem: os,
      userAgent,
      ipAddress,
      country,
      city,
    });

    // 6. Reset Lockout parameters upon successful authentication
    await adminClient
      .from("profiles")
      .update({
        failed_attempts: 0,
        locked_until: null,
        successful_login: new Date().toISOString(),
      })
      .eq("id", userId);

    // 7. Insert Login Success Audit Record
    await AuditService.log({
      userId,
      action: "login_success",
      tableName: "profiles",
      recordId: userId,
      oldValues: null,
      newValues: { email, role: profile.role, session_id: sid },
    });

    const role = profile.role as "admin" | "member";
    const redirectUrl = role === "admin" ? "/admin/dashboard" : "/portal/dashboard";

    return {
      success: true,
      role,
      redirectUrl,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("[LOGIN] Unexpected error during login flow:", errorMessage, err);
    return {
      success: false,
      error: `Server error: ${errorMessage}`,
    };
  }
}


