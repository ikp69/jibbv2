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
    redirect("/en/login");
  }

  // Fetch training programs
  const { data: list, error } = await supabase
    .from("training_programs")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    return <div className="p-6 text-red-400">Error loading training programs: {error.message}</div>;
  }

  return <TrainingClient initialList={list || []} />;
}
