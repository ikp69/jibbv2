import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PortalTrainingClient from "./PortalTrainingClient";

export const dynamic = "force-dynamic";

export default async function PortalTrainingPage() {
  const supabase = await createClient();

  // Validate authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch member profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("membership_tier")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/login");
  }

  // Fetch training programs visible to this tier
  // SECURITY: Selective projection to prevent leaking creator UUID and internal metadata
  const { data: programs, error: programsError } = await supabase
    .from("training_programs")
    .select("id, title, description, start_date, end_date, location, max_participants, status, visible_tiers, created_at, category, duration, capacity")
    .in("status", ["open", "completed"])
    .contains("visible_tiers", [profile.membership_tier])
    .order("start_date", { ascending: true });

  if (programsError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
        Failed to load training programs: {programsError.message}
      </div>
    );
  }

  // Fetch active registrations for current member
  // SECURITY: Only fetch user's own registrations with status fields (no cross-member leakage)
  const { data: registrations } = await supabase
    .from("training_registrations")
    .select("id, training_id, member_id, status, registration_date")
    .eq("member_id", user.id);

  return (
    <PortalTrainingClient
      programs={programs || []}
      registrations={registrations || []}
      currentUserId={user.id}
    />
  );
}
