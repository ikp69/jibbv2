"use server";

import { verifyServerRequest } from "@/lib/supabase/auth-guard";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SessionService } from "@/lib/services/session-service";
import { headers } from "next/headers";

export type PasswordResult = {
  success: boolean;
  error?: string;
};

export async function changePassword(password: string): Promise<PasswordResult> {
  try {
    if (!password || password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    // 1. Authenticate & verify active session
    const authResult = await verifyServerRequest();
    if (!authResult.valid) {
      return { success: false, error: authResult.error };
    }

    const user = authResult.user;
    const supabase = await createClient();

    // 2. Update user password in Supabase Auth
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { success: false, error: error.message };
    }

    // 3. Revoke all database sessions for this user upon password change
    try {
      await SessionService.revokeAllSessions(user.id, user.id, "password_changed");
    } catch (revokeErr) {
      console.warn("[CHANGE_PASSWORD] Session revocation error:", revokeErr);
    }

    // 4. Write Audit Log
    try {
      const adminClient = createAdminClient();
      const headersList = await headers();
      const userAgent = headersList.get("user-agent") || undefined;
      const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

      await adminClient.from("audit_logs").insert({
        user_id: user.id,
        action: "change_password",
        table_name: "profiles",
        record_id: user.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        old_values: null,
        new_values: null,
      });
    } catch (auditErr) {
      console.warn("[CHANGE_PASSWORD] Non-critical audit log insertion error:", auditErr);
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("[CHANGE_PASSWORD] Exception during password update:", errorMessage, err);
    return { success: false, error: `Server error: ${errorMessage}` };
  }
}

