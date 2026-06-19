import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { PageHero } from "@/components/sections/PageHero";
import {
  BarChart2, Target, Network, ShieldCheck, Rocket, Building2,
  Megaphone, Briefcase, ArrowRight, Sparkles, CheckCircle,
  ChevronRight,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://npo-jibb.org";
  const title = locale === "ja"
    ? "ビジネスサービス | JIBB — 日印ビジネス機構"
    : "Business Services | JIBB — Japan India Business Bureau";
  const description = locale === "ja"
    ? "市場調査、パートナー発掘、市場参入、デューデリジェンス、販売・マーケティング支援など、日印間の8つの統合ビジネスサービス。"
    : "Eight integrated service lines connecting Japan and India: Market landscaping, partner identification, market entry, due diligence, sales & marketing, and full operational support.";

  return {
    title,
    description,
    keywords: [
      "Japan India business services",
      "market entry Japan",
      "market entry India",
      "business matching Japan India",
      "due diligence services",
      "partnership facilitation",
      "Japan market research",
      "India market research",
      "cross-border business support",
      "bilateral trade services",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/${locale}/services`,
      siteName: "JIBB — Japan India Business Bureau",
      locale: locale === "en" ? "en_US" : "ja_JP",
      alternateLocale: locale === "en" ? "ja_JP" : "en_US",
      images: [
        {
          url: `${baseUrl}/images/og/services-og.jpg`,
          width: 1200,
          height: 630,
          alt: "JIBB Services — End-to-End Bilateral Business Support",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/og/services-og.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/services`,
      languages: {
        en: `${baseUrl}/en/services`,
        ja: `${baseUrl}/ja/services`,
      },
    },
  };
}

// ============================================================
// COLOUR MAP — keyed by design token name
// ============================================================
const COLOR = {
  "jibb-orange": {
    badge: "bg-jibb-orange/10 text-jibb-orange border-jibb-orange/20",
    icon:  "bg-jibb-orange/10 text-jibb-orange",
    num:   "text-jibb-orange",
    bar:   "bg-jibb-orange",
    dot:   "text-jibb-orange",
    ring:  "ring-jibb-orange/30",
  },
  "jibb-indigo": {
    badge: "bg-jibb-indigo/10 text-jibb-indigo dark:text-jibb-indigo-light border-jibb-indigo/20",
    icon:  "bg-jibb-indigo/10 text-jibb-indigo dark:text-jibb-indigo-light",
    num:   "text-jibb-indigo dark:text-jibb-indigo-light",
    bar:   "bg-jibb-indigo",
    dot:   "text-jibb-indigo dark:text-jibb-indigo-light",
    ring:  "ring-jibb-indigo/30",
  },
  "jibb-sakura": {
    badge: "bg-jibb-sakura/10 text-jibb-sakura border-jibb-sakura/20",
    icon:  "bg-jibb-sakura/10 text-jibb-sakura",
    num:   "text-jibb-sakura",
    bar:   "bg-jibb-sakura",
    dot:   "text-jibb-sakura",
    ring:  "ring-jibb-sakura/30",
  },
} as const;

type ServiceColor = keyof typeof COLOR;

