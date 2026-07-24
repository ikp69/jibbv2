"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
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
    const authResult = await verifyServerRequest();
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const user = authResult.user;

    // Self-introduction prevention check
    if (user.id === targetMemberId) {
      return { success: false, error: "You cannot submit an introduction request to your own organization." };
    }

    if (!objective || objective.trim().length < 15) {
      return { success: false, error: "Objective statement must be at least 15 characters long." };
    }

    const adminClient = createAdminClient();

    // Verify target member exists
    const { data: targetMember, error: targetErr } = await adminClient
      .from("profiles")
      .select("id, status")
      .eq("id", targetMemberId)
      .single();

    if (targetErr || !targetMember || targetMember.status !== "active") {
      return { success: false, error: "Target member organization not found or inactive." };
    }

    // Insert introduction request
    const { error } = await adminClient
      .from("introduction_requests")
      .insert({
        requester_id: user.id,
        target_member_id: targetMemberId,
        objective: objective.trim(),
        status: "pending"
      });

    if (error) {
      console.error("[SUBMIT_INTRODUCTION_REQUEST] Database insert error:", error);
      return { success: false, error: error.message };
    }

    try {
      revalidatePath("/[locale]/(cms)/portal/member-directory", "page");
    } catch (revalidateErr) {
      console.warn("[SUBMIT_INTRODUCTION_REQUEST] Revalidation warning:", revalidateErr);
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[SUBMIT_INTRODUCTION_REQUEST] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
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
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from("introduction_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", requestId);

    if (error) {
      console.error("[UPDATE_INTRODUCTION_STATUS] Database update error:", error);
      return { success: false, error: error.message };
    }

    try {
      revalidatePath("/[locale]/(cms)/admin/member-directory", "page");
    } catch (revalidateErr) {
      console.warn("[UPDATE_INTRODUCTION_STATUS] Revalidation warning:", revalidateErr);
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[UPDATE_INTRODUCTION_STATUS] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

