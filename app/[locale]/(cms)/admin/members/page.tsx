import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MemberListClient from "./MemberListClient";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const supabase = await createClient();

  // Validate admin authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profiles that are members
  const { data: members, error } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, company_name, designation, membership_tier, membership_start_date, membership_end_date, industry, country, status, is_active"
    )
    .eq("role", "member")
    .order("company_name", { ascending: true });

  if (error) {
    return (
      <div className="p-6 text-red-400">
        Error loading member directory: {error.message}
      </div>
    );
  }

  return <MemberListClient initialMembers={members || []} />;
}
