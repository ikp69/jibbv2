import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { getAllPosts } from "@/lib/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Search, MapPin, Target, TrendingUp, Sparkles } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import type { Metadata } from "next";

const SITE_URL = "https://npo-jibb.org";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}

// ============================================================
// METADATA — Case Studies list page SEO
// ============================================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";

  const title = isJa
    ? "ブログ | 日印ビジネスビューロー"
    : "Blog | JIBB - Japan India Business Bureau";
  const description = isJa
    ? "JIBBの最新記事、お知らせ、業界インサイトをご覧ください。"
    : "Latest articles, updates and industry insights from Japan India Business Bureau.";
  const canonicalUrl = `${SITE_URL}/${locale}/resources/blog`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: isJa ? "日印ビジネスビューロー" : "Japan India Business Bureau",
    },
    twitter: { card: "summary", title, description },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/resources/blog`,
        ja: `${SITE_URL}/ja/resources/blog`,
        "x-default": `${SITE_URL}/en/resources/blog`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function CaseStudiesPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { q: search = "" } = await searchParams;

  const t = await getTranslations({ locale });
  const allCaseStudies = await getAllPosts("blog", locale);

  // Filter case studies by search query
  const filteredCaseStudies = allCaseStudies.filter((post) => {
    return (
      search === "" ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase()) ||
      post.contentHtml.toLowerCase().includes(search.toLowerCase()) ||
      (post.client && post.client.toLowerCase().includes(search.toLowerCase())) ||
      (post.corridor && post.corridor.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // CollectionPage Schema for Blog Listing with NewsArticle items
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/${locale}/resources/blog`,
    name: locale === "ja" ? "ブログ | 日印ビジネスビューロー" : "Blog | JIBB",
    description: locale === "ja"
      ? "JIBBの最新記事、お知らせ、業界インサイトをご覧ください。"
      : "Latest articles, updates and industry insights from Japan India Business Bureau.",
    url: `${SITE_URL}/${locale}/resources/blog`,
    publisher: {
      "@type": "Organization",
      name: "Japan India Business Bureau",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
      url: SITE_URL,
    },
    inLanguage: locale === "ja" ? "ja-JP" : "en-US",
    isPartOf: { "@type": "WebSite", "@id": SITE_URL },
    hasPart: filteredCaseStudies.slice(0, 10).map(post => ({
      "@type": "NewsArticle",
      headline: post.title,
      description: post.description,
      image: post.image,
      datePublished: post.date.includes('T') ? post.date : `${post.date}T00:00:00+00:00`,
      url: `${SITE_URL}/${locale}/resources/blog/${post.slug}`,
      author: post.author ? { "@type": "Person", name: post.author } : undefined,
    })),
  };

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
      {/* ============================================================
          CINEMATIC BANNER
          ============================================================ */}
      <PageHero className="py-20" bgText="BLOG">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              {locale === "ja" ? "ケーススタディ" : "Blog"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {t("resourcesMenu.caseStudies")}
          </h1>

          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t("resourcesMenu.caseStudiesDesc")}
          </p>
        </div>
      </PageHero>

      {/* ============================================================
          SEARCH & FILTERING
          ============================================================ */}
      <section className="py-8 bg-card border-b border-border/40">
        <div className="section-container flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="text-sm text-muted-foreground font-medium">
            {locale === "ja"
              ? `${filteredCaseStudies.length} 件の成功事例を表示中`
              : `Showing ${filteredCaseStudies.length} articles`}
          </div>

          {/* Search Form */}
          <form method="GET" action="" className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder={locale === "ja" ? "企業名、地域、課題で検索..." : "Search by company, corridor, keyword..."}
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all shadow-jibb-sm"
            />
          </form>
        </div>
      </section>

      {/* ============================================================
          CASE STUDIES GRID
          ============================================================ */}
      <section className="py-16 bg-jibb-gradient-subtle">
        <div className="section-container">
          {filteredCaseStudies.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border/80 shadow-jibb p-8 space-y-4">
              <p className="text-lg text-muted-foreground">
                {locale === "ja" ? "事例が見つかりませんでした。" : "No blog found matching your criteria."}
              </p>
              <Link href="/resources/blog">
                <Button variant="outline" className="font-semibold">
                  {locale === "ja" ? "検索をリセット" : "Reset Search"}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {filteredCaseStudies.map((post) => (
                <article
                  key={post.slug}
                  className="group relative flex flex-col bg-card border border-border/80 shadow-jibb hover:shadow-jibb-lg rounded-3xl overflow-hidden transition-all duration-300"
                >
                  {/* Banner Image */}
                  <div className="relative w-full overflow-hidden bg-card" style={{ aspectRatio: "1700 / 800" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    {/* Corridor Badge */}
                    {post.corridor && (
                      <div className="absolute bottom-6 left-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                        <MapPin className="size-3.5 text-jibb-orange" />
                        {post.corridor}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-x-2.5 gap-y-0.5">
                        {post.client && (
                          <span className="text-[11px] sm:text-xs font-bold text-jibb-orange uppercase tracking-wider">
                            {post.client}
                          </span>
                        )}
                        {post.client && (
                          <span className="text-[10px] text-muted-foreground hidden xs:inline">•</span>
                        )}
                        <span className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                          <Calendar className="size-3" /> {post.date}
                        </span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight leading-snug group-hover:text-jibb-orange transition-colors">
                        <Link href={`/resources/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {post.description}
                      </p>

                      {/* Impact Highlight Box */}
                      {post.impact && (
                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-2.5 no-hover-fill">
                          <TrendingUp className="size-4 text-jibb-orange shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">
                              {locale === "ja" ? "主要インパクト" : "Key Impact"}
                            </span>
                            <span className="text-[11px] sm:text-xs font-semibold text-foreground">
                              {post.impact}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-border/50 pt-4 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[9px] px-2 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Link href={`/resources/blog/${post.slug}`}>
                        <Button variant="link" className="text-jibb-orange p-0 font-bold text-xs gap-1 group-hover:gap-2 transition-all">
                          {locale === "ja" ? "記事を読む" : "Read Post"} <ArrowRight className="size-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
