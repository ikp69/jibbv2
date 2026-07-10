import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PortalAnnouncementsClient from "./PortalAnnouncementsClient";

export const dynamic = "force-dynamic";

export default async function PortalAnnouncementsPage() {
  const supabase = await createClient();

  // Validate authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch member profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("membership_tier")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/login");
  }

  // Fetch announcements visible to this tier
  const { data: announcements, error: announcementsError } = await supabase
    .from("announcements")
    .select("*")
    .eq("status", "published")
    .contains("visible_tiers", [profile.membership_tier])
    .order("is_pinned", { ascending: false })
    .order("publish_date", { ascending: false });

  if (announcementsError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
        Failed to load circulars: {announcementsError.message}
      </div>
    );
  }

  return <PortalAnnouncementsClient announcements={announcements || []} />;
}
