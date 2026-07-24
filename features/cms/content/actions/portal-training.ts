"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export type PortalResult = {
  success: boolean;
  error?: string;
};

async function writePortalTrainingAuditLog(userId: string, action: string, recordId: string): Promise<void> {
  try {
    const adminClient = createAdminClient();
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

    await adminClient.from("audit_logs").insert({
      user_id: userId,
      action,
      table_name: "training_registrations",
      record_id: recordId,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  } catch (auditErr) {
    console.warn(`[PORTAL_TRAINING_AUDIT] Failed to insert log for ${action}:`, auditErr);
  }
}

export async function registerForTraining(trainingId: string): Promise<PortalResult> {
  try {
    const authResult = await verifyServerRequest();
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const user = authResult.user;
    const adminClient = createAdminClient();

    // Check if training exists and deadline
    const { data: training, error: checkErr } = await adminClient
      .from("training_programs")
      .select("capacity, start_date, status")
      .eq("id", trainingId)
      .single();

    if (checkErr || !training) {
      return { success: false, error: "Training program not found" };
    }

    if (training.status !== "published") {
      return { success: false, error: "Registration is not available for this training program." };
    }

    if (new Date(training.start_date).getTime() < Date.now()) {
      return { success: false, error: "Registration is closed as the training program has already started." };
    }

    // Check existing registration
    const { data: existing } = await adminClient
      .from("training_registrations")
      .select("id")
      .eq("training_id", trainingId)
      .eq("member_id", user.id)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "You are already registered for this training program." };
    }

    // Insert registration
    const { data: record, error: insertErr } = await adminClient
      .from("training_registrations")
      .insert({
        training_id: trainingId,
        member_id: user.id,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertErr || !record) {
      return { success: false, error: insertErr?.message || "Failed to submit registration." };
    }

    try {
      revalidatePath("/[locale]/(cms)/portal/training", "page");
    } catch (e) {
      console.warn("[REGISTER_TRAINING] Revalidation warning:", e);
    }

    await writePortalTrainingAuditLog(user.id, "register_training", record.id);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[REGISTER_TRAINING] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function cancelTrainingRegistration(trainingId: string): Promise<PortalResult> {
  try {
    const authResult = await verifyServerRequest();
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const user = authResult.user;
    const adminClient = createAdminClient();

    // Get registration detail to log
    const { data: reg, error: regErr } = await adminClient
      .from("training_registrations")
      .select("id")
      .eq("training_id", trainingId)
      .eq("member_id", user.id)
      .single();

    if (regErr || !reg) {
      return { success: false, error: "Registration record not found." };
    }

    // Delete registration
    const { error: deleteErr } = await adminClient
      .from("training_registrations")
      .delete()
      .eq("id", reg.id);

    if (deleteErr) {
      return { success: false, error: deleteErr.message };
    }

    try {
      revalidatePath("/[locale]/(cms)/portal/training", "page");
    } catch (e) {
      console.warn("[CANCEL_TRAINING_REGISTRATION] Revalidation warning:", e);
    }

    await writePortalTrainingAuditLog(user.id, "cancel_training_registration", reg.id);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[CANCEL_TRAINING_REGISTRATION] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

