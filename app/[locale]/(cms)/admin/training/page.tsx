import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import TrainingClient from "./TrainingClient";

export const dynamic = "force-dynamic";

export default async function AdminTrainingPage() {
  // Validate admin auth and role
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect("/portal/dashboard");
  }

  const supabase = await createClient();

  // Fetch training programs and registrations concurrently in parallel
  const [programsResult, registrationsResult] = await Promise.all([
    supabase
      .from("training_programs")
      .select("*")
      .order("start_date", { ascending: false }),
    supabase
      .from("training_registrations")
      .select(`
        id,
        training_id,
        member_id,
        status,
        created_at,
        profiles:member_id (
          id,
          full_name,
          company_name,
          email,
          phone,
          membership_tier
        )
      `)
      .order("created_at", { ascending: false })
  ]);

  if (programsResult.error) {
    return <div className="p-6 text-red-400">Error loading training programs: {programsResult.error.message}</div>;
  }

  const list = programsResult.data || [];
  const registrations = registrationsResult.data || [];

  return <TrainingClient initialList={list} initialRegistrations={registrations} />;
}
