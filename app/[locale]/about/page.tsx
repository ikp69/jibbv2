import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Parallax } from "@/components/ui/Parallax";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Timeline } from "@/components/sections/Timeline";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { AboutFAQ } from "@/components/sections/AboutFAQ";
import { PageHero } from "@/components/sections/PageHero";
import {
  Building2,
  Globe,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Lightbulb,
  Users,
  Eye,
  Target,
  ExternalLink,
  MapPin,
  Award,
  GraduationCap,
  Briefcase,
} from "lucide-react";

/* ============================================================
   LEADERSHIP DATA
   ============================================================ */
const LEADERSHIP = [
  {
    name: "Hitesh Kumar Sharma",
    role: "Founder & Director",
    location: "Tokyo, Japan",
    bio: "Visionary leader with deep expertise in Japan-India bilateral trade, industrial policy, and cross-border business development.",
    linkedin: "#",
    colorAccent: "jibb-indigo",
  },
  {
    name: "Takeshi Nakamura",
    role: "Co-Director, Japan Operations",
    location: "Tokyo, Japan",
    bio: "Seasoned industry strategist specializing in Japanese manufacturing ecosystems and international partnership facilitation.",
    linkedin: "#",
    colorAccent: "jibb-orange",
  },
  {
    name: "Priya Deshmukh",
    role: "Head of Innovation Hub",
    location: "Noida, India",
    bio: "Technology entrepreneur driving the Innovation Hub's R&D programs, startup incubation, and co-innovation projects across sectors.",
    linkedin: "#",
    colorAccent: "jibb-sakura",
  },
  {
    name: "Kenji Watanabe",
    role: "Head of Corporate Relations",
    location: "Tokyo, Japan",
    bio: "Expert in building sustainable business relationships between Japanese corporations and Indian enterprises across key sectors.",
    linkedin: "#",
    colorAccent: "jibb-indigo",
  },
];

