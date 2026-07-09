"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loginSchema, type LoginInput } from "../schemas/login-schema";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type LoginResult = {
  success: boolean;
  error?: string;
  role?: "admin" | "member";
};

export async function login(input: LoginInput): Promise<LoginResult> {
  try {
    console.log("[LOGIN] 1. Starting login");

    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
      console.log("[LOGIN] Validation failed:", parsed.error.issues);
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input data",
      };
    }

    console.log("[LOGIN] 2. Creating Supabase client");
    let supabase;
    try {
      supabase = await createClient();
      console.log("[LOGIN] 2a. Supabase client created successfully");
    } catch (clientErr) {
      console.error("[LOGIN] 2b. Failed to create Supabase client:", clientErr);
      throw clientErr;
    }

    const { email, password } = parsed.data;

    // 1. Sign in via Supabase Authentication
    console.log("[LOGIN] 3. Attempting signInWithPassword");
    let authData, authError;
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      authData = result.data;
      authError = result.error;
      console.log("[LOGIN] 3a. signInWithPassword completed");
    } catch (signInErr) {
      console.error("[LOGIN] 3b. signInWithPassword threw exception:", signInErr);
      throw signInErr;
    }

    if (authError) {
      console.log("[LOGIN] Auth error:", authError);
      return {
        success: false,
        error: authError.message || "Invalid email or password",
      };
    }

    if (!authData?.user) {
      console.log("[LOGIN] No user in auth data");
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    const userId = authData.user.id;
    console.log("[LOGIN] 4. User authenticated:", userId);

    // 2. Fetch the corresponding profile role and active status
    console.log("[LOGIN] 5. Creating admin client");
    let adminClient;
    try {
      adminClient = createAdminClient();
      console.log("[LOGIN] 5a. Admin client created");
    } catch (adminErr) {
      console.error("[LOGIN] 5b. Failed to create admin client:", adminErr);
      throw adminErr;
    }

    console.log("[LOGIN] 6. Querying profile");
    let profile, profileError;
    try {
      const result = await adminClient
        .from("profiles")
        .select("role, status")
        .eq("id", userId)
        .single();
      profile = result.data;
      profileError = result.error;
      console.log("[LOGIN] 6a. Profile query completed");
    } catch (profileQueryErr) {
      console.error("[LOGIN] 6b. Profile query threw exception:", profileQueryErr);
      throw profileQueryErr;
    }

    if (profileError) {
      console.log("[LOGIN] Profile query error:", profileError);
      try {
        await supabase.auth.signOut();
      } catch (signOutErr) {
        console.error("[LOGIN] SignOut failed:", signOutErr);
      }
      return {
        success: false,
        error: `No account profile linked to this user. DB Error: ${profileError.message}`,
      };
    }

    if (!profile) {
      console.log("[LOGIN] No profile found");
      try {
        await supabase.auth.signOut();
      } catch (signOutErr) {
        console.error("[LOGIN] SignOut failed:", signOutErr);
      }
      return {
        success: false,
        error: "No account profile linked to this user.",
      };
    }

    console.log("[LOGIN] 7. Profile found:", { userId, role: profile.role, status: profile.status });

    if (profile.status !== "active") {
      console.log("[LOGIN] User inactive:", profile.status);
      try {
        await supabase.auth.signOut();
      } catch (signOutErr) {
        console.error("[LOGIN] SignOut failed:", signOutErr);
      }
      return {
        success: false,
        error: "Your account is currently inactive. Please contact the administrator.",
      };
    }

    // 3. Create Audit Log for successful login (non-critical)
    console.log("[LOGIN] 8. Getting headers");
    try {
      const headersList = await headers();
      const userAgent = headersList.get("user-agent") || undefined;
      const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

      console.log("[LOGIN] 9. Attempting to insert audit log");
      const { error: auditError } = await supabase.from("audit_logs").insert({
        user_id: userId,
        action: "member_login",
        table_name: "profiles",
        record_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        old_values: null,
        new_values: { email, role: profile.role },
      });

      if (auditError) {
        console.log("[LOGIN] Audit log insert error (non-fatal):", auditError);
      } else {
        console.log("[LOGIN] Audit log inserted successfully");
      }
    } catch (auditException) {
      console.log("[LOGIN] Audit log exception (non-fatal):", auditException);
    }

    console.log("[LOGIN] 10. About to redirect to dashboard");
    const role = profile.role as "admin" | "member";
    const redirectPath = role === "admin" ? "/en/admin/dashboard" : "/en/portal/dashboard";
    console.log("[LOGIN] 11. Calling redirect():", redirectPath);
    
    redirect(redirectPath);
    
  } catch (error) {
    // IMPORTANT: redirect() throws NEXT_REDIRECT which we must NOT catch
    // Check if this is the redirect exception
    if (error instanceof Error && error.message && error.message.includes("NEXT_REDIRECT")) {
      console.log("[LOGIN] Caught NEXT_REDIRECT (expected, re-throwing)");
      throw error;
    }
    
    console.error("[LOGIN] Unexpected exception:", error);
    throw error;
  }
}
