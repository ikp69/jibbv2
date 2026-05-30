import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { 
  FlaskConical, Microscope, Cpu, ArrowRight, Lightbulb, GraduationCap, 
  Users, Award, Sparkles, Building2, BatteryCharging 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: "Innovation Hub",
    description: t("description"),
  };
}

export default async function InnovationHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const labs = [
    {
      id: "semiconductor",
      icon: <Cpu className="size-8 text-white" />,
      title: t("hubPage.labs.semiconductor.title"),
      desc: t("hubPage.labs.semiconductor.desc"),
      spanClass: "md:col-span-2",
      bgClass: "bg-jibb-indigo",
    },
    {
      id: "ev",
      icon: <BatteryCharging className="size-8 text-white" />,
      title: t("hubPage.labs.ev.title"),
      desc: t("hubPage.labs.ev.desc"),
      spanClass: "md:col-span-1",
      bgClass: "bg-jibb-orange",
    },
    {
      id: "pharma",
      icon: <FlaskConical className="size-8 text-white" />,
      title: t("hubPage.labs.pharma.title"),
      desc: t("hubPage.labs.pharma.desc"),
      spanClass: "md:col-span-3",
      bgClass: "bg-jibb-sakura",
    },
  ];

  const advisors = [
    { name: "Dr. Kenji Sato", role: "Semiconductor R&D Specialist", origin: "Tokyo" },
    { name: "Prof. Aarav Sharma", role: "EV Battery System Architect", origin: "Noida" },
    { name: "Hitesh Gupta", role: "Trade Strategy & Joint Ventures", origin: "Delhi NCR" },
    { name: "Sayaka Tanaka", role: "Bilateral Alliance Coordinator", origin: "Tokyo" },
  ];

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* ============================================================
          CINEMATIC BANNER
          ============================================================ */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-jibb-gradient">
        {/* Wave pattern overlay */}
        <div aria-hidden="true" className="absolute inset-0 wave-pattern opacity-10 pointer-events-none animate-wave-slide" />
        
        {/* Ambient Glow */}
        <div aria-hidden="true" className="absolute -top-40 right-[15%] w-[450px] h-[450px] bg-jibb-orange/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              Technology Sandbox
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            {t("hubPage.title")}
          </h1>
          
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t("hubPage.subtitle")}
          </p>

          <div className="flex justify-center gap-3 pt-4">
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-jibb-orange">
              Tokyo — Noida Laboratories
            </span>
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
          </div>
        </div>
      </section>

      {/* ============================================================
          LABORATORIES BENTO GRID
          ============================================================ */}
      <section className="py-20 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-5xl text-center space-y-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
              <FlaskConical className="size-3.5 text-primary" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-primary">R&amp;D Facilities</span>
            </div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              {t("hubPage.labsTitle")}
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              {t("hubPage.labsSubtitle")}
            </p>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {labs.map((lb) => (
              <div 
                key={lb.id} 
                className={`group flex flex-col justify-between p-8 rounded-2xl border border-white/10 hover:shadow-xl transition-all duration-300 min-h-[260px] text-left relative overflow-hidden text-white ${lb.spanClass} ${lb.bgClass}`}
              >
                {/* Visual Glass highlights */}
                <div aria-hidden="true" className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors" />

                <div className="space-y-4 relative z-10">
                  <div className="p-3 rounded-xl bg-white/10 inline-flex transition-transform duration-300 group-hover:scale-110">
                    {lb.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold tracking-tight">
                      {lb.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed pt-1">
                      {lb.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          STARTUP INCUBATION SECTION
          ============================================================ */}
      <section className="py-20 md:py-28 bg-background border-b border-border/30">
        <div className="section-container max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                <Lightbulb className="size-3.5 text-primary" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-primary">Incubator</span>
              </div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                {t("hubPage.incubationTitle")}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("hubPage.incubationDesc")}
              </p>
              <div className="flex gap-4 pt-2">
                <div className="text-left">
                  <span className="text-2xl font-bold text-jibb-orange block">100+</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Startups Incubated</span>
                </div>
                <div className="border-l border-border pl-4 text-left">
                  <span className="text-2xl font-bold text-jibb-indigo block">₹850 Cr+</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">VC Dealflow</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl p-6 bg-card border border-border shadow-jibb flex flex-col gap-4 text-left overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <GraduationCap className="size-5 text-jibb-indigo shrink-0" />
                  Mentorship Access
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Incubated founders are paired directly with industry experts and corporate leaders across Tokyo, Delhi, and Noida ecosystems.
                </p>
                <div className="border-t border-border pt-4">
                  <Link href="/membership">
                    <Button variant="outline" size="sm" className="w-full font-semibold gap-1">
                      Join Incubation <ArrowRight className="size-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          EXPERT ADVISORY BOARD PANEL
          ============================================================ */}
      <section className="py-20 md:py-28 bg-jibb-gradient-subtle">
        <div className="section-container max-w-5xl text-center space-y-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
              <Users className="size-3.5 text-primary" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-primary">Advisors</span>
            </div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              {t("hubPage.expertsTitle")}
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              {t("hubPage.expertsSubtitle")}
            </p>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisors.map((ad, i) => (
              <div 
                key={i} 
                className="group p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 text-center flex flex-col justify-between min-h-[160px]"
              >
                <div className="space-y-2">
                  <div className="size-10 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                    <Users className="size-5" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground tracking-tight">
                    {ad.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {ad.role}
                  </p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-accent/5 text-accent border border-accent/15 uppercase tracking-wide w-fit mx-auto mt-4">
                  {ad.origin}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