const ADVISORS = [
  {
    name: "Dr. Arun Mehta",
    role: "Strategic Advisor",
    affiliation: "Former Secretary, DPIIT India",
    icon: Award,
  },
  {
    name: "Prof. Yuki Tanaka",
    role: "Academic Advisor",
    affiliation: "University of Tokyo",
    icon: GraduationCap,
  },
  {
    name: "Rajesh Gopinathan",
    role: "Industry Advisor",
    affiliation: "Ex-CEO, Major IT Services",
    icon: Briefcase,
  },
  {
    name: "Sachiko Yamamoto",
    role: "Policy Advisor",
    affiliation: "Former Director, METI Japan",
    icon: Globe,
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: "About Us — Japan India Business Bureau",
    description: t("description"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <main className="flex-1 bg-background text-foreground">
      {/* ============================================================
          HERO — "Who We Are"
          ============================================================ */}
      <PageHero className="py-24 lg:py-32">
        <div className="section-container relative z-10 text-center max-w-4xl space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              About JIBB
            </span>
          </div>

          <AnimatedHeading
            text="Empowering Innovation. Building Lasting Partnerships."
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
            immediate
          />

          <p className="text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
            The Japan India Business Bureau serves as a strategic bridge connecting
            businesses, governments, and startups across Japan and India — driving
            mutual growth and bilateral innovation.
          </p>

          <div className="flex justify-center gap-3 pt-4">
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-jibb-orange">
              Tokyo — Noida Axis
            </span>
            <div className="h-[2px] w-12 bg-jibb-orange/60 self-center" />
          </div>
        </div>
      </PageHero>

      {/* ============================================================
          OUR STORY — Intro narrative
          ============================================================ */}
      <section className="py-20 md:py-28 bg-jibb-gradient-subtle border-b border-border/30">
        <div className="section-container max-w-6xl">
          <div className="grid md:grid-cols-12 gap-10 lg:gap-16 items-center">
            <ScrollReveal
              direction="left"
              className="md:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md">
                <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary">
                  Our Story
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                A Strategic Bilateral Bridge
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Welcome to the Japan India Business Bureau (JIBB). We serve as a
                strategic bridge connecting businesses, governments, and startups
                across Japan and India. Our goal is to empower innovation and
                facilitate cross-border collaborations that drive mutual growth.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Navigating a new market involves unique cultural and regulatory
                landscapes. We understand these nuances. By bridging the gap between
                Japanese and Indian industries, we help you overcome barriers and
                connect seamlessly. Whether you want to expand your corporate
                footprint, find reliable manufacturing partners, or scale a new
                technology, we guide you through every step of the journey.
              </p>
            </ScrollReveal>

            <div className="md:col-span-5 flex justify-center">
              <Parallax speed={-0.1} className="w-full flex justify-center">
                {/* Glassmorphic Trust Card */}
                <div className="relative w-full max-w-sm rounded-2xl p-7 bg-card border border-border shadow-jibb-md flex flex-col gap-5 overflow-hidden">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/5 text-primary shrink-0">
                      <Building2 className="size-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-muted-foreground block uppercase tracking-wider">
                        Operational Presence
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        Dual Hubs — Two Ecosystems
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3.5 border-t border-border/50 pt-4 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-foreground/80">
                        Tokyo Headquarters
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-jibb-indigo/5 text-jibb-indigo border border-jibb-indigo/15 uppercase tracking-wide">
                        Japan
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-foreground/80">
                        Noida Operations Office
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-jibb-orange/5 text-jibb-orange border border-jibb-orange/15 uppercase tracking-wide">
                        India
                      </span>
                    </div>
                  </div>

                  {/* Stats snippet */}
                  <div className="grid grid-cols-2 gap-3 border-t border-border/50 pt-4">
                    <div className="text-center">
                      <span className="text-2xl font-black text-jibb-indigo block">
                        500+
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Members
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-black text-jibb-orange block">
                        $100M+
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Deals Facilitated
                      </span>
                    </div>
                  </div>
                </div>
              </Parallax>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TIMELINE — Our Journey
          ============================================================ */}
      <Timeline />

      {/* ============================================================
          VISION & MISSION — Split layout
          ============================================================ */}
      <section className="py-20 md:py-28 bg-background border-t border-border/20">
        <div className="section-container max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md mx-auto">
              <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary">
                Guiding Principles
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              Vision &amp; Mission
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Vision */}
            <ScrollReveal direction="left">
              <div className="group relative rounded-3xl p-8 md:p-10 bg-card border border-border/50 hover:border-jibb-indigo/30 hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-jibb-indigo/3 rounded-full blur-3xl pointer-events-none group-hover:bg-jibb-indigo/8 transition-colors duration-500" />
                <div className="relative z-10 space-y-5">
                  <div className="p-3 rounded-2xl bg-jibb-indigo/5 inline-flex">
                    <Eye className="size-7 text-jibb-indigo" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                    Our Vision
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    To create a collaborative future where Japan and India stand
                    together as global leaders in technology, industry, and
                    sustainable growth.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Mission */}
            <ScrollReveal direction="right">
              <div className="group relative rounded-3xl p-8 md:p-10 bg-card border border-border/50 hover:border-jibb-orange/30 hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-jibb-orange/3 rounded-full blur-3xl pointer-events-none group-hover:bg-jibb-orange/8 transition-colors duration-500" />
                <div className="relative z-10 space-y-5">
                  <div className="p-3 rounded-2xl bg-jibb-orange/5 inline-flex">
                    <Target className="size-7 text-jibb-orange" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                    Our Mission
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    To drive meaningful partnerships and industrial progress by
                    providing expert market entry support, fostering cross-border
                    collaboration, and delivering world-class innovation incubation
                    for businesses and governments.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Core beliefs grid */}
          <div className="mt-16">
            <h3 className="text-xl md:text-2xl font-bold text-foreground text-center mb-10 tracking-tight">
              What We Believe
            </h3>
            <ScrollReveal
              staggerChildren={0.12}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                {
                  icon: <ShieldCheck className="size-6 text-jibb-indigo" />,
                  title: "Trust & Shared Value",
                  desc: "Long-term partnerships built on mutual trust, transparency, and shared goals between two dynamic economies.",
                },
                {
                  icon: <Globe className="size-6 text-jibb-indigo" />,
                  title: "Bridging Cultures",
                  desc: "True collaboration goes beyond transactions — we foster deeper cultural understanding and alignment.",
                },
                {
                  icon: <Lightbulb className="size-6 text-jibb-indigo" />,
                  title: "Budding Innovation",
                  desc: "Innovation as a driver of growth, supporting ideas from inception and enabling them to scale globally.",
                },
                {
                  icon: <HeartHandshake className="size-6 text-jibb-indigo" />,
                  title: "Creating Real Impact",
                  desc: "Collaboration leading to sustainable development, stronger industries, and a shared economic future.",
                },
              ].map((pillar, i) => (
                <div
                  key={i}
                  className="group flex flex-col gap-4 p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div className="p-2.5 rounded-xl bg-primary/5 text-primary shrink-0 w-fit">
                    {pillar.icon}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-foreground tracking-tight">
                      {pillar.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          LEADERSHIP TEAM — Cards
          ============================================================ */}
      <section className="py-20 md:py-28 bg-jibb-gradient-subtle border-t border-border/20">
        <div className="section-container max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md mx-auto">
              <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary">
                The Team
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              Leadership Team
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Driving bilateral excellence with deep cross-border expertise and an
              unwavering commitment to partnership.
            </p>
          </div>

          <ScrollReveal
            staggerChildren={0.12}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {LEADERSHIP.map((person, i) => (
              <div
                key={i}
                className="group relative rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Color accent bar */}
                <div
                  className={`h-1.5 bg-${person.colorAccent} w-full`}
                />

                <div className="p-6 space-y-4">
                  {/* Avatar placeholder */}
                  <div className="size-16 rounded-2xl bg-primary/5 flex items-center justify-center">
                    <Users className="size-7 text-primary/40" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground tracking-tight">
                      {person.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {person.role}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" />
                    <span>{person.location}</span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {person.bio}
                  </p>

                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-jibb-orange transition-colors duration-200"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          ADVISORY BOARD — Cards
          ============================================================ */}
      <section className="py-20 md:py-28 bg-background border-t border-border/20">
        <div className="section-container max-w-5xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md mx-auto">
              <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary">
                Expert Guidance
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Advisory Board
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Distinguished leaders from government, academia, and industry guiding
              JIBB&apos;s strategic direction.
            </p>
          </div>

          <ScrollReveal
            staggerChildren={0.1}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {ADVISORS.map((advisor, i) => {
              const Icon = advisor.icon;
              return (
                <div
                  key={i}
                  className="group text-center p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className="size-14 mx-auto rounded-2xl bg-jibb-gradient flex items-center justify-center mb-4 group-hover:shadow-jibb transition-shadow duration-300">
                    <Icon className="size-6 text-white" />
                  </div>
                  <h4 className="text-base font-bold text-foreground mb-1">
                    {advisor.name}
                  </h4>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    {advisor.role}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {advisor.affiliation}
                  </p>
                </div>
              );
            })}
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================
          PARTNERS & SPONSORS — Logo Marquee
          ============================================================ */}
      <LogoMarquee />

      {/* ============================================================
          FAQ — Governance questions
          ============================================================ */}
      <AboutFAQ />

      {/* ============================================================
          CTA — Join the Bureau
          ============================================================ */}
      <section className="py-20 bg-jibb-gradient text-white relative overflow-hidden">
        <Parallax
          speed={0.15}
          className="absolute -bottom-40 -left-40 w-96 h-96 pointer-events-none"
        >
          <div
            aria-hidden="true"
            className="w-full h-full bg-jibb-orange/10 rounded-full blur-3xl"
          />
        </Parallax>
        <Parallax
          speed={-0.1}
          className="absolute -top-32 right-0 w-80 h-80 pointer-events-none"
        >
          <div
            aria-hidden="true"
            className="w-full h-full bg-jibb-sakura/8 rounded-full blur-3xl"
          />
        </Parallax>

        <div className="section-container relative z-10 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold">
            Join the Bureau
          </h2>
          <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xl mx-auto">
            Expand your reach and innovate without borders. Partner with JIBB to
            access exclusive industry insights, dedicated support, and a powerful
            cross-cultural network.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <Link href="/membership">
              <AnimatedButton
                variant="accent"
                size="lg"
                className="w-full sm:w-auto font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <span>Become a Member</span>
                <ArrowRight className="size-4" />
              </AnimatedButton>
            </Link>
            <Link href="/contact">
              <AnimatedButton
                variant="glass"
                size="lg"
                className="w-full sm:w-auto font-semibold"
              >
                <span>Contact Us</span>
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
