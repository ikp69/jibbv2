"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { reportSchema, type ReportInput } from "../schemas/content-schemas";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export type ContentResult = {
  success: boolean;
  error?: string;
};

// Reusable audit logging helper for reports / resources
async function writeReportAuditLog(
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
      table_name: "resources",
      record_id: recordId,
      ip_address: ipAddress,
      user_agent: userAgent,
      old_values: oldVal,
      new_values: newVal,
    });
  } catch (auditErr) {
    console.warn(`[REPORTS_AUDIT] Failed to insert log for ${action}:`, auditErr);
  }
}

export async function createReport(input: ReportInput): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;

    const parsed = reportSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    const { data: record, error } = await adminClient
      .from("resources")
      .insert({
        title: data.title,
        description: data.description || null,
        category: data.category,
        resource_type: data.resourceType,
        file_url: data.fileUrl,
        file_size: data.fileSize || null,
        tags: data.tags,
        visible_tiers: data.visibleTiers,
        created_by: adminId,
      })
      .select("id")
      .single();

    if (error || !record) return { success: false, error: error?.message || "Insert failed" };

    try {
      revalidatePath("/[locale]/(cms)/admin/resources", "page");
      revalidatePath("/[locale]/(cms)/portal/resources", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[CREATE_REPORT] Revalidation warning:", e);
    }

    await writeReportAuditLog(adminId, "create_report", record.id, null, data);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[CREATE_REPORT] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function updateReport(id: string, input: ReportInput): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;

    const parsed = reportSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient
      .from("resources")
      .select("title, category, resource_type, visible_tiers")
      .eq("id", id)
      .single();

    const { error } = await adminClient
      .from("resources")
      .update({
        title: data.title,
        description: data.description || null,
        category: data.category,
        resource_type: data.resourceType,
        file_url: data.fileUrl,
        file_size: data.fileSize || null,
        tags: data.tags,
        visible_tiers: data.visibleTiers,
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/[locale]/(cms)/admin/resources", "page");
      revalidatePath("/[locale]/(cms)/portal/resources", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[UPDATE_REPORT] Revalidation warning:", e);
    }

    await writeReportAuditLog(adminId, "update_report", id, oldVal, data);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[UPDATE_REPORT] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function deleteReport(id: string): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient.from("resources").select("title, category").eq("id", id).single();

    const { error } = await adminClient.from("resources").delete().eq("id", id);

    if (error) return { success: false, error: error.message };

    try {
      revalidatePath("/[locale]/(cms)/admin/resources", "page");
      revalidatePath("/[locale]/(cms)/portal/resources", "page");
      revalidatePath("/[locale]/(cms)/portal/dashboard", "page");
    } catch (e) {
      console.warn("[DELETE_REPORT] Revalidation warning:", e);
    }

    await writeReportAuditLog(adminId, "delete_report", id, oldVal, null);

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[DELETE_REPORT] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function incrementDownloadCount(id: string): Promise<ContentResult> {
  try {
    const adminClient = createAdminClient();

    // Atomic download count increment via RPC or fallback fetch-and-increment
    const { error } = await adminClient.rpc("increment_resource_download_count", { resource_id: id });

    if (error) {
      // Fallback update if RPC procedure is not deployed
      const { data } = await adminClient
        .from("resources")
        .select("download_count")
        .eq("id", id)
        .single();

      const nextCount = (data?.download_count || 0) + 1;

      const { error: updateError } = await adminClient
        .from("resources")
        .update({ download_count: nextCount })
        .eq("id", id);

      if (updateError) return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[INCREMENT_DOWNLOAD_COUNT] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function getSignedResourceUrl(fileUrl: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const authResult = await verifyServerRequest();
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    // Extract file path from stored public URL
    const urlParts = fileUrl.split("/member-resources/");
    const filePath = urlParts[urlParts.length - 1];

    if (!filePath) {
      return { success: false, error: "Invalid resource file path." };
    }

    const adminClient = createAdminClient();

    // Generate a signed URL valid for 60 seconds
    const { data, error } = await adminClient.storage
      .from("member-resources")
      .createSignedUrl(filePath, 60);

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to generate signed download link." };
    }

    return { success: true, url: data.signedUrl };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred.";
    console.error("[GET_SIGNED_RESOURCE_URL] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}



