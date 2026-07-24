"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { opportunitySchema, opportunityInterestSchema, type OpportunityInput, type OpportunityInterestInput } from "../schemas/business-schemas";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export type BusinessResult = {
  success: boolean;
  error?: string;
};

// Reusable audit logging helper for business opportunities
async function writeOpportunityAuditLog(
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
    console.warn(`[OPPORTUNITIES_AUDIT] Log failure for ${action}:`, auditErr);
  }
}

export async function createOpportunity(input: OpportunityInput): Promise<BusinessResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;

    const parsed = opportunitySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    const { data: record, error } = await adminClient
      .from("business_opportunities")
      .insert({
        title: data.title,
        description: data.description,
        industry: data.industry,
        country: data.country,
        looking_for: data.lookingFor,
        deadline: new Date(data.deadline).toISOString(),
        visible_tiers: data.visibleTiers,
        status: data.status,
        created_by: adminId,
      })
      .select("id")
      .single();

    if (error || !record) return { success: false, error: error?.message || "Insert failed" };

    try {
      revalidatePath("/[locale]/(cms)/admin/business-matching", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[CREATE_OPPORTUNITY] Revalidation warning:", e);
    }

    await writeOpportunityAuditLog(adminId, "create_business_opportunity", "business_opportunities", record.id, null, data);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[CREATE_OPPORTUNITY] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function updateOpportunity(id: string, input: OpportunityInput): Promise<BusinessResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;

    const parsed = opportunitySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient
      .from("business_opportunities")
      .select("title, status, industry, country, visible_tiers")
      .eq("id", id)
      .single();

    const { error } = await adminClient
      .from("business_opportunities")
      .update({
        title: data.title,
        description: data.description,
        industry: data.industry,
        country: data.country,
        looking_for: data.lookingFor,
        deadline: new Date(data.deadline).toISOString(),
        visible_tiers: data.visibleTiers,
        status: data.status,
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/[locale]/(cms)/admin/business-matching", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[UPDATE_OPPORTUNITY] Revalidation warning:", e);
    }

    await writeOpportunityAuditLog(adminId, "update_business_opportunity", "business_opportunities", id, oldVal, data);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[UPDATE_OPPORTUNITY] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function deleteOpportunity(id: string): Promise<BusinessResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient.from("business_opportunities").select("title, status").eq("id", id).single();

    const { error } = await adminClient.from("business_opportunities").delete().eq("id", id);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/[locale]/(cms)/admin/business-matching", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[DELETE_OPPORTUNITY] Revalidation warning:", e);
    }

    await writeOpportunityAuditLog(adminId, "delete_business_opportunity", "business_opportunities", id, oldVal, null);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[DELETE_OPPORTUNITY] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function submitMatchingProposal(input: OpportunityInput): Promise<BusinessResult> {
  try {
    const authResult = await verifyServerRequest();
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const user = authResult.user;

    const parsed = opportunitySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    const { data: record, error } = await adminClient
      .from("business_opportunities")
      .insert({
        title: data.title,
        description: data.description,
        industry: data.industry,
        country: data.country,
        looking_for: data.lookingFor,
        deadline: new Date(data.deadline).toISOString(),
        visible_tiers: data.visibleTiers,
        status: "pending_approval",
        created_by: user.id,
      })
      .select("id")
      .single();

    if (error || !record) return { success: false, error: error?.message || "Proposal submission failed" };

    try {
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[SUBMIT_MATCHING_PROPOSAL] Revalidation warning:", e);
    }

    await writeOpportunityAuditLog(user.id, "submit_matching_proposal", "business_opportunities", record.id, null, data);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[SUBMIT_MATCHING_PROPOSAL] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function approveOpportunity(id: string): Promise<BusinessResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient.from("business_opportunities").select("status").eq("id", id).single();

    const { error } = await adminClient
      .from("business_opportunities")
      .update({ status: "published" })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/[locale]/(cms)/admin/business-matching", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[APPROVE_OPPORTUNITY] Revalidation warning:", e);
    }

    await writeOpportunityAuditLog(adminId, "approve_business_opportunity", "business_opportunities", id, oldVal, { status: "published" });

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[APPROVE_OPPORTUNITY] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function rejectOpportunity(id: string): Promise<BusinessResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient.from("business_opportunities").select("status").eq("id", id).single();

    const { error } = await adminClient
      .from("business_opportunities")
      .update({ status: "closed" })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/[locale]/(cms)/admin/business-matching", "page");
    } catch (e) {
      console.warn("[REJECT_OPPORTUNITY] Revalidation warning:", e);
    }

    await writeOpportunityAuditLog(adminId, "reject_business_opportunity", "business_opportunities", id, oldVal, { status: "closed" });

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[REJECT_OPPORTUNITY] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

