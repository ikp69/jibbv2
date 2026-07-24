"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentSessionId } from "@/lib/supabase/auth-guard";
import { SessionService } from "@/lib/services/session-service";
import { AuditService } from "@/lib/services/audit-service";

export type LogoutResult = {
  success: boolean;
  error?: string;
};

/**
 * Standard logout Server Action.
 */
export async function logout(): Promise<LogoutResult> {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token || null;
    const user = session?.user || null;

    if (user) {
      const sessionId = getCurrentSessionId(token);
      if (sessionId) {
        try {
          await SessionService.revokeSession(sessionId, user.id, "user_logout");
        } catch (revokeErr) {
          console.warn("[LOGOUT] Failed to mark session revoked in DB:", revokeErr);
        }
      }

      await AuditService.log({
        userId: user.id,
        action: "logout",
        tableName: "profiles",
        recordId: user.id,
      });
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[LOGOUT] Supabase Auth signOut error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred during logout";
    console.error("[LOGOUT] Critical exception during logout:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}
