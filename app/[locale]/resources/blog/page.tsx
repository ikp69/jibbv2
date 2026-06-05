import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { getAllPosts } from "@/lib/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Search, Tag, Sparkles } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import type { Metadata } from "next";

const SITE_URL = "https://npo-jibb.org";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; tag?: string }>;
}

// ============================================================
// METADATA — Blog list page SEO
// ============================================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";

  const title = isJa
    ? "ニュース & ブログ | 日印ビジネスビューロー"
    : "News & Blog | JIBB — Japan India Business Bureau";
  const description = isJa
    ? "JIBBのコラボレーションストーリー、最新ニュース、お知らせをお届けします。"
    : "Stories of collaboration, bilateral trade updates, and the latest announcements from Japan India Business Bureau.";
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



export default async function BlogPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { q: search = "", tag: selectedTag = "" } = await searchParams;

  const t = await getTranslations({ locale });
  const allPosts = await getAllPosts("blog", locale);

  // Filter posts by search query and selected tag
  const filteredPosts = allPosts.filter((post) => {
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
    new Set(allPosts.flatMap((post) => post.tags))
  );

  // Find the featured post (if any)
  const featuredPost = filteredPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => post.slug !== featuredPost?.slug);

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* ============================================================
          CINEMATIC BANNER
          ============================================================ */}
      <PageHero className="py-20">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              {t("resourcesMenu.blog")}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {t("resourcesMenu.blog")}
          </h1>
          
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t("resourcesMenu.blogDesc")}
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
            <Link href="/resources/blog">
              <Badge 
                variant={selectedTag === "" ? "accent" : "outline"}
                className="cursor-pointer font-medium text-xs py-1.5 px-3 rounded-full transition-all hover:scale-105"
              >
                {locale === "ja" ? "すべて" : "All Posts"}
              </Badge>
            </Link>
            {allTags.map((tag) => (
              <Link key={tag} href={`/resources/blog?tag=${encodeURIComponent(tag)}&q=${search}`}>
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
              placeholder={locale === "ja" ? "検索..." : "Search posts..."}
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all shadow-jibb-sm"
            />
          </form>
        </div>
      </section>

      {/* ============================================================
          ARTICLES GRID
          ============================================================ */}
      <section className="py-16 bg-jibb-gradient-subtle">
        <div className="section-container space-y-12">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border/80 shadow-jibb p-8 space-y-4">
              <p className="text-lg text-muted-foreground">
                {locale === "ja" ? "記事が見つかりませんでした。" : "No articles found matching your criteria."}
              </p>
              <Link href="/resources/blog">
                <Button variant="outline" className="font-semibold">
                  {locale === "ja" ? "フィルターをクリア" : "Clear Filters"}
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Featured Post Card */}
              {featuredPost && !selectedTag && !search && (
                <div className="group relative rounded-3xl overflow-hidden bg-card border border-border/80 shadow-jibb hover:shadow-jibb-lg transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-64 sm:h-96 lg:h-full min-h-[300px] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                      <Badge className="absolute top-6 left-6 bg-jibb-orange text-white hover:bg-jibb-orange font-bold uppercase tracking-wider text-[10px]">
                        {locale === "ja" ? "注目記事" : "Featured Post"}
                      </Badge>
                    </div>

                    <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
                      <div className="flex flex-wrap gap-2">
                        {featuredPost.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight group-hover:text-jibb-orange transition-colors">
                        <Link href={`/resources/blog/${featuredPost.slug}`}>
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3">
                        {featuredPost.description}
                      </p>

                      <div className="border-t border-border/60 pt-6 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            {featuredPost.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User className="size-3.5" />
                            {featuredPost.author}
                          </span>
                        </div>

                        <Link href={`/resources/blog/${featuredPost.slug}`}>
                          <Button variant="link" className="text-jibb-orange p-0 font-bold gap-1 group-hover:gap-2 transition-all">
                            {locale === "ja" ? "続きを読む" : "Read More"} <ArrowRight className="size-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Regular Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(featuredPost && !selectedTag && !search ? regularPosts : filteredPosts).map((post) => (
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
                      {post.featured && (
                        <Badge className="absolute top-4 left-4 bg-jibb-orange text-white hover:bg-jibb-orange font-bold uppercase tracking-wider text-[9px]">
                          {locale === "ja" ? "注目" : "Featured"}
                        </Badge>
                      )}
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
                          <Link href={`/resources/blog/${post.slug}`}>
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

                        <Link href={`/resources/blog/${post.slug}`}>
                          <Button variant="link" className="text-jibb-orange text-xs p-0 font-bold gap-1 group-hover:gap-1.5 transition-all">
                            {locale === "ja" ? "読む" : "Read"} <ArrowRight className="size-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
