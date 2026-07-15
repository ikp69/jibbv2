"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Link } from "@/src/i18n/navigation";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import {
  ArrowRight,
  Monitor,
  FolderClosed,
  BrainCircuit,
  Landmark,
  Briefcase,
  Compass,
  Building2,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

// Interactive Service Card with Hover-Expand & Giant Background Icon
function ServiceCard({
  title,
  countText,
  items,
  icon: Icon,
  bgIcon: BgIcon,
  themeColor, // "orange" | "indigo" | "sakura"
}: {
  title: string;
  countText: string;
  items: string[];
  icon: React.ComponentType<any>;
  bgIcon: React.ComponentType<any>;
  themeColor: "orange" | "indigo" | "sakura";
}) {
  const [isHovered, setIsHovered] = useState(false);

  const themeClasses = {
    orange: {
      borderHover: "hover:border-jibb-orange/40",
      iconBg: "bg-jibb-orange/10 text-jibb-orange",
      iconHoverBg: "bg-jibb-orange text-white",
      bulletIcon: "text-jibb-orange",
      glow: "shadow-jibb-orange-glow/10"
    },
    indigo: {
      borderHover: "hover:border-jibb-indigo/40",
      iconBg: "bg-jibb-indigo/10 text-jibb-indigo dark:text-jibb-indigo-light",
      iconHoverBg: "bg-jibb-indigo dark:bg-jibb-indigo-light text-white dark:text-primary-foreground",
      bulletIcon: "text-jibb-indigo dark:text-jibb-indigo-light",
      glow: "shadow-jibb-glow/10"
    },
    sakura: {
      borderHover: "hover:border-jibb-sakura/40",
      iconBg: "bg-jibb-sakura/10 text-jibb-sakura",
      iconHoverBg: "bg-jibb-sakura text-white",
      bulletIcon: "text-jibb-sakura",
      glow: "shadow-jibb-sakura-glow/10"
    }
  }[themeColor];

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "bg-card/70 dark:bg-card/25 border border-border/40 p-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-jibb cursor-pointer w-full relative overflow-hidden backdrop-blur-md",
        themeClasses.borderHover,
        isHovered && themeClasses.glow
      )}
    >
      {/* Giant faint background icon in top-right */}
      <div className="absolute -top-6 -right-6 pointer-events-none opacity-[0.03] dark:opacity-[0.05] transition-transform duration-700 select-none">
        <BgIcon className={cn("size-28", isHovered && "rotate-6 scale-110")} />
      </div>

      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          {/* Animated Icon Container */}
          <div
            className={cn(
              "p-3 rounded-xl transition-all duration-300 shrink-0",
              isHovered ? themeClasses.iconHoverBg : themeClasses.iconBg
            )}
          >
            <Icon className="size-5.5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-foreground tracking-tight">
              {title}
            </h3>
            <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
              {countText}
            </p>
          </div>
        </div>

        {/* Chevron status indicator */}
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground/60 transition-transform duration-300",
            isHovered && "rotate-180 text-foreground"
          )}
        />
      </div>

      {/* Expandable list content */}
      <AnimatePresence initial={false}>
        {isHovered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden relative z-10"
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-5 pl-[48px]">
              {items.map((item: string) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-semibold bg-secondary/30 hover:bg-secondary/50 dark:bg-secondary/10 dark:hover:bg-secondary/20 px-2.5 py-1 rounded-lg transition-colors duration-200"
                >
                  <CheckCircle2 className={cn("size-3.5 shrink-0", themeClasses.bulletIcon)} />
                  <span className="truncate">{item}</span>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function WhoWeAre() {
  const t = useTranslations("whoWeAre");

  // Type-safe translation arrays
  const consultingItems = t.raw("consultingItems") || [];
  const marketEntryItems = t.raw("marketEntryItems") || [];
  const backOfficeItems = t.raw("backOfficeItems") || [];

  return (
    <section id="who-we-are" className="py-16 md:py-24 lg:py-28 bg-background relative overflow-hidden border-b border-border/20">

      {/* Background visual decorations & grid layer */}
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(36,59,107,0.07)_0%,transparent_70%)] pointer-events-none z-0" />
      <div aria-hidden="true" className="absolute top-0 right-0 w-96 h-96 bg-jibb-orange/3 dark:bg-jibb-orange/2 rounded-full blur-3xl pointer-events-none z-0" />
      <div aria-hidden="true" className="absolute inset-0 wave-pattern opacity-1.5 dark:opacity-1 pointer-events-none z-0" />

      <div className="section-container relative z-10 max-w-7xl">

        {/* 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Interactive Service Pillars */}
          <div className="lg:col-span-6 space-y-8">
            {/* Header Section (Left Aligned) */}
            <div className="text-left space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 backdrop-blur-md">
                <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary dark:text-primary-foreground">
                  {t("tagline") || "About JIBB"}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
                {t("sectionTitle") || "Who We Are"}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("aboutUsDesc") || "JIBB serve as a strategic bridge connecting businesses, governments, and startups across Japan and India. Our goal is to empower innovation and facilitate cross-border collaborations that drive mutual growth."}
              </p>
            </div>

            <div className="space-y-5">
              <ServiceCard
                title={t("consultingTitle") || "Consulting Services"}
                countText={t("consultingCount") || "6 Strategic Offerings"}
                items={consultingItems}
                icon={Briefcase}
                bgIcon={Briefcase}
                themeColor="orange"
              />
              <ServiceCard
                title={t("marketEntryTitle") || "Market Entry & Expansion"}
                countText={t("marketEntryCount") || "6 Growth Offerings"}
                items={marketEntryItems}
                icon={Compass}
                bgIcon={Compass}
                themeColor="indigo"
              />
              <ServiceCard
                title={t("backOfficeTitle") || "Back Office Support"}
                countText={t("backOfficeCount") || "7 Support Offerings"}
                items={backOfficeItems}
                icon={Building2}
                bgIcon={Building2}
                themeColor="sakura"
              />
            </div>
          </div>

          {/* Right Column: Living Ecosystem Visualization */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-0 md:min-h-[580px]">

            {/* Animated SVG Path Connection Lines (Desktop Only) */}
            <div className="absolute inset-0 hidden md:block pointer-events-none select-none z-0">
              <svg className="w-full h-full stroke-primary/25 dark:stroke-primary/40 fill-none" viewBox="0 0 500 500">
                {/* Dash array paths animating flows to represent active exchange */}
                <motion.path
                  d="M 120 120 Q 200 180 250 250"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                  animate={{ strokeDashoffset: [0, -36] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 2.5 }}
                />
                <motion.path
                  d="M 380 120 Q 300 180 250 250"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                  animate={{ strokeDashoffset: [0, -36] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 2.5 }}
                />
                <motion.path
                  d="M 120 380 Q 200 320 250 250"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                  animate={{ strokeDashoffset: [0, 36] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 2.5 }}
                />
                <motion.path
                  d="M 380 380 Q 300 320 250 250"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                  animate={{ strokeDashoffset: [0, 36] }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 2.5 }}
                />
              </svg>
            </div>

            {/* Country Maps Visualizations (India & Japan Outlines in background) */}
            <div className="absolute inset-0 pointer-events-none select-none hidden md:block z-0 opacity-20 dark:opacity-15">
              {/* India Map (Left Side) */}
              <motion.div
                className="absolute left-[1%] top-[18%] w-[220px] h-[360px]"
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
              >
                <img
                  src="/india.svg"
                  alt="India Map"
                  className="w-full h-full object-contain filter dark:invert contrast-[0.85] opacity-50 dark:opacity-70 transition-all duration-300 drop-shadow-[0_0_20px_rgba(249,115,22,0.08)]"
                />
              </motion.div>

              {/* Japan Map (Right Side) */}
              <motion.div
                className="absolute right-[5%] top-[18%] w-[220px] h-[360px]"
                animate={{
                  y: [0, 6, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6.5,
                  ease: "easeInOut",
                }}
              >
                <img
                  src="/japan.svg"
                  alt="Japan Map"
                  className="w-full h-full object-contain filter dark:invert contrast-[0.85] opacity-50 dark:opacity-70 transition-all duration-300 drop-shadow-[0_0_20px_rgba(99,102,241,0.08)]"
                />
              </motion.div>
            </div>

            {/* Center Logo Ball (Enlarged centerpiece with glow ring and rotating gradient border) */}
            <div className="hidden md:flex absolute z-20 items-center justify-center">
              {/* Rotating outer gradient border */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="absolute w-[170px] h-[170px] md:w-[210px] md:h-[210px] rounded-full border border-dashed border-primary/20 bg-gradient-to-tr from-jibb-indigo/10 via-jibb-orange/10 to-jibb-sakura/10"
              />
              {/* Pulsing inner glow ring */}
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="absolute w-[150px] h-[150px] md:w-[185px] md:h-[185px] rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10"
              />
              {/* Core logo ball */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="relative w-36 h-36 md:w-40 md:h-40 rounded-full bg-[#01109f] dark:bg-card border border-border/80 shadow-jibb-xl flex items-center justify-center p-5 cursor-pointer transition-all duration-300"
              >
                <img
                  src="/japan_india_business_bureau_logo.jpg"
                  alt="JIBB NPO Logo"
                  className="w-full h-auto object-contain rounded-2xl"
                />
              </motion.div>
            </div>

            {/* Desktop Layout of Floating Corners (Floating dynamically) */}
            <div className="absolute inset-0 hidden md:flex items-center justify-center select-none z-10 pointer-events-none">

              {/* Top-Left Card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                className="absolute top-[5%] left-[0%] flex items-center gap-3.5 bg-card/90 dark:bg-card/75 backdrop-blur-md p-4 rounded-2xl border border-border/50 shadow-jibb-md max-w-[220px] pointer-events-auto hover:scale-105 hover:rotate-1 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-jibb-indigo/10 text-jibb-indigo dark:text-jibb-indigo-light shrink-0">
                  <Monitor className="size-6" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-foreground leading-none">
                    <AnimatedCounter value={20} suffix="+" className="text-xl font-extrabold text-foreground leading-none" />
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground mt-1.5 leading-snug">{t("expLabel") || "Years of Cross-Border Experience"}</div>
                </div>
              </motion.div>

              {/* Top-Right Card */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute top-[5%] right-[0%] flex items-center gap-3.5 bg-card/90 dark:bg-card/75 backdrop-blur-md p-4 rounded-2xl border border-border/50 shadow-jibb-md max-w-[220px] pointer-events-auto hover:scale-105 hover:-rotate-1 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-jibb-orange/10 text-jibb-orange shrink-0">
                  <FolderClosed className="size-6" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-foreground leading-none">
                    <AnimatedCounter value={100} suffix="+" className="text-xl font-extrabold text-foreground leading-none" />
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground mt-1.5 leading-snug">{t("dealsLabel") || "Facilitated Business Deals"}</div>
                </div>
              </motion.div>

              {/* Bottom-Left Card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
                className="absolute bottom-[5%] left-[0%] flex items-center gap-3.5 bg-card/90 dark:bg-card/75 backdrop-blur-md p-4 rounded-2xl border border-border/50 shadow-jibb-md max-w-[220px] pointer-events-auto hover:scale-105 hover:-rotate-1 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-jibb-sakura/10 text-jibb-sakura shrink-0">
                  <BrainCircuit className="size-6" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-foreground leading-none">
                    <AnimatedCounter value={50} suffix="+" className="text-xl font-extrabold text-foreground leading-none" />
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground mt-1.5 leading-snug">{t("teamLabel") || "On Ground Industry Experts"}</div>
                </div>
              </motion.div>

              {/* Bottom-Right Card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
                className="absolute bottom-[5%] right-[0%] flex items-center gap-3.5 bg-card/90 dark:bg-card/75 backdrop-blur-md p-4 rounded-2xl border border-border/50 shadow-jibb-md max-w-[220px] pointer-events-auto hover:scale-105 hover:rotate-1 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-jibb-orange/10 text-jibb-orange shrink-0">
                  <Landmark className="size-6" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-foreground leading-none">
                    <AnimatedCounter value={30} suffix="+" className="text-xl font-extrabold text-foreground leading-none" />
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground mt-1.5 leading-snug">{t("partnershipsLabel") || "Strategic Government Partnerships"}</div>
                </div>
              </motion.div>
            </div>

            {/* Mobile/Tablet Fallback Stacking Grid with Centered Logo */}
            <div className="md:hidden relative w-full mt-10">
              <div className="grid grid-cols-2 gap-x-4 gap-y-14 w-full">
                {/* Stat 1 */}
                <div className="bg-card dark:bg-card/45 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col gap-2 items-center text-center">
                  <div className="p-2.5 rounded-xl bg-jibb-indigo/10 text-jibb-indigo dark:text-jibb-indigo-light">
                    <Monitor className="size-5" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-foreground">
                      <AnimatedCounter value={20} suffix="+" className="text-lg font-extrabold text-foreground" />
                    </div>
                    <div className="text-[10px] font-semibold text-muted-foreground leading-tight mt-0.5">{t("expLabel") || "Cross-Border Exp."}</div>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-card dark:bg-card/45 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col gap-2 items-center text-center">
                  <div className="p-2.5 rounded-xl bg-jibb-orange/10 text-jibb-orange">
                    <FolderClosed className="size-5" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-foreground">
                      <AnimatedCounter value={100} suffix="+" className="text-lg font-extrabold text-foreground" />
                    </div>
                    <div className="text-[10px] font-semibold text-muted-foreground leading-tight mt-0.5">{t("dealsLabel") || "Business Deals"}</div>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-card dark:bg-card/45 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col gap-2 items-center text-center">
                  <div className="p-2.5 rounded-xl bg-jibb-sakura/10 text-jibb-sakura">
                    <BrainCircuit className="size-5" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-foreground">
                      <AnimatedCounter value={50} suffix="+" className="text-lg font-extrabold text-foreground" />
                    </div>
                    <div className="text-[10px] font-semibold text-muted-foreground leading-tight mt-0.5">{t("teamLabel") || "Industry Experts"}</div>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="bg-card dark:bg-card/45 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col gap-2 items-center text-center">
                  <div className="p-2.5 rounded-xl bg-jibb-orange/10 text-jibb-orange">
                    <Landmark className="size-5" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-foreground">
                      <AnimatedCounter value={30} suffix="+" className="text-lg font-extrabold text-foreground" />
                    </div>
                    <div className="text-[10px] font-semibold text-muted-foreground leading-tight mt-0.5">{t("partnershipsLabel") || "Gov Partnerships"}</div>
                  </div>
                </div>
              </div>

              {/* Centered Logo Ball for Mobile View */}
              <div
                className="absolute z-20 flex items-center justify-center pointer-events-none top-1/2 left-1/2"
                style={{ transform: "translate(-50%, -50%)" }}
              >
                {/* Rotating outer gradient border */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                  className="absolute w-[125px] h-[125px] rounded-full border border-dashed border-primary/20 bg-gradient-to-tr from-jibb-indigo/10 via-jibb-orange/10 to-jibb-sakura/10"
                />
                {/* Pulsing inner glow ring */}
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="absolute w-[108px] h-[108px] rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10"
                />
                {/* Core logo ball */}
                <div className="relative w-22 h-22 rounded-full bg-[#01109f] dark:bg-card border border-border/80 shadow-jibb-xl flex items-center justify-center p-3 pointer-events-auto">
                  <img
                    src="/japan_india_business_bureau_logo.jpg"
                    alt="JIBB NPO Logo"
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Premium Mini CTA Panel (Embedded Gradient Container) */}
        {/* <div className="mt-24 max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-jibb-indigo/5 via-jibb-orange/5 to-jibb-sakura/5 border border-border/30 dark:border-white/5 p-8 md:p-12 text-center backdrop-blur-sm shadow-sm relative overflow-hidden">
          <div aria-hidden="true" className="absolute -top-10 -right-10 w-40 h-40 bg-jibb-orange/10 rounded-full blur-2xl pointer-events-none" />
          <div aria-hidden="true" className="absolute -bottom-10 -left-10 w-40 h-40 bg-jibb-indigo/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <h3 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight max-w-lg mx-auto">
              Ready to expand and establish strategic bridges between Japan & India?
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto">
              Join our bilateral business ecosystem and leverage expert Consulting, Market Entry, and compliance support.
            </p>
            <div className="pt-2">
              <Link href="/membership">
                <Button className="px-8 py-6 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-[0.98] transition-all shadow-lg text-sm flex items-center justify-center gap-2 mx-auto">
                  <span>{t("ctaButton") || "Become a Member"}</span>
                  <ArrowRight className="size-4 animate-soft-pulse" />
                </Button>
              </Link>
            </div>
          </div>
        </div> */}

      </div>
    </section>
  );
}
