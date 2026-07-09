"use server";

import { createClient } from "@/lib/supabase/server";
import { newsletterSchema, type NewsletterInput } from "../schemas/content-schemas";
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
    table_name: "newsletters",
    record_id: recordId,
    ip_address: ipAddress,
    user_agent: userAgent,
    old_values: oldVal,
    new_values: newVal,
  });
}

export async function createNewsletter(input: NewsletterInput): Promise<ContentResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const parsed = newsletterSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;

    const { data: record, error } = await supabase
      .from("newsletters")
      .insert({
        title: data.title,
        subject: data.subject || null,
        content: data.content || null,
        file_url: data.fileUrl || null,
        visible_tiers: data.visibleTiers,
        status: data.status,
        publish_date: data.publishDate ? new Date(data.publishDate).toISOString() : new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error || !record) return { success: false, error: error.message };

    await writeAuditLog(supabase, adminId, "create_newsletter", record.id, null, data);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function updateNewsletter(id: string, input: NewsletterInput): Promise<ContentResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const parsed = newsletterSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;

    const { data: oldVal } = await supabase.from("newsletters").select("*").eq("id", id).single();

    const { error } = await supabase
      .from("newsletters")
      .update({
        title: data.title,
        subject: data.subject || null,
        content: data.content || null,
        file_url: data.fileUrl || null,
        visible_tiers: data.visibleTiers,
        status: data.status,
        publish_date: data.publishDate ? new Date(data.publishDate).toISOString() : new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    await writeAuditLog(supabase, adminId, "update_newsletter", id, oldVal, data);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function deleteNewsletter(id: string): Promise<ContentResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const { data: oldVal } = await supabase.from("newsletters").select("*").eq("id", id).single();

    const { error } = await supabase.from("newsletters").delete().eq("id", id);

    if (error) return { success: false, error: error.message };

    await writeAuditLog(supabase, adminId, "delete_newsletter", id, oldVal, null);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}
