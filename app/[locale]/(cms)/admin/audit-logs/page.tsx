import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import AuditLogsClient from "./AuditLogsClient";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  // Validate admin auth and role
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect("/portal/dashboard");
  }

  const supabase = await createClient();

  // Fetch audit logs with profile joins
  const { data: logs, error: logsError } = await supabase
    .from("audit_logs")
    .select("*, profiles(company_name, email)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (logsError) {
    return <div className="p-6 text-red-400">Error loading audit logs: {logsError.message}</div>;
  }

  return <AuditLogsClient initialLogs={(logs as any) || []} />;
}
