import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Mail, Sparkles, Quote } from "lucide-react";
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
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: post.author },
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
                <span>{post.author}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12 bg-card">
        <div className="section-container space-y-12">
          {/* Featured Image */}
          <div className="relative rounded-3xl overflow-hidden max-h-[70vh] flex justify-center bg-transparent">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.title} className="w-full h-auto object-contain max-h-[70vh] rounded-3xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Table of Contents Sidebar */}
            <aside className="lg:col-span-3 lg:sticky lg:top-24 hidden lg:block self-start">
              <TableOfContents />
            </aside>

            {/* Article content */}
            <div className="lg:col-span-9">
              <article className="jibb-prose mx-auto" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
            </div>
          </div>

          {/* Contact Box */}
          <div className="rounded-3xl p-8 bg-jibb-gradient-subtle border border-border/80 shadow-jibb text-center max-w-2xl mx-auto space-y-6">
            <div className="p-3 bg-primary/5 text-primary rounded-full inline-block">
              <Mail className="size-6 text-jibb-orange" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                {isJa ? "リーダーシップとの対話" : "Engage with Leadership"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isJa
                  ? "JIBBの共同創設者や経営陣との対話セッション、講演依頼は以下よりお問い合わせください。"
                  : "For speaking engagements, dialogue sessions, or advisory inquiries with JIBB's leadership team, reach out below."}
              </p>
            </div>
            <div>
              <a href="mailto:leadership@npo-jibb.org">
                <Button variant="accent" className="font-bold gap-1.5 shadow-md">
                  {isJa ? "リーダーシップへメール" : "Email Leadership"} <Sparkles className="size-4" />
                </Button>
              </a>
            </div>
          </div>

          <div className="border-t border-border/80 pt-8 flex items-center justify-between">
            <Link href="/resources/thought-leadership">
              <Button variant="outline" className="font-semibold gap-1.5">
                <ArrowLeft className="size-4" /> {isJa ? "論考一覧へ" : "Back to Thoughts"}
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="accent" className="font-bold gap-1.5 shadow-md">
                {isJa ? "お問い合わせ" : "Inquire Advisory"} <Sparkles className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
