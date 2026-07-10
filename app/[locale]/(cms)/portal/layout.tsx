import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CmsSidebar from "@/components/layout/cms-sidebar";
import CmsHeader from "@/components/layout/cms-header";
import { PORTAL_NAV_GROUPS } from "@/constants/cms/navigation";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // 1. Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch profile and verify role/active status
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("email, company_name, designation, membership_tier, role, status")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/login");
  }

  if (profile.status !== "active") {
    redirect("/login");
  }

  const breadcrumbs = [{ label: "Portal", path: "/en/portal/dashboard" }];

  const serializedUser = {
    email: user.email || "",
    companyName: profile.company_name,
    designation: profile.designation,
    membershipTier: profile.membership_tier,
    role: profile.role,
  };

  return (
    <div className="flex w-full min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <CmsSidebar navGroups={PORTAL_NAV_GROUPS} portalType="portal" />

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
        <footer className="h-10 border-t border-slate-200 bg-white flex items-center justify-between px-6 text-xs text-slate-500">
          <span>JIBB Member Portal v1.0.0</span>
          <span>&copy; {new Date().getFullYear()} Japan India Business Bureau</span>
        </footer>
      </div>
    </div>
  );
}
