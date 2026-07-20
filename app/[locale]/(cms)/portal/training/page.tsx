import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import PortalTrainingClient from "./PortalTrainingClient";

export const dynamic = "force-dynamic";

export default async function PortalTrainingPage() {
  // Validate authentication and load cached profile
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch training programs visible to this tier (or all if admin)
  // SECURITY: Selective projection to prevent leaking creator UUID and internal metadata
  let progQuery = supabase
    .from("training_programs")
    .select("id, title, description, start_date, end_date, location, status, visible_tiers, created_at, category, duration, capacity")
    .in("status", ["open", "completed"]);

  if (profile.role !== "admin") {
    progQuery = progQuery.contains("visible_tiers", [profile.membership_tier]);
  }

  // Fetch approved counts for all programs securely using admin client
  const fetchAllApproved = async () => {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      const { data: allApproved } = await adminSupabase
        .from("training_registrations")
        .select("training_id")
        .eq("status", "approved");
      return allApproved || [];
    } catch (err) {
      console.error("Failed to fetch approved counts:", err);
      return [];
    }
  };

  // Run all database fetches concurrently in parallel
  const [programsResult, registrationsResult, allApproved] = await Promise.all([
    progQuery.order("start_date", { ascending: true }),
    supabase
      .from("training_registrations")
      .select("id, training_id, member_id, status")
      .eq("member_id", user.id),
    fetchAllApproved()
  ]);

  if (programsResult.error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
        Failed to load training programs: {programsResult.error.message}
      </div>
    );
  }

  const programs = programsResult.data || [];
  const registrations = registrationsResult.data || [];

  // Count approved registrations
  const counts: Record<string, number> = {};
  allApproved.forEach((r) => {
    counts[r.training_id] = (counts[r.training_id] || 0) + 1;
  });

  const programsWithCounts = programs.map((p) => ({
    ...p,
    approved_count: counts[p.id] || 0,
  }));

  return (
    <PortalTrainingClient
      programs={programsWithCounts}
      registrations={registrations}
      currentUserId={user.id}
    />
  );
}
