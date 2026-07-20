import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import CollaborationClient from "./CollaborationClient";

export const dynamic = "force-dynamic";

export default async function AdminCollaborationPage() {
  // Validate admin auth and role
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect("/portal/dashboard");
  }

  const supabase = await createClient();

  // Fetch collaboration opportunities and pitches concurrently in parallel
  const [collabResult, pitchResult] = await Promise.all([
    supabase
      .from("collaboration_opportunities")
      .select("id, title, description, industry, status, visible_tiers, created_at, created_by, category, direction, location")
      .order("created_at", { ascending: false }),
    supabase
      .from("collaboration_interest")
      .select("id, collaboration_id, member_id, message, status, created_at, profiles(company_name, email)")
      .order("created_at", { ascending: false })
  ]);

  if (collabResult.error || pitchResult.error) {
    return (
      <div className="p-6 text-red-400">
        Error loading strategic collaborations: {collabResult.error?.message || pitchResult.error?.message}
      </div>
    );
  }

  const collaborations = collabResult.data || [];
  const pitches = pitchResult.data || [];

  return (
    <CollaborationClient
      collaborations={collaborations}
      pitches={(pitches as any)}
    />
  );
}
