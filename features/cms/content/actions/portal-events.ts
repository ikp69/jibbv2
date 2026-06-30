"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export type PortalResult = {
  success: boolean;
  error?: string;
};

async function writeAuditLog(supabase: any, userId: string, action: string, recordId: string) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || undefined;
  const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

  await supabase.from("audit_logs").insert({
    user_id: userId,
    action,
    table_name: "event_registrations",
    record_id: recordId,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
}

export async function registerForEvent(eventId: string, message?: string): Promise<PortalResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized access" };
    }

    // Check if event exists and status
    const { data: event, error: checkErr } = await supabase
      .from("events")
      .select("capacity, registration_deadline")
      .eq("id", eventId)
      .single();

    if (checkErr || !event) {
      return { success: false, error: "Event not found" };
    }

    // Check registration deadline
    if (new Date(event.registration_deadline).getTime() < Date.now()) {
      return { success: false, error: "Registration is closed as the deadline has passed." };
    }

    // Check existing registration
    const { data: existing } = await supabase
      .from("event_registrations")
      .select("id")
      .eq("event_id", eventId)
      .eq("member_id", user.id)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "You are already registered for this event." };
    }

    // Insert registration
    const { data: record, error: insertErr } = await supabase
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

    await writeAuditLog(supabase, user.id, "register_event", record.id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function cancelEventRegistration(eventId: string): Promise<PortalResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized access" };
    }

    // Get registration details to log
    const { data: reg, error: regErr } = await supabase
      .from("event_registrations")
      .select("id")
      .eq("event_id", eventId)
      .eq("member_id", user.id)
      .single();

    if (regErr || !reg) {
      return { success: false, error: "Registration record not found." };
    }

    // Delete registration
    const { error: deleteErr } = await supabase
      .from("event_registrations")
      .delete()
      .eq("id", reg.id);

    if (deleteErr) {
      return { success: false, error: deleteErr.message };
    }

    await writeAuditLog(supabase, user.id, "cancel_event_registration", reg.id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}
