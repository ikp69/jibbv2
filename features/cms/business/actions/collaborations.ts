"use server";

import { createClient } from "@/lib/supabase/server";
import { collaborationSchema, collaborationInterestSchema, type CollaborationInput, type CollaborationInterestInput } from "../schemas/business-schemas";
import { headers } from "next/headers";

export type BusinessResult = {
  success: boolean;
  error?: string;
};

async function checkAdminAuth(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized access");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Access denied. Admin role required.");
  }

  return user.id;
}

async function writeAuditLog(supabase: any, userId: string, action: string, recordId: string, oldVal: any, newVal: any) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || undefined;
  const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

  await supabase.from("audit_logs").insert({
    user_id: userId,
    action,
    table_name: "collaboration_opportunities",
    record_id: recordId,
    ip_address: ipAddress,
    user_agent: userAgent,
    old_values: oldVal,
    new_values: newVal,
  });
}

export async function createCollaboration(input: CollaborationInput): Promise<BusinessResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const parsed = collaborationSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;

    const { data: record, error } = await supabase
      .from("collaboration_opportunities")
      .insert({
        title: data.title,
        description: data.description,
        industry: data.industry,
        visible_tiers: data.visibleTiers,
        status: data.status,
        created_by: adminId,
      })
      .select("id")
      .single();

    if (error || !record) return { success: false, error: error.message };

    await writeAuditLog(supabase, adminId, "create_collaboration_opportunity", record.id, null, data);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function updateCollaboration(id: string, input: CollaborationInput): Promise<BusinessResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const parsed = collaborationSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;

    const { data: oldVal } = await supabase.from("collaboration_opportunities").select("*").eq("id", id).single();

    const { error } = await supabase
      .from("collaboration_opportunities")
      .update({
        title: data.title,
        description: data.description,
        industry: data.industry,
        visible_tiers: data.visibleTiers,
        status: data.status,
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    await writeAuditLog(supabase, adminId, "update_collaboration_opportunity", id, oldVal, data);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function deleteCollaboration(id: string): Promise<BusinessResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const { data: oldVal } = await supabase.from("collaboration_opportunities").select("*").eq("id", id).single();

    const { error } = await supabase.from("collaboration_opportunities").delete().eq("id", id);

    if (error) return { success: false, error: error.message };

    await writeAuditLog(supabase, adminId, "delete_collaboration_opportunity", id, oldVal, null);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

// -------------------------------------------------------------
// MEMBER INTERACTION: SUBMIT COLLABORATION INTEREST
// -------------------------------------------------------------

export async function submitCollaborationInterest(input: CollaborationInterestInput): Promise<BusinessResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized. Please sign in." };

    const parsed = collaborationInterestSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid inputs" };
    }

    const data = parsed.data;

    const { data: record, error } = await supabase
      .from("collaboration_interest")
      .insert({
        collaboration_id: data.collaborationId,
        member_id: user.id,
        message: data.message,
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !record) return { success: false, error: error.message };

    // Log member submission
    await writeAuditLog(supabase, user.id, "submit_collaboration_interest", record.id, null, {
      collaboration_id: data.collaborationId,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function updateCollaborationInterestStatus(
  interestId: string,
  status: "pending" | "reviewed" | "approved" | "closed" | "rejected"
): Promise<BusinessResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const { data: oldVal } = await supabase.from("collaboration_interest").select("status").eq("id", interestId).single();

    const { error } = await supabase
      .from("collaboration_interest")
      .update({ status })
      .eq("id", interestId);

    if (error) return { success: false, error: error.message };

    // Audit trace
    await writeAuditLog(supabase, adminId, "update_collaboration_interest_status", interestId, oldVal, { status });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}
