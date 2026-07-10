import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MemberDirectoryClient from "./MemberDirectoryClient";

export const dynamic = "force-dynamic";

export default async function PortalMemberDirectoryPage() {
  const supabase = await createClient();

  // Validate authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch approved active members who allowed directory display
  const { data: members, error } = await supabase
    .from("profiles")
    .select("id, company_name, company_description, industry, country, city, website, looking_for, membership_tier")
    .eq("role", "member")
    .eq("status", "active")
    .eq("show_in_directory", true)
    .order("company_name", { ascending: true });

  if (error) {
    return <div className="p-6 text-red-400">Error loading directory: {error.message}</div>;
  }

  return <MemberDirectoryClient initialMembers={members || []} />;
}
