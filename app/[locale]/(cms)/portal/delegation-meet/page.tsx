import React from "react";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import DelegationMeetClient from "./DelegationMeetClient";

export const dynamic = "force-dynamic";

export default async function DelegationMeetPage() {
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch existing delegation meet applications for this user
  const { data: applications } = await supabase
    .from("special_program_applications")
    .select("*")
    .eq("member_id", user.id)
    .eq("form_type", "delegation_meet")
    .order("created_at", { ascending: false });

  return (
    <DelegationMeetClient 
      initialApplications={applications || []} 
    />
  );
}
