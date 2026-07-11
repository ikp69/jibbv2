"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

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

async function writeAuditLog(supabase: any, adminId: string, action: string, tableName: string, recordId: string, oldVal: any, newVal: any) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || undefined;
  const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

  await supabase.from("audit_logs").insert({
    user_id: adminId,
    action,
    table_name: tableName,
    record_id: recordId,
    ip_address: ipAddress,
    user_agent: userAgent,
    old_values: oldVal,
    new_values: newVal,
  });
}

export async function updateTrainingRegistrationStatus(
  registrationId: string,
  status: "approved" | "rejected" | "pending"
) {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const { data: oldVal, error: fetchErr } = await supabase
      .from("training_registrations")
      .select("status")
      .eq("id", registrationId)
      .single();

    if (fetchErr || !oldVal) {
      return { success: false, error: "Registration not found" };
    }

    const { error: updateErr } = await supabase
      .from("training_registrations")
      .update({ status })
      .eq("id", registrationId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    await writeAuditLog(supabase, adminId, "update_training_registration_status", "training_registrations", registrationId, oldVal, { status });

    revalidatePath("/admin/training");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

export async function updateEventRegistrationStatus(
  registrationId: string,
  status: "approved" | "rejected" | "pending"
) {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const { data: oldVal, error: fetchErr } = await supabase
      .from("event_registrations")
      .select("status")
      .eq("id", registrationId)
      .single();

    if (fetchErr || !oldVal) {
      return { success: false, error: "Registration not found" };
    }

    const { error: updateErr } = await supabase
      .from("event_registrations")
      .update({ status })
      .eq("id", registrationId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    await writeAuditLog(supabase, adminId, "update_event_registration_status", "event_registrations", registrationId, oldVal, { status });

    revalidatePath("/admin/events");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}