// -------------------------------------------------------------
// MEMBER INTEREST SUBMISSIONS
// -------------------------------------------------------------

export async function submitOpportunityInterest(input: OpportunityInterestInput): Promise<BusinessResult> {
  try {
    const authResult = await verifyServerRequest();
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const user = authResult.user;

    const parsed = opportunityInterestSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid inputs" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    // Verify opportunity exists and is published
    const { data: opp, error: oppErr } = await adminClient
      .from("business_opportunities")
      .select("id, status")
      .eq("id", data.opportunityId)
      .single();

    if (oppErr || !opp) {
      return { success: false, error: "Business opportunity listing not found" };
    }

    const { data: record, error } = await adminClient
      .from("opportunity_interest")
      .insert({
        opportunity_id: data.opportunityId,
        member_id: user.id,
        message: data.message,
        supporting_document_url: data.supportingDocumentUrl || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error || !record) return { success: false, error: error?.message || "Submission failed" };

    // Log member submission under correct table_name: "opportunity_interest"
    await writeOpportunityAuditLog(user.id, "submit_business_interest", "opportunity_interest", record.id, null, {
      opportunity_id: data.opportunityId,
    });

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[SUBMIT_OPPORTUNITY_INTEREST] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function updateOpportunityInterestStatus(
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

    const { data: oldVal } = await adminClient.from("opportunity_interest").select("status").eq("id", interestId).single();

    const { error } = await adminClient
      .from("opportunity_interest")
      .update({ status })
      .eq("id", interestId);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/[locale]/(cms)/admin/business-matching", "page");
    } catch (e) {
      console.warn("[UPDATE_OPPORTUNITY_INTEREST_STATUS] Revalidation warning:", e);
    }

    await writeOpportunityAuditLog(adminId, "update_business_interest_status", "opportunity_interest", interestId, oldVal, { status });

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[UPDATE_OPPORTUNITY_INTEREST_STATUS] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function updateMatchingProposal(id: string, input: OpportunityInput): Promise<BusinessResult> {
  try {
    const authResult = await verifyServerRequest();
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const user = authResult.user;

    const parsed = opportunitySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }
    const data = parsed.data;
    const adminClient = createAdminClient();

    // Check if opportunity exists, belongs to user, and is still pending approval
    const { data: oldVal, error: fetchError } = await adminClient
      .from("business_opportunities")
      .select("id, created_by, status, title, description, industry, country, looking_for, deadline")
      .eq("id", id)
      .single();

    if (fetchError || !oldVal) return { success: false, error: "Opportunity listing not found" };
    if (oldVal.created_by !== user.id) return { success: false, error: "Access denied. You can only edit your own proposals." };
    if (oldVal.status !== "pending_approval") return { success: false, error: "You cannot edit this proposal once approved or rejected." };

    const { error } = await adminClient
      .from("business_opportunities")
      .update({
        title: data.title,
        description: data.description,
        industry: data.industry,
        country: data.country,
        looking_for: data.lookingFor,
        deadline: new Date(data.deadline).toISOString(),
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    await writeOpportunityAuditLog(user.id, "update_matching_proposal", "business_opportunities", id, oldVal, data);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[UPDATE_MATCHING_PROPOSAL] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function getOpportunityEditHistory(id: string): Promise<{ success: boolean; error?: string; history?: unknown[] }> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from("audit_logs")
      .select("created_at, old_values, new_values")
      .eq("table_name", "business_opportunities")
      .eq("record_id", id)
      .eq("action", "update_matching_proposal")
      .order("created_at", { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, history: data || [] };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[GET_OPPORTUNITY_EDIT_HISTORY] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}


