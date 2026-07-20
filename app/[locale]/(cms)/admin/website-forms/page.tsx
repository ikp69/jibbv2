import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import WebsiteFormsClient from "./WebsiteFormsClient";

export const dynamic = "force-dynamic";

export default async function WebsiteFormsPage() {
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect("/portal/dashboard");
  }

  const supabase = await createClient();

  // Fetch all form data concurrently in parallel
  const [contactsResult, membershipsResult, careersResult, newslettersResult] = await Promise.all([
    supabase.from("contact_inquiries").select("*").order("created_at", { ascending: false }),
    supabase.from("membership_applications").select("*").order("created_at", { ascending: false }),
    supabase.from("career_applications").select("*").order("created_at", { ascending: false }),
    supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false })
  ]);

  const contacts = contactsResult.data || [];
  const memberships = membershipsResult.data || [];
  const careers = careersResult.data || [];
  const newsletters = newslettersResult.data || [];

  return (
    <WebsiteFormsClient
      contacts={contacts}
      memberships={memberships}
      careers={careers}
      newsletters={newsletters}
    />
  );
}
