import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AuditLogsClient from "./AuditLogsClient";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const supabase = await createClient();

  // Validate admin auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/en/login");
  }

  // Fetch audit logs with profile joins
  const { data: logs, error } = await supabase
    .from("audit_logs")
    .select("*, profiles(company_name, email)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return <div className="p-6 text-red-400">Error loading audit logs: {error.message}</div>;
  }

  return <AuditLogsClient initialLogs={(logs as any) || []} />;
}
