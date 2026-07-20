import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import ReportsClient from "./ReportsClient";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  // Validate admin auth and role
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect("/portal/dashboard");
  }

  const supabase = await createClient();

  // Fetch reports
  const { data: list, error: reportsError } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (reportsError) {
    return <div className="p-6 text-red-400">Error loading reports: {reportsError.message}</div>;
  }

  return <ReportsClient initialList={list || []} />;
}
