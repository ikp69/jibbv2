"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionResult = {
  success: boolean;
  error?: string;
};

/**
 * Submit a request to introduce or connect with another member organization.
 */
export async function submitIntroductionRequest(
  targetMemberId: string,
  objective: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized. Please sign in." };
    }

    if (!objective || objective.trim().length < 15) {
      return { success: false, error: "Objective statement must be at least 15 characters long." };
    }

    // Insert introduction request
    const { error } = await supabase
      .from("introduction_requests")
      .insert({
        requester_id: user.id,
        target_member_id: targetMemberId,
        objective: objective.trim(),
        status: "pending"
      });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/[locale]/(cms)/portal/member-directory", "page");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

/**
 * Update introduction request status (Acknowledge / Reject). Restricted to admins.
 */
export async function updateIntroductionRequestStatus(
  requestId: string,
  status: "approved" | "rejected"
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // Verify user is administrator (handled by DB RLS policies, but we can query profile role for early exit)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized." };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Access denied. Administrator privileges required." };
    }

    const { error } = await supabase
      .from("introduction_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", requestId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/[locale]/(cms)/admin/member-directory", "page");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}
