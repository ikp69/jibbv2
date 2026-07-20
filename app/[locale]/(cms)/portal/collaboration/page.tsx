import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import PortalCollaborationClient from "./PortalCollaborationClient";

export const dynamic = "force-dynamic";

export default async function PortalCollaborationPage() {
  // Validate member auth and load cached profile
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  const activeTier = profile.membership_tier || "associate";
  const supabase = await createClient();

  // Prepare query for published collaboration opportunities visible to active tier
  let collabQuery = supabase
    .from("collaboration_opportunities")
    .select("id, title, description, industry, status, visible_tiers, created_at, category, direction, location")
    .eq("status", "published");

  if (profile.role !== "admin") {
    collabQuery = collabQuery.contains("visible_tiers", [activeTier]);
  }

  // Fetch both collaborations and submitted interests in parallel
  const [collabResult, submittedResult] = await Promise.all([
    collabQuery.order("created_at", { ascending: false }),
    supabase
      .from("collaboration_interest")
      .select("collaboration_id, status, message, created_at")
      .eq("member_id", user.id)
  ]);

  if (collabResult.error) {
    return <div className="p-6 text-red-400">Error loading collaborations: {collabResult.error.message}</div>;
  }

  const collaborations = collabResult.data || [];
  const submittedInterests = submittedResult.data || [];

  return (
    <PortalCollaborationClient
      collaborations={collaborations}
      submittedInterests={submittedInterests}
    />
  );
}
