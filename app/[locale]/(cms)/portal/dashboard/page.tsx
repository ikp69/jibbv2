import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import PortalDashboardClient from "./PortalDashboardClient";
import { upcomingEvents } from "@/lib/eventsData";

export const dynamic = "force-dynamic";

export default async function PortalDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 1. Get cached profile
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect(`/${locale}/login`);
  }

  const supabase = await createClient();

  // 3. Fetch counts & items for statistics concurrently in parallel
  let annQuery = supabase
    .from("announcements")
    .select("id, title, content, status, publish_date, is_pinned, visible_tiers")
    .eq("status", "published");

  if (profile.role !== "admin") {
    annQuery = annQuery.contains("visible_tiers", [profile.membership_tier]);
  }

  const [matchesResult, announcementsResult, resourcesResult] = await Promise.all([
    supabase
      .from("business_matches")
      .select("*", { count: "exact", head: true })
      .eq("member_id", user.id),
    annQuery
      .order("is_pinned", { ascending: false })
      .order("publish_date", { ascending: false }),
    supabase
      .from("resources")
      .select("*", { count: "exact", head: true })
  ]);

  const matchesCount = matchesResult.count || 0;
  const activeAnnouncements = announcementsResult.data || [];
  const resourcesCount = resourcesResult.count || 0;

  const serializedUser = {
    email: user.email || "",
    companyName: profile.company_name,
    designation: profile.designation,
    membershipTier: profile.membership_tier,
    role: profile.role,
  };

  const stats = {
    matchings: matchesCount,
    events: upcomingEvents.length,
    resources: resourcesCount,
    announcements: activeAnnouncements.length,
  };

  return (
    <PortalDashboardClient
      user={serializedUser}
      stats={stats}
      announcements={activeAnnouncements}
      upcomingEvents={upcomingEvents}
    />
  );
}
