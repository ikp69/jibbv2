import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CollaborationClient from "./CollaborationClient";

export const dynamic = "force-dynamic";

export default async function AdminCollaborationPage() {
  const supabase = await createClient();

  // Validate admin auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/en/login");
  }

  // Fetch collaboration opportunities
  const { data: collaborations, error: colError } = await supabase
    .from("collaboration_opportunities")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch collaboration pitches
  const { data: pitches, error: pitchError } = await supabase
    .from("collaboration_interest")
    .select("*, profiles(company_name, email)")
    .order("created_at", { ascending: false });

  if (colError || pitchError) {
    return (
      <div className="p-6 text-red-400">
        Error loading strategic collaborations: {colError?.message || pitchError?.message}
      </div>
    );
  }

  return (
    <CollaborationClient
      collaborations={collaborations || []}
      pitches={(pitches as any) || []}
    />
  );
}
