import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { StoryHero } from "@/components/story/StoryHero";
import { HowWeHelp } from "@/components/sections/HowWeHelp";
import { WhoWeAre } from "@/components/sections/WhoWeAre";
import { FeatOpportunities } from "@/components/sections/FeatOpportunities";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { StatCounter } from "@/components/sections/StatCounter";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { NewsRoom } from "@/components/sections/NewsRoom";
import { getAllPosts } from "@/lib/markdown";
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

  // Fetch Newsroom contents
  const blogPosts = await getAllPosts("blog", locale);
  const insightsPosts = await getAllPosts("insights", locale);
  const mediaPosts = [...blogPosts, ...insightsPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const caseStudies = await getAllPosts("case-studies", locale);
  const thoughtLeadership = await getAllPosts("thought-leadership", locale);

  return (
    <main className="flex-1">
      <StoryHero />

      {/* <LogoMarquee /> */}

      <WhoWeAre />

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

            {/* Bilateral Policy & CAGR Market Context Banner */}
            <div className="mt-8 max-w-4xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-jibb-orange/10 via-jibb-indigo/5 to-jibb-sakura/10 border border-border/40 backdrop-blur-sm text-left shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="space-y-2 flex-grow">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-jibb-orange/15 text-jibb-orange text-[10px] font-extrabold uppercase tracking-wider">
                  Strategic Frameworks
                </span>
                <h4 className="text-sm md:text-base font-extrabold text-foreground">
                  China+1 Strategy, Atmanirbhar India, &amp; Make in India
                </h4>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  India's semiconductor market is projected to reach <strong className="text-foreground font-bold">$100+ Billion by 2030</strong> with a <strong className="text-foreground font-bold">16% CAGR</strong>, while the automotive component industry has crossed <strong className="text-foreground font-bold">$51.5 Billion</strong>.
                </p>
              </div>
              <div className="flex md:flex-col gap-4 shrink-0 justify-center w-full md:w-auto text-center border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6">
                <div>
                  <div className="text-2xl font-black text-jibb-orange">$100B+</div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Semiconductors (2030)</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-jibb-indigo">16%</div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">Projected CAGR</div>
                </div>
              </div>
            </div>
          </div>

          <ScrollReveal staggerChildren={0.08} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Cpu, label: t("sectors.semiconductor"), bgImage: "/images/sectors/semiconductor.png" },
              { icon: Car, label: t("sectors.ev"), bgImage: "/images/sectors/ev.png" },
              { icon: Factory, label: t("sectors.electronics"), bgImage: "/images/sectors/manufacturing.png" },
              { icon: Pill, label: t("sectors.pharma"), bgImage: "/images/sectors/pharma.png" },
              { icon: Sun, label: t("sectors.renewable"), bgImage: "/images/sectors/renewable.png" },
              { icon: Building2, label: t("sectors.infrastructure"), bgImage: "/images/sectors/infrastructure.png" },
              { icon: FlaskConical, label: t("sectors.chemicals"), bgImage: "/images/sectors/chemicals.png" },
              { icon: Microscope, label: t("sectors.emerging"), bgImage: "/images/sectors/emerging.png" },
            ].map((sector) => {
              const Icon = sector.icon;
              return (
                <div
                  key={sector.label}
                  className="group relative bg-card dark:bg-[#161f38]/60 p-6 text-center border border-border/50 hover:border-primary/50 shadow-sm hover:shadow-jibb transition-all duration-500 hover:-translate-y-1 cursor-pointer overflow-hidden rounded-2xl"
                >
                  {/* Background Image that fades in on hover */}
                  <div 
                    className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-110 bg-cover bg-center"
                    style={{ backgroundImage: `url(${sector.bgImage})` }}
                  />
                  {/* Dark overlay to ensure text readability */}
                  <div className="absolute inset-0 z-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 mb-4 transition-all duration-500 group-hover:scale-110 flex justify-center p-3 rounded-xl bg-primary/5 group-hover:bg-white/20 w-fit mx-auto backdrop-blur-md border border-primary/10 group-hover:border-white/10 transition-colors">
                    <Icon className="size-6 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="relative z-10 font-bold text-foreground group-hover:text-white text-sm tracking-tight transition-colors duration-300">
                    {sector.label}
                  </div>
                </div>
              );
            })}
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
                colorClass: "border-jibb-indigo/40 bg-jibb-indigo/5",
                badge: "bg-jibb-indigo/15 dark:bg-jibb-indigo/30 text-jibb-indigo dark:text-jibb-indigo-light",
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
                className={`relative rounded-3xl p-6 text-left border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between min-h-[220px] ${plan.recommended
                  ? "bg-card text-foreground border-jibb-indigo dark:border-jibb-indigo shadow-lg scale-105 z-10"
                  : "bg-card text-foreground border-border/50 hover:shadow-lg backdrop-blur-sm"
                  } ${plan.colorClass}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-6 bg-jibb-indigo text-white text-[11px] uppercase font-bold tracking-wider px-3.5 py-1 rounded-full shadow-sm whitespace-nowrap">
                    Popular Choice
                  </div>
                )}
                <div className="space-y-3 flex-grow">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${plan.badge}`}>
                    {plan.tier}
                  </span>
                  <p className="text-sm text-muted-foreground mt-2 font-semibold">
                    {plan.desc}
                  </p>

                  <ul className="mt-4 space-y-2 text-xs text-muted-foreground border-t border-border/30 pt-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-1.5 font-medium">
                        <span className="text-jibb-indigo font-bold">✓</span> {feat}
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

      <NewsRoom 
        mediaPosts={mediaPosts}
        caseStudies={caseStudies}
        thoughtLeadership={thoughtLeadership}
      />
    </main>
  );
}
