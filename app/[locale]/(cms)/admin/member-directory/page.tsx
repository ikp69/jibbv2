import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminMemberDirectoryClient from "./AdminMemberDirectoryClient";

export const dynamic = "force-dynamic";

export default async function AdminMemberDirectoryPage() {
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

  // Fetch all members for admin review
  const { data: members, error } = await supabase
    .from("profiles")
    .select("id, company_name, company_description, industry, country, city, website, looking_for, membership_tier, status, show_in_directory, email")
    .eq("role", "member")
    .order("company_name", { ascending: true });

  if (error) {
    return <div className="p-6 text-red-400">Error loading directory: {error.message}</div>;
  }

  return <AdminMemberDirectoryClient initialMembers={members || []} />;
}
