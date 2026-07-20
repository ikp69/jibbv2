import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function PortalProfilePage() {
  // Validate authentication using cached profile
  const { user, profile: cachedProfile, error } = await getCachedProfile();

  if (error || !user || !cachedProfile) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch full details of the corresponding profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, company_name, designation, membership_tier, phone, industry, country, city, website, company_description, looking_for, show_in_directory"
    )
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/login");
  }

  return <ProfileClient profile={profile as any} />;
}
