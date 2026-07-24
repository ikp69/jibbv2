"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { profileUpdateSchema, type ProfileUpdateInput } from "../schemas/profile-schema";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export type ProfileResult = {
  success: boolean;
  error?: string;
};

export async function updateProfile(input: ProfileUpdateInput): Promise<ProfileResult> {
  try {
    // 1. Authenticate user and verify active session signature
    const authResult = await verifyServerRequest();
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const user = authResult.user;

    // 2. Validate input schema
    const parsed = profileUpdateSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input data",
      };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    // 3. Fetch pre-update profile details for audit trail
    const { data: oldProfile } = await adminClient
      .from("profiles")
      .select("full_name, designation, phone, website, city, company_description, looking_for, show_in_directory, company_logo")
      .eq("id", user.id)
      .single();

    // 4. Update profile in database
    const { error } = await adminClient
      .from("profiles")
      .update({
        full_name: data.fullName,
        designation: data.designation,
        phone: data.phone,
        website: data.website || null,
        city: data.city || null,
        company_description: data.companyDescription || null,
        looking_for: data.lookingFor,
        show_in_directory: data.showInDirectory,
        company_logo: data.companyLogo || null,
      })
      .eq("id", user.id);

    if (error) {
      console.error("[UPDATE_PROFILE] Database update error:", error);
      return { success: false, error: error.message };
    }

    // 5. Invalidate relevant Next.js cache paths so directory and portal update in real-time
    try {
      revalidatePath("/[locale]/(cms)/portal/profile", "page");
      revalidatePath("/[locale]/(cms)/portal/member-directory", "page");
      revalidatePath("/[locale]/(cms)/admin/member-directory", "page");
    } catch (revalidateErr) {
      console.warn("[UPDATE_PROFILE] Revalidation warning:", revalidateErr);
    }

    // 6. Write Audit Log
    try {
      const headersList = await headers();
      const userAgent = headersList.get("user-agent") || undefined;
      const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

      await adminClient.from("audit_logs").insert({
        user_id: user.id,
        action: "update_profile",
        table_name: "profiles",
        record_id: user.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        old_values: oldProfile,
        new_values: data,
      });
    } catch (auditErr) {
      console.warn("[UPDATE_PROFILE] Non-critical audit log insertion error:", auditErr);
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("[UPDATE_PROFILE] Unexpected exception:", errorMessage, err);
    return { success: false, error: `Server error: ${errorMessage}` };
  }
}

