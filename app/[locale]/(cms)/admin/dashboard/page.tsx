import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Validate authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/en/login");
  }

  // Verify role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/en/portal/dashboard");
  }

  // Query operational metrics efficiently
  const [
    { count: totalMembers },
    { count: totalCollaborations },
    { count: totalOpportunities },
    { data: recentLogs }
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "member"),
    supabase.from("collaboration_opportunities").select("*", { count: "exact", head: true }),
    supabase.from("business_opportunities").select("*", { count: "exact", head: true }),
    supabase.from("audit_logs").select("action, table_name, created_at").order("created_at", { ascending: false }).limit(5)
  ]);

  return (
    <DashboardClient
      stats={{
        members: totalMembers || 0,
        collaborations: totalCollaborations || 0,
        opportunities: totalOpportunities || 0,
      }}
      recentLogs={recentLogs || []}
    />
  );
}
