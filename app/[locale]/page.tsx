import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { StoryHero } from "@/components/story/StoryHero";
import { HowWeHelp } from "@/components/sections/HowWeHelp";
import { FeatOpportunities } from "@/components/sections/FeatOpportunities";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { StatCounter } from "@/components/sections/StatCounter";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import {
  Compass, Handshake, Lightbulb, Globe, Cpu, Car, Factory, Pill, Sun, Building2,
  FlaskConical, Microscope, BookOpen, Users, Rocket, Sparkles, ArrowRight, GraduationCap, Landmark
} from "lucide-react";

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

      {/* <LogoMarquee /> */}

      <HowWeHelp />

      {/* ============================================================
          WHAT WE DO SECTION — Four pillars
          ============================================================ */}
      <section className="py-24 bg-jibb-gradient-subtle border-b border-border/30 relative overflow-hidden">
        {/* Decorative elements */}
        <div aria-hidden="true" className="absolute top-0 right-0 w-96 h-96 bg-jibb-indigo/5 rounded-full blur-3xl pointer-events-none" />
        <div aria-hidden="true" className="absolute bottom-0 left-0 w-96 h-96 bg-jibb-orange/5 rounded-full blur-3xl pointer-events-none" />

        <div className="section-container relative z-10 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 backdrop-blur-md">
              <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary dark:text-primary-foreground">
                Core Offerings
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              {t("whatWeDo.sectionTitle")}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("whatWeDo.sectionSubtitle")}
            </p>
          </div>

          <ScrollReveal staggerChildren={0.15} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Compass className="size-7 text-jibb-orange dark:text-jibb-orange-light" />,
                title: t("whatWeDo.marketEntry.title"),
                desc: t("whatWeDo.marketEntry.description"),
                glowClass: "group-hover:bg-jibb-orange/10",
                iconBg: "bg-jibb-orange/10 dark:bg-jibb-orange/20",
              },
              {
                icon: <Handshake className="size-7 text-jibb-indigo dark:text-jibb-indigo-light" />,
                title: t("whatWeDo.partnership.title"),
                desc: t("whatWeDo.partnership.description"),
                glowClass: "group-hover:bg-jibb-indigo/10",
                iconBg: "bg-jibb-indigo/10 dark:bg-jibb-indigo/20",
              },
              {
                icon: <Lightbulb className="size-7 text-jibb-sakura dark:text-jibb-sakura-light" />,
                title: t("whatWeDo.innovation.title"),
                desc: t("whatWeDo.innovation.description"),
                glowClass: "group-hover:bg-jibb-sakura/10",
                iconBg: "bg-jibb-sakura/10 dark:bg-jibb-sakura/20",
              },
              {
                icon: <Globe className="size-7 text-jibb-orange dark:text-jibb-orange-light" />,
                title: t("whatWeDo.diaspora.title"),
                desc: t("whatWeDo.diaspora.description"),
                glowClass: "group-hover:bg-jibb-orange/10",
                iconBg: "bg-jibb-orange/10 dark:bg-jibb-orange/20",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="group relative bg-card dark:bg-card/45 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-jibb-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Hover glow */}
                <div aria-hidden="true" className={`absolute inset-0 rounded-3xl blur-3xl pointer-events-none transition-colors duration-300 opacity-0 group-hover:opacity-100 ${pillar.glowClass}`} />
                
                <div>
                  <div className={`mb-6 p-4 rounded-2xl ${pillar.iconBg} inline-flex transition-transform duration-300 group-hover:scale-110`}>
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {pillar.desc}
                  </p>
                </div>
                
                <div className="pt-2">
                  <span className="text-primary font-medium text-sm group-hover:text-accent transition-colors flex items-center gap-1.5 w-fit">
                    <span>{t("whatWeDo.learnMore")}</span>
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <FeatOpportunities />

      {/* <StatCounter /> */}

      {/* ============================================================
          SECTORS SECTION — Industry cards
          ============================================================ */}
      <section className="py-24 bg-jibb-cream/30 dark:bg-[#0b0f19] relative overflow-hidden">
        {/* Decorative background visual details */}
        <div aria-hidden="true" className="absolute inset-0 wave-pattern opacity-3 dark:opacity-2 pointer-events-none" />

        <div className="section-container relative z-10 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
             <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 backdrop-blur-md">
              <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary dark:text-primary-foreground">
                Target Industries
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              {t("sectors.sectionTitle")}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("sectors.sectionSubtitle")}
            </p>
          </div>

          <ScrollReveal staggerChildren={0.08} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Cpu className="size-6 text-primary" />, label: t("sectors.semiconductor") },
              { icon: <Car className="size-6 text-primary" />, label: t("sectors.ev") },
              { icon: <Factory className="size-6 text-primary" />, label: t("sectors.electronics") },
              { icon: <Pill className="size-6 text-primary" />, label: t("sectors.pharma") },
              { icon: <Sun className="size-6 text-primary" />, label: t("sectors.renewable") },
              { icon: <Building2 className="size-6 text-primary" />, label: t("sectors.infrastructure") },
              { icon: <FlaskConical className="size-6 text-primary" />, label: t("sectors.chemicals") },
              { icon: <Microscope className="size-6 text-primary" />, label: t("sectors.emerging") },
            ].map((sector) => (
              <div
                key={sector.label}
                className="group bg-card dark:bg-card/45 backdrop-blur-sm rounded-2xl p-6 text-center border border-border/50 hover:border-primary/30 shadow-sm hover:shadow-jibb transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110 flex justify-center p-3 rounded-xl bg-primary/5 dark:bg-primary/10 w-fit mx-auto">
                  {sector.icon}
                </div>
                <div className="font-bold text-foreground text-sm group-hover:text-primary tracking-tight transition-colors duration-200">
                  {sector.label}
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          INNOVATION HUB PREVIEW — Bento grid
          ============================================================ */}
      <section className="py-24 bg-jibb-cream/30 dark:bg-[#0b0f19] relative overflow-hidden border-t border-b border-border/10">
        {/* Glow overlays */}
        <div aria-hidden="true" className="absolute -bottom-40 -left-40 w-96 h-96 bg-jibb-orange/3 dark:bg-jibb-orange/2 rounded-full blur-3xl pointer-events-none" />
        <div aria-hidden="true" className="absolute top-20 -right-20 w-80 h-80 bg-jibb-indigo/3 dark:bg-jibb-indigo/20 rounded-full blur-3xl pointer-events-none" />

        <div className="section-container relative z-10 max-w-7xl mx-auto px-4">
          {/* Section Heading replaced from user image */}
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 backdrop-blur-md">
              <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
              <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary dark:text-primary-foreground">
                Strategic Alliance
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              The Visionary Strategic Bridge
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Integrating Industry, Experts, Academia, and Government to foster bilateral growth and innovation.
            </p>
          </div>

          {/* Bento Grid containing the 4 pillars with detailed descriptions */}
          <ScrollReveal staggerChildren={0.12} scale={0.96} className="grid md:grid-cols-3 gap-6">
            
            {/* Card 1: Industry (col-span-2) */}
            <div className="md:col-span-2 group relative rounded-3xl p-8 bg-card dark:bg-card/45 border border-border/50 hover:border-blue-500/20 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110 p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 inline-flex">
                <Building2 className="size-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-jibb-orange tracking-tight transition-colors">
                Industry Integration
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Bridging commercial markets through concrete technology transfer, active business matching, and training initiatives.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 text-xs text-foreground/80 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">✓</span> Technology transfer & matching
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">✓</span> Training & skill development
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">✓</span> Value chain integration
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500 font-bold">✓</span> Collaborated bilateral R&D
                </li>
              </ul>
            </div>
            
            {/* Card 2: Experts (col-span-1) */}
            <div className="group relative rounded-3xl p-8 bg-card dark:bg-card/45 border border-border/50 hover:border-orange-500/20 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110 p-4 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 inline-flex">
                <Compass className="size-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-jibb-orange tracking-tight transition-colors">
                Expert Landscaping
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                Guided market research, foresighting, and opportunity execution roadmaps.
              </p>
              <ul className="space-y-3 text-xs text-foreground/80 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> Innovation foresighting
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> Risk navigation & mitigation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">✓</span> Strategy execution roadmaps
                </li>
              </ul>
            </div>

            {/* Card 3: Academia (col-span-1) */}
            <div className="group relative rounded-3xl p-8 bg-card dark:bg-card/45 border border-border/50 hover:border-indigo-500/20 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110 p-4 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 inline-flex">
                <GraduationCap className="size-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-jibb-orange tracking-tight transition-colors">
                Academic Alliance
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                Developing cross-border human capital and collaborative research platforms.
              </p>
              <ul className="space-y-3 text-xs text-foreground/80 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500 font-bold">✓</span> Human capital development
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500 font-bold">✓</span> Japanese style training modules
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500 font-bold">✓</span> Startups incubation & support
                </li>
              </ul>
            </div>

            {/* Card 4: Government (col-span-2) */}
            <div className="md:col-span-2 group relative rounded-3xl p-8 bg-card dark:bg-card/45 border border-border/50 hover:border-emerald-500/20 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110 p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 inline-flex">
                <Landmark className="size-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-jibb-orange tracking-tight transition-colors">
                Government &amp; Policy
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Advocating framework implementation, thought leadership, delegation logistics, and compliance alignments.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 text-xs text-foreground/80 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> Policy framework & implementation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> Delegation & bilateral support
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> PLI navigation & compliance
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> Thought leadership & advocacy
                </li>
              </ul>
            </div>
            
          </ScrollReveal>

          <div className="text-center mt-12">
            <Link href="/innovation-hub">
              <button className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/95 hover:scale-105 active:scale-[0.98] transition-all shadow-xl text-sm flex items-center justify-center gap-2 mx-auto">
                <span>Explore Innovation Hub</span>
                <ArrowRight className="size-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <TestimonialCarousel />

      {/* ============================================================
          MEMBERSHIP PREVIEW
          ============================================================ */}
      <section className="py-24 bg-background relative overflow-hidden border-t border-border/30">
        <div aria-hidden="true" className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="section-container relative z-10 max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 backdrop-blur-md">
              <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary dark:text-primary-foreground">
                Join Us
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              {t("membership.sectionTitle")}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("membership.sectionSubtitle")}
            </p>
          </div>
          <ScrollReveal staggerChildren={0.08} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                tier: "Associate Member",
                desc: "Entry level network access",
                colorClass: "border-blue-500/20 hover:border-blue-500/30",
                badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
                recommended: false,
                features: [
                  "5% Business Matching",
                  "5% Training Programs",
                  "Standard Portal Access",
                ],
              },
              {
                tier: "Silver Member",
                desc: "Standard market growth",
                colorClass: "border-orange-500/20 hover:border-orange-500/30",
                badge: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
                recommended: false,
                features: [
                  "10% Business Matching",
                  "2.5% Exhibition Support",
                  "Newsletter Intelligence",
                ],
              },
              {
                tier: "Gold Member",
                desc: "Professional co-innovation",
                colorClass: "border-emerald-500/40 bg-emerald-500/5",
                badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
                recommended: true,
                features: [
                  "20% Business Matching",
                  "3 Free Training Programs",
                  "Japan Delegations Entry",
                ],
              },
              {
                tier: "Platinum Member",
                desc: "Ultimate advocacy & scale",
                colorClass: "border-slate-500/20 hover:border-slate-500/30",
                badge: "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
                recommended: false,
                features: [
                  "30% Business Matching",
                  "7 Free Training Programs",
                  "Full Intelligence Access",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.tier}
                className={`relative rounded-3xl p-6 text-left border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between min-h-[220px] ${
                  plan.recommended
                    ? "bg-card text-foreground border-emerald-500 dark:border-emerald-400 shadow-lg scale-105 z-10"
                    : "bg-card text-foreground border-border/50 hover:shadow-lg backdrop-blur-sm"
                } ${plan.colorClass}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-6 bg-emerald-500 text-white text-[9px] uppercase font-bold tracking-wider px-3.5 py-1 rounded-full shadow-sm whitespace-nowrap">
                    Popular Choice
                  </div>
                )}
                <div className="space-y-2 flex-grow">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${plan.badge}`}>
                    {plan.tier}
                  </span>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    {plan.desc}
                  </p>
                  
                  <ul className="mt-4 space-y-2 text-[11px] text-muted-foreground border-t border-border/30 pt-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-1.5">
                        <span className="text-emerald-500 font-bold">✓</span> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </ScrollReveal>

          <div className="text-center mt-12">
            <Link href="/membership">
              <button className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-[0.98] transition-all shadow-lg text-sm flex items-center justify-center gap-2 mx-auto">
                <span>{t("membership.cta")}</span>
                <ArrowRight className="size-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
