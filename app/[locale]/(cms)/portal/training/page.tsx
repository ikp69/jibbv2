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
    .select("membership_tier, role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/login");
  }

  // Fetch training programs visible to this tier (or all if admin)
  // SECURITY: Selective projection to prevent leaking creator UUID and internal metadata
  let progQuery = supabase
    .from("training_programs")
    .select("id, title, description, start_date, end_date, location, status, visible_tiers, created_at, category, duration, capacity")
    .in("status", ["open", "completed"]);

  if (profile.role !== "admin") {
    progQuery = progQuery.contains("visible_tiers", [profile.membership_tier]);
  }

  const { data: programs, error: programsError } = await progQuery
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
    .select("id, training_id, member_id, status")
    .eq("member_id", user.id);

  // Fetch approved counts for all programs securely using admin client
  let programsWithCounts = (programs || []).map(p => ({ ...p, approved_count: 0 }));
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminSupabase = createAdminClient();
    const { data: allApproved } = await adminSupabase
      .from("training_registrations")
      .select("training_id")
      .eq("status", "approved");

    if (allApproved) {
      const counts: Record<string, number> = {};
      allApproved.forEach((r) => {
        counts[r.training_id] = (counts[r.training_id] || 0) + 1;
      });
      programsWithCounts = programsWithCounts.map((p) => ({
        ...p,
        approved_count: counts[p.id] || 0,
      }));
    }
  } catch (err) {
    console.error("Failed to fetch approved counts:", err);
  }

  return (
    <PortalTrainingClient
      programs={programsWithCounts}
      registrations={registrations || []}
      currentUserId={user.id}
    />
  );
}
