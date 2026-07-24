"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const adminProfileUpdateSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
});

export type AdminProfileResult = {
  success: boolean;
  error?: string;
};

export async function updateAdminProfile(input: {
  companyName: string;
  designation: string;
}): Promise<AdminProfileResult> {
  try {
    // 1. Authorize: Verify executing user has Admin privileges and valid active session signature
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const user = authResult.user;

    // 2. Validate input schema
    const parsed = adminProfileUpdateSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input data",
      };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    // 3. Fetch pre-update profile details for audit trail
    const { data: profile } = await adminClient
      .from("profiles")
      .select("company_name, designation")
      .eq("id", user.id)
      .single();

    // 4. Update profile in database
    const { error } = await adminClient
      .from("profiles")
      .update({
        company_name: data.companyName,
        designation: data.designation,
      })
      .eq("id", user.id);

    if (error) {
      console.error("[UPDATE_ADMIN_PROFILE] Database update error:", error);
      return { success: false, error: error.message };
    }

    // 5. Invalidate Next.js cache paths
    try {
      revalidatePath("/[locale]/(cms)/admin/settings", "page");
    } catch (revalidateErr) {
      console.warn("[UPDATE_ADMIN_PROFILE] Revalidation warning:", revalidateErr);
    }

    // 6. Write Audit Log
    try {
      const headersList = await headers();
      const userAgent = headersList.get("user-agent") || undefined;
      const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

      await adminClient.from("audit_logs").insert({
        user_id: user.id,
        action: "update_admin_profile",
        table_name: "profiles",
        record_id: user.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        old_values: {
          company_name: profile?.company_name,
          designation: profile?.designation,
        },
        new_values: data,
      });
    } catch (auditErr) {
      console.warn("[UPDATE_ADMIN_PROFILE] Non-critical audit log insertion error:", auditErr);
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("[UPDATE_ADMIN_PROFILE] Unexpected exception:", errorMessage, err);
    return { success: false, error: `Server error: ${errorMessage}` };
  }
}

