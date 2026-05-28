import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { StoryHero } from "@/components/story/StoryHero";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <main className="flex-1">
      <StoryHero />

      {/* ============================================================
          WHAT WE DO SECTION — Four pillars
          ============================================================ */}
      <section className="py-24 bg-jibb-gradient-subtle wave-pattern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              {t("whatWeDo.sectionTitle")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("whatWeDo.sectionSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🚀",
                title: t("whatWeDo.marketEntry.title"),
                desc: t("whatWeDo.marketEntry.description"),
              },
              {
                icon: "🤝",
                title: t("whatWeDo.partnership.title"),
                desc: t("whatWeDo.partnership.description"),
              },
              {
                icon: "💡",
                title: t("whatWeDo.innovation.title"),
                desc: t("whatWeDo.innovation.description"),
              },
              {
                icon: "🌏",
                title: t("whatWeDo.diaspora.title"),
                desc: t("whatWeDo.diaspora.description"),
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="group bg-card rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-border/50 cursor-pointer"
              >
                <div className="text-4xl mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">{pillar.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {pillar.desc}
                </p>
                <div className="mt-6">
                  <span className="text-primary font-medium text-sm group-hover:text-accent transition-colors flex items-center gap-1.5">
                    <span>{t("whatWeDo.learnMore")}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTORS SECTION — Industry cards
          ============================================================ */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              {t("sectors.sectionTitle")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("sectors.sectionSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "⚡", label: t("sectors.semiconductor") },
              { icon: "🚗", label: t("sectors.ev") },
              { icon: "🏭", label: t("sectors.electronics") },
              { icon: "💊", label: t("sectors.pharma") },
              { icon: "☀️", label: t("sectors.renewable") },
              { icon: "🏗️", label: t("sectors.infrastructure") },
              { icon: "🧪", label: t("sectors.chemicals") },
              { icon: "🔬", label: t("sectors.emerging") },
            ].map((sector) => (
              <div
                key={sector.label}
                className="group bg-card rounded-xl p-6 text-center border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-115 group-hover:rotate-3">{sector.icon}</div>
                <div className="font-medium text-foreground text-sm group-hover:text-primary transition-colors duration-200">
                  {sector.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          INNOVATION HUB PREVIEW — Bento grid
          ============================================================ */}
      <section className="py-24 bg-jibb-gradient text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              {t("innovationHub.sectionTitle")}
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {t("innovationHub.sectionSubtitle")}
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Large card */}
            <div className="md:col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:-translate-y-1 hover:shadow-jibb-md group cursor-pointer">
              <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">🔬</div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-jibb-orange transition-colors">
                {t("innovationHub.labs.title")}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {t("innovationHub.labs.description")}
              </p>
            </div>
            {/* Small card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:-translate-y-1 hover:shadow-jibb-md group cursor-pointer">
              <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">🚀</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-jibb-orange transition-colors">
                {t("innovationHub.incubation.title")}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {t("innovationHub.incubation.description")}
              </p>
            </div>
            {/* Row of 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:-translate-y-1 hover:shadow-jibb-md group cursor-pointer">
              <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">📚</div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-jibb-orange transition-colors">
                {t("innovationHub.research.title")}
              </h3>
              <p className="text-white/70 text-sm">
                {t("innovationHub.research.description")}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:-translate-y-1 hover:shadow-jibb-md group cursor-pointer">
              <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">🌐</div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-jibb-orange transition-colors">
                {t("innovationHub.collaboration.title")}
              </h3>
              <p className="text-white/70 text-sm">
                {t("innovationHub.collaboration.description")}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:-translate-y-1 hover:shadow-jibb-md group cursor-pointer">
              <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">👥</div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-jibb-orange transition-colors">
                {t("innovationHub.ecosystem.title")}
              </h3>
              <p className="text-white/70 text-sm">
                {t("innovationHub.ecosystem.description")}
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/innovation-hub"
              className="inline-flex items-center justify-center px-8 py-4 bg-jibb-orange text-white font-semibold rounded-xl hover:bg-jibb-orange-dark transition-all duration-300 shadow-lg"
            >
              {t("innovationHub.cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          MEMBERSHIP PREVIEW
          ============================================================ */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              {t("membership.sectionTitle")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("membership.sectionSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { tier: t("membership.corporate"), recommended: true },
              { tier: t("membership.startup"), recommended: false },
              { tier: t("membership.institutional"), recommended: false },
              { tier: t("membership.government"), recommended: false },
              { tier: t("membership.individual"), recommended: false },
            ].map((plan) => (
              <div
                key={plan.tier}
                className={`relative rounded-2xl p-6 text-center border transition-all duration-300 hover:-translate-y-1 ${
                  plan.recommended
                    ? "bg-primary text-primary-foreground border-primary shadow-xl scale-105"
                    : "bg-card text-foreground border-border/50 hover:shadow-lg"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {t("membership.recommended")}
                  </div>
                )}
                <h3 className="text-lg font-bold mt-2">{plan.tier}</h3>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/membership"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg"
            >
              {t("membership.cta")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
