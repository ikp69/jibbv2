"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export type LifecycleResult = {
  success: boolean;
  error?: string;
};

// Helper to assert admin privilege
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

// Log lifecycle action helper
async function logLifecycleAction(
  supabase: any,
  adminId: string,
  memberId: string,
  action: string,
  oldVal: any,
  newVal: any
) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || undefined;
  const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

  await supabase.from("audit_logs").insert({
    user_id: adminId,
    action,
    table_name: "profiles",
    record_id: memberId,
    ip_address: ipAddress,
    user_agent: userAgent,
    old_values: oldVal,
    new_values: newVal,
  });
}

export async function suspendMember(memberId: string): Promise<LifecycleResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const { data: profile } = await supabase
      .from("profiles")
      .select("status, is_active")
      .eq("id", memberId)
      .single();

    const { error } = await supabase
      .from("profiles")
      .update({ status: "suspended", is_active: false })
      .eq("id", memberId);

    if (error) return { success: false, error: error.message };

    await logLifecycleAction(
      supabase,
      adminId,
      memberId,
      "suspend_member",
      { status: profile?.status, is_active: profile?.is_active },
      { status: "suspended", is_active: false }
    );

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function activateMember(memberId: string): Promise<LifecycleResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const { data: profile } = await supabase
      .from("profiles")
      .select("status, is_active")
      .eq("id", memberId)
      .single();

    const { error } = await supabase
      .from("profiles")
      .update({ status: "active", is_active: true })
      .eq("id", memberId);

    if (error) return { success: false, error: error.message };

    await logLifecycleAction(
      supabase,
      adminId,
      memberId,
      "activate_member",
      { status: profile?.status, is_active: profile?.is_active },
      { status: "active", is_active: true }
    );

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function archiveMember(memberId: string): Promise<LifecycleResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const { data: profile } = await supabase
      .from("profiles")
      .select("status, is_active")
      .eq("id", memberId)
      .single();

    const { error } = await supabase
      .from("profiles")
      .update({ status: "archived", is_active: false })
      .eq("id", memberId);

    if (error) return { success: false, error: error.message };

    await logLifecycleAction(
      supabase,
      adminId,
      memberId,
      "archive_member",
      { status: profile?.status, is_active: profile?.is_active },
      { status: "archived", is_active: false }
    );

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function renewMember(memberId: string, newEndDate: string): Promise<LifecycleResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const { data: profile } = await supabase
      .from("profiles")
      .select("membership_end_date, membership_valid_until, status, is_active")
      .eq("id", memberId)
      .single();

    const formattedDate = new Date(newEndDate).toISOString();

    const { error } = await supabase
      .from("profiles")
      .update({
        membership_end_date: formattedDate,
        membership_valid_until: newEndDate,
        status: "active",
        is_active: true,
      })
      .eq("id", memberId);

    if (error) return { success: false, error: error.message };

    await logLifecycleAction(
      supabase,
      adminId,
      memberId,
      "renew_member",
      {
        membership_end_date: profile?.membership_end_date,
        membership_valid_until: profile?.membership_valid_until,
        status: profile?.status,
        is_active: profile?.is_active,
      },
      {
        membership_end_date: formattedDate,
        membership_valid_until: newEndDate,
        status: "active",
        is_active: true,
      }
    );

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function forceLogoutSession(memberId: string, sessionId: string): Promise<LifecycleResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const { SessionService } = await import("@/lib/services/session-service");
    await SessionService.revokeSession(sessionId, adminId, "admin_logout");

    // Insert audit log
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

    await supabase.from("audit_logs").insert({
      user_id: adminId,
      action: "forced_logout",
      table_name: "sessions",
      record_id: sessionId,
      ip_address: ipAddress,
      user_agent: userAgent,
      old_values: null,
      new_values: { member_id: memberId, session_id: sessionId },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

export async function forceLogoutAllSessions(memberId: string): Promise<LifecycleResult> {
  try {
    const supabase = await createClient();
    const adminId = await checkAdminAuth(supabase);

    const { SessionService } = await import("@/lib/services/session-service");
    await SessionService.revokeAllSessions(memberId, adminId, "admin_logout");

    // Insert audit log
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

    await supabase.from("audit_logs").insert({
      user_id: adminId,
      action: "forced_logout_all",
      table_name: "profiles",
      record_id: memberId,
      ip_address: ipAddress,
      user_agent: userAgent,
      old_values: null,
      new_values: { member_id: memberId },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}

