import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminMediaLibraryClient from "./AdminMediaLibraryClient";

export const dynamic = "force-dynamic";

export default async function AdminMediaLibraryPage() {
  const supabase = await createClient();

  // Validate authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/en/login");
  }

  // Verify role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/en/portal/dashboard");
  }

  // Fetch all media resources
  const { data: resources, error } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-6 text-red-400">Error loading media library: {error.message}</div>;
  }

  return <AdminMediaLibraryClient initialResources={resources || []} />;
}
