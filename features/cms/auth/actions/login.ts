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

function devLog(...args: any[]) {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
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

    devLog("[LOGIN] 2. Creating Supabase client");
    const supabase = await createClient();
    const { email, password } = parsed.data;

    // 1. Sign in via Supabase Authentication
    devLog("[LOGIN] 3. Attempting signInWithPassword");
    let authData, authError;
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      authData = result.data;
      authError = result.error;
      devLog("[LOGIN] 3a. signInWithPassword succeeded:", authData?.user?.id);
    } catch (signInException) {
      console.error("[LOGIN] 3b. signInWithPassword threw exception:", signInException);
      return {
        success: false,
        error: `Auth error: ${signInException instanceof Error ? signInException.message : "Unknown"}`,
      };
    }

    if (authError) {
      devLog("[LOGIN] Auth error (non-exception):", authError);
      return {
        success: false,
        error: authError.message || "Invalid email or password",
      };
    }

    if (!authData?.user) {
      devLog("[LOGIN] No user in auth data");
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    const userId = authData.user.id;
    devLog("[LOGIN] 4. User authenticated:", userId);

    // 2. Fetch the corresponding profile role and active status
    devLog("[LOGIN] 5. Creating admin client");
    const adminClient = createAdminClient();

    devLog("[LOGIN] 6. Querying profile");
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("role, status")
      .eq("id", userId)
      .single();

    if (profileError) {
      devLog("[LOGIN] Profile query error:", profileError);
      try {
        await supabase.auth.signOut();
      } catch (e) {
        devLog("[LOGIN] SignOut failed:", e);
      }
      return {
        success: false,
        error: `No account profile linked to this user. DB Error: ${profileError.message}`,
      };
    }

    if (!profile) {
      devLog("[LOGIN] No profile found");
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

    devLog("[LOGIN] 7. Profile found:", { userId, role: profile.role, status: profile.status });

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

    // 3. Create Audit Log for successful login (non-critical)
    devLog("[LOGIN] 8. Getting headers");
    try {
      const headersList = await headers();
      const userAgent = headersList.get("user-agent");
      const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0];

      devLog("[LOGIN] 9. Attempting to insert audit log");
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
        devLog("[LOGIN] Audit log insert error (non-critical):", auditError.message);
        // Don't fail - audit is non-critical
      } else {
        devLog("[LOGIN] Audit log succeeded");
      }
    } catch (auditErr) {
      devLog("[LOGIN] Audit log exception (non-critical):", auditErr);
      // Don't fail - audit is non-critical
    }

    // 4. Return success with redirect URL
    devLog("[LOGIN] 10. Returning success");
    const role = profile.role as "admin" | "member";
    const redirectUrl = role === "admin" ? "/admin/dashboard" : "/portal/dashboard";

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
