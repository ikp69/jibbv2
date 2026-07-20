import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import PortalAnnouncementsClient from "./PortalAnnouncementsClient";

export const dynamic = "force-dynamic";

export default async function PortalAnnouncementsPage() {
  // Validate authentication and load cached profile
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch announcements visible to this tier (or all if admin)
  // SECURITY: Selective projection to prevent exposing internal metadata
  let dbQuery = supabase
    .from("announcements")
    .select("id, title, content, status, publish_date, is_pinned, visible_tiers, banner_image, attachment, external_link, created_at")
    .eq("status", "published");

  if (profile.role !== "admin") {
    dbQuery = dbQuery.contains("visible_tiers", [profile.membership_tier]);
  }

  const { data: announcements, error: announcementsError } = await dbQuery
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
