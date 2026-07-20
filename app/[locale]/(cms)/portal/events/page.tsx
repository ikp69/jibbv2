import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import PortalEventsClient from "./PortalEventsClient";

export const dynamic = "force-dynamic";

export default async function PortalEventsPage() {
  // Validate authentication and retrieve cached profile
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch events visible to this tier (or all if admin)
  // SECURITY: Selective projection to prevent leaking creator UUID and internal metadata
  let eventQuery = supabase
    .from("events")
    .select("id, title, description, event_date, location, capacity, status, visible_tiers, created_at, banner, registration_deadline")
    .in("status", ["open", "completed"]);

  if (profile.role !== "admin") {
    eventQuery = eventQuery.contains("visible_tiers", [profile.membership_tier]);
  }

  // Fetch approved counts for all events securely using admin client
  const fetchAllApproved = async () => {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const adminSupabase = createAdminClient();
      const { data: allApproved } = await adminSupabase
        .from("event_registrations")
        .select("event_id")
        .eq("status", "approved");
      return allApproved || [];
    } catch (err) {
      console.error("Failed to fetch approved counts:", err);
      return [];
    }
  };

  // Run all database fetches concurrently in parallel
  const [eventsResult, registrationsResult, allApproved] = await Promise.all([
    eventQuery.order("event_date", { ascending: true }),
    supabase
      .from("event_registrations")
      .select("id, event_id, member_id, status, registration_date, message")
      .eq("member_id", user.id),
    fetchAllApproved()
  ]);

  if (eventsResult.error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
        Failed to load invite-only events: {eventsResult.error.message}
      </div>
    );
  }

  const events = eventsResult.data || [];
  const registrations = registrationsResult.data || [];

  // Count approved registrations per event
  const counts: Record<string, number> = {};
  allApproved.forEach((r) => {
    counts[r.event_id] = (counts[r.event_id] || 0) + 1;
  });

  const eventsWithCounts = events.map((e) => ({
    ...e,
    approved_count: counts[e.id] || 0,
  }));

  return (
    <PortalEventsClient
      events={eventsWithCounts}
      registrations={registrations}
      currentUserId={user.id}
    />
  );
}
