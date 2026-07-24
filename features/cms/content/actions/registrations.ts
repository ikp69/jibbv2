"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type RegistrationResult = {
  success: boolean;
  error?: string;
};

async function writeRegistrationAuditLog(
  adminId: string,
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
      user_id: adminId,
      action,
      table_name: tableName,
      record_id: recordId,
      ip_address: ipAddress,
      user_agent: userAgent,
      old_values: oldVal,
      new_values: newVal,
    });
  } catch (auditErr) {
    console.warn(`[REGISTRATIONS_AUDIT] Failed to insert log for ${action}:`, auditErr);
  }
}

export async function updateTrainingRegistrationStatus(
  registrationId: string,
  status: "approved" | "rejected" | "pending"
): Promise<RegistrationResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: oldVal, error: fetchErr } = await adminClient
      .from("training_registrations")
      .select("status")
      .eq("id", registrationId)
      .single();

    if (fetchErr || !oldVal) {
      return { success: false, error: "Registration record not found" };
    }

    const { error: updateErr } = await adminClient
      .from("training_registrations")
      .update({ status })
      .eq("id", registrationId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    try {
      revalidatePath("/[locale]/(cms)/admin/training", "page");
    } catch (e) {
      console.warn("[UPDATE_TRAINING_REGISTRATION_STATUS] Revalidation warning:", e);
    }

    await writeRegistrationAuditLog(adminId, "update_training_registration_status", "training_registrations", registrationId, oldVal, { status });

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[UPDATE_TRAINING_REGISTRATION_STATUS] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function updateEventRegistrationStatus(
  registrationId: string,
  status: "approved" | "rejected" | "pending"
): Promise<RegistrationResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: oldVal, error: fetchErr } = await adminClient
      .from("event_registrations")
      .select("status")
      .eq("id", registrationId)
      .single();

    if (fetchErr || !oldVal) {
      return { success: false, error: "Registration record not found" };
    }

    const { error: updateErr } = await adminClient
      .from("event_registrations")
      .update({ status })
      .eq("id", registrationId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    try {
      revalidatePath("/[locale]/(cms)/admin/events", "page");
    } catch (e) {
      console.warn("[UPDATE_EVENT_REGISTRATION_STATUS] Revalidation warning:", e);
    }

    await writeRegistrationAuditLog(adminId, "update_event_registration_status", "event_registrations", registrationId, oldVal, { status });

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[UPDATE_EVENT_REGISTRATION_STATUS] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

