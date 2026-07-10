import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PortalCollaborationClient from "./PortalCollaborationClient";

export const dynamic = "force-dynamic";

export default async function PortalCollaborationPage() {
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
    .select("membership_tier")
    .eq("id", user.id)
    .single();

  const activeTier = profile?.membership_tier || "associate";

  // Fetch published collaboration opportunities visible to active tier
  const { data: collaborations, error } = await supabase
    .from("collaboration_opportunities")
    .select("*")
    .eq("status", "published")
    .contains("visible_tiers", [activeTier])
    .order("created_at", { ascending: false });

  // Fetch already submitted interest details (IDs and status) by this member
  const { data: submitted } = await supabase
    .from("collaboration_interest")
    .select("collaboration_id, status")
    .eq("member_id", user.id);

  const submittedInterests = submitted || [];

  if (error) {
    return <div className="p-6 text-red-400">Error loading collaborations: {error.message}</div>;
  }

  return (
    <PortalCollaborationClient
      collaborations={collaborations || []}
      submittedInterests={submittedInterests}
    />
  );
}
