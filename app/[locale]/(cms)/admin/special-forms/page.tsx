import React from "react";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import SpecialFormsClient from "./SpecialFormsClient";

export const dynamic = "force-dynamic";

export default async function AdminSpecialFormsPage() {
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect("/portal/dashboard");
  }

  const supabase = await createClient();

  // Fetch all applications across all special programs, joining profile info
  const { data: applications, error: fetchError } = await supabase
    .from("special_program_applications")
    .select(`
      *,
      profiles:member_id (
        id,
        company_name,
        email,
        full_name
      )
    `)
    .order("created_at", { ascending: false });

  if (fetchError) {
    console.error("Error fetching special program applications:", fetchError);
  }

  return (
    <SpecialFormsClient 
      initialApplications={(applications as any) || []} 
    />
  );
}
