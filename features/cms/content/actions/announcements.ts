"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { announcementSchema, type AnnouncementInput } from "../schemas/content-schemas";
import { AuditService } from "@/lib/services/audit-service";
import { CacheTarget, revalidateFeatureCache } from "@/lib/utils/cache-revalidation";

export type ContentResult = {
  success: boolean;
  error?: string;
};

export async function createAnnouncement(input: AnnouncementInput): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;

    const parsed = announcementSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    const { data: record, error } = await adminClient
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

    if (error || !record) return { success: false, error: error?.message || "Insert failed" };

    revalidateFeatureCache(CacheTarget.ANNOUNCEMENTS);

    await AuditService.log({
      userId: adminId,
      action: "create_announcement",
      tableName: "announcements",
      recordId: record.id,
      newValues: data,
    });

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[CREATE_ANNOUNCEMENT] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function updateAnnouncement(id: string, input: AnnouncementInput): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;

    const parsed = announcementSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid input" };
    }

    const data = parsed.data;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient
      .from("announcements")
      .select("title, status, is_pinned, publish_date, expiry_date, visible_tiers")
      .eq("id", id)
      .single();

    const { error } = await adminClient
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
        publish_date: data.publishDate ? new Date(data.publishDate).toISOString() : oldVal?.publish_date || new Date().toISOString(),
        expiry_date: data.expiryDate ? new Date(data.expiryDate).toISOString() : null,
      })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidateFeatureCache(CacheTarget.ANNOUNCEMENTS);

    await AuditService.log({
      userId: adminId,
      action: "update_announcement",
      tableName: "announcements",
      recordId: id,
      oldValues: oldVal,
      newValues: data,
    });

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[UPDATE_ANNOUNCEMENT] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function deleteAnnouncement(id: string): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient.from("announcements").select("title, status").eq("id", id).single();

    const { error } = await adminClient.from("announcements").delete().eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidateFeatureCache(CacheTarget.ANNOUNCEMENTS);

    await AuditService.log({
      userId: adminId,
      action: "delete_announcement",
      tableName: "announcements",
      recordId: id,
      oldValues: oldVal,
    });

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[DELETE_ANNOUNCEMENT] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function togglePinAnnouncement(id: string): Promise<ContentResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: oldVal } = await adminClient.from("announcements").select("is_pinned").eq("id", id).single();
    const nextPin = !oldVal?.is_pinned;

    const { error } = await adminClient
      .from("announcements")
      .update({ is_pinned: nextPin })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidateFeatureCache(CacheTarget.ANNOUNCEMENTS);

    await AuditService.log({
      userId: adminId,
      action: "toggle_pin_announcement",
      tableName: "announcements",
      recordId: id,
      oldValues: oldVal,
      newValues: { is_pinned: nextPin },
    });

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred";
    console.error("[TOGGLE_PIN_ANNOUNCEMENT] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}


