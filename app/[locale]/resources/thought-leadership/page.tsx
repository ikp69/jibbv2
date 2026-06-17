import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { getAllPosts } from "@/lib/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, User, Sparkles, Quote, ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import type { Metadata } from "next";

const SITE_URL = "https://npo-jibb.org";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === "ja";

  const title = isJa
    ? "リーダーシップ論考 | 日印ビジネスビューロー"
    : "Thought Leadership | JIBB — Japan India Business Bureau";
  const description = isJa
    ? "JIBBの共同創設者および経営陣による、日印ビジネス・産業協力に関するビジョンと戦略的見解。"
    : "Vision, strategy, and perspectives from JIBB's co-founders and leadership on India-Japan industrial co-innovation.";
  const canonicalUrl = `${SITE_URL}/${locale}/resources/thought-leadership`;

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
        en: `${SITE_URL}/en/resources/thought-leadership`,
        ja: `${SITE_URL}/ja/resources/thought-leadership`,
        "x-default": `${SITE_URL}/en/resources/thought-leadership`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function LeadershipThoughtsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const isJa = locale === "ja";

  const posts = await getAllPosts("thought-leadership", locale);

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* Cinematic Banner */}
      <PageHero className="py-20 lg:py-28" bgText="LEADERSHIP">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Quote className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              {t("resourcesMenu.leadership")}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {t("resourcesMenu.leadership")}
          </h1>

          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t("resourcesMenu.leadershipDesc")}
          </p>
        </div>
      </PageHero>

      {/* Posts Grid */}
      <section className="py-16 md:py-24 bg-jibb-gradient-subtle">
        <div className="section-container">
          <div className="mb-8">
            <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-jibb-orange transition-colors group">
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              {isJa ? "リソースへ戻る" : "Back to Resources"}
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border/80 shadow-jibb p-8 space-y-4">
              <p className="text-lg text-muted-foreground">
                {isJa ? "まだ論考が投稿されていません。" : "No thought leadership published yet."}
              </p>
              <Link href="/resources">
                <Button variant="outline" className="font-semibold">
                  {isJa ? "リソースに戻る" : "Back to Resources"}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col h-full bg-card border border-border/80 shadow-jibb hover:shadow-jibb-md rounded-2xl overflow-hidden transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {post.featured && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge variant="accent" className="text-[9px] uppercase tracking-wider font-bold gap-1 rounded-full px-2.5 py-0.5 shadow-md">
                          <Sparkles className="size-2.5" /> {isJa ? "注目" : "Featured"}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
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
                        <Link href={`/resources/thought-leadership/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {post.description}
                      </p>
                    </div>

                    <div className="border-t border-border/50 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Calendar className="size-3" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <User className="size-3" />
                          {post.author}
                        </span>
                      </div>

                      <Link href={`/resources/thought-leadership/${post.slug}`}>
                        <Button variant="link" className="text-jibb-orange text-xs p-0 font-bold gap-1 group-hover:gap-1.5 transition-all">
                          {isJa ? "記事を読む" : "Read Article"} <ArrowRight className="size-3.5" />
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