// ============================================================
// SERVICE DATA — 8 offerings
// ============================================================
const SERVICES: {
  id: string;
  num: string;
  icon: React.ComponentType<{ className?: string }>;
  color: ServiceColor;
  title: string;
  tagline: string;
  intro: string;
  sections: { heading: string; items: string[] }[];
}[] = [
  {
    id: "market-landscaping",
    num: "01",
    icon: BarChart2,
    color: "jibb-orange",
    title: "Market Landscaping",
    tagline: "Build a 360° view of the market before committing capital.",
    intro:
      "We conduct deep industry landscaping that gives you a comprehensive understanding of the environment you are entering, so every strategic decision is grounded in real data.",
    sections: [
      {
        heading: "What We Cover",
        items: [
          "Value chain mapping",
          "Competitive intensity",
          "Emerging technologies",
          "Regulatory environment",
          "Demand drivers",
        ],
      },
      {
        heading: "What This Enables",
        items: [
          "Identification of structural gaps",
          "Uncovering unmet needs",
          "Strategic whitespace where differentiated entry is possible",
        ],
      },
    ],
  },
  {
    id: "opportunity-landscape",
    num: "02",
    icon: Target,
    color: "jibb-indigo",
    title: "Opportunity Landscape",
    tagline: "Translate market potential into quantified, actionable opportunities.",
    intro:
      "Raw market data only becomes valuable when it is transformed into prioritized revenue pathways. We build rigorous frameworks that tell you exactly where to focus and why.",
    sections: [
      {
        heading: "Our Deliverables",
        items: [
          "TAM–SAM–SOM models",
          "Segment attractiveness frameworks",
          "Growth projections — bottom-up and top-down analyses",
        ],
      },
      {
        heading: "The Outcome",
        items: [
          "Clear prioritization of high-value segments",
          "Realistic and defensible revenue pathways",
        ],
      },
    ],
  },
  {
    id: "partner-identification",
    num: "03",
    icon: Network,
    color: "jibb-sakura",
    title: "Partner Identification & Ecosystem Building",
    tagline: "Identify and align with the right strategic counterparts.",
    intro:
      "The right partner can compress years of growth into months. We map the full ecosystem and rigorously evaluate every candidate before making an introduction.",
    sections: [
      {
        heading: "Who We Map",
        items: [
          "Distributors",
          "Suppliers",
          "Technology partners",
          "Potential JV candidates",
        ],
      },
      {
        heading: "Evaluation Criteria",
        items: [
          "Capability",
          "Credibility",
          "Cultural alignment",
          "Long-term strategic fit",
        ],
      },
    ],
  },
  {
    id: "due-diligence",
    num: "04",
    icon: ShieldCheck,
    color: "jibb-orange",
    title: "Due Diligence & Deal Structuring",
    tagline: "De-risk investments and structure deals for long-term value creation.",
    intro:
      "Capital deployment without proper diligence is capital at risk. We conduct multi-dimensional due diligence and support you through every stage of commercial negotiation.",
    sections: [
      {
        heading: "Due Diligence Coverage",
        items: [
          "Financials",
          "Operations",
          "Governance",
          "Market positioning",
        ],
      },
      {
        heading: "Deal Support",
        items: [
          "Commercial negotiations",
          "Optimal deal structure design",
          "Alignment with regulatory frameworks and strategic objectives",
        ],
      },
    ],
  },
  {
    id: "go-to-market",
    num: "05",
    icon: Rocket,
    color: "jibb-indigo",
    title: "Go-to-Market Strategy & Entry Blueprint",
    tagline: "Design a market entry strategy that converts intent into execution.",
    intro:
      "Strategy without execution clarity is just planning. Our entry blueprints are built to be immediately actionable, tailored specifically to the India–Japan business dynamic.",
    sections: [
      {
        heading: "What We Define",
        items: [
          "Entry models",
          "Customer segmentation",
          "Value proposition",
          "Pricing architecture",
          "Channel strategy",
        ],
      },
      {
        heading: "The Result",
        items: [
          "A clear, execution-ready blueprint",
          "Tailored to India–Japan business dynamics",
        ],
      },
    ],
  },
  {
    id: "market-entry-execution",
    num: "06",
    icon: Building2,
    color: "jibb-sakura",
    title: "Local Presence & Market Entry Execution",
    tagline: "Establish a strong in-market presence with minimal friction.",
    intro:
      "Being physically present in a market signals commitment and enables faster decisions. We activate your local presence rapidly so you can start building relationships from day one.",
    sections: [
      {
        heading: "How We Enable It",
        items: [
          "Virtual office setup",
          "Physical office setup",
          "Deployment of local representatives",
          "Ongoing operational coordination",
        ],
      },
      {
        heading: "What This Ensures",
        items: [
          "Faster decision-making",
          "Stronger local relationships",
          "Smoother execution",
        ],
      },
    ],
  },
  {
    id: "sales-marketing",
    num: "07",
    icon: Megaphone,
    color: "jibb-orange",
    title: "Sales, Marketing & Ecosystem Enablement",
    tagline: "Accelerate market traction and build commercial momentum.",
    intro:
      "Presence alone does not create demand. We activate your commercial engine through distributor networks, marketing programs, and curated industry touchpoints.",
    sections: [
      {
        heading: "Core Support",
        items: [
          "Distributor onboarding",
          "Sales channel activation",
          "Integrated marketing efforts",
        ],
      },
      {
        heading: "Demand Generation",
        items: [
          "Exhibition participation",
          "Curated business events",
          "Targeted outreach programs",
        ],
      },
    ],
  },
  {
    id: "back-office",
    num: "08",
    icon: Briefcase,
    color: "jibb-indigo",
    title: "Back Office & Corporate Support",
    tagline: "Ensure operational excellence and full regulatory compliance.",
    intro:
      "The back office is the backbone of a sustainable cross-border operation. We handle every administrative and compliance requirement so your leadership stays focused on growth.",
    sections: [
      {
        heading: "End-to-End Support",
        items: [
          "Entity setup",
          "Accounting",
          "Taxation",
          "Corporate secretarial services",
          "HR & payroll",
          "Compliance management",
        ],
      },
      {
        heading: "Additional Services",
        items: [
          "M&A process support",
          "Director-level assistance across India and Japan",
        ],
      },
    ],
  },
];

