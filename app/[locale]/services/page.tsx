import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Parallax } from "@/components/ui/Parallax";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { HorizontalScroll } from "@/components/sections/HorizontalScroll";
import { PageHero } from "@/components/sections/PageHero";
import { WorkProcess } from "@/components/sections/WorkProcess";
import {
  MapPin, Handshake, Globe, DollarSign, Sparkles, ArrowRight, ShieldCheck, Cpu, Lightbulb,
} from "lucide-react";

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
      icon: <MapPin className="size-8 text-jibb-orange" />,
      title: t("servicesPage.marketEntry.title"),
      subtitle: t("servicesPage.marketEntry.subtitle"),
      desc: t("servicesPage.marketEntry.para1"),
      colorClass: "hover:border-jibb-orange/30",
      bgText: "ENTRY",
      headline: "Navigating Cross-Border Complexities",
      para1: t("servicesPage.marketEntry.para1"),
      para2: t("servicesPage.marketEntry.para2"),
      sidebarTitle: "Key Focus Sectors",
      sidebarItems: ["Semiconductors", "Advanced Manufacturing", "EV Systems & Batteries", "Clean Energy Incentives"],
      stepsTitle: "Our Entry Roadmap",
      steps: [
        { num: "01", title: t("servicesPage.marketEntry.step1Title"), desc: t("servicesPage.marketEntry.step1Desc") },
        { num: "02", title: t("servicesPage.marketEntry.step2Title"), desc: t("servicesPage.marketEntry.step2Desc") },
        { num: "03", title: t("servicesPage.marketEntry.step3Title"), desc: t("servicesPage.marketEntry.step3Desc") },
      ],
    },
    {
      id: "partnership-facilitation",
      icon: <Handshake className="size-8 text-jibb-orange" />,
      title: t("servicesPage.partnership.title"),
      subtitle: t("servicesPage.partnership.subtitle"),
      desc: t("servicesPage.partnership.para1"),
      colorClass: "hover:border-jibb-indigo/30",
      bgText: "PARTNERS",
      headline: "Connecting Precision with Speed",
      para1: t("servicesPage.partnership.para1"),
      para2: t("servicesPage.partnership.para2"),
      sidebarTitle: "Bilateral Matchmaking",
      sidebarItems: ["Verified Directory Listings", "Technical Standards Vetting", "Joint Venture Structuring", "Shared R&D Agreements"],
      stepsTitle: "Facilitation Deliverables",
      steps: [
        { num: "01", title: t("servicesPage.partnership.step1Title"), desc: t("servicesPage.partnership.step1Desc") },
        { num: "02", title: t("servicesPage.partnership.step2Title"), desc: t("servicesPage.partnership.step2Desc") },
        { num: "03", title: t("servicesPage.partnership.step3Title"), desc: t("servicesPage.partnership.step3Desc") },
      ],
    },
    {
      id: "co-innovation-collaboration",
      icon: <Lightbulb className="size-8 text-jibb-orange" />,
      title: t("servicesPage.coInnovation.title"),
      subtitle: t("servicesPage.coInnovation.subtitle"),
      desc: t("servicesPage.coInnovation.para1"),
      colorClass: "hover:border-jibb-sakura/30",
      bgText: "INNOVATE",
      headline: "Groundbreaking Joint Products",
      para1: t("servicesPage.coInnovation.para1"),
      para2: t("servicesPage.coInnovation.para2"),
      sidebarTitle: "Innovation Areas",
      sidebarItems: ["AI & Robotics", "EV Powertrains", "Sustainable Tech", "Advanced Materials"],
      stepsTitle: "Our Collaboration Process",
      steps: [
        { num: "01", title: t("servicesPage.coInnovation.step1Title"), desc: t("servicesPage.coInnovation.step1Desc") },
        { num: "02", title: t("servicesPage.coInnovation.step2Title"), desc: t("servicesPage.coInnovation.step2Desc") },
        { num: "03", title: t("servicesPage.coInnovation.step3Title"), desc: t("servicesPage.coInnovation.step3Desc") },
      ],
    },
    {
      id: "investment-support",
      icon: <DollarSign className="size-8 text-jibb-orange" />,
      title: t("servicesPage.investment.title"),
      subtitle: t("servicesPage.investment.subtitle"),
      desc: t("servicesPage.investment.para1"),
      colorClass: "hover:border-amber-500/30",
      bgText: "INVEST",
      headline: "Deploying Capital Channels Securely",
      para1: t("servicesPage.investment.para1"),
      para2: t("servicesPage.investment.para2"),
      sidebarTitle: "Capital Facilitation",
      sidebarItems: ["India-Japan Angel Networks", "PLI Subsidy & Regulatory Claims", "Financial Due Diligences", "Cross-Border Banking Support"],
      stepsTitle: "Investment Advisories",
      steps: [
        { num: "01", title: t("servicesPage.investment.step1Title"), desc: t("servicesPage.investment.step1Desc") },
        { num: "02", title: t("servicesPage.investment.step2Title"), desc: t("servicesPage.investment.step2Desc") },
        { num: "03", title: t("servicesPage.investment.step3Title"), desc: t("servicesPage.investment.step3Desc") },
      ],
    },
    {
      id: "diaspora-networking",
      icon: <Globe className="size-8 text-jibb-orange" />,
      title: t("servicesPage.diaspora.title"),
      subtitle: t("servicesPage.diaspora.subtitle"),
      desc: t("servicesPage.diaspora.para1"),
      colorClass: "hover:border-emerald-500/30",
      bgText: "NETWORK",
      headline: "Connecting People and Opportunities",
      para1: t("servicesPage.diaspora.para1"),
      para2: t("servicesPage.diaspora.para2"),
      sidebarTitle: "Networking Highlights",
      sidebarItems: ["Cultural Mixers", "Business Panels", "Startup Mixers", "Investor Meetups"],
      stepsTitle: "Our Networking Pathways",
      steps: [
        { num: "01", title: t("servicesPage.diaspora.step1Title"), desc: t("servicesPage.diaspora.step1Desc") },
        { num: "02", title: t("servicesPage.diaspora.step2Title"), desc: t("servicesPage.diaspora.step2Desc") },
        { num: "03", title: t("servicesPage.diaspora.step3Title"), desc: t("servicesPage.diaspora.step3Desc") },
      ],
    },
  ];

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* ============================================================
          HERO BANNER
          ============================================================ */}
      <PageHero className="py-20 lg:py-28" bgText="SERVICES">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              Strategic Solutions
            </span>
          </div>

          <AnimatedHeading
            text={t("servicesPage.title")}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
            immediate
          />

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
      </PageHero>

      {/* ============================================================
          SERVICES OVERVIEW GRID — Quick navigation anchors
          ============================================================ */}
      <section className="py-20 md:py-28 bg-jibb-gradient-subtle">
        <div className="section-container max-w-5xl">
          <ScrollReveal staggerChildren={0.12} className="grid md:grid-cols-2 gap-8">
            {services.map((svc) => (
              <a
                key={svc.id}
                href={`#${svc.id}`}
                className={`group relative rounded-3xl p-8 bg-card border border-border/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between min-h-[300px] text-left overflow-hidden ${svc.colorClass}`}
              >
                <div aria-hidden="true" className="absolute -top-6 -right-6 w-28 h-28 bg-jibb-orange/5 rounded-full blur-xl pointer-events-none transition-all duration-500 group-hover:bg-jibb-orange/15 group-hover:scale-125" />

                <div className="space-y-5">
                  <div className="p-3 rounded-2xl bg-primary/5 inline-flex transition-transform duration-300 group-hover:scale-110">
                    {svc.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{svc.title}</h3>
                    <span className="text-xs font-semibold text-jibb-orange block uppercase tracking-wider">{svc.subtitle}</span>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-2">{svc.desc}</p>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary transition-colors group-hover:text-jibb-orange">
                  <span>{t("common.learnMore")}</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background border-t border-border/30">
        <div className="section-container max-w-5xl">
          <HorizontalScroll />
        </div>
      </section>

      <WorkProcess />

      {/* ============================================================
          EACH SERVICE — Full detail sections
          ============================================================ */}
      {services.map((svc, svcIdx) => (
        <div key={svc.id} id={svc.id}>
          {/* Detail Copy Section */}
          <section className={`py-16 md:py-24 border-b border-border/30 ${svcIdx % 2 === 0 ? "bg-jibb-gradient-subtle" : "bg-background"}`}>
            <div className="section-container max-w-5xl">
              {/* Service Header */}
              <div className="mb-12 flex flex-col gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 w-fit">
                  {svc.icon}
                  <span className="text-xs font-bold tracking-wider uppercase text-primary">{svc.subtitle}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">{svc.title}</h2>
              </div>

              <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
                <div className="md:col-span-8 space-y-6 text-left">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{svc.headline}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{svc.para1}</p>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{svc.para2}</p>
                </div>

                <div className="md:col-span-4 flex justify-center">
                  <div className="relative w-full max-w-xs rounded-2xl p-6 bg-card border border-border shadow-jibb flex flex-col gap-4 text-left overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                    <h4 className="text-xs font-bold text-foreground tracking-tight uppercase">{svc.sidebarTitle}</h4>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {svc.sidebarItems.map((item) => (
                        <li key={item} className="flex items-center gap-1.5">
                          <span className="text-jibb-orange font-bold">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step Roadmap */}
          <section className={`py-20 md:py-28 ${svcIdx % 2 === 0 ? "bg-background" : "bg-jibb-gradient-subtle"}`}>
            <div className="section-container max-w-5xl text-center space-y-16">
              <div className="space-y-4">
                <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{svc.stepsTitle}</h3>
                <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {svc.steps.map((st) => (
                  <div key={st.num} className="group relative rounded-2xl p-8 bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between min-h-[220px]">
                    <div className="absolute top-4 right-6 text-4xl font-extrabold text-primary/5 group-hover:text-primary/10 select-none tracking-wider">{st.num}</div>
                    <div className="space-y-3">
                      <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{st.title}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      ))}

      {/* ============================================================
          CO-INNOVATION & ECOSYSTEM STRATEGY BANNER
          ============================================================ */}
      <section className="py-16 md:py-24 bg-background border-t border-border/30">
        <div className="section-container max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <ScrollReveal direction="left" className="md:col-span-7 space-y-5 text-left">
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
                  <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-muted text-foreground/80 border border-border">{tag}</span>
                ))}
              </div>
            </ScrollReveal>

            <div className="md:col-span-5 flex justify-center">
              <Parallax speed={-0.1} className="w-full flex justify-center">
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
                      <AnimatedButton variant="accent" size="sm" className="w-full font-semibold gap-1">
                        Become a Member <ArrowRight className="size-3.5" />
                      </AnimatedButton>
                    </Link>
                  </div>
                </div>
              </Parallax>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
