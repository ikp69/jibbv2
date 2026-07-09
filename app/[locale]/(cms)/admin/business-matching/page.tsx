import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BusinessMatchingClient from "./BusinessMatchingClient";

export const dynamic = "force-dynamic";

export default async function AdminBusinessMatchingPage() {
  const supabase = await createClient();

  // Validate admin auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/en/login");
  }

  // Fetch opportunities
  const { data: opportunities, error: oppError } = await supabase
    .from("business_opportunities")
    .select("*, profiles(company_name, email)")
    .order("created_at", { ascending: false });

  // Fetch interest pitches
  const { data: pitches, error: pitchError } = await supabase
    .from("opportunity_interest")
    .select("*, profiles(company_name, email)")
    .order("created_at", { ascending: false });

  if (oppError || pitchError) {
    return (
      <div className="p-6 text-red-400">
        Error loading business matching listings: {oppError?.message || pitchError?.message}
      </div>
    );
  }

  return (
    <BusinessMatchingClient
      opportunities={opportunities || []}
      pitches={(pitches as any) || []}
    />
  );
}
