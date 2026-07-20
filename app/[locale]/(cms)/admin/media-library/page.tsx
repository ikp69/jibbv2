import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import AdminMediaLibraryClient from "./AdminMediaLibraryClient";

export const dynamic = "force-dynamic";

export default async function AdminMediaLibraryPage() {
  // Validate admin auth and role
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect("/portal/dashboard");
  }

  const supabase = await createClient();

  // Fetch all media resources
  const { data: resources, error: resourcesError } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (resourcesError) {
    return <div className="p-6 text-red-400">Error loading media library: {resourcesError.message}</div>;
  }

  return <AdminMediaLibraryClient initialResources={resources || []} />;
}
