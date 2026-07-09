import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNewslettersClient from "./AdminNewslettersClient";

export const dynamic = "force-dynamic";

export default async function AdminNewslettersPage() {
  const supabase = await createClient();

  // Validate admin auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/en/login");
  }

  // Verify that the user has admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_tier")
    .eq("id", user.id)
    .single();

  if (!profile || profile.membership_tier !== "admin") {
    redirect("/en/portal/dashboard");
  }

  // Fetch newsletters
  const { data: list, error } = await supabase
    .from("newsletters")
    .select("*")
    .order("publish_date", { ascending: false });

  if (error) {
    return <div className="p-6 text-red-400">Error loading newsletters: {error.message}</div>;
  }

  return <AdminNewslettersClient initialList={list || []} />;
}
