"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { trainingSchema, type TrainingInput } from "../schemas/content-schemas";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export type ContentResult = {
  success: boolean;
  error?: string;
};

// Reusable audit logging helper for training programs
async function writeTrainingAuditLog(
  adminId: string,
  action: string,
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
      user_id: adminId,
      action,
      table_name: "training_programs",
      record_id: recordId,
      ip_address: ipAddress,
      user_agent: userAgent,
      old_values: oldVal,
      new_values: newVal,
    });
  } catch (auditErr) {
    console.warn(`[TRAINING_AUDIT] Failed to insert log for ${action}:`, auditErr);
  }
}

export async function createTraining(input: TrainingInput): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;

    const parsed = trainingSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    const { data: record, error } = await adminClient
      .from("training_programs")
      .insert({
        title: data.title,
        description: data.description || null,
        category: data.category,
        duration: data.duration,
        location: data.location,
        start_date: new Date(data.startDate).toISOString(),
        end_date: new Date(data.endDate).toISOString(),
        capacity: data.capacity,
        visible_tiers: data.visibleTiers,
        status: data.status,
        created_by: adminId,
      })
      .select("id")
      .single();

    if (error || !record) return { success: false, error: error?.message || "Insert failed" };

    try {
      revalidatePath("/[locale]/(cms)/admin/training", "page");
      revalidatePath("/[locale]/(cms)/portal/training", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[CREATE_TRAINING] Revalidation warning:", e);
    }

    await writeTrainingAuditLog(adminId, "create_training", record.id, null, data);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[CREATE_TRAINING] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function updateTraining(id: string, input: TrainingInput): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;

    const parsed = trainingSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient
      .from("training_programs")
      .select("title, status, start_date, end_date, capacity, visible_tiers")
      .eq("id", id)
      .single();

    const { error } = await adminClient
      .from("training_programs")
      .update({
        title: data.title,
        description: data.description || null,
        category: data.category,
        duration: data.duration,
        location: data.location,
        start_date: new Date(data.startDate).toISOString(),
        end_date: new Date(data.endDate).toISOString(),
        capacity: data.capacity,
        visible_tiers: data.visibleTiers,
        status: data.status,
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/[locale]/(cms)/admin/training", "page");
      revalidatePath("/[locale]/(cms)/portal/training", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[UPDATE_TRAINING] Revalidation warning:", e);
    }

    await writeTrainingAuditLog(adminId, "update_training", id, oldVal, data);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[UPDATE_TRAINING] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function deleteTraining(id: string): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient.from("training_programs").select("title, status").eq("id", id).single();

    const { error } = await adminClient.from("training_programs").delete().eq("id", id);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/[locale]/(cms)/admin/training", "page");
      revalidatePath("/[locale]/(cms)/portal/training", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[DELETE_TRAINING] Revalidation warning:", e);
    }

    await writeTrainingAuditLog(adminId, "delete_training", id, oldVal, null);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[DELETE_TRAINING] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

