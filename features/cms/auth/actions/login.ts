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
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

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
  const adminClient = createAdminClient();

  console.log("[LOGIN] 6. Querying profile");
  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("role, status")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.log("[LOGIN] Profile query error:", profileError);
    await supabase.auth.signOut();
    return {
      success: false,
      error: `No account profile linked to this user. DB Error: ${profileError.message}`,
    };
  }

  if (!profile) {
    console.log("[LOGIN] No profile found");
    await supabase.auth.signOut();
    return {
      success: false,
      error: "No account profile linked to this user.",
    };
  }

  console.log("[LOGIN] 7. Profile found:", { userId, role: profile.role, status: profile.status });

  if (profile.status !== "active") {
    console.log("[LOGIN] User inactive:", profile.status);
    await supabase.auth.signOut();
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

  // 4. Return success with redirect URL (client will handle navigation)
  console.log("[LOGIN] 10. Returning success");
  const role = profile.role as "admin" | "member";
  const redirectUrl = role === "admin" ? "/en/admin/dashboard" : "/en/portal/dashboard";

  return {
    success: true,
    role,
    redirectUrl,
  };
}
