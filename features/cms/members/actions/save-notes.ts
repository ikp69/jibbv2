"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export type SaveNotesResult = {
  success: boolean;
  error?: string;
};

export async function saveNotes(memberId: string, notes: string): Promise<SaveNotesResult> {
  const supabase = await createClient();

  // Validate authorization
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    return { success: false, error: "Unauthorized access" };
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", currentUser.id)
    .single();

  if (adminProfile?.role !== "admin") {
    return { success: false, error: "Access denied. Admin role required." };
  }

  // Get previous notes for audit
  const { data: oldProfile } = await supabase
    .from("profiles")
    .select("notes")
    .eq("id", memberId)
    .single();

  // Update notes
  const { error } = await supabase
    .from("profiles")
    .update({ notes })
    .eq("id", memberId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Write audit log
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || undefined;
  const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || undefined;

  await supabase.from("audit_logs").insert({
    user_id: currentUser.id,
    action: "update_member_notes",
    table_name: "profiles",
    record_id: memberId,
    ip_address: ipAddress,
    user_agent: userAgent,
    old_values: { notes: oldProfile?.notes },
    new_values: { notes },
  });

  return { success: true };
}
