import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { Lightbulb, ArrowLeft, Building2, Users, DollarSign, Sparkles, ArrowRight } from "lucide-react";
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
    title: `${t("hubMenu.incubation")} — JIBB Innovation Hub`,
    description: t("hubMenu.incubationDesc"),
  };
}

export default async function StartupIncubationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const benefits = [
    {
      icon: <Building2 className="size-6 text-white" />,
      title: t("incubationPage.b1Title"),
      desc: t("incubationPage.b1Desc"),
      color: "from-jibb-orange to-jibb-orange-light",
    },
    {
      icon: <Users className="size-6 text-white" />,
      title: t("incubationPage.b2Title"),
      desc: t("incubationPage.b2Desc"),
      color: "from-jibb-indigo to-jibb-indigo-light",
    },
    {
      icon: <DollarSign className="size-6 text-white" />,
      title: t("incubationPage.b3Title"),
      desc: t("incubationPage.b3Desc"),
      color: "from-jibb-sakura to-jibb-sakura-light",
    },
  ];

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* Cinematic Banner */}
      <PageHero className="py-20 lg:py-28" bgText="INCUBATE">
        <div className="section-container relative z-10 text-left max-w-4xl space-y-6">
          <Link href="/innovation-hub" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-jibb-orange hover:text-white transition-colors select-none">
            <ArrowLeft className="size-3.5" /> {t("common.back")} {t("nav.innovationHub")}
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {t("hubMenu.incubation")}
          </h1>
          
          <p className="text-sm md:text-base text-white/80 max-w-2xl leading-relaxed">
            {t("hubMenu.incubationDesc")}
          </p>
        </div>
      </PageHero>

      {/* Detail Copy Section */}
      <section className="py-16 md:py-24 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
            <div className="md:col-span-8 space-y-6 text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                {t("incubationPage.headline")}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("incubationPage.para1")}
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("incubationPage.para2")}
              </p>
            </div>

            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-full max-w-xs rounded-3xl p-6 bg-card border border-border/80 shadow-jibb flex flex-col gap-4 text-left overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-bold text-foreground tracking-tight uppercase">Incubation Track</h3>
                <ul className="space-y-2 text-xs text-muted-foreground font-semibold">
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> Noida &amp; Tokyo Hotdesks</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-indigo font-bold">•</span> ₹850 Cr+ Direct VC Dealflow</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-sakura font-bold">•</span> Bicultural Mentor Swaps</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> Fast-Track IP Filing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-background">
        <div className="section-container max-w-5xl text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              {t("incubationPage.programTitle")}
            </h2>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl p-8 bg-card border border-border/85 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between min-h-[260px]"
              >
                <div className="space-y-5">
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${b.color} inline-flex shadow-md transition-transform duration-300 group-hover:scale-105`}>
                    {b.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {b.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/40 mt-4 flex items-center justify-between text-xs font-semibold text-primary/75">
                  <span>Incubation Benefit</span>
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
            Ready to Accelerate Your Startup?
          </h2>
          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl mx-auto">
            Apply to the JIBB Incubation program to gain physical co-working desks, venture capital access, and strategic mentorship.
          </p>
          <div className="pt-4 flex justify-center">
            <Link href="/membership">
              <Button variant="accent" size="lg" className="font-bold gap-1.5 shadow-lg">
                Apply for Incubation <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
