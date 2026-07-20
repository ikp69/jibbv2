"use server";

import { createClient } from "@/lib/supabase/server";
import { exhibitionSupportSchema, delegationJapanSchema, delegationMeetSchema } from "@/app/lib/validation/special-programs";

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function submitSpecialProgramApplication(
  formType: "exhibition_support" | "delegation_japan" | "delegation_meet",
  payload: any
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized access. Please log in." };
    }

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

    const { error } = await supabase
      .from("special_program_applications")
      .insert({
        member_id: user.id,
        form_type: formType,
        data: parsed.data,
        status: "pending",
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

export async function updateSpecialProgramApplicationStatus(
  id: string,
  status: "pending" | "approved" | "rejected"
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized access." };
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { success: false, error: "Access denied. Admin privileges required." };
    }

    const { error } = await supabase
      .from("special_program_applications")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}
