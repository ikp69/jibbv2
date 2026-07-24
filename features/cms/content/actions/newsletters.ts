"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { newsletterSchema, type NewsletterInput } from "../schemas/content-schemas";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export type ContentResult = {
  success: boolean;
  error?: string;
};

// Reusable audit logging helper for newsletters
async function writeNewsletterAuditLog(
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
      table_name: "newsletters",
      record_id: recordId,
      ip_address: ipAddress,
      user_agent: userAgent,
      old_values: oldVal,
      new_values: newVal,
    });
  } catch (auditErr) {
    console.warn(`[NEWSLETTERS_AUDIT] Failed to insert log for ${action}:`, auditErr);
  }
}

export async function createNewsletter(input: NewsletterInput): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;

    const parsed = newsletterSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    const { data: record, error } = await adminClient
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

    if (error || !record) return { success: false, error: error?.message || "Insert failed" };

    try {
      revalidatePath("/[locale]/(cms)/admin/newsletters", "page");
      revalidatePath("/[locale]/(cms)/portal/newsletters", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[CREATE_NEWSLETTER] Revalidation warning:", e);
    }

    await writeNewsletterAuditLog(adminId, "create_newsletter", record.id, null, data);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[CREATE_NEWSLETTER] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function updateNewsletter(id: string, input: NewsletterInput): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;

    const parsed = newsletterSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient
      .from("newsletters")
      .select("title, status, publish_date, visible_tiers")
      .eq("id", id)
      .single();

    const { error } = await adminClient
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

    try {
      revalidatePath("/[locale]/(cms)/admin/newsletters", "page");
      revalidatePath("/[locale]/(cms)/portal/newsletters", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[UPDATE_NEWSLETTER] Revalidation warning:", e);
    }

    await writeNewsletterAuditLog(adminId, "update_newsletter", id, oldVal, data);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[UPDATE_NEWSLETTER] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function deleteNewsletter(id: string): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient.from("newsletters").select("title, status").eq("id", id).single();

    const { error } = await adminClient.from("newsletters").delete().eq("id", id);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/[locale]/(cms)/admin/newsletters", "page");
      revalidatePath("/[locale]/(cms)/portal/newsletters", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[DELETE_NEWSLETTER] Revalidation warning:", e);
    }

    await writeNewsletterAuditLog(adminId, "delete_newsletter", id, oldVal, null);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[DELETE_NEWSLETTER] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

