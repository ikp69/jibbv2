"use server";

import { createClient } from "@/lib/supabase/server";
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

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized access" };
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { success: false, error: error.message };
    }

    // Write audit log
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "change_password",
      table_name: "profiles",
      record_id: user.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      old_values: null,
      new_values: null,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "An error occurred" };
  }
}
