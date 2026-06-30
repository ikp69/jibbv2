"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { memberSchema, type MemberInput } from "../schemas/member-schema";
import { headers } from "next/headers";

export type CreateMemberResult = {
  success: boolean;
  error?: string;
  temporaryPassword?: string;
};

export async function createMember(input: MemberInput): Promise<CreateMemberResult> {
  // 1. Authorize: Check if executing user is Admin
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    return { success: false, error: "Unauthorized access" };
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", currentUser.id)
    .single();

  if (adminProfile?.role !== "admin") {
    return { success: false, error: "Access denied. Admin role required." };
  }

  // 2. Validate input schema
  const parsed = memberSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid input data",
    };
  }

  const data = parsed.data;

  // 3. Check if email already exists in profiles
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", data.email)
    .maybeSingle();

  if (existingProfile) {
    return { success: false, error: "A member with this email already exists." };
  }

  // 4. Generate a random temporary password
  const temporaryPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase() + "1!";

  // 5. Create user account via Admin Service Client
  const adminClient = createAdminClient();
  const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
    email: data.email,
    password: temporaryPassword,
    email_confirm: true,
  });

  if (authError || !authUser.user) {
    return {
      success: false,
      error: authError?.message || "Failed to create authentication credentials",
    };
  }

  const newUserId = authUser.user.id;

  // 6. Upsert details into public.profiles (overwriting the stub profile automatically created by the auth trigger)
  const { error: insertError } = await adminClient.from("profiles").upsert({
    id: newUserId,
    email: data.email,
    full_name: data.representativeName,
    company_name: data.companyName,
    designation: data.designation,
    membership_tier: data.membershipTier,
    membership_start_date: new Date(data.membershipStartDate).toISOString(),
    membership_end_date: new Date(data.membershipEndDate).toISOString(),
    membership_valid_from: data.membershipStartDate,
    membership_valid_until: data.membershipEndDate,
    phone: data.phone,
    industry: data.industry,
    country: data.country,
    city: data.city || null,
    website: data.website || null,
    company_description: data.companyDescription || null,
    looking_for: data.lookingFor,
    notes: data.notes || null,
    is_active: true,
    role: "member",
  });

  if (insertError) {
    // Rollback: Delete the auth user if inserting profile metadata fails
    await adminClient.auth.admin.deleteUser(newUserId);
    return {
      success: false,
      error: insertError.message || "Failed to initialize member profile",
    };
  }

  // 7. Write Audit Log
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || undefined;
  const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

  await supabase.from("audit_logs").insert({
    user_id: currentUser.id,
    action: "add_member",
    table_name: "profiles",
    record_id: newUserId,
    ip_address: ipAddress,
    user_agent: userAgent,
    old_values: null,
    new_values: { email: data.email, company_name: data.companyName, tier: data.membershipTier },
  });

  return {
    success: true,
    temporaryPassword,
  };
}
