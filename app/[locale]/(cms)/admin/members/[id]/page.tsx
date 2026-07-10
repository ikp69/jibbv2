import React from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import MemberDetailTabs from "./MemberDetailTabs";

export const dynamic = "force-dynamic";

type MemberDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminMemberDetailPage({ params }: MemberDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Validate admin authentication
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    redirect("/login");
  }

  // Fetch target member details
  const { data: member, error: memberError } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, company_name, designation, membership_tier, membership_start_date, membership_end_date, phone, industry, country, city, website, company_description, looking_for, notes, status, is_active"
    )
    .eq("id", id)
    .single();

  if (memberError || !member) {
    notFound();
  }

  // Fetch activity logs (audit logs) relating to this member
  const { data: logs, error: logsError } = await supabase
    .from("audit_logs")
    .select("id, action, created_at, new_values")
    .or(`user_id.eq.${id},record_id.eq.${id}`)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      {/* Detail Tabs View */}
      <MemberDetailTabs member={member} activityLogs={logs || []} />
    </div>
  );
}
