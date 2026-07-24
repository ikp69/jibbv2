"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { eventSchema, type EventInput } from "../schemas/content-schemas";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export type ContentResult = {
  success: boolean;
  error?: string;
};

// Reusable audit logging helper for events
async function writeEventAuditLog(
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
      table_name: "events",
      record_id: recordId,
      ip_address: ipAddress,
      user_agent: userAgent,
      old_values: oldVal,
      new_values: newVal,
    });
  } catch (auditErr) {
    console.warn(`[EVENTS_AUDIT] Failed to insert log for ${action}:`, auditErr);
  }
}

export async function createEvent(input: EventInput): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;

    const parsed = eventSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    const { data: record, error } = await adminClient
      .from("events")
      .insert({
        title: data.title,
        description: data.description || null,
        location: data.location,
        event_date: new Date(data.eventDate).toISOString(),
        registration_deadline: new Date(data.registrationDeadline).toISOString(),
        capacity: data.capacity,
        visible_tiers: data.visibleTiers,
        status: data.status,
        created_by: adminId,
      })
      .select("id")
      .single();

    if (error || !record) return { success: false, error: error?.message || "Insert failed" };

    try {
      revalidatePath("/[locale]/(cms)/admin/events", "page");
      revalidatePath("/[locale]/(cms)/portal/events", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[CREATE_EVENT] Revalidation warning:", e);
    }

    await writeEventAuditLog(adminId, "create_event", record.id, null, data);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[CREATE_EVENT] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function updateEvent(id: string, input: EventInput): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;

    const parsed = eventSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient
      .from("events")
      .select("title, status, event_date, capacity, visible_tiers")
      .eq("id", id)
      .single();

    const { error } = await adminClient
      .from("events")
      .update({
        title: data.title,
        description: data.description || null,
        location: data.location,
        event_date: new Date(data.eventDate).toISOString(),
        registration_deadline: new Date(data.registrationDeadline).toISOString(),
        capacity: data.capacity,
        visible_tiers: data.visibleTiers,
        status: data.status,
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/[locale]/(cms)/admin/events", "page");
      revalidatePath("/[locale]/(cms)/portal/events", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[UPDATE_EVENT] Revalidation warning:", e);
    }

    await writeEventAuditLog(adminId, "update_event", id, oldVal, data);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[UPDATE_EVENT] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function deleteEvent(id: string): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient.from("events").select("title, status").eq("id", id).single();

    const { error } = await adminClient.from("events").delete().eq("id", id);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/[locale]/(cms)/admin/events", "page");
      revalidatePath("/[locale]/(cms)/portal/events", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[DELETE_EVENT] Revalidation warning:", e);
    }

    await writeEventAuditLog(adminId, "delete_event", id, oldVal, null);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[DELETE_EVENT] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

