"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loginSchema, type LoginInput } from "../schemas/login-schema";
import { headers } from "next/headers";

export type LoginResult = {
  success: boolean;
  error?: string;
  role?: "admin" | "member";
  redirectUrl?: string;
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
    const supabase = await createClient();
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
      console.log("[LOGIN] 3a. signInWithPassword succeeded:", authData?.user?.id);
    } catch (signInException) {
      console.error("[LOGIN] 3b. signInWithPassword threw exception:", signInException);
      return {
        success: false,
        error: `Auth error: ${signInException instanceof Error ? signInException.message : "Unknown"}`,
      };
    }

    if (authError) {
      console.log("[LOGIN] Auth error (non-exception):", authError);
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
    const adminClient = createAdminClient();

    console.log("[LOGIN] 6. Querying profile");
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("role, status")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.log("[LOGIN] Profile query error:", profileError);
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.log("[LOGIN] SignOut failed:", e);
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
      } catch (e) {
        console.log("[LOGIN] SignOut failed:", e);
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
      } catch (e) {
        console.log("[LOGIN] SignOut failed:", e);
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
      const userAgent = headersList.get("user-agent");
      const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0];

      console.log("[LOGIN] 9. Attempting to insert audit log");
      const { error: auditError } = await supabase.from("audit_logs").insert({
        user_id: userId,
        action: "member_login",
        table_name: "profiles",
        record_id: userId,
        ip_address: ipAddress || null,
        user_agent: userAgent || null,
        old_values: null,
        new_values: { email, role: profile.role },
      });

      if (auditError) {
        console.log("[LOGIN] Audit log insert error (non-critical):", auditError.message);
        // Don't fail - audit is non-critical
      } else {
        console.log("[LOGIN] Audit log succeeded");
      }
    } catch (auditErr) {
      console.log("[LOGIN] Audit log exception (non-critical):", auditErr);
      // Don't fail - audit is non-critical
    }

    // 4. Return success with redirect URL
    console.log("[LOGIN] 10. Returning success");
    const role = profile.role as "admin" | "member";
    const redirectUrl = role === "admin" ? "/en/admin/dashboard" : "/en/portal/dashboard";

    return {
      success: true,
      role,
      redirectUrl,
    };
  } catch (err) {
    // Catch any unexpected errors and return them safely
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("[LOGIN] Unexpected error:", errorMessage, err);
    return {
      success: false,
      error: `Server error: ${errorMessage}`,
    };
  }
}
