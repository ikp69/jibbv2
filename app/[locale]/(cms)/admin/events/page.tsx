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
    redirect("/en/login");
  }

  // Fetch events
  const { data: list, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  if (error) {
    return <div className="p-6 text-red-400">Error loading events: {error.message}</div>;
  }

  return <EventsClient initialList={list || []} />;
}
