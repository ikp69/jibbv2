import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import WebsiteFormsClient from "./WebsiteFormsClient";

export const dynamic = "force-dynamic";

export default async function WebsiteFormsPage() {
  const supabase = await createClient();

  // Validate admin auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if role is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/portal/dashboard");
  }

  // Fetch contact inquiries
  const { data: contacts } = await supabase
    .from("contact_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch membership applications
  const { data: memberships } = await supabase
    .from("membership_applications")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch career applications
  const { data: careers } = await supabase
    .from("career_applications")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch newsletter subscribers
  const { data: newsletters } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <WebsiteFormsClient
      contacts={contacts || []}
      memberships={memberships || []}
      careers={careers || []}
      newsletters={newsletters || []}
    />
  );
}
