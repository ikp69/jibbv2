import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { Trophy, ArrowLeft, ArrowRight, Sparkles, Clock, Zap, Target, Users, Award, Rocket } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: `${t("hubMenu.challenges")} — JIBB Innovation Hub`,
    description: t("hubMenu.challengesDesc"),
  };
}

export default async function InnovationChallengesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const challenges = [
    {
      icon: <Zap className="size-6 text-white" />,
      title: t("challengesPage.c1Title"),
      desc: t("challengesPage.c1Desc"),
      color: "from-jibb-orange to-jibb-orange-light",
      prize: "¥5,000,000",
      deadline: "2026-09-30",
      status: "Open",
    },
    {
      icon: <Target className="size-6 text-white" />,
      title: t("challengesPage.c2Title"),
      desc: t("challengesPage.c2Desc"),
      color: "from-jibb-indigo to-jibb-indigo-light",
      prize: "¥3,000,000",
      deadline: "2026-11-15",
      status: "Open",
    },
  ];

  const benefits = [
    {
      icon: <Award className="size-5 text-jibb-orange" />,
      title: locale === "ja" ? "賞金" : "Cash Prizes",
      desc: locale === "ja"
        ? "各チャレンジのトップチームに最大¥5,000,000の賞金を授与"
        : "Up to ¥5,000,000 awarded to top teams in each challenge",
    },
    {
      icon: <Rocket className="size-5 text-jibb-orange" />,
      title: locale === "ja" ? "インキュベーション優先参加" : "Fast-Track Incubation",
      desc: locale === "ja"
        ? "受賞チームはJIBBインキュベーションプログラムへの優先エントリー権を獲得"
        : "Winners receive priority entry into JIBB's Startup Incubation program",
    },
    {
      icon: <Users className="size-5 text-jibb-orange" />,
      title: locale === "ja" ? "スポンサー企業PoC機会" : "Sponsor PoC Access",
      desc: locale === "ja"
        ? "主催企業との直接的な概念実証（PoC）プロジェクト参画機会"
        : "Direct proof-of-concept project opportunities with sponsoring corporations",
    },
  ];

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* Cinematic Banner */}
      <PageHero className="py-20 lg:py-28" bgText="CHALLENGES">
        <div className="section-container relative z-10 text-left max-w-4xl space-y-6">
          <Link href="/innovation-hub" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-jibb-orange hover:text-white transition-colors select-none">
            <ArrowLeft className="size-3.5" /> {t("common.back")} {t("nav.innovationHub")}
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {t("hubMenu.challenges")}
          </h1>
          
          <p className="text-sm md:text-base text-white/80 max-w-2xl leading-relaxed">
            {t("hubMenu.challengesDesc")}
          </p>
        </div>
      </PageHero>

      {/* Detail Copy Section */}
      <section className="py-16 md:py-24 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
            <div className="md:col-span-8 space-y-6 text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                {t("challengesPage.headline")}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("challengesPage.para1")}
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("challengesPage.para2")}
              </p>
            </div>

            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-full max-w-xs rounded-3xl p-6 bg-card border border-border/80 shadow-jibb flex flex-col gap-4 text-left overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-bold text-foreground tracking-tight uppercase flex items-center gap-1"><Trophy className="size-4 text-primary" /> {locale === "ja" ? "チャレンジ概要" : "Challenge Specs"}</h3>
                <ul className="space-y-2 text-xs text-muted-foreground font-semibold">
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> {locale === "ja" ? "技術課題ハックアソン" : "Tech Problem Hackathons"}</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-indigo font-bold">•</span> {locale === "ja" ? "企業スポンサード" : "Corporate Sponsored"}</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-sakura font-bold">•</span> {locale === "ja" ? "賞金 + PoC機会" : "Cash Prizes + PoC Access"}</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> {locale === "ja" ? "ラボクレジット付与" : "Lab Credits Included"}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Winner Benefits */}
      <section className="py-16 bg-card border-b border-border/30">
        <div className="section-container max-w-5xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              {locale === "ja" ? "受賞者特典" : "Winner Benefits"}
            </h2>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="group rounded-2xl p-6 bg-background border border-border/70 hover:border-primary/20 hover:shadow-lg transition-all duration-300 text-left space-y-3"
              >
                <div className="p-2.5 rounded-xl bg-primary/5 inline-flex">
                  {b.icon}
                </div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                  {b.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Challenges Grid */}
      <section className="py-20 bg-background">
        <div className="section-container max-w-5xl text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              {t("challengesPage.activeTitle")}
            </h2>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {challenges.map((c, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl p-8 bg-card border border-border/85 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[280px]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-tr ${c.color} inline-flex shadow-md transition-transform duration-300 group-hover:scale-105`}>
                      {c.icon}
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      {c.status}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {c.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/40 mt-4 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1"><Award className="size-3.5 text-jibb-orange" /> {c.prize}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3.5 text-jibb-indigo" /> {c.deadline}</span>
                  </div>
                  <Sparkles className="size-4 text-jibb-orange opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-jibb-gradient text-white relative overflow-hidden">
        <div className="section-container relative z-10 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {locale === "ja" ? "チャレンジに参加しませんか？" : "Ready to Take on a Challenge?"}
          </h2>
          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl mx-auto">
            {locale === "ja"
              ? "チームを結成して、日印の最先端技術課題に挑戦しましょう。お問い合わせフォームからエントリーを開始してください。"
              : "Assemble your team and tackle critical bilateral technology problems. Contact us to begin your entry."}
          </p>
          <div className="pt-4 flex justify-center">
            <Link href="/contact">
              <Button variant="accent" size="lg" className="font-bold gap-1.5 shadow-lg">
                {locale === "ja" ? "エントリーする" : "Submit Entry"} <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
