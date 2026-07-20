import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import MemberDirectoryClient from "./MemberDirectoryClient";

export const dynamic = "force-dynamic";

export default async function PortalMemberDirectoryPage() {
  // Validate authentication using cached profile
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch approved active members who allowed directory display
  const { data: members, error: membersError } = await supabase
    .from("profiles")
    .select("id, company_name, company_description, industry, country, city, website, looking_for, membership_tier")
    .eq("role", "member")
    .eq("status", "active")
    .eq("show_in_directory", true)
    .order("company_name", { ascending: true });

  if (membersError) {
    return <div className="p-6 text-red-400">Error loading directory: {membersError.message}</div>;
  }

  // Fetch introduction requests sent by this member to show connection status
  const { data: requests } = await supabase
    .from("introduction_requests")
    .select("id, target_member_id, status")
    .eq("requester_id", user.id);

  return <MemberDirectoryClient initialMembers={members || []} initialRequests={requests || []} />;
}
