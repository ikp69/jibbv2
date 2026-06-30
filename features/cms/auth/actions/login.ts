"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loginSchema, type LoginInput } from "../schemas/login-schema";
import { headers } from "next/headers";

export type LoginResult = {
  success: boolean;
  error?: string;
  role?: "admin" | "member";
};

export async function login(input: LoginInput): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input data",
    };
  }

  const supabase = await createClient();
  const { email, password } = parsed.data;

  // 1. Sign in via Supabase Authentication
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message || "Invalid email or password",
    };
  }

  const userId = authData.user.id;

  // 2. Fetch the corresponding profile role and active status via Admin Client to bypass RLS session lags
  const adminClient = createAdminClient();
  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("role, status")
    .eq("id", userId)
    .single();

  console.log("LOGIN DB CHECK:", { userId, profile, profileError });

  if (profileError || !profile) {
    // Sign out if no profile row is linked to the authenticated user
    await supabase.auth.signOut();
    return {
      success: false,
      error: `No account profile linked to this user. DB Error: ${profileError?.message || "None"}`,
    };
  }

  if (profile.status !== "active") {
    await supabase.auth.signOut();
    return {
      success: false,
      error: "Your account is currently inactive. Please contact the administrator.",
    };
  }

  // 3. Create Audit Log for successful login
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || undefined;
  const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

  await supabase.from("audit_logs").insert({
    user_id: userId,
    action: "member_login",
    table_name: "profiles",
    record_id: userId,
    ip_address: ipAddress,
    user_agent: userAgent,
    old_values: null,
    new_values: { email, role: profile.role },
  });

  return {
    success: true,
    role: profile.role as "admin" | "member",
  };
}
