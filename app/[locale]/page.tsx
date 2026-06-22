import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { StoryHero } from "@/components/story/StoryHero";
import { HowWeHelp } from "@/components/sections/HowWeHelp";
import { WhoWeAre } from "@/components/sections/WhoWeAre";
import { EventNoticeBoard } from "@/components/sections/EventNoticeBoard";
import { FeatOpportunities } from "@/components/sections/FeatOpportunities";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { TiltCard } from "@/components/ui/TiltCard";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { NewsRoom } from "@/components/sections/NewsRoom";
import { getAllPosts } from "@/lib/markdown";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";

export const revalidate = 86400; // revalidate homepage cache every 24 hours
import {
  Compass, Handshake, Lightbulb, Globe, Cpu, Car, Factory, Pill, Sun, Building2,
  FlaskConical, Microscope, BookOpen, Users, Rocket, Sparkles, ArrowRight, GraduationCap, Landmark,
  Zap, Crown, Star, Diamond
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://npo-jibb.org";

  const title = locale === "ja"
    ? "JIBB — 日印ビジネス機構 | 日本・インド間のビジネス協力と産業成長"
    : "JIBB - Japan India Business Bureau | Bilateral Growth & Innovation";

  const description = locale === "ja"
    ? "日本とインドの企業・政府・スタートアップを結ぶ戦略的な橋渡し。市場参入支援、ビジネスマッチング、イノベーション協業で日印間の産業成長を推進します。"
    : "JIBB connects businesses, governments, and startups across Japan and India. We facilitate market entry, enable partnerships, and drive innovation collaboration for bilateral growth.";

  return {
    title,
    description,
    keywords: [
      "Japan India business",
      "bilateral collaboration",
      "market entry Japan",
      "market entry India",
      "business matching",
      "Japan India partnership",
      "cross-border business",
      "innovation collaboration",
      "semiconductor Japan India",
      "EV automotive Japan India",
      "日本インドビジネス",
      "日印協力",
      "市場参入",
      "ビジネスマッチング",
      "日印パートナーシップ",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/${locale}`,
      siteName: "JIBB - Japan India Business Bureau",
      locale: locale === "en" ? "en_US" : "ja_JP",
      alternateLocale: locale === "en" ? "ja_JP" : "en_US",
      images: [
        {
          url: `${baseUrl}/images/og/home-og.jpg`,
          width: 1200,
          height: 630,
          alt: "JIBB — Connecting Japan & India for Bilateral Growth & Innovation",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/og/home-og.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        ja: `${baseUrl}/ja`,
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  // Organization Schema for Homepage SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Japan India Business Bureau",
    "alternateName": ["JIBB", "日印ビジネス機構"],
    "url": "https://npo-jibb.org",
    "logo": "https://www.npo-jibb.org/logo.webp",
    "description": "A cross-border innovation and industrial collaboration ecosystem connecting Japan and India through partnerships, trade, manufacturing, and technology.",
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
        "contactType": "General Inquiries",
        "areaServed": "JP",
        "availableLanguage": ["English", "Japanese"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+91-70000-17005",
        "contactType": "General Inquiries",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"],
        "email": "vc@npo-jibb.org"
      }
    ],
    "sameAs": [
      "https://linkedin.com/company/japan-india-business-bureau"
    ],
    "areaServed": [
      {
        "@type": "Country",
        "name": "Japan"
      },
      {
        "@type": "Country",
        "name": "India"
      }
    ],
    "knowsAbout": [
      "Japan India Trade",
      "Cross-Border Business",
      "Semiconductor Industry",
      "Electric Vehicles",
      "Market Entry Services",
      "Business Matching",
      "Innovation Collaboration"
    ]
  };

  const blogPosts = await getAllPosts("blog", locale);
  const insightsPosts = await getAllPosts("insights", locale);
  const mediaPosts = [...blogPosts, ...insightsPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const caseStudies = await getAllPosts("blog", locale);
  const thoughtLeadership = await getAllPosts("thought-leadership", locale);

  let linkedinPosts: { id: string; shareUrn: string }[] = [];
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: posts, error } = await supabase
        .from("linkedin_posts")
        .select("id, share_urn")
        .order("created_at", { ascending: false })
        .limit(4);

      if (posts && !error) {
        linkedinPosts = posts.map((post, idx) => ({
          id: post.id || `l-${idx}`,
          shareUrn: post.share_urn
        }));
      }
    }
  } catch (err) {
    console.error("Failed to fetch LinkedIn posts from database:", err);
  }

  // BreadcrumbList Schema for Homepage
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://npo-jibb.org/${locale}`
      }
    ]
  };

  return (
    <main className="flex-1">
      {/* Schema.org JSON-LD for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* BreadcrumbList Schema for Navigation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <StoryHero />

      {/* Event Notice Board */}
      <EventNoticeBoard />

      {/* <LogoMarquee /> */}

      <WhoWeAre />

      <HowWeHelp />

      {/* ============================================================
          WHAT WE DO SECTION — Four pillars
          ============================================================ */}
      <section className="py-24 bg-jibb-gradient-subtle border-b border-border/30 relative overflow-hidden">
        {/* Decorative elements */}
        <div aria-hidden="true" className="absolute top-0 right-0 w-96 h-96 bg-jibb-indigo/5 rounded-full blur-3xl pointer-events-none" />
        <div aria-hidden="true" className="absolute bottom-0 left-0 w-96 h-96 bg-jibb-orange/5 rounded-full blur-3xl pointer-events-none" />

        <div className="section-container relative z-10 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 backdrop-blur-md">
              <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary dark:text-primary-foreground">
                {t("whatWeDo.tagline")}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              {t("whatWeDo.sectionTitle")}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("whatWeDo.sectionSubtitle")}
            </p>
          </div>

          <ScrollReveal staggerChildren={0.15} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Compass className="size-7 text-jibb-orange dark:text-jibb-orange-light" />,
                title: t("whatWeDo.marketEntry.title"),
                desc: t("whatWeDo.marketEntry.description"),
                glowClass: "group-hover:bg-jibb-orange/10",
                iconBg: "bg-jibb-orange/10 dark:bg-jibb-orange/20",
              },
              {
                icon: <Handshake className="size-7 text-jibb-indigo dark:text-jibb-indigo-light" />,
                title: t("whatWeDo.partnership.title"),
                desc: t("whatWeDo.partnership.description"),
                glowClass: "group-hover:bg-jibb-indigo/10",
                iconBg: "bg-jibb-indigo/10 dark:bg-jibb-indigo/20",
              },
              {
                icon: <Lightbulb className="size-7 text-jibb-sakura dark:text-jibb-sakura-light" />,
                title: t("whatWeDo.innovation.title"),
                desc: t("whatWeDo.innovation.description"),
                glowClass: "group-hover:bg-jibb-sakura/10",
                iconBg: "bg-jibb-sakura/10 dark:bg-jibb-sakura/20",
              },
              {
                icon: <Globe className="size-7 text-jibb-orange dark:text-jibb-orange-light" />,
                title: t("whatWeDo.diaspora.title"),
                desc: t("whatWeDo.diaspora.description"),
                glowClass: "group-hover:bg-jibb-orange/10",
                iconBg: "bg-jibb-orange/10 dark:bg-jibb-orange/20",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="group relative bg-card dark:bg-card/45 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-jibb-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Hover glow */}
                <div aria-hidden="true" className={`absolute inset-0 rounded-3xl blur-3xl pointer-events-none transition-colors duration-300 opacity-0 group-hover:opacity-100 ${pillar.glowClass}`} />

                <div>
                  <div className={`mb-6 p-4 rounded-2xl ${pillar.iconBg} inline-flex transition-transform duration-300 group-hover:scale-110`}>
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-primary font-medium text-sm group-hover:text-accent transition-colors flex items-center gap-1.5 w-fit">
                    <span>{t("whatWeDo.learnMore")}</span>
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <FeatOpportunities />

      {/* <StatCounter /> */}

      {/* ============================================================
          SECTORS SECTION — Industry cards
          ============================================================ */}
      <section className="py-24 bg-jibb-cream/30 dark:bg-[#0b0f19] relative overflow-hidden">
        {/* Decorative background visual details */}
        <div aria-hidden="true" className="absolute inset-0 wave-pattern opacity-3 dark:opacity-2 pointer-events-none" />

        <div className="section-container relative z-10 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 backdrop-blur-md">
              <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary dark:text-primary-foreground">
                {t("sectors.tagline")}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              {t("sectors.sectionTitle")}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("sectors.sectionSubtitle")}
            </p>

            {/* Bilateral Policy & CAGR Market Context Banner */}
            <div className="mt-8 max-w-4xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-jibb-orange/10 via-jibb-indigo/5 to-jibb-sakura/10 border border-border/40 backdrop-blur-sm text-left shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="space-y-2 flex-grow">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-jibb-orange/15 text-jibb-orange text-[10px] font-extrabold uppercase tracking-wider">
                  {t("sectors.strategicFrameworks")}
                </span>
                <h4 className="text-sm md:text-base font-extrabold text-foreground">
                  {t("sectors.frameworkTitle")}
                </h4>
                <p
                  className="text-xs md:text-sm text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t.raw("sectors.frameworkDesc") }}
                />
              </div>
              <div className="flex md:flex-col gap-4 shrink-0 justify-center w-full md:w-auto text-center border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6">
                <div>
                  <div className="text-2xl font-black text-jibb-orange">
                    <AnimatedCounter value={100} prefix="$" suffix="B+" className="text-2xl font-black text-jibb-orange" />
                  </div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{t("sectors.semiconductorLabel")}</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-jibb-indigo">
                    <AnimatedCounter value={16} suffix="%" className="text-2xl font-black text-jibb-indigo" />
                  </div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{t("sectors.cagrLabel")}</div>
                </div>
              </div>
            </div>
          </div>

          <ScrollReveal staggerChildren={0.08} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Cpu, label: t("sectors.semiconductor"), bgImage: "/images/sectors/semiconductor.png" },
              { icon: Car, label: t("sectors.ev"), bgImage: "/images/sectors/ev.png" },
              { icon: Factory, label: t("sectors.electronics"), bgImage: "/images/sectors/manufacturing.png" },
              { icon: Pill, label: t("sectors.pharma"), bgImage: "/images/sectors/pharma.png" },
              { icon: Sun, label: t("sectors.renewable"), bgImage: "/images/sectors/renewable.png" },
              { icon: Building2, label: t("sectors.infrastructure"), bgImage: "/images/sectors/infrastructure.png" },
              { icon: FlaskConical, label: t("sectors.chemicals"), bgImage: "/images/sectors/chemicals.png" },
              { icon: Microscope, label: t("sectors.emerging"), bgImage: "/images/sectors/emerging.png" },
            ].map((sector) => {
              const Icon = sector.icon;
              return (
                <div
                  key={sector.label}
                  className="group relative bg-card dark:bg-[#161f38]/60 p-6 text-center border border-border/50 hover:border-primary/50 shadow-sm hover:shadow-jibb transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden rounded-2xl"
                >
                  {/* Background Image that fades in on hover */}
                  <div
                    className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-110 bg-cover bg-center"
                    style={{ backgroundImage: `url(${sector.bgImage})` }}
                  />
                  {/* Dark overlay to ensure text readability */}
                  <div className="absolute inset-0 z-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 mb-4 transition-all duration-500 group-hover:scale-110 flex justify-center p-3 rounded-xl bg-primary/5 group-hover:bg-white/20 w-fit mx-auto backdrop-blur-md border border-primary/10 group-hover:border-white/10 transition-colors">
                    <Icon className="size-6 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="relative z-10 font-bold text-foreground group-hover:text-white text-sm tracking-tight transition-colors duration-300">
                    {sector.label}
                  </div>
                </div>
              );
            })}
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          INNOVATION HUB PREVIEW — Bento grid
          ============================================================ */}
      <section className="py-24 bg-jibb-cream/30 dark:bg-[#0b0f19] relative overflow-hidden border-t border-b border-border/10">
        {/* Glow overlays */}
        <div aria-hidden="true" className="absolute -bottom-40 -left-40 w-96 h-96 bg-jibb-orange/3 dark:bg-jibb-orange/2 rounded-full blur-3xl pointer-events-none" />
        <div aria-hidden="true" className="absolute top-20 -right-20 w-80 h-80 bg-jibb-indigo/3 dark:bg-jibb-indigo/20 rounded-full blur-3xl pointer-events-none" />

        <div className="section-container relative z-10 max-w-7xl mx-auto px-4">
          {/* Section Heading replaced from user image */}
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 backdrop-blur-md">
              <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
              <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary dark:text-primary-foreground">
                {t("strategicBridge.tagline")}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              {t("strategicBridge.title")}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("strategicBridge.subtitle")}
            </p>
          </div>

          {/* Bento Grid containing the 4 pillars with detailed descriptions */}
          <ScrollReveal staggerChildren={0.12} scale={0.96} className="grid md:grid-cols-3 gap-6">

            {/* Card 1: Industry (col-span-2) */}
            <div className="md:col-span-2 group relative rounded-3xl p-8 bg-card dark:bg-card/45 border border-border/50 hover:border-blue-500/20 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110 p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 inline-flex">
                <Building2 className="size-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-jibb-orange tracking-tight transition-colors">
                {t("strategicBridge.industry.title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {t("strategicBridge.industry.desc")}
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 text-xs text-foreground/80 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">✓</span> {t("strategicBridge.industry.bullets.0")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">✓</span> {t("strategicBridge.industry.bullets.1")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">✓</span> {t("strategicBridge.industry.bullets.2")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">✓</span> {t("strategicBridge.industry.bullets.3")}
                </li>
              </ul>
            </div>

            {/* Card 2: Experts (col-span-1) */}
            <div className="group relative rounded-3xl p-8 bg-card dark:bg-card/45 border border-border/50 hover:border-orange-500/20 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110 p-4 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 inline-flex">
                <Compass className="size-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-jibb-orange tracking-tight transition-colors">
                {t("strategicBridge.experts.title")}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                {t("strategicBridge.experts.desc")}
              </p>
              <ul className="space-y-3 text-xs text-foreground/80 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> {t("strategicBridge.experts.bullets.0")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> {t("strategicBridge.experts.bullets.1")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> {t("strategicBridge.experts.bullets.2")}
                </li>
              </ul>
            </div>

            {/* Card 3: Academia (col-span-1) */}
            <div className="group relative rounded-3xl p-8 bg-card dark:bg-card/45 border border-border/50 hover:border-indigo-500/20 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110 p-4 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 inline-flex">
                <GraduationCap className="size-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-jibb-orange tracking-tight transition-colors">
                {t("strategicBridge.academia.title")}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                {t("strategicBridge.academia.desc")}
              </p>
              <ul className="space-y-3 text-xs text-foreground/80 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500 font-bold">✓</span> {t("strategicBridge.academia.bullets.0")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500 font-bold">✓</span> {t("strategicBridge.academia.bullets.1")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500 font-bold">✓</span> {t("strategicBridge.academia.bullets.2")}
                </li>
              </ul>
            </div>

            {/* Card 4: Government (col-span-2) */}
            <div className="md:col-span-2 group relative rounded-3xl p-8 bg-card dark:bg-card/45 border border-border/50 hover:border-emerald-500/20 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110 p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 inline-flex">
                <Landmark className="size-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-jibb-orange tracking-tight transition-colors">
                {t("strategicBridge.government.title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {t("strategicBridge.government.desc")}
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 text-xs text-foreground/80 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {t("strategicBridge.government.bullets.0")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {t("strategicBridge.government.bullets.1")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {t("strategicBridge.government.bullets.2")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {t("strategicBridge.government.bullets.3")}
                </li>
              </ul>
            </div>

          </ScrollReveal>

          {/* <div className="text-center mt-12">
            <Link href="/innovation-hub">
              <button className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/95 hover:scale-105 active:scale-[0.98] transition-all shadow-xl text-sm flex items-center justify-center gap-2 mx-auto">
                <span>Explore Innovation Hub</span>
                <ArrowRight className="size-4" />
              </button>
            </Link>
          </div> */}
        </div>
      </section>

      <TestimonialCarousel />

      {/* ============================================================
          MEMBERSHIP PREVIEW
          ============================================================ */}
      <section className="py-24 bg-background relative overflow-hidden border-t border-border/30">
        <div aria-hidden="true" className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="section-container relative z-10 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 backdrop-blur-md">
              <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary dark:text-primary-foreground">
                Join Us
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              {t("membership.sectionTitle")}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("membership.sectionSubtitle")}
            </p>
          </div>
          <ScrollReveal staggerChildren={0.08} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                tier: t("membership.tiers.associate.title"),
                desc: t("membership.tiers.associate.desc"),
                colorClass: "border-blue-500/20 hover:border-blue-500/30",
                badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
                recommended: false,
                icon: Zap,
                features: [
                  t("membership.tiers.associate.features.0"),
                  t("membership.tiers.associate.features.1"),
                  t("membership.tiers.associate.features.2"),
                ],
              },
              {
                tier: t("membership.tiers.silver.title"),
                desc: t("membership.tiers.silver.desc"),
                colorClass: "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-500/[0.03]",
                badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
                recommended: false,
                icon: Star,
                features: [
                  t("membership.tiers.silver.features.0"),
                  t("membership.tiers.silver.features.1"),
                  t("membership.tiers.silver.features.2"),
                ],
              },
              {
                tier: t("membership.tiers.gold.title"),
                desc: t("membership.tiers.gold.desc"),
                colorClass: "border-amber-500/40 bg-amber-500/[0.04]",
                badge: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400",
                recommended: true,
                icon: Crown,
                features: [
                  t("membership.tiers.gold.features.0"),
                  t("membership.tiers.gold.features.1"),
                  t("membership.tiers.gold.features.2"),
                ],
              },
              {
                tier: t("membership.tiers.platinum.title"),
                desc: t("membership.tiers.platinum.desc"),
                colorClass: "border-slate-400/80 dark:border-slate-500/80 bg-slate-500/[0.06] hover:shadow-lg border-2",
                badge: "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200",
                recommended: false,
                icon: Diamond,
                features: [
                  t("membership.tiers.platinum.features.0"),
                  t("membership.tiers.platinum.features.1"),
                  t("membership.tiers.platinum.features.2"),
                ],
              },
            ].map((plan) => {
              const IconComponent = plan.icon;
              return (
                <TiltCard
                  key={plan.tier}
                  tiltMaxAngle={8}
                  scale={1.05}
                  speed={0.6}
                >
                  <div
                    className={`relative rounded-3xl p-6 text-left border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between min-h-[220px] ${plan.recommended
                      ? "bg-card text-foreground border-amber-500 dark:border-amber-400 shadow-lg scale-105 z-10"
                      : "bg-card text-foreground border-border/50 hover:shadow-lg backdrop-blur-sm"
                      } ${plan.colorClass}`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] uppercase font-bold tracking-wider px-3.5 py-1 rounded-full shadow-sm whitespace-nowrap">
                        {t("membership.popularChoice")}
                      </div>
                    )}
                    <div className="space-y-3 flex-grow">
                      {/* Icon */}
                      {/* <div className="mb-3 p-2 rounded-lg bg-foreground/10 w-fit">
                      <IconComponent className="w-6 h-6 text-foreground" />
                    </div> */}

                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${plan.badge}`}>
                        {plan.tier}
                      </span>
                      <p className="text-sm text-muted-foreground mt-2 font-semibold">
                        {plan.desc}
                      </p>

                      <ul className="mt-4 space-y-2 text-xs text-muted-foreground border-t border-border/30 pt-3">
                        {plan.features.map((feat) => (
                          <li key={feat} className="flex items-center gap-1.5 font-medium">
                            <span className={`${plan.recommended ? "text-amber-500" : plan.tier.includes("Platinum") ? "text-slate-500 dark:text-slate-400" : plan.tier.includes("Silver") ? "text-slate-400 dark:text-slate-300" : "text-jibb-indigo"} font-bold`}>✓</span> {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </ScrollReveal>

          <div className="text-center mt-12">
            <Link href="/membership">
              <button className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-[0.98] transition-all shadow-lg text-sm flex items-center justify-center gap-2 mx-auto">
                <span>{t("membership.cta")}</span>
                <ArrowRight className="size-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <NewsRoom
        mediaPosts={mediaPosts}
        caseStudies={caseStudies}
        thoughtLeadership={thoughtLeadership}
        linkedinPosts={linkedinPosts}
      />
    </main>
  );
}
