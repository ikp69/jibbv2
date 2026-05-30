import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { Building2, Compass, Handshake, Globe, ArrowRight, ShieldCheck, HeartHandshake, Lightbulb, Users } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: "About Us",
    description: t("description"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <main className="flex-1 bg-background text-foreground">
      {/* ============================================================
          CINEMATIC BILATERAL HERO
          ============================================================ */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-jibb-gradient">
        {/* Wave pattern overlay */}
        <div aria-hidden="true" className="absolute inset-0 wave-pattern opacity-10 pointer-events-none animate-wave-slide" />
        
        {/* Dynamic Glow Accent */}
        <div 
          aria-hidden="true" 
          className="absolute -top-40 right-[15%] w-[450px] h-[450px] bg-jibb-orange/10 rounded-full blur-[110px] pointer-events-none"
        />

        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              Bilateral Strategy &amp; Growth
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            {t("aboutPage.title")}
          </h1>
          
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t("aboutPage.subtitle")}
          </p>

          <div className="flex justify-center gap-3 pt-4">
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-jibb-orange">
              Tokyo — Noida Axis
            </span>
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
          </div>
        </div>
      </section>

      {/* ============================================================
          INTRO BLOCK
          ============================================================ */}
      <section className="py-16 md:py-24 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-5 text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {t("aboutPage.introHeadline")}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("aboutPage.introPara1")}
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("aboutPage.introPara2")}
              </p>
            </div>
            
            <div className="md:col-span-5 flex justify-center">
              {/* Glassmorphic Trust Card */}
              <div className="relative w-full max-w-sm rounded-2xl p-6 bg-card border border-border shadow-jibb-md flex flex-col gap-5 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/5 text-primary shrink-0">
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground block uppercase tracking-wider">Operational Presence</span>
                    <span className="text-sm font-bold text-foreground">Dual Hubs</span>
                  </div>
                </div>

                <div className="space-y-3.5 border-t border-border/50 pt-4 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-foreground/80">Tokyo Headquarters</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-jibb-indigo/5 text-jibb-indigo border border-jibb-indigo/15 uppercase tracking-wide">Japan</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-foreground/80">Noida Operations Office</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-jibb-orange/5 text-jibb-orange border border-jibb-orange/15 uppercase tracking-wide">India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          WHO WE ARE (Split details)
          ============================================================ */}
      <section className="py-16 md:py-24 bg-background">
        <div className="section-container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Left Column: Who We Are */}
            <div className="space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                <Users className="size-3.5 text-primary" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-primary">Identity</span>
              </div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                {t("aboutPage.whoWeAreTitle")}
              </h2>
              <div className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line space-y-4">
                {t("aboutPage.whoWeAreDesc")}
              </div>
            </div>

            {/* Right Column: What We Do */}
            <div className="space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10">
                <Compass className="size-3.5 text-accent" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-accent">Catalyst</span>
              </div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                {t("aboutPage.whatWeDoTitle")}
              </h2>
              <div className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line space-y-4">
                {t("aboutPage.whatWeDoDesc")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          WHAT WE BELIEVE (Four core pillars)
          ============================================================ */}
      <section className="py-16 md:py-24 bg-jibb-gradient-subtle border-t border-border/30">
        <div className="section-container max-w-5xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              {t("aboutPage.whatWeBelieveTitle")}
            </h2>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <ShieldCheck className="size-6 text-jibb-indigo" />,
                title: t("aboutPage.whatWeBelieve1Title"),
                desc: t("aboutPage.whatWeBelieve1Desc"),
              },
              {
                icon: <Globe className="size-6 text-jibb-indigo" />,
                title: t("aboutPage.whatWeBelieve2Title"),
                desc: t("aboutPage.whatWeBelieve2Desc"),
              },
              {
                icon: <Lightbulb className="size-6 text-jibb-indigo" />,
                title: t("aboutPage.whatWeBelieve3Title"),
                desc: t("aboutPage.whatWeBelieve3Desc"),
              },
              {
                icon: <HeartHandshake className="size-6 text-jibb-indigo" />,
                title: t("aboutPage.whatWeBelieve4Title"),
                desc: t("aboutPage.whatWeBelieve4Desc"),
              },
            ].map((pillar, i) => (
              <div 
                key={i} 
                className="flex gap-4 p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 text-left"
              >
                <div className="mt-1 p-2.5 rounded-xl bg-primary/5 text-primary shrink-0 h-fit">
                  {pillar.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CALL TO ACTION (Bottom banner)
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
