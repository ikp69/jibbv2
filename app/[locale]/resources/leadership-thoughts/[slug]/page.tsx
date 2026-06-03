import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Clock, Sparkles } from "lucide-react";
import type { Metadata } from "next";

const SITE_URL = "https://npo-jibb.org";
const PUBLISHER = {
  "@type": "Organization",
  name: "Japan India Business Bureau",
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
  },
  url: SITE_URL,
};

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// ============================================================
// STATIC PARAMS — Pre-render all slugs × locales at build time
// ============================================================
export async function generateStaticParams() {
  const slugs = await getAllSlugs("leadership-thoughts");
  const locales = ["en", "ja"];
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

// ============================================================
// METADATA — Full SEO per article
// ============================================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug("leadership-thoughts", slug, locale);

  if (!post) {
    return { title: "Not Found | JIBB" };
  }

  const canonicalPath = `/${locale}/resources/leadership-thoughts/${slug}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const altLocale = locale === "en" ? "ja" : "en";
  const altUrl = `${SITE_URL}/${altLocale}/resources/leadership-thoughts/${slug}`;

  const ogTitle =
    locale === "ja"
      ? `${post.title} | 日印ビジネスビューロー`
      : `${post.title} | JIBB`;

  return {
    title: ogTitle,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      type: "article",
      title: ogTitle,
      description: post.description,
      url: canonicalUrl,
      siteName: locale === "ja" ? "日印ビジネスビューロー" : "Japan India Business Bureau",
      images: post.image
        ? [{ url: post.image, width: 1200, height: 630, alt: post.title }]
        : undefined,
      publishedTime: post.date,
      authors: [post.author],
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
        en: `${SITE_URL}/en/resources/leadership-thoughts/${slug}`,
        ja: `${SITE_URL}/ja/resources/leadership-thoughts/${slug}`,
        "x-default": `${SITE_URL}/en/resources/leadership-thoughts/${slug}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function LeadershipThoughtPostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const post = await getPostBySlug("leadership-thoughts", slug, locale);

  if (!post) {
    notFound();
  }

  // Simple reading time estimator (200 words per minute)
  const wordCount = post.contentHtml.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const canonicalUrl = `${SITE_URL}/${locale}/resources/leadership-thoughts/${slug}`;
  const listUrl = `${SITE_URL}/${locale}/resources/leadership-thoughts`;

  // ---- JSON-LD Structured Data ----
  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.description,
    image: post.image || undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: PUBLISHER,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    keywords: post.tags.join(", "),
    inLanguage: locale === "ja" ? "ja-JP" : "en-US",
    isAccessibleForFree: true,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "ja" ? "ホーム" : "Home",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "ja" ? "リソース" : "Resources",
        item: `${SITE_URL}/${locale}/resources`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: locale === "ja" ? "リーダーシップ・ソーツ" : "Leadership Thoughts",
        item: listUrl,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* ============================================================
          JSON-LD STRUCTURED DATA
          ============================================================ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ============================================================
          ARTICLE BREADCRUMB & BACK ACTION
          ============================================================ */}
      <section className="pt-28 pb-8 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-4xl">
          <Link href="/resources/leadership-thoughts" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-jibb-orange transition-colors group mb-6">
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            {locale === "ja" ? "リーダーシップ・ソーツ一覧へ戻る" : "Back to Leadership Thoughts"}
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

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-t border-border/40 pt-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-jibb-orange" />
                <span>
                  <time dateTime={post.date}>{post.date}</time>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="size-4 text-jibb-orange" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="size-4 text-jibb-orange" />
                <span>
                  {locale === "ja" ? `読了時間 約 ${readingTime} 分` : `${readingTime} min read`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          ARTICLE HERO IMAGE & CONTENT
          ============================================================ */}
      <section className="py-12 bg-card">
        <div className="section-container max-w-4xl space-y-12">
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
            className="jibb-prose mx-auto"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* Footer Navigation */}
          <div className="border-t border-border/80 pt-8 flex items-center justify-between">
            <Link href="/resources/leadership-thoughts">
              <Button variant="outline" className="font-semibold gap-1.5">
                <ArrowLeft className="size-4" /> {locale === "ja" ? "オピニオン一覧へ" : "Back to Articles"}
              </Button>
            </Link>

            <Link href="/contact">
              <Button variant="accent" className="font-bold gap-1.5 shadow-md">
                {locale === "ja" ? "お問い合わせ" : "Inquire Advisory"} <Sparkles className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
