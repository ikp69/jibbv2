import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import AnnouncementsClient from "@/app/[locale]/(cms)/admin/announcements/AnnouncementsClient";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  // Validate admin auth
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect("/portal/dashboard");
  }

  const supabase = await createClient();

  // Fetch announcements
  const { data: list, error: announcementsError } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (announcementsError) {
    return <div className="p-6 text-red-400">Error loading announcements: {announcementsError.message}</div>;
  }

  return <AnnouncementsClient initialList={list || []} />;
}
