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
    table_name: "training_registrations",
    record_id: recordId,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
}

export async function registerForTraining(trainingId: string): Promise<PortalResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized access" };
    }

    // Check if training exists and capacity
    const { data: training, error: checkErr } = await supabase
      .from("training_programs")
      .select("capacity, start_date")
      .eq("id", trainingId)
      .single();

    if (checkErr || !training) {
      return { success: false, error: "Training program not found" };
    }

    // Check registration deadline (e.g. training hasn't started)
    if (new Date(training.start_date).getTime() < Date.now()) {
      return { success: false, error: "Registration is closed as the training program has already started." };
    }

    // Check existing registration
    const { data: existing } = await supabase
      .from("training_registrations")
      .select("id")
      .eq("training_id", trainingId)
      .eq("member_id", user.id)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "You are already registered for this training program." };
    }

    // Insert registration
    const { data: record, error: insertErr } = await supabase
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

    await writeAuditLog(supabase, user.id, "register_training", record.id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function cancelTrainingRegistration(trainingId: string): Promise<PortalResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized access" };
    }

    // Get registration detail to log
    const { data: reg, error: regErr } = await supabase
      .from("training_registrations")
      .select("id")
      .eq("training_id", trainingId)
      .eq("member_id", user.id)
      .single();

    if (regErr || !reg) {
      return { success: false, error: "Registration record not found." };
    }

    // Delete registration
    const { error: deleteErr } = await supabase
      .from("training_registrations")
      .delete()
      .eq("id", reg.id);

    if (deleteErr) {
      return { success: false, error: deleteErr.message };
    }

    await writeAuditLog(supabase, user.id, "cancel_training_registration", reg.id);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}
