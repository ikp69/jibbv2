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
    redirect("/login");
  }

  // Verify role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/portal/dashboard");
  }

  // Query operational metrics efficiently in parallel
  const [membersResult, collabResult, oppResult, logsResult] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "member"),
    supabase.from("collaboration_opportunities").select("*", { count: "exact", head: true }),
    supabase.from("business_opportunities").select("*", { count: "exact", head: true }),
    supabase.from("audit_logs").select("action, table_name, created_at").order("created_at", { ascending: false }).limit(5)
  ]);

  const totalMembers = membersResult.count || 0;
  const totalCollaborations = collabResult.count || 0;
  const totalOpportunities = oppResult.count || 0;
  const recentLogs = logsResult.data || [];

  return (
    <DashboardClient
      stats={{
        members: totalMembers,
        collaborations: totalCollaborations,
        opportunities: totalOpportunities,
      }}
      recentLogs={recentLogs}
    />
  );
}
