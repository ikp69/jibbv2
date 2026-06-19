import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Parallax } from "@/components/ui/Parallax";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Timeline } from "@/components/sections/Timeline";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { AboutFAQ } from "@/components/sections/AboutFAQ";
import { PageHero } from "@/components/sections/PageHero";
import { LeadershipCarousel } from "@/components/sections/LeadershipCarousel";
import {
  Building2,
  Globe,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Lightbulb,
  Users,
  Eye,
  Target,
  Award,
  GraduationCap,
  Briefcase,
  Landmark,
  Sparkles,
  Compass,
  Handshake,
  Rocket,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://npo-jibb.org";
  const title = locale === "ja"
    ? "JIBBについて | 日印ビジネス機構"
    : "About Us — Japan India Business Bureau";
  const description = locale === "ja"
    ? "日印ビジネス機構（JIBB）は、日本とインドの企業・政府・スタートアップを結ぶ戦略的な橋渡し役。クロスボーダー協力と産業成長を推進します。"
    : "JIBB is a strategic bridge connecting businesses, governments, and startups across Japan and India. We empower innovation and facilitate cross-border collaborations for mutual growth.";

  return {
    title,
    description,
    keywords: [
      "JIBB about",
      "Japan India Business Bureau",
      "Japan India collaboration",
      "bilateral business organization",
      "cross-border innovation",
      "Tokyo Noida axis",
      "Japan India partnership",
      "日印ビジネス",
      "日印協力",
      "二国間ビジネス機構",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/${locale}/about`,
      siteName: "JIBB — Japan India Business Bureau",
      locale: locale === "en" ? "en_US" : "ja_JP",
      alternateLocale: locale === "en" ? "ja_JP" : "en_US",
      images: [
        {
          url: `${baseUrl}/images/og/about-og.jpg`,
          width: 1200,
          height: 630,
          alt: "About JIBB — Connecting Japan & India for Bilateral Growth",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/og/about-og.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
      languages: {
        en: `${baseUrl}/en/about`,
        ja: `${baseUrl}/ja/about`,
      },
    },
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

  const approachSteps = [
    {
      icon: <Users className="size-8 text-white" />,
      title: t("approachPage.connectTitle"),
      desc: t("approachPage.connectDesc"),
      color: "from-jibb-orange to-jibb-orange-light",
    },
    {
      icon: <Handshake className="size-8 text-white" />,
      title: t("approachPage.facilitateTitle"),
      desc: t("approachPage.facilitateDesc"),
      color: "from-jibb-indigo to-jibb-indigo-light",
    },
    {
      icon: <Target className="size-8 text-white" />,
      title: t("approachPage.enableTitle"),
      desc: t("approachPage.enableDesc"),
      color: "from-jibb-sakura to-jibb-sakura-light",
    },
  ];

  return (
    <main className="flex-1 bg-background text-foreground">
      {/* AboutPage Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About JIBB — Japan India Business Bureau",
            "url": `https://npo-jibb.org/${locale}/about`,
            "organization": {
              "@type": "Organization",
              "name": "Japan India Business Bureau",
              "alternateName": ["JIBB", "日印ビジネス機構"],
              "url": "https://npo-jibb.org",
              "description": "A cross-border innovation and industrial collaboration ecosystem connecting Japan and India",
              "foundingDate": "2018",
              "address": [
                {
                  "@type": "PostalAddress",
                  "streetAddress": "Tameike Suzuki Building 3F, 1-2-13 Akasaka, Minato-ku",
                  "addressLocality": "Tokyo",
                  "addressCountry": "JP"
                },
                {
                  "@type": "PostalAddress",
                  "streetAddress": "6th Floor, 162, Sector 136, Arihant Business Centre",
                  "addressLocality": "Noida",
                  "addressRegion": "Uttar Pradesh",
                  "addressCountry": "IN"
                }
              ],
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+81-90-9325-3456",
                  "contactType": "General",
                  "areaServed": "JP"
                },
                {
                  "@type": "ContactPoint",
                  "telephone": "+91-70000-17005",
                  "contactType": "General",
                  "areaServed": "IN"
                }
              ],
              "sameAs": [
                "https://linkedin.com/company/japan-india-business-bureau"
              ]
            }
          })
        }}
      />

      {/* FAQ Schema for About Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is JIBB?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "JIBB (Japan India Business Bureau) is a strategic bridge connecting businesses, governments, and startups across Japan and India. We facilitate cross-border collaborations, drive investments, and build long-term industrial growth between the two nations."
                }
              },
              {
                "@type": "Question",
                "name": "Where are JIBB's offices located?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "JIBB operates a dual-hub model with headquarters in Tokyo, Japan and Noida, India. This Tokyo-Noida axis enables seamless support for bilateral business operations across both ecosystems."
                }
              },
              {
                "@type": "Question",
                "name": "What services does JIBB provide?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "JIBB provides comprehensive market entry and partnership facilitation services including market landscaping, partnership facilitation, market entry strategy, due diligence, go-to-market strategy, sales and marketing support, regulatory navigation, and back-office support."
                }
              },
              {
                "@type": "Question",
                "name": "How can I become a JIBB member?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "JIBB offers four membership tiers: Associate, Silver, Gold, and Platinum, each designed for different business needs. Visit our membership page to explore the benefits of each tier and apply for the one that best fits your organization."
                }
              },
              {
                "@type": "Question",
                "name": "What industries does JIBB focus on?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "JIBB focuses on high-growth sectors including semiconductors, electric vehicles, renewable energy, pharmaceuticals, infrastructure, chemicals, electronics, and emerging technologies that drive bilateral innovation and industrial collaboration."
                }
              }
            ]
          })
        }}
      />

      {/* BreadcrumbList Schema for About Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `https://npo-jibb.org/${locale}`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "About",
                "item": `https://npo-jibb.org/${locale}/about`
              }
            ]
          })
        }}
      />

      {/* ============================================================
          HERO — "Who We Are"
          ============================================================ */}
      <PageHero className="py-24 lg:py-32" bgText="ABOUT">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              About JIBB
            </span>
          </div>

          <AnimatedHeading
            text="Enabling the Next Global Manufacturing Shift"
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
            immediate
          />

          <p className="text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
            We connect stakeholders, businesses, institutions, and governments to create a meaningful partnership, drive investments, and build long-term industrial growth between India and Japan.
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
          OUR STORY — Intro narrative
          ============================================================ */}
      <section className="py-20 md:py-28 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container">
          <div className="grid md:grid-cols-12 gap-10 lg:gap-16 items-center">
            <ScrollReveal direction="left" className="md:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md">
                <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary">
                  Our Story
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                A Strategic Bilateral Bridge
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Welcome to the Japan India Business Bureau (JIBB). We serve as a
                strategic bridge connecting businesses, governments, and startups
                across Japan and India. Our goal is to empower innovation and
                facilitate cross-border collaborations that drive mutual growth.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Navigating a new market involves unique cultural and regulatory
                landscapes. We understand these nuances. By bridging the gap between
                Japanese and Indian industries, we help you overcome barriers and
                connect seamlessly. Whether you want to expand your corporate
                footprint, find reliable manufacturing partners, or scale a new
                technology, we guide you through every step of the journey via our <Link href="/services" className="text-primary hover:text-jibb-orange-light font-semibold underline transition-colors">comprehensive service offerings</Link>.
              </p>
            </ScrollReveal>

            <div className="md:col-span-5 flex justify-center">
              <Parallax speed={-0.1} className="w-full flex justify-center">
                <div className="relative w-full max-w-sm rounded-2xl p-7 bg-card border border-border shadow-jibb-md flex flex-col gap-5 overflow-hidden">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/5 text-primary shrink-0">
                      <Building2 className="size-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-muted-foreground block uppercase tracking-wider">Operational Presence</span>
                      <span className="text-sm font-bold text-foreground">Dual Hubs — Two Ecosystems</span>
                    </div>
                  </div>
                  <div className="space-y-3.5 border-t border-border/50 pt-4 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-foreground/80">Japan Headquarters</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-jibb-indigo/5 text-jibb-indigo border border-jibb-indigo/15 uppercase tracking-wide">Tokyo</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-foreground/80">India Headquarters</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-jibb-orange/5 text-jibb-orange border border-jibb-orange/15 uppercase tracking-wide">Noida</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 border-t border-border/50 pt-4">
                    <div className="text-center">
                      <AnimatedCounter 
                        value={500} 
                        suffix="+" 
                        className="text-2xl font-black text-jibb-indigo block"
                        duration={2}
                      />
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Members</span>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-black text-jibb-orange block">$<AnimatedCounter 
                        value={100} 
                        suffix="M+" 
                        className="text-2xl font-black text-jibb-orange"
                        duration={2}
                      /></span>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Deals Facilitated</span>
                    </div>
                  </div>
                </div>
              </Parallax>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TIMELINE — Our Journey
          ============================================================ */}
      <Timeline />

      {/* ============================================================
          VISION & MISSION
          ============================================================ */}
      <section id="vision-mission" className="py-20 md:py-28 bg-background border-t border-border/20">
        <div className="section-container">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md mx-auto">
              <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary">Guiding Principles</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              Vision &amp; Mission
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <ScrollReveal direction="left">
              <div className="group relative rounded-3xl p-8 md:p-10 bg-card border border-border/50 hover:border-jibb-indigo/30 hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-jibb-indigo/3 rounded-full blur-3xl pointer-events-none group-hover:bg-jibb-indigo/8 transition-colors duration-500" />
                <div className="relative z-10 space-y-5">
                  <div className="p-3 rounded-2xl bg-jibb-indigo/5 inline-flex">
                    <Eye className="size-7 text-jibb-indigo" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Our Vision</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    To create a collaborative future where Japan and India stand together as global leaders in technology, industry, and sustainable growth.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="group relative rounded-3xl p-8 md:p-10 bg-card border border-border/50 hover:border-jibb-orange/30 hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-jibb-orange/3 rounded-full blur-3xl pointer-events-none group-hover:bg-jibb-orange/8 transition-colors duration-500" />
                <div className="relative z-10 space-y-5">
                  <div className="p-3 rounded-2xl bg-jibb-orange/5 inline-flex">
                    <Target className="size-7 text-jibb-orange" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Our Mission</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    To drive meaningful partnerships and industrial progress by providing expert <Link href="/services" className="text-jibb-orange hover:text-jibb-orange-light font-semibold underline">market entry support</Link>, fostering cross-border collaboration across <Link href="/sectors" className="text-jibb-orange hover:text-jibb-orange-light font-semibold underline">8 focus sectors</Link>, and delivering world-class innovation incubation for businesses and governments.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Core beliefs grid */}
          <div className="mt-16">
            <h3 className="text-xl md:text-2xl font-bold text-foreground text-center mb-10 tracking-tight">What We Believe</h3>
            <ScrollReveal staggerChildren={0.12} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <ShieldCheck className="size-6 text-jibb-indigo" />, title: "Trust & Shared Value", desc: "Long-term partnerships built on mutual trust, transparency, and shared goals between two dynamic economies." },
                { icon: <Globe className="size-6 text-jibb-indigo" />, title: "Bridging Cultures", desc: "True collaboration goes beyond transactions — we foster deeper cultural understanding and alignment." },
                { icon: <Lightbulb className="size-6 text-jibb-indigo" />, title: "Budding Innovation", desc: "Innovation as a driver of growth, supporting ideas from inception and enabling them to scale globally." },
                { icon: <HeartHandshake className="size-6 text-jibb-indigo" />, title: "Creating Real Impact", desc: "Collaboration leading to sustainable development, stronger industries, and a shared economic future." },
              ].map((pillar, i) => (
                <div key={i} className="group flex flex-col gap-4 p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 text-left">
                  <div className="p-2.5 rounded-xl bg-primary/5 text-primary shrink-0 w-fit">{pillar.icon}</div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-foreground tracking-tight">{pillar.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          COOPERATION PILLARS
          ============================================================ */}
      <section className="py-16 md:py-24 bg-jibb-gradient-subtle border-t border-border/20">
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
              { icon: <Award className="size-6 text-jibb-orange" />, title: t("visionPage.pillar1Title"), desc: t("visionPage.pillar1Desc"), borderClass: "hover:border-jibb-indigo/30" },
              { icon: <Landmark className="size-6 text-jibb-orange" />, title: t("visionPage.pillar2Title"), desc: t("visionPage.pillar2Desc"), borderClass: "hover:border-jibb-orange/30" },
              { icon: <Sparkles className="size-6 text-jibb-orange" />, title: t("visionPage.pillar3Title"), desc: t("visionPage.pillar3Desc"), borderClass: "hover:border-jibb-sakura/30" },
            ].map((pillar, i) => (
              <div key={i} className={`group flex flex-col items-center p-8 bg-card rounded-2xl border border-border/50 ${pillar.borderClass} hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-center gap-5`}>
                <div className="p-3 rounded-2xl bg-accent/5 text-accent shrink-0 group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <div className="space-y-2.5">
                  <h3 className="text-base font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{pillar.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          OUR APPROACH — Intro Copy
          ============================================================ */}
      <section id="our-approach" className="py-16 md:py-24 bg-background border-t border-border/20">
        <div className="section-container max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
            <div className="md:col-span-8 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md">
                <Compass className="size-3.5 text-primary animate-soft-pulse" />
                <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary">
                  {t("approachPage.title")}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                {t("approachPage.introHeadline")}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("approachPage.introPara1")}
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("approachPage.introPara2")}
              </p>
            </div>

            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-full max-w-xs rounded-3xl p-6 bg-card border border-border/80 shadow-jibb flex flex-col gap-4 text-left overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-bold text-foreground tracking-tight uppercase flex items-center gap-1.5">
                  <Sparkles className="size-4 text-jibb-orange" /> JIBB Core Principles
                </h3>
                <ul className="space-y-3 text-xs text-muted-foreground font-semibold">
                  <li className="flex items-center gap-2"><span className="text-jibb-orange font-bold text-base">✓</span> Bicultural Trust First</li>
                  <li className="flex items-center gap-2"><span className="text-jibb-indigo font-bold text-base">✓</span> Actionable Localization</li>
                  <li className="flex items-center gap-2"><span className="text-jibb-orange font-bold text-base">✓</span> R&D Sandbox Access</li>
                  <li className="flex items-center gap-2"><span className="text-jibb-indigo font-bold text-base">✓</span> Regulatory Navigation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Step Roadmap */}
      <section className="py-20 md:py-28 bg-jibb-gradient-subtle border-t border-border/20">
        <div className="section-container max-w-5xl text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">{t("approachPage.roadmapTitle")}</h2>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border/40 -translate-y-1/2 hidden md:block z-0 pointer-events-none" />
            {approachSteps.map((st, idx) => (
              <div key={idx} className="group relative rounded-3xl p-8 bg-card border border-border/80 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[280px] z-10">
                <div className="space-y-5">
                  <div className={`p-4 rounded-2xl bg-gradient-to-tr ${st.color} inline-flex shadow-md transition-transform duration-300 group-hover:scale-105`}>{st.icon}</div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{st.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          LEADERSHIP TEAM — Carousel
          ============================================================ */}
      <section className="py-20 md:py-28 bg-background border-t border-border/20">
        <div className="section-container">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md mx-auto">
              <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary">Featured Leadership</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">Featured Core Team</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Meet our bilateral directors driving operations across the Tokyo-Noida axis.
            </p>
          </div>
          <LeadershipCarousel />
        </div>
      </section>

      {/* ============================================================
          PARTNERS & SPONSORS — Logo Marquee
          ============================================================ */}
      <LogoMarquee />

      {/* ============================================================
          FAQ — Governance questions
          ============================================================ */}
      <AboutFAQ />

      {/* ============================================================
          CTA — Join the Bureau
          ============================================================ */}
      <section className="py-20 bg-jibb-gradient text-white relative overflow-hidden">
        <Parallax speed={0.15} className="absolute -bottom-40 -left-40 w-96 h-96 pointer-events-none">
          <div aria-hidden="true" className="w-full h-full bg-jibb-orange/10 rounded-full blur-3xl" />
        </Parallax>
        <Parallax speed={-0.1} className="absolute -top-32 right-0 w-80 h-80 pointer-events-none">
          <div aria-hidden="true" className="w-full h-full bg-jibb-sakura/8 rounded-full blur-3xl" />
        </Parallax>

        <div className="section-container relative z-10 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">Join the Bureau</h2>
          <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xl mx-auto">
            Expand your reach and innovate without borders. Partner with JIBB to access exclusive industry insights, dedicated support, and a powerful cross-cultural network.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <Link href="/membership">
              <AnimatedButton variant="accent" size="lg" className="w-full sm:w-auto font-bold shadow-lg flex items-center justify-center gap-2">
                <span>Become a Member</span>
                <ArrowRight className="size-4" />
              </AnimatedButton>
            </Link>
            <Link href="/contact">
              <AnimatedButton variant="glass" size="lg" className="w-full sm:w-auto font-semibold">
                <span>Contact Us</span>
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
