import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { Compass, Users, Handshake, Target, ArrowRight, Sparkles } from "lucide-react";
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
    title: `${t("approachPage.title")} — Japan India Business Bureau`,
    description: t("approachPage.subtitle"),
  };
}

export default async function OurApproachPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const steps = [
    {
      icon: <Users className="size-8 text-white" />,
      title: t("approachPage.connectTitle"),
      desc: t("approachPage.connectDesc"),
      color: "from-jibb-orange to-jibb-orange-light",
    },
    {
      icon: <Handshake className="size-8 text-white" />,
      title: t("approachPage.facilitateTitle"),
      desc: t("approachPage.facilitateDesc"),
      color: "from-jibb-indigo to-jibb-indigo-light",
    },
    {
      icon: <Target className="size-8 text-white" />,
      title: t("approachPage.enableTitle"),
      desc: t("approachPage.enableDesc"),
      color: "from-jibb-sakura to-jibb-sakura-light",
    },
  ];

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* Cinematic Banner */}
      <PageHero className="py-20 lg:py-28" bgText="METHOD">
        <div className="section-container relative z-10 text-left max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Compass className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              {t("approachPage.title")}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {t("approachPage.title")}
          </h1>
          
          <p className="text-sm md:text-base text-white/80 max-w-2xl leading-relaxed">
            {t("approachPage.subtitle")}
          </p>
        </div>
      </PageHero>

      {/* Intro Narrative */}
      <section className="py-16 md:py-24 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
            <div className="md:col-span-8 space-y-6 text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                {t("approachPage.introHeadline")}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("approachPage.introPara1")}
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("approachPage.introPara2")}
              </p>
            </div>

            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-full max-w-xs rounded-3xl p-6 bg-card border border-border/80 shadow-jibb flex flex-col gap-4 text-left overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-bold text-foreground tracking-tight uppercase flex items-center gap-1.5">
                  <Sparkles className="size-4 text-jibb-orange" /> JIBB Core Principles
                </h3>
                <ul className="space-y-3 text-xs text-muted-foreground font-semibold">
                  <li className="flex items-center gap-2">
                    <span className="text-jibb-orange font-bold text-base">✓</span> Bicultural Trust First
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-jibb-indigo font-bold text-base">✓</span> Actionable Localization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-jibb-orange font-bold text-base">✓</span> R&D Sandbox Access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-jibb-indigo font-bold text-base">✓</span> Regulatory Navigation
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step Roadmap */}
      <section className="py-20 md:py-28 bg-background">
        <div className="section-container max-w-5xl text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              {t("approachPage.roadmapTitle")}
            </h2>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Visual connector line for large screens */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border/40 -translate-y-1/2 hidden md:block z-0 pointer-events-none" />

            {steps.map((st, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl p-8 bg-card border border-border/80 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[280px] z-10"
              >
                <div className="space-y-5">
                  <div className={`p-4 rounded-2xl bg-gradient-to-tr ${st.color} inline-flex shadow-md transition-transform duration-300 group-hover:scale-105`}>
                    {st.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {st.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-jibb-gradient text-white relative overflow-hidden">
        <div className="section-container relative z-10 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {t("approachPage.ctaTitle")}
          </h2>
          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl mx-auto">
            {t("approachPage.ctaDesc")}
          </p>
          <div className="pt-4 flex justify-center">
            <Link href="/membership">
              <Button variant="accent" size="lg" className="font-bold gap-1.5 shadow-lg">
                {t("approachPage.ctaButton")} <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
