import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import AdminMemberDirectoryClient from "./AdminMemberDirectoryClient";

export const dynamic = "force-dynamic";

export default async function AdminMemberDirectoryPage() {
  // Validate admin auth and role
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect("/portal/dashboard");
  }

  const supabase = await createClient();

  // Fetch all members for admin review
  const { data: members, error: membersError } = await supabase
    .from("profiles")
    .select("id, company_name, company_description, industry, country, city, website, looking_for, membership_tier, status, show_in_directory, email")
    .eq("role", "member")
    .order("company_name", { ascending: true });

  if (membersError) {
    return <div className="p-6 text-red-400">Error loading directory: {membersError.message}</div>;
  }

  return <AdminMemberDirectoryClient initialMembers={members || []} />;
}
