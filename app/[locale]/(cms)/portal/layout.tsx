import React from "react";
import { redirect } from "next/navigation";
import { getCachedProfile } from "@/lib/supabase/profile";
import CmsSidebar from "@/components/layout/cms-sidebar";
import CmsHeader from "@/components/layout/cms-header";
import { PORTAL_NAV_GROUPS } from "@/constants/cms/navigation";

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 1. Retrieve cached profile
  const { user, profile, error } = await getCachedProfile();

  if (error || !user || !profile) {
    redirect(`/${locale}/login`);
  }

  if (profile.status !== "active") {
    redirect(`/${locale}/login`);
  }

  if (profile.role !== "member") {
    if (profile.role === "admin") {
      redirect(`/${locale}/admin/dashboard`);
    } else {
      redirect(`/${locale}/login`);
    }
  }

  const breadcrumbs = [{ label: "Portal", path: `/${locale}/portal/dashboard` }];

  const serializedUser = {
    email: user.email || "",
    companyName: profile.company_name,
    designation: profile.designation,
    membershipTier: profile.membership_tier,
    role: profile.role,
    companyLogo: profile.company_logo,
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
