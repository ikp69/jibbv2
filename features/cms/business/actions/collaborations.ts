"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { collaborationSchema, collaborationInterestSchema, type CollaborationInput, type CollaborationInterestInput } from "../schemas/business-schemas";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export type BusinessResult = {
  success: boolean;
  error?: string;
};

// Reusable audit logging helper for business collaborations
async function writeCollaborationAuditLog(
  userId: string,
  action: string,
  tableName: string,
  recordId: string,
  oldVal: unknown,
  newVal: unknown
): Promise<void> {
  try {
    const adminClient = createAdminClient();
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

    await adminClient.from("audit_logs").insert({
      user_id: userId,
      action,
      table_name: tableName,
      record_id: recordId,
      ip_address: ipAddress,
      user_agent: userAgent,
      old_values: oldVal,
      new_values: newVal,
    });
  } catch (auditErr) {
    console.warn(`[COLLABORATIONS_AUDIT] Failed to insert log for ${action}:`, auditErr);
  }
}

export async function createCollaboration(input: CollaborationInput): Promise<BusinessResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;

    const parsed = collaborationSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    const { data: record, error } = await adminClient
      .from("collaboration_opportunities")
      .insert({
        title: data.title,
        description: data.description,
        industry: data.industry,
        visible_tiers: data.visibleTiers,
        status: data.status,
        category: data.category,
        direction: data.direction,
        location: data.location,
        created_by: adminId,
      })
      .select("id")
      .single();

    if (error || !record) return { success: false, error: error?.message || "Insert failed" };

    try {
      revalidatePath("/[locale]/(cms)/admin/collaboration", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[CREATE_COLLABORATION] Revalidation warning:", e);
    }

    await writeCollaborationAuditLog(adminId, "create_collaboration_opportunity", "collaboration_opportunities", record.id, null, data);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[CREATE_COLLABORATION] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function updateCollaboration(id: string, input: CollaborationInput): Promise<BusinessResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;

    const parsed = collaborationSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient.from("collaboration_opportunities").select("title, status, industry, visible_tiers").eq("id", id).single();

    const { error } = await adminClient
      .from("collaboration_opportunities")
      .update({
        title: data.title,
        description: data.description,
        industry: data.industry,
        visible_tiers: data.visibleTiers,
        status: data.status,
        category: data.category,
        direction: data.direction,
        location: data.location,
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/[locale]/(cms)/admin/collaboration", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[UPDATE_COLLABORATION] Revalidation warning:", e);
    }

    await writeCollaborationAuditLog(adminId, "update_collaboration_opportunity", "collaboration_opportunities", id, oldVal, data);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[UPDATE_COLLABORATION] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function deleteCollaboration(id: string): Promise<BusinessResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient.from("collaboration_opportunities").select("title, status").eq("id", id).single();

    const { error } = await adminClient.from("collaboration_opportunities").delete().eq("id", id);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/[locale]/(cms)/admin/collaboration", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[DELETE_COLLABORATION] Revalidation warning:", e);
    }

    await writeCollaborationAuditLog(adminId, "delete_collaboration_opportunity", "collaboration_opportunities", id, oldVal, null);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[DELETE_COLLABORATION] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

// -------------------------------------------------------------
// MEMBER INTERACTION: SUBMIT COLLABORATION INTEREST
// -------------------------------------------------------------

export async function submitCollaborationInterest(input: CollaborationInterestInput): Promise<BusinessResult> {
  try {
    const authResult = await verifyServerRequest();
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const user = authResult.user;

    const parsed = collaborationInterestSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid inputs" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    // Verify target collaboration opportunity exists and is published
    const { data: opp, error: oppErr } = await adminClient
      .from("collaboration_opportunities")
      .select("id, status")
      .eq("id", data.collaborationId)
      .single();

    if (oppErr || !opp) {
      return { success: false, error: "Collaboration opportunity listing not found" };
    }

    const { data: record, error } = await adminClient
      .from("collaboration_interest")
      .insert({
        collaboration_id: data.collaborationId,
        member_id: user.id,
        message: data.message,
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !record) return { success: false, error: error?.message || "Submission failed" };

    // Correct table_name: "collaboration_interest" recorded in audit log
    await writeCollaborationAuditLog(user.id, "submit_collaboration_interest", "collaboration_interest", record.id, null, {
      collaboration_id: data.collaborationId,
    });

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[SUBMIT_COLLABORATION_INTEREST] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function updateCollaborationInterestStatus(
  interestId: string,
  status: "pending" | "reviewed" | "approved" | "closed" | "rejected"
): Promise<BusinessResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient.from("collaboration_interest").select("status").eq("id", interestId).single();

    const { error } = await adminClient
      .from("collaboration_interest")
      .update({ status })
      .eq("id", interestId);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/[locale]/(cms)/admin/collaboration", "page");
    } catch (e) {
      console.warn("[UPDATE_COLLABORATION_INTEREST_STATUS] Revalidation warning:", e);
    }

    // Audit trace on collaboration_interest table
    await writeCollaborationAuditLog(adminId, "update_collaboration_interest_status", "collaboration_interest", interestId, oldVal, { status });

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[UPDATE_COLLABORATION_INTEREST_STATUS] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

