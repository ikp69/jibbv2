"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { memberSchema, type MemberInput } from "../schemas/member-schema";
import { AuditService } from "@/lib/services/audit-service";
import crypto from "crypto";

export type CreateMemberResult = {
  success: boolean;
  error?: string;
  temporaryPassword?: string;
};

/**
 * Generates a cryptographically secure temporary password.
 */
function generateSecurePassword(): string {
  const randomBuf = crypto.randomBytes(8).toString("hex");
  return `Jibb#${randomBuf.slice(0, 6).toUpperCase()}${randomBuf.slice(6, 10)}!`;
}

export async function createMember(input: MemberInput): Promise<CreateMemberResult> {
  try {
    // 1. Centralized Authorization: Verify executing user has Admin privileges
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const currentAdminUser = authResult.user;

    // 2. Input Schema Validation
    const parsed = memberSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input data",
      };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    // 3. Duplicate Email Check in profiles
    const { data: existingProfile, error: checkError } = await adminClient
      .from("profiles")
      .select("id")
      .eq("email", data.email)
      .maybeSingle();

    if (checkError) {
      console.error("[CREATE_MEMBER] Error checking existing profile email:", checkError);
      return { success: false, error: "Database error while validating email." };
    }

    if (existingProfile) {
      return { success: false, error: "A member with this email already exists." };
    }

    // 4. Generate Cryptographically Secure Temporary Password
    const temporaryPassword = generateSecurePassword();

    // 5. Create Auth User Account via Admin API Client
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email: data.email,
      password: temporaryPassword,
      email_confirm: true,
    });

    if (authError || !authUser.user) {
      console.error("[CREATE_MEMBER] Failed to create auth user:", authError);
      return {
        success: false,
        error: authError?.message || "Failed to create authentication credentials",
      };
    }

    const newUserId = authUser.user.id;

    // 6. Upsert Profile metadata into public.profiles
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
      status: "active",
      role: "member",
    });

    if (insertError) {
      console.error("[CREATE_MEMBER] Profile metadata insert failed. Triggering user deletion rollback:", insertError);
      // Rollback: Delete the auth user if profile creation fails
      try {
        await adminClient.auth.admin.deleteUser(newUserId);
      } catch (rollbackErr) {
        console.error("[CREATE_MEMBER] Critical rollback error deleting user:", newUserId, rollbackErr);
      }

      return {
        success: false,
        error: insertError.message || "Failed to initialize member profile",
      };
    }

    // 7. Write Audit Log
    await AuditService.log({
      userId: currentAdminUser.id,
      action: "add_member",
      tableName: "profiles",
      recordId: newUserId,
      newValues: { email: data.email, company_name: data.companyName, tier: data.membershipTier },
    });

    return {
      success: true,
      temporaryPassword,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("[CREATE_MEMBER] Unexpected exception:", errorMessage, err);
    return {
      success: false,
      error: `Server error: ${errorMessage}`,
    };
  }
}

