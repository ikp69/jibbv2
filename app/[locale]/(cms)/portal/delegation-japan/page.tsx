import React from "react";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import DelegationJapanClient from "./DelegationJapanClient";

export const dynamic = "force-dynamic";

export default async function DelegationJapanPage() {
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch existing delegation to japan applications for this user
  const { data: applications } = await supabase
    .from("special_program_applications")
    .select("*")
    .eq("member_id", user.id)
    .eq("form_type", "delegation_japan")
    .order("created_at", { ascending: false });

  return (
    <DelegationJapanClient 
      initialApplications={applications || []} 
    />
  );
}
