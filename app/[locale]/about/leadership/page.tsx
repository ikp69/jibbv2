import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/sections/PageHero";
import { LeadershipGrid } from "@/components/sections/LeadershipGrid";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: "Leadership & Core Team — Japan India Business Bureau",
    description: t("description"),
  };
}

export default async function LeadershipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <main className="flex-1 bg-background text-foreground animate-fadeIn">
      {/* Hero */}
      <PageHero className="py-24 lg:py-32" bgText="TEAM">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              JIBB Board
            </span>
          </div>

          <AnimatedHeading
            text={t("leadershipPage.title") || "JIBB Leadership & Core Team"}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
            immediate
          />

          <p className="text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
            {t("leadershipPage.subtitle") || "Experienced leaders from India and Japan driving bilateral synergy, policy alignment, and corporate growth."}
          </p>
        </div>
      </PageHero>

      {/* Leadership Directory */}
      <LeadershipGrid />
    </main>
  );
}

