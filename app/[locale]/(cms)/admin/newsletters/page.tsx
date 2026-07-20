import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import AdminNewslettersClient from "./AdminNewslettersClient";

export const dynamic = "force-dynamic";

export default async function AdminNewslettersPage() {
  // Validate admin auth and verify membership tier
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  if (profile.membership_tier !== "admin") {
    redirect("/portal/dashboard");
  }

  const supabase = await createClient();

  // Fetch newsletters
  const { data: list, error: newslettersError } = await supabase
    .from("newsletters")
    .select("*")
    .order("publish_date", { ascending: false });

  if (newslettersError) {
    return <div className="p-6 text-red-400">Error loading newsletters: {newslettersError.message}</div>;
  }

  return <AdminNewslettersClient initialList={list || []} />;
}
