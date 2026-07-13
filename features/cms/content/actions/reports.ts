"use server";

import { createClient } from "@/lib/supabase/server";
import { reportSchema, type ReportInput } from "../schemas/content-schemas";
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
    table_name: "resources",
    record_id: recordId,
    ip_address: ipAddress,
    user_agent: userAgent,
    old_values: oldVal,
    new_values: newVal,
  });
}

export async function createReport(input: ReportInput): Promise<ContentResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const parsed = reportSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;

    const { data: record, error } = await supabase
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

    if (error || !record) return { success: false, error: error.message };

    await writeAuditLog(supabase, adminId, "create_report", record.id, null, data);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function updateReport(id: string, input: ReportInput): Promise<ContentResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const parsed = reportSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;

    const { data: oldVal } = await supabase.from("resources").select("*").eq("id", id).single();

    const { error } = await supabase
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

    await writeAuditLog(supabase, adminId, "update_report", id, oldVal, data);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function deleteReport(id: string): Promise<ContentResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const { data: oldVal } = await supabase.from("resources").select("*").eq("id", id).single();

    const { error } = await supabase.from("resources").delete().eq("id", id);

    if (error) return { success: false, error: error.message };

    await writeAuditLog(supabase, adminId, "delete_report", id, oldVal, null);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function incrementDownloadCount(id: string): Promise<ContentResult> {
  try {
    const supabase = await createClient();
    
    // We fetch and update in one transaction or simple read/write (authenticated or guest is fine)
    const { data, error: fetchError } = await supabase
      .from("resources")
      .select("download_count")
      .eq("id", id)
      .single();

    if (fetchError) return { success: false, error: fetchError.message };

    const nextCount = (data?.download_count || 0) + 1;

    const { error: updateError } = await supabase
      .from("resources")
      .update({ download_count: nextCount })
      .eq("id", id);

    if (updateError) return { success: false, error: updateError.message };

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function getSignedResourceUrl(fileUrl: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createClient();
    
    // 1. Verify user is logged in (authenticated)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "You must be logged in to view this resource." };
    }

    // 2. Extract path from the full public URL stored in database
    // e.g. "https://.../storage/v1/object/public/member-resources/filename.pdf"
    const urlParts = fileUrl.split("/member-resources/");
    const filePath = urlParts[urlParts.length - 1];

    if (!filePath) {
      return { success: false, error: "Invalid file path." };
    }

    // 3. Generate a signed URL valid for 60 seconds
    const { data, error } = await supabase.storage
      .from("member-resources")
      .createSignedUrl(filePath, 60);

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to generate download link." };
    }

    return { success: true, url: data.signedUrl };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred." };
  }
}


