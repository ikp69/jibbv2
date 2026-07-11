import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TrainingClient from "./TrainingClient";

export const dynamic = "force-dynamic";

export default async function AdminTrainingPage() {
  const supabase = await createClient();

  // Validate admin auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch training programs
  const { data: list, error } = await supabase
    .from("training_programs")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    return <div className="p-6 text-red-400">Error loading training programs: {error.message}</div>;
  }

  // Fetch registrations with profiles (including phone)
  const { data: registrations } = await supabase
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
    .order("created_at", { ascending: false });

  return <TrainingClient initialList={list || []} initialRegistrations={registrations || []} />;
}
