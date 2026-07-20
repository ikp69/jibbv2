import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import BusinessMatchingClient from "./BusinessMatchingClient";

export const dynamic = "force-dynamic";

export default async function AdminBusinessMatchingPage() {
  // Validate admin auth and role
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect("/portal/dashboard");
  }

  const supabase = await createClient();

  // Fetch opportunities and interest pitches in parallel
  const [oppResult, pitchResult] = await Promise.all([
    supabase
      .from("business_opportunities")
      .select("*, profiles(company_name, email, membership_tier)")
      .order("created_at", { ascending: false }),
    supabase
      .from("opportunity_interest")
      .select("*, profiles(company_name, email, membership_tier)")
      .order("created_at", { ascending: false })
  ]);

  if (oppResult.error || pitchResult.error) {
    return (
      <div className="p-6 text-red-400">
        Error loading business matching listings: {oppResult.error?.message || pitchResult.error?.message}
      </div>
    );
  }

  const opportunities = oppResult.data || [];
  const pitches = pitchResult.data || [];

  return (
    <BusinessMatchingClient
      opportunities={opportunities}
      pitches={(pitches as any)}
    />
  );
}
