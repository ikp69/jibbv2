import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import PortalBusinessMatchingClient from "./PortalBusinessMatchingClient";

export const dynamic = "force-dynamic";

export default async function PortalBusinessMatchingPage() {
  // Validate member auth and retrieve profile from cache
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  const activeTier = profile.membership_tier || "associate";
  const supabase = await createClient();

  // Prepare the query for published business opportunities visible to active tier
  let oppQuery = supabase
    .from("business_opportunities")
    .select("id, title, description, industry, country, looking_for, deadline, created_at")
    .eq("status", "published")
    .neq("created_by", user.id);

  if (profile.role !== "admin") {
    oppQuery = oppQuery.contains("visible_tiers", [activeTier]);
  }

  // Fetch all database records concurrently in parallel
  const [oppResult, myProposalsResult, submittedResult, incomingPitchesResult] = await Promise.all([
    oppQuery.order("created_at", { ascending: false }),
    supabase
      .from("business_opportunities")
      .select("id, title, description, industry, country, looking_for, deadline, status, created_at, visible_tiers")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("opportunity_interest")
      .select("opportunity_id, message, supporting_document_url, status")
      .eq("member_id", user.id),
    supabase
      .from("opportunity_interest")
      .select(`
        id,
        opportunity_id,
        message,
        supporting_document_url,
        status,
        created_at,
        profiles(company_name, email),
        business_opportunities!inner(title, created_by)
      `)
      .eq("business_opportunities.created_by", user.id)
  ]);

  if (oppResult.error) {
    return <div className="p-6 text-red-400">Error loading opportunities: {oppResult.error.message}</div>;
  }

  const opportunities = oppResult.data || [];
  const myProposals = myProposalsResult.data || [];
  const submitted = submittedResult.data || [];
  const rawIncomingPitches = incomingPitchesResult.data || [];

  // Map incoming pitches to the format expected by the client component
  const pitchesOnMyProposals = rawIncomingPitches.map((p: any) => ({
    id: p.id,
    opportunity_id: p.opportunity_id,
    opportunity_title: p.business_opportunities?.title || "",
    message: p.message,
    supporting_document_url: p.supporting_document_url,
    status: p.status,
    created_at: p.created_at,
    profiles: p.profiles,
  }));

  return (
    <PortalBusinessMatchingClient
      opportunities={opportunities}
      submittedPitches={submitted}
      myProposals={(myProposals as any)}
      pitchesOnMyProposals={pitchesOnMyProposals}
    />
  );
}
