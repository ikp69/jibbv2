import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PortalBusinessMatchingClient from "./PortalBusinessMatchingClient";

export const dynamic = "force-dynamic";

export default async function PortalBusinessMatchingPage() {
  const supabase = await createClient();

  // Validate member auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch active member's tier
  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_tier, role")
    .eq("id", user.id)
    .single();

  const activeTier = profile?.membership_tier || "associate";

  // Fetch published business opportunities visible to active tier (created by others, or all if admin)
  // Selecting only necessary columns to prevent creator UUID leakage to client payloads
  let oppQuery = supabase
    .from("business_opportunities")
    .select("id, title, description, industry, country, looking_for, deadline, created_at")
    .eq("status", "published")
    .neq("created_by", user.id);

  if (profile?.role !== "admin") {
    oppQuery = oppQuery.contains("visible_tiers", [activeTier]);
  }

  const { data: opportunities, error } = await oppQuery
    .order("created_at", { ascending: false });

  // Fetch my proposed matchings (regardless of status)
  // SECURITY: Selective projection to prevent exposing internal statuses
  const { data: myProposals } = await supabase
    .from("business_opportunities")
    .select("id, title, description, industry, country, looking_for, deadline, status, created_at, visible_tiers")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  // Fetch already submitted interest details by this member on other listings
  const { data: submitted } = await supabase
    .from("opportunity_interest")
    .select("opportunity_id, message, supporting_document_url, status")
    .eq("member_id", user.id);

  // Fetch pitches submitted by other members on my matching opportunities
  const { data: incomingPitches } = await supabase
    .from("opportunity_interest")
    .select(`
      id,
      opportunity_id,
      message,
      supporting_document_url,
      status,
      created_at,
      profiles(company_name, email),
      business_opportunities(title, created_by)
    `);

  // Filter incoming pitches for opportunities created by this user
  const pitchesOnMyProposals = (incomingPitches || [])
    .filter((p: any) => p.business_opportunities && p.business_opportunities.created_by === user.id)
    .map((p: any) => ({
      id: p.id,
      opportunity_id: p.opportunity_id,
      opportunity_title: p.business_opportunities.title,
      message: p.message,
      supporting_document_url: p.supporting_document_url,
      status: p.status,
      created_at: p.created_at,
      profiles: p.profiles,
    }));

  if (error) {
    return <div className="p-6 text-red-400">Error loading opportunities: {error.message}</div>;
  }

  return (
    <PortalBusinessMatchingClient
      opportunities={opportunities || []}
      submittedPitches={submitted || []}
      myProposals={(myProposals as any) || []}
      pitchesOnMyProposals={pitchesOnMyProposals}
    />
  );
}
