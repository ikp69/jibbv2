import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PortalReportsClient from "./PortalReportsClient";

export const dynamic = "force-dynamic";

export default async function PortalReportsPage() {
  const supabase = await createClient();

  // Validate authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/en/login");
  }

  // Fetch resources (automatically filtered by RLS based on active member tier)
  const { data: list, error } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
        Failed to load reports library: {error.message}
      </div>
    );
  }

  return <PortalReportsClient reports={list || []} />;
}
