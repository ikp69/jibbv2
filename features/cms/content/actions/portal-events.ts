"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export type PortalResult = {
  success: boolean;
  error?: string;
};

async function writePortalEventAuditLog(userId: string, action: string, recordId: string): Promise<void> {
  try {
    const adminClient = createAdminClient();
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

    await adminClient.from("audit_logs").insert({
      user_id: userId,
      action,
      table_name: "event_registrations",
      record_id: recordId,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  } catch (auditErr) {
    console.warn(`[PORTAL_EVENTS_AUDIT] Failed to insert log for ${action}:`, auditErr);
  }
}

export async function registerForEvent(eventId: string, message?: string): Promise<PortalResult> {
  try {
    const authResult = await verifyServerRequest();
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const user = authResult.user;
    const adminClient = createAdminClient();

    // Check if event exists and registration deadline
    const { data: event, error: checkErr } = await adminClient
      .from("events")
      .select("capacity, registration_deadline, status")
      .eq("id", eventId)
      .single();

    if (checkErr || !event) {
      return { success: false, error: "Event not found" };
    }

    if (event.status !== "published") {
      return { success: false, error: "Registration is not available for this event." };
    }

    if (new Date(event.registration_deadline).getTime() < Date.now()) {
      return { success: false, error: "Registration is closed as the deadline has passed." };
    }

    // Check existing registration
    const { data: existing } = await adminClient
      .from("event_registrations")
      .select("id")
      .eq("event_id", eventId)
      .eq("member_id", user.id)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "You are already registered for this event." };
    }

    // Insert registration
    const { data: record, error: insertErr } = await adminClient
      .from("event_registrations")
      .insert({
        event_id: eventId,
        member_id: user.id,
        message: message || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertErr || !record) {
      return { success: false, error: insertErr?.message || "Failed to submit registration request." };
    }

    try {
      revalidatePath("/[locale]/(cms)/portal/events", "page");
    } catch (e) {
      console.warn("[REGISTER_EVENT] Revalidation warning:", e);
    }

    await writePortalEventAuditLog(user.id, "register_event", record.id);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[REGISTER_EVENT] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function cancelEventRegistration(eventId: string): Promise<PortalResult> {
  try {
    const authResult = await verifyServerRequest();
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const user = authResult.user;
    const adminClient = createAdminClient();

    // Get registration details to log
    const { data: reg, error: regErr } = await adminClient
      .from("event_registrations")
      .select("id")
      .eq("event_id", eventId)
      .eq("member_id", user.id)
      .single();

    if (regErr || !reg) {
      return { success: false, error: "Registration record not found." };
    }

    // Delete registration
    const { error: deleteErr } = await adminClient
      .from("event_registrations")
      .delete()
      .eq("id", reg.id);

    if (deleteErr) {
      return { success: false, error: deleteErr.message };
    }

    try {
      revalidatePath("/[locale]/(cms)/portal/events", "page");
    } catch (e) {
      console.warn("[CANCEL_EVENT_REGISTRATION] Revalidation warning:", e);
    }

    await writePortalEventAuditLog(user.id, "cancel_event_registration", reg.id);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[CANCEL_EVENT_REGISTRATION] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

