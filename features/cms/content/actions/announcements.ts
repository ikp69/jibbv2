"use server";

import { createClient } from "@/lib/supabase/server";
import { announcementSchema, type AnnouncementInput } from "../schemas/content-schemas";
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
    table_name: "announcements",
    record_id: recordId,
    ip_address: ipAddress,
    user_agent: userAgent,
    old_values: oldVal,
    new_values: newVal,
  });
}

export async function createAnnouncement(input: AnnouncementInput): Promise<ContentResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const parsed = announcementSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;

    const { data: record, error } = await supabase
      .from("announcements")
      .insert({
        title: data.title,
        content: data.content,
        banner_image: data.bannerImage || null,
        attachment: data.attachment || null,
        external_link: data.externalLink || null,
        visible_tiers: data.visibleTiers,
        is_pinned: data.isPinned,
        status: data.status,
        publish_date: data.publishDate ? new Date(data.publishDate).toISOString() : new Date().toISOString(),
        expiry_date: data.expiryDate ? new Date(data.expiryDate).toISOString() : null,
        created_by: adminId,
      })
      .select("id")
      .single();

    if (error || !record) return { success: false, error: error.message };

    await writeAuditLog(supabase, adminId, "create_announcement", record.id, null, data);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function updateAnnouncement(id: string, input: AnnouncementInput): Promise<ContentResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const parsed = announcementSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;

    const { data: oldVal } = await supabase.from("announcements").select("*").eq("id", id).single();

    const { error } = await supabase
      .from("announcements")
      .update({
        title: data.title,
        content: data.content,
        banner_image: data.bannerImage || null,
        attachment: data.attachment || null,
        external_link: data.externalLink || null,
        visible_tiers: data.visibleTiers,
        is_pinned: data.isPinned,
        status: data.status,
        publish_date: data.publishDate ? new Date(data.publishDate).toISOString() : oldVal.publish_date,
        expiry_date: data.expiryDate ? new Date(data.expiryDate).toISOString() : null,
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    await writeAuditLog(supabase, adminId, "update_announcement", id, oldVal, data);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function deleteAnnouncement(id: string): Promise<ContentResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const { data: oldVal } = await supabase.from("announcements").select("*").eq("id", id).single();

    const { error } = await supabase.from("announcements").delete().eq("id", id);

    if (error) return { success: false, error: error.message };

    await writeAuditLog(supabase, adminId, "delete_announcement", id, oldVal, null);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function togglePinAnnouncement(id: string): Promise<ContentResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const { data: oldVal } = await supabase.from("announcements").select("is_pinned").eq("id", id).single();
    const nextPin = !oldVal?.is_pinned;

    const { error } = await supabase
      .from("announcements")
      .update({ is_pinned: nextPin })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    await writeAuditLog(supabase, adminId, "toggle_pin_announcement", id, oldVal, { is_pinned: nextPin });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}
