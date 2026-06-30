import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ReportsClient from "./ReportsClient";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const supabase = await createClient();

  // Validate admin auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/en/login");
  }

  // Fetch reports
  const { data: list, error } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-6 text-red-400">Error loading reports: {error.message}</div>;
  }

  return <ReportsClient initialList={list || []} />;
}
