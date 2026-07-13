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

  // 3. Fetch counts & items for statistics
  // - count of user's own business matchmaking requests
  const { count: matchesCount } = await supabase
    .from("business_matches")
    .select("*", { count: "exact", head: true })
    .eq("member_id", user.id);

  // - list of announcements visible to this tier (or all if admin)
  // SECURITY: Selective projection to prevent exposing internal metadata
  let annQuery = supabase
    .from("announcements")
    .select("id, title, content, status, publish_date, is_pinned, visible_tiers")
    .eq("status", "published");

  if (profile.role !== "admin") {
    annQuery = annQuery.contains("visible_tiers", [profile.membership_tier]);
  }

  const { data: announcements } = await annQuery
    .order("is_pinned", { ascending: false })
    .order("publish_date", { ascending: false });

  const activeAnnouncements = announcements || [];

  // - count of resources the user has access to
  const { count: resourcesCount } = await supabase
    .from("resources")
    .select("*", { count: "exact", head: true });

  const serializedUser = {
    email: user.email || "",
    companyName: profile.company_name,
    designation: profile.designation,
    membershipTier: profile.membership_tier,
    role: profile.role,
  };

  const stats = {
    matchings: matchesCount || 0,
    events: upcomingEvents.length,
    resources: resourcesCount || 0,
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
