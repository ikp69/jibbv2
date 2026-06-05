"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  const t = useTranslations();

  // Framer Motion staggered container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  } as const;

  // Fade up spring items
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 16,
      },
    },
  } as const;

  // Floating bubble options
  const floatTransition = (duration: number, delay: number = 0) => ({
    y: [0, -10, 0],
    transition: {
      duration,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    },
  });

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-jibb-gradient pt-20">
      {/* Wave pattern overlay — used here only, as a single textured band */}
      <div aria-hidden="true" className="absolute inset-0 wave-pattern opacity-15 pointer-events-none animate-wave-slide" />

      {/* Single premium glow — orange only, sakura removed to avoid blob overload */}
      <motion.div
        aria-hidden="true"
        className="absolute -top-40 right-[10%] w-[500px] h-[500px] bg-jibb-orange/10 rounded-full blur-[120px] pointer-events-none"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating geometric tech grids */}
      <div aria-hidden="true" className="absolute top-[20%] left-[45%] w-24 h-24 border border-white/5 rounded-2xl rotate-12 animate-pulse pointer-events-none hidden lg:block" />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[25%] right-[40%] w-36 h-36 border border-white/5 rounded-full pointer-events-none hidden lg:block"
        animate={floatTransition(6)}
      />

      <div className="section-container relative z-10 py-16 lg:py-24 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Headlines & Core Actions (Span 7) */}
        <motion.div
          className="lg:col-span-7 space-y-8 text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Bilateral Trust Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            variants={itemVariants}
          >
            {/* animate-soft-pulse replaces animate-ping — much softer */}
            <span className="flex h-2 w-2 rounded-full bg-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/90">
              {t("hero.badgeText")}
            </span>
          </motion.div>

          <motion.div className="space-y-4" variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              {t("hero.headline1")}
              <br />
              <span className="text-jibb-gradient-orange bg-clip-text text-transparent bg-gradient-to-r from-jibb-orange to-jibb-sakura">
                {t("hero.headline2")}
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-xl leading-relaxed">
              {t("hero.subtext")}
            </p>
          </motion.div>

          {/* Quick Metrics Row — upgraded with real stats and a source note */}
          <motion.div
            className="border-y border-white/10 py-6 max-w-lg space-y-3"
            variants={itemVariants}
          >
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="block text-2xl font-bold text-white">{t("hero.stat1Value")}</span>
                <span className="text-xs text-white/60 font-medium">{t("hero.stat1Label")}</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">{t("hero.stat2Value")}</span>
                <span className="text-xs text-white/60 font-medium">{t("hero.stat2Label")}</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">{t("hero.stat3Value")}</span>
                <span className="text-xs text-white/60 font-medium">{t("hero.stat3Label")}</span>
              </div>
            </div>
            <p className="text-[10px] text-white/35 font-medium tracking-wide uppercase">{t("hero.statNote")}</p>
          </motion.div>

          {/* CTAs */}
          <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
            <Link href="/membership">
              <Button
                variant="accent"
                size="xl"
                className="gap-2 font-semibold shadow-jibb-lg shadow-jibb-orange/20"
              >
                {t("hero.ctaJoin")}
                <ArrowRight className="size-5" />
              </Button>
            </Link>
            <Link href="/innovation-hub">
              <Button
                variant="glass"
                size="xl"
                className="gap-2 text-white border-white/20 hover:bg-white/15"
              >
                {t("hero.ctaExplore")}
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Side: Showcase Image Frame (Span 5) */}
        <motion.div
          className="lg:col-span-5 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.4 }}
        >
          <motion.div
            aria-hidden="true"
            className="relative w-full max-w-[420px] aspect-[4/5] rounded-2xl p-2 bg-gradient-to-br from-white/15 to-white/5 border border-white/10 backdrop-blur-md shadow-jibb-xl cursor-default"
            animate={floatTransition(7)}
          >
            {/* Absolute accent glows */}
            <div className="absolute -top-3 -left-3 size-12 bg-jibb-orange/20 rounded-full blur-md" />
            <div className="absolute -bottom-3 -right-3 size-12 bg-jibb-sakura/20 rounded-full blur-md" />

            <div className="relative w-full h-full overflow-hidden rounded-xl bg-primary/20">
              <Image
                src="/mascots.jpeg"
                alt="JIBB Bilateral Mascots & Innovation Ecosystem"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 420px"
                priority
              />
              {/* Subtle visual gradient bottom fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Float info tag overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-jibb-orange font-bold block">
                    {t("hero.imageBadge1")}
                  </span>
                  <span className="text-white text-xs font-semibold">
                    {t("hero.imageBadge2")}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-white/15 text-white">
                  <Sparkles className="size-3.5" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>

      {/* Bottom organic curve or border */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
