import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PortalDashboardClient from "./PortalDashboardClient";
import { upcomingEvents } from "@/lib/eventsData";

export const dynamic = "force-dynamic";

export default async function PortalDashboardPage() {
  const supabase = await createClient();

  // 1. Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("email, company_name, designation, membership_tier, role, status")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/login");
  }

  // 3. Fetch counts & items for statistics
  // - count of user's own business matchmaking requests
  const { count: matchesCount } = await supabase
    .from("business_matches")
    .select("*", { count: "exact", head: true })
    .eq("member_id", user.id);

  // - list of announcements visible to this tier
  // SECURITY: Selective projection to prevent exposing internal metadata
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, content, status, publish_date, is_pinned, visible_tiers")
    .eq("status", "published")
    .contains("visible_tiers", [profile.membership_tier])
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
