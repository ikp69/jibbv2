"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { getCurrentSessionId } from "@/lib/supabase/auth-guard";
import { SessionService } from "@/lib/services/session-service";

export type LogoutResult = {
  success: boolean;
  error?: string;
};


export async function logout(): Promise<LogoutResult> {
  const supabase = await createClient();

  // 1. Fetch current session and user context
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || null;
  const sid = getCurrentSessionId(token);
  const user = session?.user || null;

  if (user && sid) {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

    // Revoke session in database
    await SessionService.revokeSession(sid, user.id, "user_logout");

    // Insert audit log
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "member_logout",
      table_name: "profiles",
      record_id: user.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      old_values: null,
      new_values: { session_id: sid },
    });
  }

  // 2. Perform Supabase Sign Out
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}

