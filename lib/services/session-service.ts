import { createAdminClient } from "@/lib/supabase/admin";

export type SessionValidationResult =
  | { valid: true; reason: null; profile: any; session: any }
  | { valid: false; reason: "revoked" | "expired" | "not_found" | "inactive" | "disabled" | "deleted" | "invalid_role"; profile?: any };

export class SessionService {
  /**
   * Inserts a new active session inside a database transaction, revoking previous ones.
   */
  static async createSession(
    userId: string,
    sessionId: string,
    req: {
      deviceName?: string;
      browser?: string;
      operatingSystem?: string;
      userAgent: string;
      ipAddress?: string;
      country?: string;
      city?: string;
    }
  ): Promise<void> {
    const admin = createAdminClient();

    // Call the database transaction RPC
    const { error } = await admin.rpc("create_new_session_tx", {
      p_user_id: userId,
      p_session_id: sessionId,
      p_device_name: req.deviceName || null,
      p_browser: req.browser || null,
      p_operating_system: req.operatingSystem || null,
      p_user_agent: req.userAgent,
      p_ip_address: req.ipAddress || null,
      p_country: req.country || null,
      p_city: req.city || null,
    });

    if (error) {
      console.error("[SESSION_SERVICE] Failed to create session transaction:", error);
      throw new Error(`Failed to create active session: ${error.message}`);
    }
  }

  /**
   * Validates user status and session active state in a single query.
   */
  static async validateSession(userId: string, sessionId: string): Promise<SessionValidationResult> {
    const admin = createAdminClient();

    // 1. Get the session record
    const { data: session, error: sessionError } = await admin
      .from("sessions")
      .select("id, session_id, revoked_at, logout_at")
      .eq("user_id", userId)
      .eq("session_id", sessionId)
      .maybeSingle();

    if (sessionError) {
      console.error("[SESSION_SERVICE] Session query error:", sessionError);
      return { valid: false, reason: "not_found" };
    }

    if (!session) {
      return { valid: false, reason: "not_found" };
    }

    if (session.revoked_at) {
      return { valid: false, reason: "revoked" };
    }

    // 2. Get the profile record
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id, role, status, country, membership_tier")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("[SESSION_SERVICE] Profile query error:", profileError);
      return { valid: false, reason: "not_found" };
    }

    if (!profile) {
      return { valid: false, reason: "deleted" };
    }

    if (profile.status !== "active") {
      return { valid: false, reason: "disabled", profile };
    }

    return { valid: true, reason: null, profile, session };
  }

  /**
   * Revokes a single session.
   */
  static async revokeSession(sessionId: string, revokedBy: string, reason: string): Promise<void> {
    const admin = createAdminClient();
    await admin
      .from("sessions")
      .update({
        revoked_at: new Date().toISOString(),
        revoked_by: revokedBy,
        revoke_reason: reason,
      })
      .eq("session_id", sessionId);
  }

  /**
   * Revokes all active sessions for a specific user.
   */
  static async revokeAllSessions(userId: string, revokedBy: string, reason: string): Promise<void> {
    const admin = createAdminClient();
    await admin
      .from("sessions")
      .update({
        revoked_at: new Date().toISOString(),
        revoked_by: revokedBy,
        revoke_reason: reason,
      })
      .eq("user_id", userId)
      .is("revoked_at", null);
  }

  /**
   * Updates last activity timestamp, throttled at 5-minute intervals.
   */
  static async touchSession(sessionId: string): Promise<void> {
    try {
      const admin = createAdminClient();
      const { data, error } = await admin
        .from("sessions")
        .select("last_activity")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (error || !data) return;

      const lastActivity = new Date(data.last_activity);
      const now = new Date();

      // Only update if difference > 5 minutes
      if (now.getTime() - lastActivity.getTime() > 5 * 60 * 1000) {
        await admin
          .from("sessions")
          .update({ last_activity: now.toISOString() })
          .eq("session_id", sessionId);
      }
    } catch (touchError) {
      console.warn("[SESSION_SERVICE] Touch session failed (non-fatal):", touchError);
    }
  }
}
