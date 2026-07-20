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

  // Fetch introduction requests for review
  const { data: requests, error: requestsError } = await supabase
    .from("introduction_requests")
    .select(`
      id,
      requester_id,
      target_member_id,
      objective,
      status,
      created_at,
      requester:profiles!requester_id(company_name, email),
      target:profiles!target_member_id(company_name, email)
    `)
    .order("created_at", { ascending: false });

  if (membersError || requestsError) {
    return (
      <div className="p-6 text-red-400">
        Error loading admin directory data: {membersError?.message || requestsError?.message}
      </div>
    );
  }

  return (
    <AdminMemberDirectoryClient
      initialMembers={members || []}
      initialRequests={(requests as any) || []}
    />
  );
}
