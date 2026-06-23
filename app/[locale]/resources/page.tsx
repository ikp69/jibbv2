import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import {
  TrendingUp,
  BookMarked,
  Mail,
  Quote,
  ArrowRight,
  Sparkles,
  FileText,
  Library,
} from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

const SITE_URL = "https://npo-jibb.org";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";

  const title = isJa
    ? "リソース | 日印ビジネスビューロー"
    : "Resources | JIBB - Japan India Business Bureau";
  const description = isJa
    ? "JIBBのリソースライブラリ。市場インサイト、事例紹介、リーダーシップ論考、ニュースレターをご覧ください。"
    : "Access JIBB's knowledge library — market insights, case studies, thought leadership, and newsletters.";

  return {
    title,
    description,
    keywords: [
      "resources",
      "insights",
      "blog",
      "thought leadership",
      "newsletters",
      "market analysis",
      "Japan India business",
      "case studies",
      "business intelligence",
      "bilateral insights",
      "リソース",
      "インサイト",
      "ブログ",
      "ニュースレター",
      "市場分析",
    ],
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE_URL}/${locale}/resources`,
      siteName: isJa ? "日印ビジネスビューロー" : "Japan India Business Bureau",
      locale: isJa ? "ja_JP" : "en_US",
      alternateLocale: isJa ? "en_US" : "ja_JP",
      images: [
        {
          url: `${SITE_URL}/images/og/resources-og.jpg`,
          width: 1200,
          height: 630,
          alt: "JIBB Resources — Market Insights, Blog, Thought Leadership",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/images/og/resources-og.jpg`],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/resources`,
      languages: {
        en: `${SITE_URL}/en/resources`,
        ja: `${SITE_URL}/ja/resources`,
        "x-default": `${SITE_URL}/en/resources`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function ResourcesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const isJa = locale === "ja";

  const sections = [
    {
      icon: <TrendingUp className="size-7 text-white" />,
      color: "from-jibb-orange to-jibb-orange-light",
      title: t("resourcesMenu.insights"),
      desc: t("resourcesMenu.insightsDesc"),
      href: "/resources/insights",
      cta: isJa ? "インサイトを見る" : "View Insights",
    },
    {
      icon: <BookMarked className="size-7 text-white" />,
      color: "from-jibb-indigo to-jibb-indigo-light",
      title: t("resourcesMenu.blog"),
      desc: t("resourcesMenu.blogDesc"),
      href: "/resources/blog",
      cta: isJa ? "ブログを見る" : "View Blog",
    },
    {
      icon: <Quote className="size-7 text-white" />,
      color: "from-jibb-sakura to-jibb-sakura-light",
      title: t("resourcesMenu.leadership"),
      desc: t("resourcesMenu.leadershipDesc"),
      href: "/resources/thought-leadership",
      cta: isJa ? "論考を読む" : "Read Thoughts",
    },
    // {
    //   icon: <Mail className="size-7 text-white" />,
    //   color: "from-jibb-orange to-jibb-orange-light",
    //   title: t("resourcesMenu.newsletter"),
    //   desc: t("resourcesMenu.newsletterDesc"),
    //   href: "/resources/newsletter",
    //   cta: isJa ? "ニュースレター" : "Newsletter",
    // },
  ];

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* Cinematic Banner */}
      <PageHero className="py-20 lg:py-28" bgText="RESOURCES">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Library className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              {t("nav.resources")}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {isJa ? "ナレッジ＆リソースライブラリ" : "Knowledge & Resource Library"}
          </h1>

          <p className="text-sm md:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            {isJa
              ? "JIBBが提供する市場分析、リーダーの視点、成功事例、ニュースレター等、二国間ビジネスを加速するリソース群。"
              : "Explore JIBB's comprehensive collection of market analyses, leadership perspectives, success stories, and curated newsletters that power bilateral business."}
          </p>
        </div>
      </PageHero>

      {/* Resources Grid */}
      <section className="py-20 md:py-28 bg-jibb-gradient-subtle">
        <div className="section-container max-w-5xl space-y-16">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              {isJa ? "リソースカテゴリ" : "Browse by Category"}
            </h2>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
            <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {isJa
                ? "目的に合わせてリソースをお選びください。各カテゴリには、日印ビジネスを支える深い知見が集約されています。"
                : "Select a category to dive deep into JIBB's repository of bilateral business intelligence and thought leadership."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((s, idx) => (
              <Link key={idx} href={s.href} className="group block">
                <div className="relative rounded-3xl p-8 bg-card border border-border/85 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[240px] overflow-hidden">
                  {/* Decorative blur */}
                  <div className="absolute -top-6 -right-6 w-28 h-28 bg-jibb-orange/5 rounded-full blur-3xl pointer-events-none group-hover:bg-jibb-orange/10 transition-colors duration-500" />

                  <div className="space-y-4 relative z-10">
                    <div className={`p-3 rounded-xl bg-gradient-to-tr ${s.color} inline-flex shadow-md transition-transform duration-300 group-hover:scale-105`}>
                      {s.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                        {s.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/40 mt-6 flex items-center justify-between text-xs font-semibold relative z-10">
                    <span className="text-primary/80 flex items-center gap-1 group-hover:gap-2 transition-all">
                      {s.cta} <ArrowRight className="size-3.5" />
                    </span>
                    <Sparkles className="size-4 text-jibb-orange opacity-30 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-jibb-gradient text-white relative overflow-hidden">
        <div className="section-container relative z-10 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {isJa ? "インサイトを受信する" : "Stay Informed"}
          </h2>
          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl mx-auto">
            {isJa
              ? "毎週のニュースレターに登録して、日印ビジネスの最新動向と政策アップデートを受信しましょう。"
              : "Subscribe to JIBB's weekly newsletter for the latest bilateral market trends, policy updates, and event invitations."}
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link href="#footer">
              <Button variant="accent" size="lg" className="font-bold gap-1.5 shadow-lg">
                {isJa ? "ニュースレター登録" : "Subscribe Now"} <Mail className="size-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="font-bold gap-1.5 shadow-lg bg-white/10 border-white/20 text-white hover:bg-white/20">
                {isJa ? "お問い合わせ" : "Contact Us"} <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
