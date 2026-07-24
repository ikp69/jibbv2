import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { Cpu, Car, Sun, Pill, Landmark, FlaskConical, Factory, Rocket, ArrowRight, Sparkles } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/button";
import { WorkProcess } from "@/components/sections/WorkProcess";
import { HighvalueEcosystem } from "@/components/sections/HighvalueEcosystem";
// import { HorizontalScroll } from "@/components/sections/HorizontalScroll";
import { env } from "@/lib/env";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const title = locale === "ja"
    ? "対象産業セクター | JIBB — 日印ビジネス機構"
    : "Industry Sectors | JIBB - Japan India Business Bureau";
  const description = locale === "ja"
    ? "半導体、EV、再生可能エネルギー、医薬品、インフラ、化学、電子機器、新興技術など、日印間の8つの重点産業セクター。"
    : "Eight focus industry sectors for Japan-India collaboration: Semiconductors, Electric Vehicles, Renewable Energy, Pharmaceuticals, Infrastructure, Chemicals, Electronics, and Emerging Technologies.";

  return {
    title,
    description,
    keywords: [
      "Japan India sectors",
      "semiconductor Japan India",
      "EV manufacturing India",
      "renewable energy collaboration",
      "pharma India Japan",
      "infrastructure development",
      "electronics manufacturing",
      "emerging technologies",
      "bilateral trade sectors",
      "Japan India industries",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/${locale}/sectors`,
      siteName: "JIBB - Japan India Business Bureau",
      locale: locale === "en" ? "en_US" : "ja_JP",
      alternateLocale: locale === "en" ? "ja_JP" : "en_US",
      images: [
        {
          url: `${baseUrl}/images/og/sectors-og.jpg`,
          width: 1200,
          height: 630,
          alt: "JIBB Industry Sectors — Japan India Focus Areas",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/og/sectors-og.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/sectors`,
      languages: {
        en: `${baseUrl}/en/sectors`,
        ja: `${baseUrl}/ja/sectors`,
      },
    },
  };
}

export default async function SectorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const sectors = [
    {
      key: "semiconductor",
      icon: <Cpu className="size-7 text-white" />,
      color: "from-jibb-orange to-jibb-orange-light",
    },
    {
      key: "ev",
      icon: <Car className="size-7 text-white" />,
      color: "from-jibb-indigo to-jibb-indigo-light",
    },
    {
      key: "renewable",
      icon: <Sun className="size-7 text-white" />,
      color: "from-jibb-orange to-jibb-orange-light",
    },
    {
      key: "pharma",
      icon: <Pill className="size-7 text-white" />,
      color: "from-jibb-sakura to-jibb-sakura-light",
    },
    {
      key: "infrastructure",
      icon: <Landmark className="size-7 text-white" />,
      color: "from-jibb-indigo to-jibb-indigo-light",
    },
    {
      key: "chemicals",
      icon: <FlaskConical className="size-7 text-white" />,
      color: "from-jibb-sakura to-jibb-sakura-light",
    },
    {
      key: "electronics",
      icon: <Factory className="size-7 text-white" />,
      color: "from-jibb-orange to-jibb-orange-light",
    },
    {
      key: "emerging",
      icon: <Rocket className="size-7 text-white" />,
      color: "from-jibb-indigo to-jibb-indigo-light",
    },
  ];

  // ItemList Schema for SEO
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "JIBB Focus Industry Sectors",
    "description": "Eight strategic industry sectors for Japan-India business collaboration",
    "itemListElement": sectors.map((sector, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": t(`sectorsPage.details.${sector.key}.title`),
      "description": t(`sectorsPage.details.${sector.key}.desc`),
      "url": `https://npo-jibb.org/${locale}/sectors#${sector.key}`
    }))
  };

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* Schema.org JSON-LD for ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Cinematic Banner */}
      <PageHero className="py-20 lg:py-28" bgText="SECTORS">
        <div className="section-container relative z-10 text-left max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Cpu className="size-3.5 text-jibb-orange" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              {t("sectorsPage.title")}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {t("sectorsPage.title")}
          </h1>

          <p className="text-sm md:text-base text-white/80 max-w-2xl leading-relaxed">
            {t.rich("sectorsPage.subtitleRich", {
              servicesLink: (chunks) => (
                <Link href="/services" className="text-jibb-orange hover:text-jibb-orange-light font-semibold underline">
                  {chunks}
                </Link>
              ),
              membershipLink: (chunks) => (
                <Link href="/membership" className="text-jibb-orange hover:text-jibb-orange-light font-semibold underline">
                  {chunks}
                </Link>
              )
            })}
          </p>
        </div>
      </PageHero>

      {/* Bento-style Grid of Sectors */}
      <section className="py-20 md:py-28 bg-jibb-gradient-subtle">
        <div className="section-container max-w-6xl">
          {/* Featured Snippet Optimization — Sectors List */}
          <div className="mb-16 p-8 bg-card rounded-2xl border border-border/40">
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 tracking-tight">{t("sectorsPage.listTitle")}</h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {sectors.map((sec) => (
                <li key={sec.key} className="text-sm text-muted-foreground">
                  <strong>{t(`sectorsPage.details.${sec.key}.title`)}</strong> — {t(`sectorsPage.details.${sec.key}.desc`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sectors.map((sec) => (
              <div
                key={sec.key}
                id={sec.key}
                className="group relative rounded-3xl bg-card border border-border/80 hover:border-primary/20 hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between min-h-[280px] scroll-mt-20"
              >
                <div className="space-y-4">
                  {/* Icon Panel */}
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${sec.color} inline-flex shadow-md transition-transform duration-300 group-hover:scale-105`}>
                    {sec.icon}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {t(`sectorsPage.details.${sec.key}.title`)}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t(`sectorsPage.details.${sec.key}.desc`)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    {t(`sectorsPage.details.${sec.key}.stat`)}
                  </span>
                  <Sparkles className="size-3.5 text-jibb-orange opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WorkProcess />
      <HighvalueEcosystem />
      {/* <HorizontalScroll /> */}

      {/* Call to Action */}
      <section className="py-16 bg-jibb-gradient text-white relative overflow-hidden">
        <div className="section-container relative z-10 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {t("sectorsPage.ctaTitle")}
          </h2>
          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl mx-auto">
            {t.rich("sectorsPage.ctaDescRich", {
              servicesLink: (chunks) => (
                <Link href="/services" className="text-jibb-orange hover:text-jibb-orange-light font-semibold underline">
                  {chunks}
                </Link>
              )
            })}
          </p>
          <div className="pt-4 flex justify-center gap-4 flex-col sm:flex-row">
            <Link href="/membership">
              <Button variant="accent" size="lg" className="font-bold gap-1.5 shadow-lg">
                {t("sectorsPage.ctaButton")} <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="font-bold gap-1.5 shadow-lg bg-white/10 border-white/30 hover:bg-white/20 text-white">
                {t("sectorsPage.discussSector")} <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
