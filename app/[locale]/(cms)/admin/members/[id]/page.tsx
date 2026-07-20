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

  // Fetch audit logs, sessions, business matching, collaborations, events and trainings concurrently in parallel
  const [logsResult, sessionsResult, opportunitiesResult, pitchesResult, collaborationsResult, collabPitchesResult, eventsResult, trainingResult] = await Promise.all([
    supabase
      .from("audit_logs")
      .select("id, action, created_at, new_values")
      .or(`user_id.eq.${id},record_id.eq.${id}`)
      .order("created_at", { ascending: false })
      .limit(55),
    supabase
      .from("sessions")
      .select("*")
      .eq("user_id", id)
      .order("last_activity", { ascending: false }),
    supabase
      .from("business_opportunities")
      .select("id, title, description, industry, country, looking_for, deadline, status, created_at")
      .eq("created_by", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("opportunity_interest")
      .select(`
        id,
        opportunity_id,
        message,
        supporting_document_url,
        status,
        created_at,
        business_opportunities(title, industry, country)
      `)
      .eq("member_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("collaboration_opportunities")
      .select("id, title, description, industry, status, created_at, category, direction, location")
      .eq("created_by", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("collaboration_interest")
      .select(`
        id,
        collaboration_id,
        message,
        status,
        created_at,
        collaboration_opportunities(title, industry)
      `)
      .eq("member_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("event_registrations")
      .select(`
        id,
        event_id,
        status,
        registration_date,
        message,
        events(title, event_date, location)
      `)
      .eq("member_id", id)
      .order("registration_date", { ascending: false }),
    supabase
      .from("training_registrations")
      .select(`
        id,
        training_id,
        status,
        created_at,
        training_programs(title, start_date, location, duration)
      `)
      .eq("member_id", id)
      .order("created_at", { ascending: false })
  ]);

  const logs = logsResult.data || [];
  const sessions = sessionsResult.data || [];
  const businessProposals = opportunitiesResult.data || [];
  const businessPitches = pitchesResult.data || [];
  const collaborationProposals = collaborationsResult.data || [];
  const collaborationPitches = collabPitchesResult.data || [];
  const eventRegistrations = eventsResult.data || [];
  const trainingRegistrations = trainingResult.data || [];

  return (
    <div className="space-y-6">
      {/* Detail Tabs View */}
      <MemberDetailTabs 
        member={member} 
        activityLogs={logs} 
        sessions={sessions}
        businessProposals={businessProposals}
        businessPitches={businessPitches as any}
        collaborationProposals={collaborationProposals}
        collaborationPitches={collaborationPitches as any}
        eventRegistrations={eventRegistrations as any}
        trainingRegistrations={trainingRegistrations as any}
      />
    </div>
  );
}
