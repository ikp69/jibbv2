import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import MemberNewslettersClient from "./MemberNewslettersClient";

export const dynamic = "force-dynamic";

export default async function MemberNewslettersPage() {
  // Validate authentication using cached profile
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Query published newsletters visible to their tier (or all if admin)
  // SECURITY: Selective projection to prevent leaking internal workflow status and admin metadata
  let newsQuery = supabase
    .from("newsletters")
    .select("id, title, subject, content, file_url, publish_date, status, visible_tiers, created_at")
    .eq("status", "published");

  if (profile.role !== "admin") {
    newsQuery = newsQuery.contains("visible_tiers", [profile.membership_tier]);
  }

  const { data: list, error: newsletterError } = await newsQuery
    .order("publish_date", { ascending: false });

  if (newsletterError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-750 text-sm rounded-xl">
        Failed to load newsletter archives: {newsletterError.message}
      </div>
    );
  }

  return <MemberNewslettersClient initialList={list || []} />;
}
