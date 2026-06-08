import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { Cpu, Car, Sun, Pill, Landmark, FlaskConical, Factory, Rocket, ArrowRight, Sparkles } from "lucide-react";
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
    title: `${t("sectorsPage.title")} — Japan India Business Bureau`,
    description: t("sectorsPage.subtitle"),
  };
}

export default async function SectorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const sectors = [
    {
      key: "semiconductor",
      icon: <Cpu className="size-7 text-white" />,
      color: "from-jibb-orange to-jibb-orange-light",
    },
    {
      key: "ev",
      icon: <Car className="size-7 text-white" />,
      color: "from-jibb-indigo to-jibb-indigo-light",
    },
    {
      key: "renewable",
      icon: <Sun className="size-7 text-white" />,
      color: "from-jibb-orange to-jibb-orange-light",
    },
    {
      key: "pharma",
      icon: <Pill className="size-7 text-white" />,
      color: "from-jibb-sakura to-jibb-sakura-light",
    },
    {
      key: "infrastructure",
      icon: <Landmark className="size-7 text-white" />,
      color: "from-jibb-indigo to-jibb-indigo-light",
    },
    {
      key: "chemicals",
      icon: <FlaskConical className="size-7 text-white" />,
      color: "from-jibb-sakura to-jibb-sakura-light",
    },
    {
      key: "electronics",
      icon: <Factory className="size-7 text-white" />,
      color: "from-jibb-orange to-jibb-orange-light",
    },
    {
      key: "emerging",
      icon: <Rocket className="size-7 text-white" />,
      color: "from-jibb-indigo to-jibb-indigo-light",
    },
  ];

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* Cinematic Banner */}
      <PageHero className="py-20 lg:py-28" bgText="SECTORS">
        <div className="section-container relative z-10 text-left max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Cpu className="size-3.5 text-jibb-orange" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              {t("sectorsPage.title")}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {t("sectorsPage.title")}
          </h1>
          
          <p className="text-sm md:text-base text-white/80 max-w-2xl leading-relaxed">
            {t("sectorsPage.subtitle")}
          </p>
        </div>
      </PageHero>

      {/* Bento-style Grid of Sectors */}
      <section className="py-20 md:py-28 bg-jibb-gradient-subtle">
        <div className="section-container max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sectors.map((sec) => (
              <div
                key={sec.key}
                className="group relative rounded-3xl bg-card border border-border/80 hover:border-primary/20 hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between min-h-[280px]"
              >
                <div className="space-y-4">
                  {/* Icon Panel */}
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${sec.color} inline-flex shadow-md transition-transform duration-300 group-hover:scale-105`}>
                    {sec.icon}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {t(`sectorsPage.details.${sec.key}.title`)}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t(`sectorsPage.details.${sec.key}.desc`)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    {t(`sectorsPage.details.${sec.key}.stat`)}
                  </span>
                  <Sparkles className="size-3.5 text-jibb-orange opacity-40 group-hover:opacity-100 transition-opacity" />
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
            {t("sectorsPage.ctaTitle")}
          </h2>
          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl mx-auto">
            {t("sectorsPage.ctaDesc")}
          </p>
          <div className="pt-4 flex justify-center">
            <Link href="/membership">
              <Button variant="accent" size="lg" className="font-bold gap-1.5 shadow-lg">
                {t("sectorsPage.ctaButton")} <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
