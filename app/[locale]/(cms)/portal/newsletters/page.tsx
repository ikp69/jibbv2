import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MemberNewslettersClient from "./MemberNewslettersClient";

export const dynamic = "force-dynamic";

export default async function MemberNewslettersPage() {
  const supabase = await createClient();

  // Validate member session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/en/login");
  }

  // Fetch member profile for tier verification
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("membership_tier")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/en/login");
  }

  // Query published newsletters visible to their tier
  const { data: list, error: newsletterError } = await supabase
    .from("newsletters")
    .select("*")
    .eq("status", "published")
    .contains("visible_tiers", [profile.membership_tier])
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
