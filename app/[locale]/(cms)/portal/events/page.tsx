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

  return (
    <PortalEventsClient
      events={events || []}
      registrations={registrations || []}
      currentUserId={user.id}
    />
  );
}
