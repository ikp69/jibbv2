"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { SessionService } from "@/lib/services/session-service";
import { headers } from "next/headers";

export type LifecycleResult = {
  success: boolean;
  error?: string;
};

// Centralized audit logging helper for lifecycle transitions
async function logLifecycleAction(
  adminId: string,
  memberId: string,
  action: string,
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
      table_name: "profiles",
      record_id: memberId,
      ip_address: ipAddress,
      user_agent: userAgent,
      old_values: oldVal,
      new_values: newVal,
    });
  } catch (auditErr) {
    console.warn(`[LIFECYCLE_ACTION] Audit log failure for action ${action}:`, auditErr);
  }
}

export async function suspendMember(memberId: string): Promise<LifecycleResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: profile } = await adminClient
      .from("profiles")
      .select("status, is_active")
      .eq("id", memberId)
      .single();

    const { error } = await adminClient
      .from("profiles")
      .update({ status: "suspended", is_active: false })
      .eq("id", memberId);

    if (error) return { success: false, error: error.message };

    // Immediately revoke all active database sessions for the suspended member
    try {
      await SessionService.revokeAllSessions(memberId, adminId, "account_disabled");
    } catch (revokeErr) {
      console.warn("[SUSPEND_MEMBER] Session revocation warning:", revokeErr);
    }

    await logLifecycleAction(
      adminId,
      memberId,
      "suspend_member",
      { status: profile?.status, is_active: profile?.is_active },
      { status: "suspended", is_active: false }
    );

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[SUSPEND_MEMBER] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function activateMember(memberId: string): Promise<LifecycleResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: profile } = await adminClient
      .from("profiles")
      .select("status, is_active")
      .eq("id", memberId)
      .single();

    const { error } = await adminClient
      .from("profiles")
      .update({ status: "active", is_active: true })
      .eq("id", memberId);

    if (error) return { success: false, error: error.message };

    await logLifecycleAction(
      adminId,
      memberId,
      "activate_member",
      { status: profile?.status, is_active: profile?.is_active },
      { status: "active", is_active: true }
    );

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[ACTIVATE_MEMBER] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function archiveMember(memberId: string): Promise<LifecycleResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: profile } = await adminClient
      .from("profiles")
      .select("status, is_active")
      .eq("id", memberId)
      .single();

    const { error } = await adminClient
      .from("profiles")
      .update({ status: "archived", is_active: false })
      .eq("id", memberId);

    if (error) return { success: false, error: error.message };

    // Immediately revoke active sessions for archived members
    try {
      await SessionService.revokeAllSessions(memberId, adminId, "account_disabled");
    } catch (revokeErr) {
      console.warn("[ARCHIVE_MEMBER] Session revocation warning:", revokeErr);
    }

    await logLifecycleAction(
      adminId,
      memberId,
      "archive_member",
      { status: profile?.status, is_active: profile?.is_active },
      { status: "archived", is_active: false }
    );

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[ARCHIVE_MEMBER] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function renewMember(memberId: string, newEndDate: string): Promise<LifecycleResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    const adminClient = createAdminClient();

    const { data: profile } = await adminClient
      .from("profiles")
      .select("membership_end_date, membership_valid_until, status, is_active")
      .eq("id", memberId)
      .single();

    const formattedDate = new Date(newEndDate).toISOString();

    const { error } = await adminClient
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
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[RENEW_MEMBER] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function forceLogoutSession(memberId: string, sessionId: string): Promise<LifecycleResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    await SessionService.revokeSession(sessionId, adminId, "admin_logout");

    await logLifecycleAction(
      adminId,
      memberId,
      "forced_logout",
      null,
      { member_id: memberId, session_id: sessionId }
    );

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[FORCE_LOGOUT_SESSION] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}

export async function forceLogoutAllSessions(memberId: string): Promise<LifecycleResult> {
  try {
    const authResult = await verifyServerRequest("admin");
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const adminId = authResult.user.id;
    await SessionService.revokeAllSessions(memberId, adminId, "admin_logout");

    await logLifecycleAction(
      adminId,
      memberId,
      "forced_logout_all",
      null,
      { member_id: memberId }
    );

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[FORCE_LOGOUT_ALL_SESSIONS] Exception:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}


