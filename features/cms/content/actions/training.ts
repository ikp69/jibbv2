"use server";

import { createClient } from "@/lib/supabase/server";
import { trainingSchema, type TrainingInput } from "../schemas/content-schemas";
import { headers } from "next/headers";

export type ContentResult = {
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

async function writeAuditLog(supabase: any, adminId: string, action: string, recordId: string, oldVal: any, newVal: any) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || undefined;
  const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

  await supabase.from("audit_logs").insert({
    user_id: adminId,
    action,
    table_name: "training_programs",
    record_id: recordId,
    ip_address: ipAddress,
    user_agent: userAgent,
    old_values: oldVal,
    new_values: newVal,
  });
}

export async function createTraining(input: TrainingInput): Promise<ContentResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const parsed = trainingSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;

    const { data: record, error } = await supabase
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

    if (error || !record) return { success: false, error: error.message };

    await writeAuditLog(supabase, adminId, "create_training", record.id, null, data);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function updateTraining(id: string, input: TrainingInput): Promise<ContentResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const parsed = trainingSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;

    const { data: oldVal } = await supabase.from("training_programs").select("*").eq("id", id).single();

    const { error } = await supabase
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

    await writeAuditLog(supabase, adminId, "update_training", id, oldVal, data);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function deleteTraining(id: string): Promise<ContentResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const { data: oldVal } = await supabase.from("training_programs").select("*").eq("id", id).single();

    const { error } = await supabase.from("training_programs").delete().eq("id", id);

    if (error) return { success: false, error: error.message };

    await writeAuditLog(supabase, adminId, "delete_training", id, oldVal, null);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}
