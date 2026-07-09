import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function PortalProfilePage() {
  const supabase = await createClient();

  // Validate authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/en/login");
  }

  // Fetch profiles that corresponds to this user
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, company_name, designation, membership_tier, phone, industry, country, city, website, company_description, looking_for, show_in_directory"
    )
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/en/login");
  }

  return <ProfileClient profile={profile as any} />;
}
