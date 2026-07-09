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
    redirect("/en/login");
  }

  // Fetch active member's tier
  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_tier")
    .eq("id", user.id)
    .single();

  const activeTier = profile?.membership_tier || "associate";

  // Fetch published business opportunities visible to active tier
  const { data: opportunities, error } = await supabase
    .from("business_opportunities")
    .select("*")
    .eq("status", "published")
    .contains("visible_tiers", [activeTier])
    .order("created_at", { ascending: false });

  // Fetch already submitted interest details by this member
  const { data: submitted } = await supabase
    .from("opportunity_interest")
    .select("opportunity_id, message, supporting_document_url, status")
    .eq("member_id", user.id);

  if (error) {
    return <div className="p-6 text-red-400">Error loading opportunities: {error.message}</div>;
  }

  return (
    <PortalBusinessMatchingClient
      opportunities={opportunities || []}
      submittedPitches={submitted || []}
    />
  );
}