// ============================================================
// SERVICE DATA — 8 offerings
// ============================================================
export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  // BreadcrumbList Schema for Services Page
  const breadcrumbSchema = {
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
        "name": locale === "ja" ? "ビジネスサービス" : "Services",
        "item": `https://npo-jibb.org/${locale}/services`
      }
    ]
  };

  return (
    <main className="flex-1 bg-background text-foreground">
      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Service Schema for SEO */}
      {SERVICES.map((service) => {
        const serviceSchema = {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": service.title,
          "description": service.intro,
          "serviceType": "Business Consulting",
          "provider": {
            "@type": "Organization",
            "name": "Japan India Business Bureau",
            "url": "https://npo-jibb.org"
          },
          "areaServed": [
            { "@type": "Country", "name": "Japan" },
            { "@type": "Country", "name": "India" }
          ],
          "url": `https://npo-jibb.org/${locale}/services#${service.id}`,
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "INR",
            "price": "Contact for Quote"
          }
        };

        return (
          <script
            key={`service-schema-${service.id}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
          />
        );
      })}

      {/* ── HERO ─────────────────────────────────────────── */}
      <PageHero className="py-20 lg:py-28" bgText="SERVICES">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              What We Do
            </span>
          </div>

          <AnimatedHeading
            text="End-to-End Bilateral Services"
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
            immediate
          />

          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            From initial market landscaping to full operational setup — eight integrated service lines that take Japan–India partnerships from ambition to execution. Our services align with <Link href="/sectors" className="text-jibb-orange hover:text-jibb-orange-light font-semibold underline">our 8 focus sectors</Link> and <Link href="/membership" className="text-jibb-orange hover:text-jibb-orange-light font-semibold underline">membership tiers</Link>.
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

      {/* ── QUICK-NAV INDEX + SERVICES LIST ──────────────────────────────── */}
      <section className="py-14 md:py-20 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
            
            {/* Left: 2-column card grid (4 rows) */}
            <ScrollReveal
              staggerChildren={0.07}
              className="lg:col-span-7 grid sm:grid-cols-2 gap-4"
            >
              {SERVICES.map((svc) => {
                const c = COLOR[svc.color];
                const Icon = svc.icon;
                return (
                  <a
                    key={svc.id}
                    href={`#${svc.id}`}
                    className={`group flex flex-col gap-4 p-5 rounded-2xl bg-card border border-border/60
                      hover:border-border hover:shadow-jibb-md hover:-translate-y-1
                      transition-all duration-300`}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`text-xs font-black tracking-wider ${c.num}`}>
                        {svc.num}
                      </span>
                      <div className={`shrink-0 p-2.5 rounded-xl ${c.icon} transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className="size-5" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-snug">
                        {svc.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">
                        {svc.tagline}
                      </p>
                    </div>
                  </a>
                );
              })}
            </ScrollReveal>

            {/* Right: 8 Core Services List */}
            <ScrollReveal direction="right" className="lg:col-span-5 hidden lg:block">
              <div className="rounded-3xl bg-card border border-border/80 p-8 md:p-10 shadow-jibb-md h-full">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-extrabold text-foreground tracking-tight">
                      JIBB's 8 Core Business Services
                    </h3>
                    <div className="h-1 w-10 bg-jibb-orange/60 rounded-full" />
                  </div>
                  
                  <ol className="space-y-4">
                    <li className="flex gap-4">
                      <span className="text-jibb-orange font-black text-sm shrink-0 pt-0.5">01</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Market Landscaping</p>
                        <p className="text-xs text-muted-foreground mt-1">Deep market research and comprehensive environment analysis</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-jibb-indigo font-black text-sm shrink-0 pt-0.5">02</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Opportunity Landscape</p>
                        <p className="text-xs text-muted-foreground mt-1">Quantified opportunities and prioritized revenue pathways</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-jibb-sakura font-black text-sm shrink-0 pt-0.5">03</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Partner Identification</p>
                        <p className="text-xs text-muted-foreground mt-1">Strategic partner mapping and ecosystem building</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-jibb-orange font-black text-sm shrink-0 pt-0.5">04</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Due Diligence</p>
                        <p className="text-xs text-muted-foreground mt-1">Comprehensive risk assessment and investment evaluation</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-jibb-indigo font-black text-sm shrink-0 pt-0.5">05</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Go-to-Market Strategy</p>
                        <p className="text-xs text-muted-foreground mt-1">Launch and scaling roadmap for new markets</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-jibb-sakura font-black text-sm shrink-0 pt-0.5">06</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Sales & Marketing Support</p>
                        <p className="text-xs text-muted-foreground mt-1">Growth enablement and market penetration strategies</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-jibb-orange font-black text-sm shrink-0 pt-0.5">07</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Back Office Support</p>
                        <p className="text-xs text-muted-foreground mt-1">Operational excellence and administrative support</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-jibb-indigo font-black text-sm shrink-0 pt-0.5">08</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">Regulatory Navigation</p>
                        <p className="text-xs text-muted-foreground mt-1">Compliance guidance and legal framework support</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── SERVICE DETAIL SECTIONS ──────────────────────── */}
      {SERVICES.map((svc, idx) => {
        const c = COLOR[svc.color];
        const Icon = svc.icon;
        const isEven = idx % 2 === 0;

        return (
          <section
            key={svc.id}
            id={svc.id}
            className={`py-16 md:py-24 border-b border-border/20 scroll-mt-20 ${
              isEven ? "bg-background" : "bg-jibb-gradient-subtle"
            }`}
          >
            <div className="section-container max-w-6xl">
              <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">

                {/* ── Left: Number + Icon + Meta ── */}
                <ScrollReveal direction="left" className="lg:col-span-1 flex lg:flex-col items-center lg:items-start gap-4 lg:gap-6 pt-1">
                  <span className={`text-5xl lg:text-6xl font-black tracking-tighter leading-none ${c.num} opacity-20 select-none`}>
                    {svc.num}
                  </span>
                  <div className={`shrink-0 p-3 rounded-2xl ${c.icon}`}>
                    <Icon className="size-6" />
                  </div>
                </ScrollReveal>

                {/* ── Centre: Title + Intro + Sections ── */}
                <ScrollReveal direction="up" className="lg:col-span-7 space-y-7">
                  {/* Title block */}
                  <div className="space-y-2">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md border ${c.badge}`}>
                      Service {svc.num}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-snug">
                      {svc.title}
                    </h2>
                    <p className={`text-sm font-semibold ${c.dot}`}>
                      {svc.tagline}
                    </p>
                  </div>

                  {/* Intro paragraph */}
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {svc.intro}
                  </p>

                  {/* Sub-sections with bullet lists */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {svc.sections.map((sec) => (
                      <div key={sec.heading} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className={`h-[2px] w-5 rounded-full ${c.bar}`} />
                          <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground/70">
                            {sec.heading}
                          </h3>
                        </div>
                        <ul className="space-y-2">
                          {sec.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-sm text-muted-foreground leading-snug"
                            >
                              <CheckCircle className={`size-3.5 mt-0.5 shrink-0 ${c.dot}`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>

                {/* ── Right: CTA card ── */}
                <ScrollReveal direction="right" className="lg:col-span-4">
                  <div className={`rounded-2xl border bg-card shadow-jibb p-6 space-y-5 ring-1 ${c.ring}`}>
                    {/* Mini icon header */}
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${c.icon}`}>
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className={`text-[10px] font-black tracking-widest uppercase ${c.num}`}>
                          Service {svc.num}
                        </p>
                        <p className="text-xs font-bold text-foreground leading-tight">
                          {svc.title}
                        </p>
                      </div>
                    </div>

                    {/* All bullets condensed */}
                    <div className="space-y-1.5">
                      {svc.sections.flatMap((s) => s.items).map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <div className={`mt-1.5 size-1.5 rounded-full shrink-0 ${c.bar}`} />
                          <span className="text-[11px] text-muted-foreground leading-snug">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="pt-2 border-t border-border/60">
                      <Link href="/contact">
                        <AnimatedButton
                          variant="outline"
                          size="sm"
                          className="w-full font-semibold gap-1.5 text-xs"
                        >
                          Enquire About This Service
                          <ArrowRight className="size-3.5" />
                        </AnimatedButton>
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>

              </div>
            </div>
          </section>
        );
      })}

      {/* ── CLOSING CTA BANNER ───────────────────────────── */}
      <section className="py-20 md:py-28 bg-jibb-gradient">
        <div className="section-container max-w-4xl text-center space-y-8">
          <ScrollReveal className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold tracking-widest uppercase text-white/90">
              <Sparkles className="size-3 text-jibb-orange" />
              Ready to Begin?
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Eight services. One unified corridor.
            </h2>
            <p className="text-white/75 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Whether you are entering India from Japan or Japan from India, our integrated service lines remove every barrier between ambition and execution. Explore how our services connect with <Link href="/sectors" className="text-jibb-orange hover:text-jibb-orange-light font-semibold">industry sectors</Link> and <Link href="/about" className="text-jibb-orange hover:text-jibb-orange-light font-semibold">our company mission</Link>.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/contact">
              <AnimatedButton className="h-12 px-8 bg-jibb-orange hover:bg-jibb-orange/90 text-white font-bold rounded-xl border-none shadow-lg gap-2">
                Start a Conversation
                <ArrowRight className="size-4" />
              </AnimatedButton>
            </Link>
            <Link href="/membership">
              <AnimatedButton
                variant="outline"
                className="h-12 px-8 bg-transparent border-white/40 hover:bg-white/10 hover:border-white/60 text-white hover:text-white font-semibold rounded-xl gap-2"
              >
                View Membership Plans
              </AnimatedButton>
            </Link>
          </ScrollReveal>
        </div>
      </section>

    </main>
  );
}
