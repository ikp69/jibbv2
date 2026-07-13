"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loginSchema, type LoginInput } from "../schemas/login-schema";
import { headers } from "next/headers";
import { getCurrentSessionId } from "@/lib/supabase/auth-guard";
import { SessionService } from "@/lib/services/session-service";

export type LoginResult = {
  success: boolean;
  error?: string;
  role?: "admin" | "member";
  redirectUrl?: string;
};

// Configuration Parameters
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

function devLog(...args: any[]) {
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
    devLog("[LOGIN] 1. Starting login");

    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
      devLog("[LOGIN] Validation failed:", parsed.error.issues);
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input data",
      };
    }

    const { email, password } = parsed.data;
    const adminClient = createAdminClient();

    // 1. Lockout Check before verification
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

    devLog("[LOGIN] 2. Creating Supabase client");
    const supabase = await createClient();

    // 2. Sign in via Supabase Authentication
    devLog("[LOGIN] 3. Attempting signInWithPassword");
    let authData, authError;
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      authData = result.data;
      authError = result.error;
      devLog("[LOGIN] 3a. signInWithPassword completed. User found:", authData?.user?.id);
    } catch (signInException) {
      console.error("[LOGIN] 3b. signInWithPassword threw exception:", signInException);
      return {
        success: false,
        error: `Auth error: ${signInException instanceof Error ? signInException.message : "Unknown"}`,
      };
    }

    // 3. Handle Auth Errors & Lockout Increments
    if (authError || !authData?.user) {
      devLog("[LOGIN] Auth error (non-exception):", authError);
      
      if (preProfile) {
        const attempts = (preProfile.failed_attempts || 0) + 1;
        const updates: any = {
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

        try {
          const headersList = await headers();
          const userAgent = headersList.get("user-agent");
          const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0];

          await adminClient.from("audit_logs").insert({
            user_id: preProfile.id,
            action: "login_failure",
            table_name: "profiles",
            record_id: preProfile.id,
            ip_address: ipAddress || null,
            user_agent: userAgent || null,
            old_values: { failed_attempts: preProfile.failed_attempts },
            new_values: { failed_attempts: attempts, locked_until: updates.locked_until || null },
          });
        } catch (e) {
          // Ignored
        }
      }

      return {
        success: false,
        error: authError?.message || "Invalid email or password",
      };
    }

    const userId = authData.user.id;
    devLog("[LOGIN] 4. User authenticated:", userId);

    // 4. Fetch User Profile
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("role, status")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      devLog("[LOGIN] Profile query error:", profileError);
      try {
        await supabase.auth.signOut();
      } catch (e) {
        devLog("[LOGIN] SignOut failed:", e);
      }
      return {
        success: false,
        error: "No account profile linked to this user.",
      };
    }

    if (profile.status !== "active") {
      devLog("[LOGIN] User inactive:", profile.status);
      try {
        await supabase.auth.signOut();
      } catch (e) {
        devLog("[LOGIN] SignOut failed:", e);
      }
      return {
        success: false,
        error: "Your account is currently inactive. Please contact the administrator.",
      };
    }

    // 5. Retrieve Token claims to find sid and Register active Session record
    const token = authData.session?.access_token;
    const sid = getCurrentSessionId(token);

    if (!sid) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
      return {
        success: false,
        error: "Authentication failed. Could not verify session identifier.",
      };
    }

    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "Unknown";
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;
    const country = headersList.get("x-vercel-ip-country") || undefined;
    const city = headersList.get("x-vercel-ip-city") || undefined;

    const { browser, os } = parseUserAgent(userAgent);

    // Create session in database. Under the hood, this revokes previous sessions in a database transaction.
    await SessionService.createSession(userId, sid, {
      browser,
      operatingSystem: os,
      userAgent,
      ipAddress,
      country,
      city,
    });

    // 6. Reset Lockout parameters atomically
    await adminClient
      .from("profiles")
      .update({
        failed_attempts: 0,
        locked_until: null,
        successful_login: new Date().toISOString(),
      })
      .eq("id", userId);

    // 7. Write Login Success Audit Log
    try {
      await adminClient.from("audit_logs").insert({
        user_id: userId,
        action: "login_success",
        table_name: "profiles",
        record_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        old_values: null,
        new_values: { email, role: profile.role, session_id: sid },
      });
    } catch (auditErr) {
      devLog("[LOGIN] Audit log exception (non-critical):", auditErr);
    }

    const role = profile.role as "admin" | "member";
    const redirectUrl = role === "admin" ? "/admin/dashboard" : "/portal/dashboard";

    return {
      success: true,
      role,
      redirectUrl,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("[LOGIN] Unexpected error:", errorMessage, err);
    return {
      success: false,
      error: `Server error: ${errorMessage}`,
    };
  }
}
