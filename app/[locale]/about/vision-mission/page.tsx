import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { Eye, Rocket, ShieldAlert, Award, Landmark, Sparkles, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: "Vision & Mission",
    description: t("description"),
  };
}

export default async function VisionMissionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* ============================================================
          CINEMATIC BANNER
          ============================================================ */}
      <PageHero className="py-20 lg:py-28" bgText="VISION">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              Core Principles &amp; Ambitions
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            {t("visionPage.title")}
          </h1>
          
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t("visionPage.subtitle")}
          </p>

          <div className="flex justify-center gap-3 pt-4">
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-jibb-orange">
              Strategic Foundation
            </span>
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
          </div>
        </div>
      </PageHero>

      {/* ============================================================
          VISION & MISSION SPLIT CARDS
          ============================================================ */}
      <section className="py-16 md:py-24 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Vision Card */}
            <div className="group relative rounded-3xl p-8 bg-card border border-border hover:border-primary/20 shadow-jibb hover:shadow-jibb-lg transition-all duration-300 flex flex-col gap-6 text-left">
              {/* Vision Card Accent Glow */}
              <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 bg-jibb-indigo/5 rounded-full blur-3xl pointer-events-none group-hover:bg-jibb-indigo/10 transition-colors" />
              
              <div className="p-3.5 rounded-2xl bg-primary/5 text-primary shrink-0 w-fit">
                <Eye className="size-7" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                  {t("visionPage.visionTitle")}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {t("visionPage.visionDesc")}
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="group relative rounded-3xl p-8 bg-card border border-border hover:border-accent/20 shadow-jibb hover:shadow-jibb-lg transition-all duration-300 flex flex-col gap-6 text-left">
              {/* Mission Card Accent Glow */}
              <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 bg-jibb-orange/5 rounded-full blur-3xl pointer-events-none group-hover:bg-jibb-orange/10 transition-colors" />
              
              <div className="p-3.5 rounded-2xl bg-accent/5 text-accent shrink-0 w-fit">
                <Rocket className="size-7" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                  {t("visionPage.missionTitle")}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {t("visionPage.missionDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          COOPERATION PILLARS
          ============================================================ */}
      <section className="py-16 md:py-24 bg-background">
        <div className="section-container max-w-5xl text-center space-y-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
              <Landmark className="size-3.5 text-primary" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-primary">Framework</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              {t("visionPage.pillarsTitle")}
            </h2>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Award className="size-6 text-jibb-orange" />,
                title: t("visionPage.pillar1Title"),
                desc: t("visionPage.pillar1Desc"),
                borderClass: "hover:border-jibb-indigo/30",
              },
              {
                icon: <Landmark className="size-6 text-jibb-orange" />,
                title: t("visionPage.pillar2Title"),
                desc: t("visionPage.pillar2Desc"),
                borderClass: "hover:border-jibb-orange/30",
              },
              {
                icon: <Sparkles className="size-6 text-jibb-orange" />,
                title: t("visionPage.pillar3Title"),
                desc: t("visionPage.pillar3Desc"),
                borderClass: "hover:border-jibb-sakura/30",
              },
            ].map((pillar, i) => (
              <div 
                key={i} 
                className={`group flex flex-col items-center p-8 bg-card rounded-2xl border border-border/50 ${pillar.borderClass} hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-center gap-5`}
              >
                <div className="p-3 rounded-2xl bg-accent/5 text-accent shrink-0 group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <div className="space-y-2.5">
                  <h3 className="text-base font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CALL TO ACTION
          ============================================================ */}
      <section className="py-16 bg-jibb-gradient text-white relative overflow-hidden">
        {/* Glow overlay */}
        <div aria-hidden="true" className="absolute -bottom-40 -left-40 w-96 h-96 bg-jibb-orange/10 rounded-full blur-3xl" />
        
        <div className="section-container relative z-10 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Expand Your Reach with JIBB
          </h2>
          <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xl mx-auto">
            Partner with our bilateral ecosystem to unlock premium strategic tools, secure global operations, and connect with cross-border leaders.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link href="/membership">
              <button className="w-full sm:w-auto px-7 py-3 bg-jibb-orange text-white font-bold rounded-xl hover:bg-jibb-orange-dark hover:scale-105 active:scale-[0.98] transition-all shadow-lg text-sm flex items-center justify-center gap-2">
                <span>{t("membership.cta")}</span>
                <ArrowRight className="size-4" />
              </button>
            </Link>
            <Link href="/innovation-hub">
              <button className="w-full sm:w-auto px-7 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/15 hover:scale-105 active:scale-[0.98] transition-all text-sm">
                <span>{t("innovationHub.cta")}</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
