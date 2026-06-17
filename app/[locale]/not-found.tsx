"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/src/i18n/navigation";
import { motion } from "framer-motion";
import { Compass, ArrowLeft, Home, BookOpen, Users } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("notFound");
  const router = useRouter();

  return (
    <main className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 px-4 bg-background">
      {/* ------------------------------------------------------------
          AMBIENT GLOWING ORBS (Adapts perfectly to light/dark themes)
          ------------------------------------------------------------ */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 md:w-96 h-80 md:h-96 rounded-full bg-jibb-orange/10 dark:bg-jibb-orange/15 blur-[80px] md:blur-[120px] pointer-events-none transition-all duration-500" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 md:w-96 h-80 md:h-96 rounded-full bg-primary/10 dark:bg-primary/20 blur-[80px] md:blur-[120px] pointer-events-none transition-all duration-500" />

      {/* Grid Pattern overlay for technological feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-10"
        >
          {/* Centered Large Cinematic 404 Display */}
          <div className="relative inline-block select-none">
            <h2 className="text-8xl md:text-9xl font-extrabold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-jibb-orange via-jibb-sakura to-primary animate-[pulse_4s_ease-in-out_infinite] font-heading">
              404
            </h2>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-jibb-orange to-primary rounded-full blur-[1px]" />
          </div>

          <div className="space-y-4">
            {/* Localized error status tag */}
            <span className="inline-block text-xs font-bold tracking-widest text-jibb-orange bg-jibb-orange/10 dark:bg-jibb-orange/15 border border-jibb-orange/20 dark:border-jibb-orange/30 rounded-full px-4 py-1.5 uppercase shadow-jibb-orange-glow">
              {t("title")}
            </span>

            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight font-heading">
              {t("headline")}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg mx-auto">
              {t("description")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-accent hover:opacity-90 text-accent-foreground font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer">
                <Home className="size-5" />
                <span>{t("goHome")}</span>
              </button>
            </Link>

            <button 
              onClick={() => router.back()}
              className="w-full sm:w-auto px-8 py-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-xl border border-border transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="size-5" />
              <span>{t("backTrack")}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-4">
            <div className="absolute inset-0 flex items-center pointer-events-none">
              <div className="w-full border-t border-border/50" />
            </div>
            <span className="relative z-10 px-4 text-xs tracking-wider text-muted-foreground uppercase bg-background font-medium">
              {t("suggestedLinks")}
            </span>
          </div>

          {/* Suggested Links - Borderless underline hover style instead of cards */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm">
            {[
              {
                label: t("services"),
                href: "/services",
                icon: <Compass className="size-4 text-jibb-orange" />,
              },
              {
                label: t("innovationHub"),
                href: "/innovation-hub",
                icon: <BookOpen className="size-4 text-jibb-orange" />,
              },
              {
                label: t("membership"),
                href: "/membership",
                icon: <Users className="size-4 text-jibb-orange" />,
              },
            ].map((dest) => (
              <Link key={dest.href} href={dest.href} className="group flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors py-1 cursor-pointer">
                {dest.icon}
                <span className="font-semibold relative">
                  {dest.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
