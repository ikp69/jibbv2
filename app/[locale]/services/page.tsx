import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { MapPin, Handshake, Globe, DollarSign, Sparkles, ArrowRight, ShieldCheck, Cpu, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: "Our Services",
    description: t("description"),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const services = [
    {
      id: "market-entry",
      href: "/services/market-entry",
      icon: <MapPin className="size-8 text-jibb-orange" />,
      title: t("servicesPage.marketEntry.title"),
      subtitle: t("servicesPage.marketEntry.subtitle"),
      desc: t("whatWeDo.marketEntry.description"),
      colorClass: "hover:border-jibb-orange/30 group-hover:bg-jibb-orange/5",
    },
    {
      id: "partnership-facilitation",
      href: "/services/partnership-facilitation",
      icon: <Handshake className="size-8 text-jibb-orange" />,
      title: t("servicesPage.partnership.title"),
      subtitle: t("servicesPage.partnership.subtitle"),
      desc: t("whatWeDo.partnership.description"),
      colorClass: "hover:border-jibb-indigo/30 group-hover:bg-primary/5",
    },
    {
      id: "localization-support",
      href: "/services/localization-support",
      icon: <Globe className="size-8 text-jibb-orange" />,
      title: t("servicesPage.localization.title"),
      subtitle: t("servicesPage.localization.subtitle"),
      desc: t("whatWeDo.localization.description"),
      colorClass: "hover:border-jibb-sakura/30 group-hover:bg-jibb-sakura/5",
    },
    {
      id: "investment-support",
      href: "/services/investment-support",
      icon: <DollarSign className="size-8 text-jibb-orange" />,
      title: t("servicesPage.investment.title"),
      subtitle: t("servicesPage.investment.subtitle"),
      desc: t("servicesPage.investment.step1Desc"),
      colorClass: "hover:border-amber-500/30 group-hover:bg-amber-500/5",
    },
  ];

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* ============================================================
          HERO BANNER
          ============================================================ */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-jibb-gradient">
        {/* Wave pattern overlay */}
        <div aria-hidden="true" className="absolute inset-0 wave-pattern opacity-10 pointer-events-none animate-wave-slide" />
        
        {/* Ambient Glow Accent */}
        <div 
          aria-hidden="true" 
          className="absolute -top-40 right-[15%] w-[450px] h-[450px] bg-jibb-orange/10 rounded-full blur-[110px] pointer-events-none"
        />

        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              Strategic Solutions
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            {t("servicesPage.title")}
          </h1>
          
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t("servicesPage.subtitle")}
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
          SERVICES MAIN GRID
          ============================================================ */}
      <section className="py-20 md:py-28 bg-jibb-gradient-subtle">
        <div className="section-container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((svc) => (
              <Link 
                key={svc.id} 
                href={svc.href}
                className={`group relative rounded-3xl p-8 bg-card border border-border/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between min-h-[300px] text-left overflow-hidden ${svc.colorClass}`}
              >
                {/* Background decorative glow */}
                <div aria-hidden="true" className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none transition-all group-hover:bg-jibb-orange/10" />

                <div className="space-y-5">
                  <div className="p-3 rounded-2xl bg-primary/5 inline-flex transition-transform duration-300 group-hover:scale-110">
                    {svc.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {svc.title}
                    </h3>
                    <span className="text-xs font-semibold text-jibb-orange block uppercase tracking-wider">
                      {svc.subtitle}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                      {svc.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary transition-colors group-hover:text-jibb-orange">
                  <span>{t("common.learnMore")}</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CO-INNOVATION & ECOSYSTEM STRATEGY BANNER
          ============================================================ */}
      <section className="py-16 md:py-24 bg-background border-t border-border/30">
        <div className="section-container max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                <Cpu className="size-3.5 text-primary" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-primary">Synergy</span>
              </div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                Co-Innovation &amp; Joint Ventures
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Our services are deeply integrated with the JIBB Center of Excellence laboratories and physical incubation facilities. By combining Japanese technical rigor and hardware precision with Indian software speed, we empower startups and large corporations to scale co-innovations to global heights.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["Semiconductors", "EV Powertrains", "Pharma Analytics", "Advanced Materials"].map((tag) => (
                  <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-muted text-foreground/80 border border-border">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl p-6 bg-card border border-border shadow-jibb flex flex-col gap-4 text-left overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2.5 text-sm font-bold text-foreground">
                  <ShieldCheck className="size-5 text-jibb-indigo shrink-0" />
                  Bilateral Trusted Advisory
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We maintain strong strategic ties with METI, JETRO, DPIIT, and Invest India, allowing us to guide companies through complex regulatory systems smoothly.
                </p>
                <div className="border-t border-border pt-4">
                  <Link href="/membership">
                    <Button variant="accent" size="sm" className="w-full font-semibold gap-1">
                      Become a Member <ArrowRight className="size-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
