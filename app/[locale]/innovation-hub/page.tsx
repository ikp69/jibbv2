import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Parallax } from "@/components/ui/Parallax";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { TechStack } from "@/components/sections/TechStack";
import {
  FlaskConical, Microscope, Cpu, ArrowRight, Lightbulb, GraduationCap,
  Users, Award, Sparkles, Building2, BatteryCharging, Battery, Trophy,
  Landmark, Globe, Handshake, Zap, Target, Rocket, Clock, Car, Factory,
  DollarSign,
} from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://npo-jibb.org";
  const title = locale === "ja"
    ? "イノベーションハブ | JIBB — 日印ビジネス機構"
    : "Innovation Hub | JIBB - Japan India Business Bureau";
  const description = locale === "ja"
    ? "日印の革新的なビジネスハブ。卓越センター、イノベーションチャレンジ、研究施設、パートナー機関、スタートアップインキュベーションで協創を推進。"
    : "Japan-India innovation hub for research, technology transfer, and collaborative development. Centers of Excellence, innovation challenges, laboratories, and startup incubation.";

  return {
    title,
    description,
    keywords: [
      "innovation hub",
      "Japan India innovation",
      "center of excellence",
      "technology transfer",
      "research collaboration",
      "startup incubation",
      "innovation challenges",
      "bilateral R&D",
      "emerging technology",
      "イノベーション",
      "技術移転",
      "スタートアップ",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/${locale}/innovation-hub`,
      siteName: "JIBB - Japan India Business Bureau",
      locale: locale === "en" ? "en_US" : "ja_JP",
      alternateLocale: locale === "en" ? "ja_JP" : "en_US",
      images: [
        {
          url: `${baseUrl}/images/og/innovation-hub-og.jpg`,
          width: 1200,
          height: 630,
          alt: "JIBB Innovation Hub — Japan India Collaborative Research & Technology Transfer",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/og/innovation-hub-og.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/innovation-hub`,
      languages: {
        en: `${baseUrl}/en/innovation-hub`,
        ja: `${baseUrl}/ja/innovation-hub`,
      },
    },
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
      bgClass: "bg-jibb-indigo hover:shadow-jibb-glow hover:-translate-y-1",
    },
    {
      id: "ev",
      icon: <BatteryCharging className="size-8 text-white" />,
      title: t("hubPage.labs.ev.title"),
      desc: t("hubPage.labs.ev.desc"),
      spanClass: "md:col-span-1",
      bgClass: "bg-jibb-orange hover:shadow-jibb-orange-glow hover:-translate-y-1",
    },
    {
      id: "pharma",
      icon: <FlaskConical className="size-8 text-white" />,
      title: t("hubPage.labs.pharma.title"),
      desc: t("hubPage.labs.pharma.desc"),
      spanClass: "md:col-span-3",
      bgClass: "bg-jibb-sakura hover:shadow-jibb-sakura-glow hover:-translate-y-1",
    },
  ];

  const coeFocuses = [
    {
      icon: <Cpu className="size-6 text-white" />,
      title: t("coePage.f1Title"),
      desc: t("coePage.f1Desc"),
      color: "from-jibb-orange to-jibb-orange-light",
    },
    {
      icon: <Car className="size-6 text-white" />,
      title: t("coePage.f2Title"),
      desc: t("coePage.f2Desc"),
      color: "from-jibb-indigo to-jibb-indigo-light",
    },
    {
      icon: <Factory className="size-6 text-white" />,
      title: t("coePage.f3Title"),
      desc: t("coePage.f3Desc"),
      color: "from-jibb-sakura to-jibb-sakura-light",
    },
  ];

  const labFacilities = [
    {
      icon: <Battery className="size-6 text-white" />,
      title: t("laboratoriesPage.l1Title"),
      desc: t("laboratoriesPage.l1Desc"),
      color: "from-jibb-orange to-jibb-orange-light",
    },
    {
      icon: <Cpu className="size-6 text-white" />,
      title: t("laboratoriesPage.l2Title"),
      desc: t("laboratoriesPage.l2Desc"),
      color: "from-jibb-indigo to-jibb-indigo-light",
    },
    {
      icon: <Microscope className="size-6 text-white" />,
      title: t("laboratoriesPage.l3Title"),
      desc: t("laboratoriesPage.l3Desc"),
      color: "from-jibb-sakura to-jibb-sakura-light",
    },
  ];

  const incubationBenefits = [
    {
      icon: <Building2 className="size-6 text-white" />,
      title: t("incubationPage.b1Title"),
      desc: t("incubationPage.b1Desc"),
      color: "from-jibb-orange to-jibb-orange-light",
    },
    {
      icon: <Users className="size-6 text-white" />,
      title: t("incubationPage.b2Title"),
      desc: t("incubationPage.b2Desc"),
      color: "from-jibb-indigo to-jibb-indigo-light",
    },
    {
      icon: <DollarSign className="size-6 text-white" />,
      title: t("incubationPage.b3Title"),
      desc: t("incubationPage.b3Desc"),
      color: "from-jibb-sakura to-jibb-sakura-light",
    },
  ];

  const partners = [
    { icon: <GraduationCap className="size-6 text-white" />, name: t("partnerPage.p1Name"), desc: t("partnerPage.p1Desc"), color: "from-jibb-orange to-jibb-orange-light" },
    { icon: <GraduationCap className="size-6 text-white" />, name: t("partnerPage.p2Name"), desc: t("partnerPage.p2Desc"), color: "from-jibb-indigo to-jibb-indigo-light" },
    { icon: <Landmark className="size-6 text-white" />, name: t("partnerPage.p3Name"), desc: t("partnerPage.p3Desc"), color: "from-jibb-sakura to-jibb-sakura-light" },
    { icon: <Globe className="size-6 text-white" />, name: t("partnerPage.p4Name"), desc: t("partnerPage.p4Desc"), color: "from-jibb-orange to-jibb-orange-light" },
  ];

  const challenges = [
    {
      icon: <Zap className="size-6 text-white" />,
      title: t("challengesPage.c1Title"),
      desc: t("challengesPage.c1Desc"),
      color: "from-jibb-orange to-jibb-orange-light",
      prize: "¥5,000,000",
      deadline: "2026-09-30",
      status: "Open",
    },
    {
      icon: <Target className="size-6 text-white" />,
      title: t("challengesPage.c2Title"),
      desc: t("challengesPage.c2Desc"),
      color: "from-jibb-indigo to-jibb-indigo-light",
      prize: "¥3,000,000",
      deadline: "2026-11-15",
      status: "Open",
    },
  ];

  const challengeBenefits = [
    { icon: <Award className="size-5 text-jibb-orange" />, title: "Cash Prizes", desc: "Up to ¥5,000,000 awarded to top teams in each challenge" },
    { icon: <Rocket className="size-5 text-jibb-orange" />, title: "Fast-Track Incubation", desc: "Winners receive priority entry into JIBB's Startup Incubation program" },
    { icon: <Users className="size-5 text-jibb-orange" />, title: "Sponsor PoC Access", desc: "Direct proof-of-concept project opportunities with sponsoring corporations" },
  ];

  // ResearchProject Schema for SEO
  const researchSchema = {
    "@context": "https://schema.org",
    "@type": "ResearchProject",
    "name": "JIBB Innovation Hub",
    "description": "Collaborative Japan-India innovation hub for research, technology transfer, and startup development",
    "url": `https://npo-jibb.org/${locale}/innovation-hub`,
    "funder": {
      "@type": "Organization",
      "name": "Japan India Business Bureau"
    },
    "location": [
      {
        "@type": "Place",
        "name": "Tokyo Innovation Center",
        "address": { "@type": "PostalAddress", "addressCountry": "JP" }
      },
      {
        "@type": "Place",
        "name": "Noida Research Lab",
        "address": { "@type": "PostalAddress", "addressCountry": "IN" }
      }
    ],
    "knowsAbout": [
      "Semiconductor Technology",
      "Electric Vehicle Research",
      "Pharmaceutical Development",
      "Manufacturing Innovation",
      "Startup Incubation",
      "Technology Transfer"
    ]
  };

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* Schema.org JSON-LD for Research Project */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(researchSchema) }}
      />

      {/* ============================================================
          CINEMATIC BANNER
          ============================================================ */}
      <PageHero className="py-20 lg:py-28" bgText="HUB">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              Technology Sandbox
            </span>
          </div>

          <AnimatedHeading
            text={t("hubPage.title")}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
            immediate
          />

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
      </PageHero>

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
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">{t("hubPage.labsTitle")}</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">{t("hubPage.labsSubtitle")}</p>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <ScrollReveal staggerChildren={0.12} scale={0.96} className="grid md:grid-cols-3 gap-4">
            {labs.map((lb) => (
              <div
                key={lb.id}
                className={`group flex flex-col justify-between p-8 rounded-2xl border border-white/10 hover:shadow-xl transition-all duration-300 min-h-[260px] text-left relative overflow-hidden text-white ${lb.spanClass} ${lb.bgClass}`}
              >
                <div aria-hidden="true" className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors" />
                <div className="space-y-4 relative z-10">
                  <div className="p-3 rounded-xl bg-white/10 inline-flex transition-transform duration-300 group-hover:scale-110">{lb.icon}</div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold tracking-tight">{lb.title}</h3>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed pt-1">{lb.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <TechStack />

      {/* ============================================================
          CENTER OF EXCELLENCE
          ============================================================ */}
      <section id="center-of-excellence" className="py-20 bg-background border-t border-border/30">
        <div className="section-container max-w-5xl">
          {/* Section Header */}
          <div className="flex flex-col gap-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 w-fit">
              <Trophy className="size-3.5 text-primary" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-primary">{t("hubMenu.coe")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">{t("coePage.headline")}</h2>
          </div>

          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start mb-16">
            <div className="md:col-span-8 space-y-6 text-left">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("coePage.para1")}</p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("coePage.para2")}</p>
            </div>
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-full max-w-xs rounded-3xl p-6 bg-card border border-border/80 shadow-jibb flex flex-col gap-4 text-left overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-bold text-foreground tracking-tight uppercase">CoE Core Metrics</h3>
                <ul className="space-y-2 text-xs text-muted-foreground font-semibold">
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> 5+ Shared IC Testers</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-indigo font-bold">•</span> 24/7 Remote Sandbox API</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-sakura font-bold">•</span> Bilateral Compliant Specs</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> Direct METI/DPIIT Audited</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-10 text-center">
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">{t("coePage.focusTitle")}</h3>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {coeFocuses.map((f, idx) => (
              <div key={idx} className="group relative rounded-3xl p-8 bg-card border border-border/85 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[260px]">
                <div className="space-y-5">
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${f.color} inline-flex shadow-md transition-transform duration-300 group-hover:scale-105`}>{f.icon}</div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{f.title}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/40 mt-4 flex items-center justify-between text-xs font-semibold text-primary/75">
                  <span>Industrial Standard</span>
                  <Sparkles className="size-4 text-jibb-orange opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          STARTUP INCUBATION SECTION
          ============================================================ */}
      <section id="startup-incubation" className="py-20 md:py-28 bg-jibb-gradient-subtle border-t border-border/30">
        <div className="section-container max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 items-center mb-16">
            <div className="md:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                <Lightbulb className="size-3.5 text-primary" />
                <span className="text-[10px] font-bold tracking-wider uppercase text-primary">Incubator</span>
              </div>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">{t("hubPage.incubationTitle")}</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("hubPage.incubationDesc")}</p>
              <div className="flex gap-4 pt-2">
                <div className="text-left">
                  <AnimatedCounter value={100} suffix="+" className="text-2xl font-bold text-jibb-orange block" />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Startups Incubated</span>
                </div>
                <div className="border-l border-border pl-4 text-left">
                  <AnimatedCounter value={850} prefix="₹" suffix=" Cr+" className="text-2xl font-bold text-jibb-indigo block" />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">VC Dealflow</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center">
              <Parallax speed={-0.08} className="w-full flex justify-center">
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
                      <AnimatedButton variant="outline" size="sm" className="w-full font-semibold gap-1">
                        Join Incubation <ArrowRight className="size-3.5" />
                      </AnimatedButton>
                    </Link>
                  </div>
                </div>
              </Parallax>
            </div>
          </div>

          <div className="space-y-4 mb-10 text-center">
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">{t("incubationPage.programTitle")}</h3>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {incubationBenefits.map((b, idx) => (
              <div key={idx} className="group relative rounded-3xl p-8 bg-card border border-border/85 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[260px]">
                <div className="space-y-5">
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${b.color} inline-flex shadow-md transition-transform duration-300 group-hover:scale-105`}>{b.icon}</div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{b.title}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/40 mt-4 flex items-center justify-between text-xs font-semibold text-primary/75">
                  <span>Incubation Benefit</span>
                  <Sparkles className="size-4 text-jibb-orange opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          LABORATORIES — Physical Sandboxes
          ============================================================ */}
      <section id="laboratories" className="py-20 bg-background border-t border-border/30">
        <div className="section-container max-w-5xl">
          <div className="flex flex-col gap-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 w-fit">
              <FlaskConical className="size-3.5 text-primary" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-primary">{t("hubMenu.labs")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">{t("laboratoriesPage.headline")}</h2>
          </div>

          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start mb-16">
            <div className="md:col-span-8 space-y-6 text-left">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("laboratoriesPage.para1")}</p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("laboratoriesPage.para2")}</p>
            </div>
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-full max-w-xs rounded-3xl p-6 bg-card border border-border/80 shadow-jibb flex flex-col gap-4 text-left overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-bold text-foreground tracking-tight uppercase">Lab Diagnostics</h3>
                <ul className="space-y-2 text-xs text-muted-foreground font-semibold">
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> Wafer Cutters &amp; Bonders</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-indigo font-bold">•</span> Environmental Climate Chambers</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-sakura font-bold">•</span> Class 1000 Cleanroom</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> Spectrometer Analytics</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-10 text-center">
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">{t("laboratoriesPage.labsTitle")}</h3>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {labFacilities.map((lb, idx) => (
              <div key={idx} className="group relative rounded-3xl p-8 bg-card border border-border/85 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[260px]">
                <div className="space-y-5">
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${lb.color} inline-flex shadow-md transition-transform duration-300 group-hover:scale-105`}>{lb.icon}</div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{lb.title}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{lb.desc}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/40 mt-4 flex items-center justify-between text-xs font-semibold text-primary/75">
                  <span>Certified Environment</span>
                  <Sparkles className="size-4 text-jibb-orange opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PARTNER INSTITUTIONS
          ============================================================ */}
      <section id="partner-institutions" className="py-20 bg-jibb-gradient-subtle border-t border-border/30">
        <div className="section-container max-w-5xl">
          <div className="flex flex-col gap-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 w-fit">
              <GraduationCap className="size-3.5 text-primary" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-primary">{t("hubMenu.partners")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">{t("partnerPage.headline")}</h2>
          </div>

          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start mb-16">
            <div className="md:col-span-8 space-y-6 text-left">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("partnerPage.para1")}</p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("partnerPage.para2")}</p>
            </div>
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-full max-w-xs rounded-3xl p-6 bg-card border border-border/80 shadow-jibb flex flex-col gap-4 text-left overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-bold text-foreground tracking-tight uppercase flex items-center gap-1"><Handshake className="size-4 text-primary" /> Alliance Specs</h3>
                <ul className="space-y-2 text-xs text-muted-foreground font-semibold">
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> Tier 1 Academic Hubs</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-indigo font-bold">•</span> Sovereign Credit Agencies</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-sakura font-bold">•</span> Bilateral Ministry Board</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> 30+ Corporate Allies</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-10 text-center">
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">{t("partnerPage.partnersTitle")}</h3>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {partners.map((p, idx) => (
              <div key={idx} className="group relative rounded-3xl p-8 bg-card border border-border/85 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[220px]">
                <div className="space-y-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-tr ${p.color} inline-flex shadow-md transition-transform duration-300 group-hover:scale-105`}>{p.icon}</div>
                  <div className="space-y-1.5">
                    <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{p.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/40 mt-4 flex items-center justify-between text-xs font-semibold text-primary/75">
                  <span>Official Affiliate</span>
                  <Sparkles className="size-4 text-jibb-orange opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          INNOVATION CHALLENGES
          ============================================================ */}
      <section id="innovation-challenges" className="py-20 bg-background border-t border-border/30">
        <div className="section-container max-w-5xl">
          <div className="flex flex-col gap-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 w-fit">
              <Trophy className="size-3.5 text-primary" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-primary">{t("hubMenu.challenges")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">{t("challengesPage.headline")}</h2>
          </div>

          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start mb-16">
            <div className="md:col-span-8 space-y-6 text-left">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("challengesPage.para1")}</p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("challengesPage.para2")}</p>
            </div>
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-full max-w-xs rounded-3xl p-6 bg-card border border-border/80 shadow-jibb flex flex-col gap-4 text-left overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-bold text-foreground tracking-tight uppercase flex items-center gap-1"><Trophy className="size-4 text-primary" /> Challenge Specs</h3>
                <ul className="space-y-2 text-xs text-muted-foreground font-semibold">
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> Tech Problem Hackathons</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-indigo font-bold">•</span> Corporate Sponsored</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-sakura font-bold">•</span> Cash Prizes + PoC Access</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> Lab Credits Included</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Winner Benefits */}
          <div className="py-12 bg-card rounded-3xl border border-border/30 mb-16 px-8 space-y-10">
            <div className="space-y-4 text-center">
              <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Winner Benefits</h3>
              <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {challengeBenefits.map((b, idx) => (
                <div key={idx} className="group rounded-2xl p-6 bg-background border border-border/70 hover:border-primary/20 hover:shadow-lg transition-all duration-300 text-left space-y-3">
                  <div className="p-2.5 rounded-xl bg-primary/5 inline-flex">{b.icon}</div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{b.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-10 text-center">
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">{t("challengesPage.activeTitle")}</h3>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {challenges.map((c, idx) => (
              <div key={idx} className="group relative rounded-3xl p-8 bg-card border border-border/85 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[280px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-tr ${c.color} inline-flex shadow-md transition-transform duration-300 group-hover:scale-105`}>{c.icon}</div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      {c.status}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{c.title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/40 mt-4 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1"><Award className="size-3.5 text-jibb-orange" /> {c.prize}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3.5 text-jibb-indigo" /> {c.deadline}</span>
                  </div>
                  <Sparkles className="size-4 text-jibb-orange opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
          ============================================================ */}
      <section className="py-16 bg-jibb-gradient text-white relative overflow-hidden">
        <div className="section-container relative z-10 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Ready to Join the Innovation Hub?
          </h2>
          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl mx-auto">
            Access state-of-the-art labs, incubation support, and bilateral challenges to fast-track your innovation.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/membership">
              <Button variant="accent" size="lg" className="font-bold gap-1.5 shadow-lg">
                Become a Member <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="font-semibold bg-white/10 border-white/20 hover:bg-white/15 text-white">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
