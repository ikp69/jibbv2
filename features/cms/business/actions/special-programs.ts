"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { exhibitionSupportSchema, delegationJapanSchema, delegationMeetSchema } from "@/app/lib/validation/special-programs";
import { revalidatePath } from "next/cache";

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function submitSpecialProgramApplication(
  formType: "exhibition_support" | "delegation_japan" | "delegation_meet",
  payload: unknown
): Promise<ActionResult> {
  try {
    const authResult = await verifyServerRequest();
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const user = authResult.user;

    // Validate payload according to formType
    let parsed;
    if (formType === "exhibition_support") {
      parsed = exhibitionSupportSchema.safeParse(payload);
    } else if (formType === "delegation_japan") {
      parsed = delegationJapanSchema.safeParse(payload);
    } else if (formType === "delegation_meet") {
      parsed = delegationMeetSchema.safeParse(payload);
    } else {
      return { success: false, error: "Invalid form type." };
    }

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
    }

    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from("special_program_applications")
      .insert({
        member_id: user.id,
        form_type: formType,
        data: parsed.data,
        status: "pending",
      });

    if (error) {
      console.error("[SUBMIT_SPECIAL_PROGRAM] Database insert error:", error);
      return { success: false, error: error.message };
    }

    try {
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (revalidateErr) {
      console.warn("[SUBMIT_SPECIAL_PROGRAM] Revalidation warning:", revalidateErr);
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[SUBMIT_SPECIAL_PROGRAM] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function updateSpecialProgramApplicationStatus(
  id: string,
  status: "pending" | "approved" | "rejected"
): Promise<ActionResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from("special_program_applications")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("[UPDATE_SPECIAL_PROGRAM_STATUS] Database update error:", error);
      return { success: false, error: error.message };
    }

    try {
      revalidatePath("/[locale]/(cms)/admin/special-forms", "page");
    } catch (revalidateErr) {
      console.warn("[UPDATE_SPECIAL_PROGRAM_STATUS] Revalidation warning:", revalidateErr);
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[UPDATE_SPECIAL_PROGRAM_STATUS] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

