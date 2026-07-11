import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PortalEventsClient from "./PortalEventsClient";

export const dynamic = "force-dynamic";

export default async function PortalEventsPage() {
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

  // Fetch events visible to this tier
  // SECURITY: Selective projection to prevent leaking creator UUID and internal metadata
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("id, title, description, event_date, location, capacity, status, visible_tiers, created_at, banner, registration_deadline")
    .in("status", ["open", "completed"])
    .contains("visible_tiers", [profile.membership_tier])
    .order("event_date", { ascending: true });

  if (eventsError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
        Failed to load invite-only events: {eventsError.message}
      </div>
    );
  }

  // Fetch active registrations for current member
  // SECURITY: Only member's own registrations to prevent cross-member privacy violation
  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("id, event_id, member_id, status, registration_date, message")
    .eq("member_id", user.id);

  // Fetch approved counts for all events securely using admin client
  let eventsWithCounts = (events || []).map(e => ({ ...e, approved_count: 0 }));
  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminSupabase = createAdminClient();
    const { data: allApproved } = await adminSupabase
      .from("event_registrations")
      .select("event_id")
      .eq("status", "approved");

    if (allApproved) {
      const counts: Record<string, number> = {};
      allApproved.forEach((r) => {
        counts[r.event_id] = (counts[r.event_id] || 0) + 1;
      });
      eventsWithCounts = eventsWithCounts.map((e) => ({
        ...e,
        approved_count: counts[e.id] || 0,
      }));
    }
  } catch (err) {
    console.error("Failed to fetch approved counts:", err);
  }

  return (
    <PortalEventsClient
      events={eventsWithCounts}
      registrations={registrations || []}
      currentUserId={user.id}
    />
  );
}
