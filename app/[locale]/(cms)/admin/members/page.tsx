import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import MemberListClient from "./MemberListClient";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  // Validate admin authentication and role
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect("/portal/dashboard");
  }

  const supabase = await createClient();

  // Fetch profiles that are members
  const { data: members, error: membersError } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, company_name, designation, membership_tier, membership_start_date, membership_end_date, industry, country, status, is_active"
    )
    .eq("role", "member")
    .order("company_name", { ascending: true });

  if (membersError) {
    return (
      <div className="p-6 text-red-400">
        Error loading member directory: {membersError.message}
      </div>
    );
  }

  return <MemberListClient initialMembers={members || []} />;
}
