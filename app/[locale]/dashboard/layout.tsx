import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/ui/LogoutButton";
import { ShieldCheck } from "lucide-react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tLayout = await getTranslations({ locale, namespace: "layout" });
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const membershipTier = profile?.membership_tier || "associate";
  const fullName = profile?.full_name || user.email?.split("@")[0] || "JIBB Member";
  const companyName = profile?.company_name || "";
  const designation = profile?.designation || "";

  // Helper for membership badge style
  const getBadgeStyle = (tier: string) => {
    switch (tier) {
      case "admin":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "platinum":
        return "bg-slate-400/10 text-slate-300 border-slate-400/20 shadow-sm shadow-slate-500/10";
      case "gold":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-sm shadow-amber-500/10";
      case "silver":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1629] text-white">
      {/* Top Header */}
      <header className="border-b border-white/5 bg-black/30 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[96rem] mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
              <ShieldCheck className="size-5 text-jibb-orange animate-soft-pulse" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight uppercase leading-none">{tLayout("common.portalTitle")}</h1>
              <span className="text-[10px] text-white/50 tracking-wider font-semibold">{tLayout("common.memberConsole")}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-sm font-bold text-white leading-none">{fullName}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getBadgeStyle(membershipTier)}`}>
                  {membershipTier}
                </span>
              </div>
              {companyName && (
                <span className="text-[10px] text-white/55 block mt-1 leading-none">
                  {designation ? `${designation}, ` : ""}{companyName}
                </span>
              )}
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="max-w-[96rem] mx-auto px-4 md:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
