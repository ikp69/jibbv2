import React from "react";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import ExhibitionSupportClient from "./ExhibitionSupportClient";

export const dynamic = "force-dynamic";

export default async function ExhibitionSupportPage() {
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch existing exhibition support requests for this user
  const { data: applications } = await supabase
    .from("special_program_applications")
    .select("*")
    .eq("member_id", user.id)
    .eq("form_type", "exhibition_support")
    .order("created_at", { ascending: false });

  return (
    <ExhibitionSupportClient 
      initialApplications={applications || []} 
    />
  );
}
