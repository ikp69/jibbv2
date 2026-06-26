import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Mail, Sparkles } from "lucide-react";
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
  const slugs = await getAllSlugs("insights");
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
  const post = await getPostBySlug("insights", slug, locale);

  if (!post) return { title: "Not Found | JIBB" };

  const canonicalUrl = `${SITE_URL}/${locale}/resources/insights/${slug}`;
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
        en: `${SITE_URL}/en/resources/insights/${slug}`,
        ja: `${SITE_URL}/ja/resources/insights/${slug}`,
        "x-default": `${SITE_URL}/en/resources/insights/${slug}`,
      },
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const post = await getPostBySlug("insights", slug, locale);

  if (!post) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/${locale}/resources/insights/${slug}`;
  const listUrl = `${SITE_URL}/${locale}/resources/insights`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image || undefined,
    datePublished: post.date.includes('T') ? post.date : `${post.date}T00:00:00+00:00`,
    dateModified: post.date.includes('T') ? post.date : `${post.date}T00:00:00+00:00`,
    author: { "@type": "Person", name: post.author },
    publisher: PUBLISHER,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    keywords: post.tags.join(", "),
    inLanguage: locale === "ja" ? "ja-JP" : "en-US",
    isAccessibleForFree: true,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "ja" ? "ホーム" : "Home", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: locale === "ja" ? "リソース" : "Resources", item: `${SITE_URL}/${locale}/resources` },
      { "@type": "ListItem", position: 3, name: locale === "ja" ? "マーケットインサイト" : "Market Insights", item: listUrl },
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
          <Link href="/resources/insights" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-jibb-orange transition-colors group mb-6">
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            {locale === "ja" ? "インサイト一覧へ戻る" : "Back to Insights"}
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

          {/* Contact Research Box */}
          <div className="rounded-3xl p-8 bg-jibb-gradient-subtle border border-border/80 shadow-jibb text-center max-w-2xl mx-auto space-y-6">
            <div className="p-3 bg-primary/5 text-primary rounded-full inline-block">
              <Mail className="size-6 text-jibb-orange" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                {locale === "ja" ? "政策調査レポートの購読とご相談" : "Policy Insights & Consultation"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {locale === "ja"
                  ? "二国間CEPA改革や特許優先審査（PPH）に関する個別アドバイザリーのご相談は、JIBB調査部門までお問い合わせください。"
                  : "For detailed tariff schedules or advisory sessions regarding the new patent fast-tracking, contact our Policy Division."}
              </p>
            </div>
            <div>
              <a href="mailto:hitesh@npo-jibb.org">
                <Button variant="accent" className="font-bold gap-1.5 shadow-md">
                  {locale === "ja" ? "調査部門へメールする" : "Email Research Division"} <Sparkles className="size-4" />
                </Button>
              </a>
            </div>
          </div>

          <div className="border-t border-border/80 pt-8 flex items-center justify-between">
            <Link href="/resources/insights">
              <Button variant="outline" className="font-semibold gap-1.5">
                <ArrowLeft className="size-4" /> {locale === "ja" ? "インサイト一覧へ" : "Back to Insights"}
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
