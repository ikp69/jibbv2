import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EventsClient from "./EventsClient";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const supabase = await createClient();

  // Validate admin auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch events
  const { data: list, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  if (error) {
    return <div className="p-6 text-red-400">Error loading events: {error.message}</div>;
  }

  // Fetch registrations with profiles (including phone)
  const { data: registrations } = await supabase
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
    .order("created_at", { ascending: false });

  return <EventsClient initialList={list || []} initialRegistrations={registrations || []} />;
}
