import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { getAllPosts } from "@/lib/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Search, Tag, Sparkles } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import PastEventsCollage from "@/components/sections/PastEventsCollage";
import LinkedInCarousel from "@/components/sections/LinkedInCarousel";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";

const SITE_URL = "https://npo-jibb.org";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; tag?: string }>;
}

// ============================================================
// METADATA — Insights list page SEO
// ============================================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";

  const title = isJa
    ? "マーケットインサイト | 日印ビジネスビューロー"
    : "Market Insights | JIBB — Japan India Business Bureau";
  const description = isJa
    ? "日印クロスボーダートレンド、政策変更、二国間市場に関する深い分析レポート。"
    : "In-depth analyses of cross-border trends, policy shifts, and bilateral market opportunities between Japan and India.";
  const canonicalUrl = `${SITE_URL}/${locale}/resources/insights`;

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
        en: `${SITE_URL}/en/resources/insights`,
        ja: `${SITE_URL}/ja/resources/insights`,
        "x-default": `${SITE_URL}/en/resources/insights`,
      },
    },
    robots: { index: true, follow: true },
  };
}



export default async function InsightsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { q: search = "", tag: selectedTag = "" } = await searchParams;

  const t = await getTranslations({ locale });
  const allInsights = await getAllPosts("insights", locale);

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
        .limit(6);

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

  // Filter posts by search query and selected tag
  const filteredInsights = allInsights.filter((post) => {
    const matchesSearch =
      search === "" ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.description.toLowerCase().includes(search.toLowerCase()) ||
      post.contentHtml.toLowerCase().includes(search.toLowerCase());

    const matchesTag =
      selectedTag === "" ||
      post.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  // Extract all unique tags
  const allTags = Array.from(
    new Set(allInsights.flatMap((post) => post.tags))
  );

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* ============================================================
          CINEMATIC BANNER
          ============================================================ */}
      <PageHero className="py-20" bgText="INSIGHTS">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              {t("resourcesMenu.insights")}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {t("resourcesMenu.insights")}
          </h1>

          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t("resourcesMenu.insightsDesc")}
          </p>
        </div>
      </PageHero>

      {/* ============================================================
          SEARCH & FILTERING
          ============================================================ */}
      <section className="py-8 bg-card border-b border-border/40">
        <div className="section-container flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Tag Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/resources/insights">
              <Badge
                variant={selectedTag === "" ? "accent" : "outline"}
                className="cursor-pointer font-medium text-xs py-1.5 px-3 rounded-full transition-all hover:scale-105"
              >
                {locale === "ja" ? "すべて" : "All Insights"}
              </Badge>
            </Link>
            {allTags.map((tag) => (
              <Link key={tag} href={`/resources/insights?tag=${encodeURIComponent(tag)}&q=${search}`}>
                <Badge
                  variant={selectedTag.toLowerCase() === tag.toLowerCase() ? "accent" : "outline"}
                  className="cursor-pointer font-medium text-xs py-1.5 px-3 rounded-full transition-all hover:scale-105"
                >
                  <Tag className="size-3 mr-1 inline" /> {tag}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Search Form */}
          <form method="GET" action="" className="relative w-full md:w-80">
            {selectedTag && <input type="hidden" name="tag" value={selectedTag} />}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder={locale === "ja" ? "政策、分析、関税で検索..." : "Search insights..."}
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all shadow-jibb-sm"
            />
          </form>
        </div>

        {/* Table of Contents Quick Navigation */}
        <div className="section-container mt-6 pt-6 border-t border-border/20 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="text-foreground/60">{locale === "ja" ? "セクション移動:" : "Jump to:"}</span>
          <a href="#insights-archive" className="px-3.5 py-1.5 rounded-full bg-secondary text-jibb-indigo hover:bg-jibb-indigo hover:text-jibb-sakura transition-all duration-300">
            {locale === "ja" ? "レポート一覧" : "Insights Grid"}
          </a>
          <a href="#linkedin-updates" className="px-3.5 py-1.5 rounded-full bg-secondary text-jibb-indigo hover:bg-jibb-indigo hover:text-jibb-sakura transition-all duration-300">
            {locale === "ja" ? "LinkedIn投稿" : "LinkedIn Updates"}
          </a>
          <a href="#past-events-gallery" className="px-3.5 py-1.5 rounded-full bg-secondary text-jibb-indigo hover:bg-jibb-indigo hover:text-jibb-sakura transition-all duration-300">
            {locale === "ja" ? "イベントギャラリー" : "Past Highlights"}
          </a>
        </div>
      </section>

      {/* ============================================================
          INSIGHTS GRID
          ============================================================ */}
      <section id="insights-archive" className="py-16 bg-jibb-gradient-subtle scroll-mt-20">
        <div className="section-container">
          {filteredInsights.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border/80 shadow-jibb p-8 space-y-4">
              <p className="text-lg text-muted-foreground">
                {locale === "ja" ? "インサイトが見つかりませんでした。" : "No insights found matching your criteria."}
              </p>
              <Link href="/resources/insights">
                <Button variant="outline" className="font-semibold">
                  {locale === "ja" ? "クリア" : "Clear Filters"}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInsights.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col h-full bg-card border border-border/80 shadow-jibb hover:shadow-jibb-md rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] py-0 px-2">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <h3 className="text-lg font-bold text-foreground tracking-tight leading-snug group-hover:text-jibb-orange transition-colors line-clamp-2">
                        <Link href={`/resources/insights/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {post.description}
                      </p>
                    </div>

                    <div className="border-t border-border/50 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Calendar className="size-3" />
                          {post.date}
                        </span>
                      </div>

                      <Link href={`/resources/insights/${post.slug}`}>
                        <Button variant="link" className="text-jibb-orange text-xs p-0 font-bold gap-1 group-hover:gap-1.5 transition-all">
                          {locale === "ja" ? "レポートを読む" : "Read Report"} <ArrowRight className="size-3.5" />
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

      <LinkedInCarousel posts={linkedinPosts} />

      <PastEventsCollage />
    </main>
  );
}
