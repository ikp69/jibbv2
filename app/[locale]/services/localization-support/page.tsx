import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { Globe, ArrowLeft, ArrowRight, ShieldCheck, Compass, Lightbulb, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: "Localization Support",
    description: t("description"),
  };
}

export default async function LocalizationSupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const steps = [
    {
      num: "01",
      title: t("servicesPage.localization.step1Title"),
      desc: t("servicesPage.localization.step1Desc"),
    },
    {
      num: "02",
      title: t("servicesPage.localization.step2Title"),
      desc: t("servicesPage.localization.step2Desc"),
    },
    {
      num: "03",
      title: t("servicesPage.localization.step3Title"),
      desc: t("servicesPage.localization.step3Desc"),
    },
  ];

  return (
    <main className="flex-1 bg-background text-foreground animate-in fade-in duration-300">
      {/* ============================================================
          CINEMATIC BANNER
          ============================================================ */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-jibb-gradient">
        {/* Wave pattern overlay */}
        <div aria-hidden="true" className="absolute inset-0 wave-pattern opacity-10 pointer-events-none animate-wave-slide" />
        
        {/* Ambient Glow */}
        <div aria-hidden="true" className="absolute -top-40 left-[15%] w-[450px] h-[450px] bg-jibb-orange/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="section-container relative z-10 text-left max-w-4xl space-y-6">
          <Link href="/services" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-jibb-orange hover:text-white transition-colors select-none">
            <ArrowLeft className="size-3.5" /> {t("common.back")} {t("nav.services")}
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {t("servicesPage.localization.title")}
          </h1>
          
          <p className="text-sm md:text-base text-white/80 max-w-2xl leading-relaxed">
            {t("servicesPage.localization.subtitle")}
          </p>
        </div>
      </section>

      {/* ============================================================
          DETAILED COPY SECTION
          ============================================================ */}
      <section className="py-16 md:py-24 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
            <div className="md:col-span-8 space-y-6 text-left">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Bridging Cultural Working Divides
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("servicesPage.localization.para1")}
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("servicesPage.localization.para2")}
              </p>
            </div>

            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-full max-w-xs rounded-2xl p-6 bg-card border border-border shadow-jibb flex flex-col gap-4 text-left overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-bold text-foreground tracking-tight uppercase">Support Capabilities</h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> Technical Spec Translations</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> Bilateral Cultural Workshops</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> Local Marketing and Brand Assets</li>
                  <li className="flex items-center gap-1.5"><span className="text-jibb-orange font-bold">•</span> Localized Media and PR relations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          STEP-BY-STEP SERVICE PATHWAY
          ============================================================ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="section-container max-w-5xl text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Localization Deliverables
            </h2>
            <div className="h-1 w-12 bg-jibb-orange/60 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((st) => (
              <div key={st.num} className="group relative rounded-2xl p-8 bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between min-h-[220px]">
                <div className="absolute top-4 right-6 text-4xl font-extrabold text-primary/5 group-hover:text-primary/10 select-none tracking-wider">
                  {st.num}
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                    {st.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA BANNER
          ============================================================ */}
      <section className="py-16 bg-jibb-gradient text-white relative overflow-hidden">
        <div aria-hidden="true" className="absolute -bottom-40 -left-40 w-96 h-96 bg-jibb-orange/10 rounded-full blur-3xl" />
        <div className="section-container relative z-10 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Align Your Teams and Products
          </h2>
          <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xl mx-auto">
            Become a corporate member today to unlock expert language alignments, professional technical translations, and local branding resources.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link href="/membership">
              <Button variant="accent" size="lg" className="w-full sm:w-auto font-bold gap-1.5 shadow-lg">
                {t("membership.cta")} <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold bg-white/10 border-white/20 hover:bg-white/15 text-white">
                Contact Advisory
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
