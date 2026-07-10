import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CollaborationClient from "./CollaborationClient";

export const dynamic = "force-dynamic";

export default async function AdminCollaborationPage() {
  const supabase = await createClient();

  // Validate admin auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify admin role
  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminProfile?.role !== "admin") {
    redirect("/portal/dashboard");
  }

  // Fetch collaboration opportunities
  // SECURITY: Admin can see all, but selective projection for audit safety
  const { data: collaborations, error: colError } = await supabase
    .from("collaboration_opportunities")
    .select("id, title, description, industry, status, visible_tiers, created_at, created_by, category, direction, location")
    .order("created_at", { ascending: false });

  // Fetch collaboration pitches
  // SECURITY: Selective projection to prevent leaking unnecessary internal fields
  const { data: pitches, error: pitchError } = await supabase
    .from("collaboration_interest")
    .select("id, collaboration_id, member_id, message, status, created_at, profiles(company_name, email)")
    .order("created_at", { ascending: false });

  if (colError || pitchError) {
    return (
      <div className="p-6 text-red-400">
        Error loading strategic collaborations: {colError?.message || pitchError?.message}
      </div>
    );
  }

  return (
    <CollaborationClient
      collaborations={collaborations || []}
      pitches={(pitches as any) || []}
    />
  );
}
