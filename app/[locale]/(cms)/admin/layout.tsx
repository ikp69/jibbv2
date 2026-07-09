import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CmsSidebar from "@/components/layout/cms-sidebar";
import CmsHeader from "@/components/layout/cms-header";
import { ADMIN_NAV_GROUPS } from "@/constants/cms/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  // 1. Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/en/login");
  }

  // 2. Fetch profile and verify role using admin client to bypass RLS session lags
  const { data: profile, error } = await adminClient
    .from("profiles")
    .select("email, company_name, designation, membership_tier, role, status")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/en/login");
  }

  if (profile.role !== "admin" || profile.status !== "active") {
    // Redirect normal members or inactive admins out
    redirect("/en/portal/dashboard");
  }

  const breadcrumbs = [{ label: "Admin", path: "/en/admin/dashboard" }];

  const serializedUser = {
    email: user.email || "",
    companyName: profile.company_name,
    designation: profile.designation,
    membershipTier: profile.membership_tier,
    role: profile.role,
  };

  return (
    <div className="flex w-full min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <CmsSidebar navGroups={ADMIN_NAV_GROUPS} portalType="admin" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <CmsHeader breadcrumbs={breadcrumbs} user={serializedUser} />

        {/* Content Body */}
        <main className="flex-1 p-6 overflow-y-auto mt-16 md:mt-0">
          <div className="max-w-[1440px] mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="h-10 border-t border-slate-200 bg-white flex items-center justify-between px-6 text-xs text-slate-500 font-sans">
          <span>JIBB Admin Portal v1.0.0</span>
          <span>&copy; {new Date().getFullYear()} Japan India Business Bureau</span>
        </footer>
      </div>
    </div>
  );
}
