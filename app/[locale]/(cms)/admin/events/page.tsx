import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import EventsClient from "./EventsClient";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  // Validate admin auth and role
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect("/portal/dashboard");
  }

  const supabase = await createClient();

  // Fetch events and event registrations concurrently in parallel
  const [eventsResult, registrationsResult] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false }),
    supabase
      .from("event_registrations")
      .select(`
        id,
        event_id,
        member_id,
        message,
        status,
        created_at,
        profiles:member_id (
          id,
          full_name,
          company_name,
          email,
          phone,
          membership_tier
        )
      `)
      .order("created_at", { ascending: false })
  ]);

  if (eventsResult.error) {
    return <div className="p-6 text-red-400">Error loading events: {eventsResult.error.message}</div>;
  }

  const list = eventsResult.data || [];
  const registrations = registrationsResult.data || [];

  return <EventsClient initialList={list} initialRegistrations={registrations} />;
}
