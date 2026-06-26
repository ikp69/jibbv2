import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/markdown";
import { getAuthorLinkedIn } from "@/lib/authors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthorBox } from "@/components/ui/AuthorBox";
import { Calendar, User, ArrowLeft, Sparkles, Quote } from "lucide-react";
import { TableOfContents } from "@/components/ui/TableOfContents";
import type { Metadata } from "next";

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
  const slugs = await getAllSlugs("thought-leadership");
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
  const post = await getPostBySlug("thought-leadership", slug, locale);

  if (!post) return { title: "Not Found | JIBB" };

  const canonicalUrl = `${SITE_URL}/${locale}/resources/thought-leadership/${slug}`;
  const ogTitle =
    locale === "ja" ? `${post.title} | 日印ビジネスビューロー` : `${post.title} | JIBB`;

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
      images: post.image ? [{ url: post.image, width: 1200, height: 630, alt: post.title }] : undefined,
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
        en: `${SITE_URL}/en/resources/thought-leadership/${slug}`,
        ja: `${SITE_URL}/ja/resources/thought-leadership/${slug}`,
        "x-default": `${SITE_URL}/en/resources/thought-leadership/${slug}`,
      },
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function LeadershipThoughtDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const post = await getPostBySlug("thought-leadership", slug, locale);
  const isJa = locale === "ja";

  if (!post) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/${locale}/resources/thought-leadership/${slug}`;
  const listUrl = `${SITE_URL}/${locale}/resources/thought-leadership`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image || undefined,
    datePublished: post.date.includes('T') ? post.date : `${post.date}T00:00:00+00:00`,
    dateModified: post.date.includes('T') ? post.date : `${post.date}T00:00:00+00:00`,
    author: {
      "@type": "Person",
      name: post.author,
      url: getAuthorLinkedIn(post.author) || undefined,
    },
    publisher: PUBLISHER,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    keywords: post.tags.join(", "),
    inLanguage: isJa ? "ja-JP" : "en-US",
    isAccessibleForFree: true,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: isJa ? "ホーム" : "Home", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: isJa ? "リソース" : "Resources", item: `${SITE_URL}/${locale}/resources` },
      { "@type": "ListItem", position: 3, name: isJa ? "ソート・リーダーシップ" : "Thought Leadership", item: listUrl },
      { "@type": "ListItem", position: 4, name: post.title, item: canonicalUrl },
    ],
  };

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* BREADCRUMB & BACK */}
      <section className="pt-28 pb-8 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-4xl">
          <Link href="/resources/thought-leadership" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-jibb-orange transition-colors group mb-6">
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            {isJa ? "リーダーシップ論考一覧へ戻る" : "Back to Thought Leadership"}
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent" className="font-semibold rounded-full uppercase tracking-wider text-[9px] gap-1">
                <Quote className="size-2.5" /> {isJa ? "リーダーシップ" : "Leadership"}
              </Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-semibold rounded-full uppercase tracking-wider text-[9px]">
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
                <time dateTime={post.date}>{post.date}</time>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="size-4 text-jibb-orange" />
                {getAuthorLinkedIn(post.author) ? (
                  <a
                    href={getAuthorLinkedIn(post.author) || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-jibb-orange hover:underline transition-all"
                  >
                    {post.author}
                  </a>
                ) : (
                  <span className="font-semibold">{post.author}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT WITH SIDEBAR */}
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

              {/* Mobile-only Table of Contents and Key Takeaways */}
              <div className="block lg:hidden space-y-6">
                {post.takeaways && post.takeaways.length > 0 && (
                  <div className="rounded-3xl p-6 bg-card border border-border/80 shadow-jibb relative overflow-hidden space-y-4">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50 pb-3">
                      {isJa ? "主要な要点" : "Key Takeaways"}
                    </h3>

                    <ul className="space-y-3.5">
                      {post.takeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex gap-2.5 text-xs text-muted-foreground leading-relaxed">
                          <span className="text-jibb-orange font-bold mt-0.5">•</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <TableOfContents />
              </div>

              {/* Article content */}
              <article
                className="jibb-prose"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            </div>

            {/* Sidebar Container */}
            <div className="space-y-6 lg:sticky lg:top-24 self-start">
              {/* Desktop-only Table of Contents and Key Takeaways */}
              <div className="hidden lg:block space-y-6">
                <TableOfContents />

                {/* Key Takeaways */}
                {post.takeaways && post.takeaways.length > 0 && (
                  <div className="rounded-3xl p-6 bg-card border border-border/80 shadow-jibb relative overflow-hidden space-y-4">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50 pb-3">
                      {isJa ? "主要な要点" : "Key Takeaways"}
                    </h3>

                    <ul className="space-y-3.5">
                      {post.takeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex gap-2.5 text-xs text-muted-foreground leading-relaxed">
                          <span className="text-jibb-orange font-bold mt-0.5">•</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Author Box - EEAT Enhancement */}
              <AuthorBox author={post.author} isJa={isJa} />

              {/* Contact Box */}
              <div className="rounded-3xl p-6 bg-jibb-gradient text-white space-y-4 shadow-jibb-lg">
                <h4 className="text-md font-bold tracking-tight">
                  {isJa ? "リーダーシップと相談" : "Engage Leadership"}
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  {isJa
                    ? "対話セッション、講演依頼、アドバイザリーについてお気軽にお問い合わせください。"
                    : "Speaking engagements, dialogue sessions, or advisory inquiries."}
                </p>
                <Link href="/contact" className="block w-full">
                  <Button variant="accent" className="w-full font-bold text-xs gap-1.5 shadow-md">
                    {isJa ? "お問い合わせ" : "Contact"} <Sparkles className="size-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Back Button */}
          <div className="border-t border-border/80 mt-12 pt-8">
            <Link href="/resources/thought-leadership">
              <Button variant="outline" className="font-semibold gap-1.5">
                <ArrowLeft className="size-4" /> {isJa ? "論考一覧へ戻る" : "Back to Thought Leadership"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
