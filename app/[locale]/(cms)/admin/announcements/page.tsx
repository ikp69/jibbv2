import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AnnouncementsClient from "@/app/[locale]/(cms)/admin/announcements/AnnouncementsClient";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();

  // Validate admin auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch announcements
  const { data: list, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-6 text-red-400">Error loading announcements: {error.message}</div>;
  }

  return <AnnouncementsClient initialList={list || []} />;
}
