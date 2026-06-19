import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, MapPin, Building2, Trophy, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { TableOfContents } from "@/components/ui/TableOfContents";

const SITE_URL = "https://npo-jibb.org";
const PUBLISHER = {
  "@type": "Organization",
  name: "Japan India Business Bureau",
  logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
  url: SITE_URL,
};

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// ============================================================
// STATIC PARAMS
// ============================================================
export async function generateStaticParams() {
  const slugs = await getAllSlugs("blog");
  const locales = ["en", "ja"];
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

// ============================================================
// METADATA
// ============================================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug("blog", slug, locale);

  if (!post) return { title: "Not Found | JIBB" };

  const canonicalUrl = `${SITE_URL}/${locale}/resources/blog/${slug}`;
  const ogTitle =
    locale === "ja" ? `${post.title} | 日印ビジネスビューロー` : `${post.title} | JIBB`;

  return {
    title: ogTitle,
    description: post.description,
    keywords: post.tags,
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      type: "article",
      title: ogTitle,
      description: post.description,
      url: canonicalUrl,
      siteName: locale === "ja" ? "日印ビジネスビューロー" : "Japan India Business Bureau",
      images: post.image ? [{ url: post.image, width: 1200, height: 630, alt: post.title }] : undefined,
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: post.description,
      images: post.image ? [post.image] : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/resources/blog/${slug}`,
        ja: `${SITE_URL}/ja/resources/blog/${slug}`,
        "x-default": `${SITE_URL}/en/resources/blog/${slug}`,
      },
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const post = await getPostBySlug("blog", slug, locale);

  if (!post) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/${locale}/resources/blog/${slug}`;
  const listUrl = `${SITE_URL}/${locale}/resources/blog`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    alternativeHeadline: post.description,
    image: post.image ? [post.image] : undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: post.author ? 
      { "@type": "Person", name: post.author, affiliation: PUBLISHER } 
      : PUBLISHER,
    publisher: PUBLISHER,
    mainEntityOfPage: { 
      "@type": "WebPage", 
      "@id": canonicalUrl 
    },
    description: post.description,
    articleBody: post.contentHtml ? post.contentHtml.replace(/<[^>]*>/g, '') : "",
    keywords: post.tags.join(", "),
    articleSection: locale === "ja" ? "ケーススタディ" : "Case Studies",
    inLanguage: locale === "ja" ? "ja-JP" : "en-US",
    isAccessibleForFree: true,
    ...(post.client && { 
      about: { 
        "@type": "Organization", 
        name: post.client 
      } 
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "ja" ? "ホーム" : "Home", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: locale === "ja" ? "リソース" : "Resources", item: `${SITE_URL}/${locale}/resources` },
      { "@type": "ListItem", position: 3, name: locale === "ja" ? "事例研究" : "Case Studies", item: listUrl },
      { "@type": "ListItem", position: 4, name: post.title, item: canonicalUrl },
    ],
  };

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {/* ============================================================
          CASE STUDY BREADCRUMB & BACK ACTION
          ============================================================ */}
      <section className="pt-28 pb-8 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-4xl">
          <Link href="/resources/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-jibb-orange transition-colors group mb-6">
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            {locale === "ja" ? "ブログ一覧へ戻る" : "Back to Blog"}
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="accent" className="font-semibold rounded-full uppercase tracking-wider text-[9px]">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {post.description}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          CASE STUDY CONTENT & METRICS SIDEBAR
          ============================================================ */}
      <section className="py-12 bg-card">
        <div className="section-container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Image */}
              <div className="relative rounded-3xl overflow-hidden max-h-[70vh] flex justify-center bg-transparent">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto object-contain max-h-[70vh] rounded-3xl"
                />
              </div>

              {/* Rendered HTML Markdown Body */}
              <article 
                className="jibb-prose"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            </div>

            {/* Metrics Sidebar */}
            <div className="space-y-6 lg:sticky lg:top-24 self-start">
              <TableOfContents />

              <div className="rounded-3xl p-6 bg-card border border-border/80 shadow-jibb relative overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                
                <h3 className="text-lg font-bold text-foreground tracking-tight border-b border-border/50 pb-3">
                  {locale === "ja" ? "プロジェクト概要" : "Project Summary"}
                </h3>

                <div className="space-y-5">
                  {post.client && (
                    <div className="flex items-start gap-3">
                      <Building2 className="size-5 text-jibb-orange shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {locale === "ja" ? "クライアント" : "Client"}
                        </span>
                        <span className="text-sm font-semibold text-foreground">{post.client}</span>
                      </div>
                    </div>
                  )}

                  {post.corridor && (
                    <div className="flex items-start gap-3">
                      <MapPin className="size-5 text-jibb-orange shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {locale === "ja" ? "活動エリア" : "Corridor Axis"}
                        </span>
                        <span className="text-sm font-semibold text-foreground">{post.corridor}</span>
                      </div>
                    </div>
                  )}

                    <div className="flex items-start gap-3">
                      <Calendar className="size-5 text-jibb-orange shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          {locale === "ja" ? "公開日" : "Published"}
                        </span>
                        <time dateTime={post.date} className="text-sm font-semibold text-foreground">{post.date}</time>
                    </div>
                  </div>

                  {post.impact && (
                    <div className="flex items-start gap-3 pt-4 border-t border-border/50">
                      <Trophy className="size-5 text-jibb-orange shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                          {locale === "ja" ? "主要成果" : "Key Impact"}
                        </span>
                        <span className="text-sm font-bold text-foreground leading-snug">{post.impact}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar CTA */}
              <div className="rounded-3xl p-6 bg-jibb-gradient text-white space-y-4 shadow-jibb-lg">
                <h4 className="text-md font-bold tracking-tight">
                  {locale === "ja" ? "同様の展開をご検討ですか？" : "Planning a similar entry?"}
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  {locale === "ja"
                    ? "JIBBの専門アドバイザーが、通関手続き、現地提携先開拓、インキュベーション支援までトータルコーディネートします。"
                    : "JIBB provides customized support for customs clearances, local partner sourcing, and sandbox labs in Tokyo & Noida."}
                </p>
                <Link href="/contact" className="block w-full">
                  <Button variant="accent" className="w-full font-bold text-xs gap-1.5 shadow-md">
                    {locale === "ja" ? "アドバイザリー相談" : "Consult Advisory"} <Sparkles className="size-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Back Button */}
          <div className="border-t border-border/80 mt-12 pt-8">
            <Link href="/resources/blog">
              <Button variant="outline" className="font-semibold gap-1.5">
                <ArrowLeft className="size-4" /> {locale === "ja" ? "ブログ一覧へ戻る" : "Back to Blog"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
