import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import PortalReportsClient from "./PortalReportsClient";

export const dynamic = "force-dynamic";

export default async function PortalReportsPage() {
  // Validate authentication using cached profile
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch resources (automatically filtered by RLS based on active member tier)
  const { data: list, error: reportsError } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (reportsError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
        Failed to load reports library: {reportsError.message}
      </div>
    );
  }

  return <PortalReportsClient reports={list || []} />;
}
