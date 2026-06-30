"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export type LogoutResult = {
  success: boolean;
  error?: string;
};

export async function logout(): Promise<LogoutResult> {
  const supabase = await createClient();

  // 1. Fetch current user context before signing out (to log)
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

    // Log the logout action
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "member_logout",
      table_name: "profiles",
      record_id: user.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      old_values: null,
      new_values: null,
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
