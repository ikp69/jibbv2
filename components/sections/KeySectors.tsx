"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Cpu,
  Car,
  Factory,
  Pill,
  Sun,
  Building2,
  FlaskConical,
  Network,
  ArrowRight
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const sectorConfigs = {
  semiconductor: {
    icon: Cpu,
    iconColor: "text-jibb-sakura dark:text-jibb-sakura-light",
    iconBg: "bg-jibb-sakura/10 dark:bg-jibb-sakura/20",
    cardBg: "bg-jibb-sakura/[0.01] dark:bg-jibb-sakura/[0.04]",
    borderColor: "border-jibb-sakura/25 dark:border-jibb-sakura/30 hover:border-jibb-sakura/50",
    glowClass: "group-hover:bg-jibb-sakura/10",
    exploreColor: "text-jibb-sakura dark:text-jibb-sakura-light",
    bgImage: "/images/sectors/semiconductor.png",
  },
  ev: {
    icon: Car,
    iconColor: "text-jibb-orange dark:text-jibb-orange-light",
    iconBg: "bg-jibb-orange/10 dark:bg-jibb-orange/20",
    cardBg: "bg-jibb-orange/[0.01] dark:bg-jibb-orange/[0.04]",
    borderColor: "border-jibb-orange/25 dark:border-jibb-orange/30 hover:border-jibb-orange/50",
    glowClass: "group-hover:bg-jibb-orange/10",
    exploreColor: "text-jibb-orange dark:text-jibb-orange-light",
    bgImage: "/images/sectors/ev.png",
  },
  electronics: {
    icon: Factory,
    iconColor: "text-jibb-indigo dark:text-jibb-indigo-light",
    iconBg: "bg-jibb-indigo/10 dark:bg-jibb-indigo/20",
    cardBg: "bg-jibb-indigo/[0.01] dark:bg-jibb-indigo/[0.04]",
    borderColor: "border-jibb-indigo/25 dark:border-jibb-indigo/30 hover:border-jibb-indigo/50",
    glowClass: "group-hover:bg-jibb-indigo/10",
    exploreColor: "text-jibb-indigo dark:text-jibb-indigo-light",
    bgImage: "/images/sectors/manufacturing.png",
  },
  pharma: {
    icon: Pill,
    iconColor: "text-jibb-sakura dark:text-jibb-sakura-light",
    iconBg: "bg-jibb-sakura/10 dark:bg-jibb-sakura/20",
    cardBg: "bg-jibb-sakura/[0.01] dark:bg-jibb-sakura/[0.04]",
    borderColor: "border-jibb-sakura/25 dark:border-jibb-sakura/30 hover:border-jibb-sakura/50",
    glowClass: "group-hover:bg-jibb-sakura/10",
    exploreColor: "text-jibb-sakura dark:text-jibb-sakura-light",
    bgImage: "/images/sectors/pharma.png",
  },
  renewable: {
    icon: Sun,
    iconColor: "text-jibb-orange dark:text-jibb-orange-light",
    iconBg: "bg-jibb-orange/10 dark:bg-jibb-orange/20",
    cardBg: "bg-jibb-orange/[0.01] dark:bg-jibb-orange/[0.04]",
    borderColor: "border-jibb-orange/25 dark:border-jibb-orange/30 hover:border-jibb-orange/50",
    glowClass: "group-hover:bg-jibb-orange/10",
    exploreColor: "text-jibb-orange dark:text-jibb-orange-light",
    bgImage: "/images/sectors/renewable.png",
  },
  infrastructure: {
    icon: Building2,
    iconColor: "text-jibb-indigo dark:text-jibb-indigo-light",
    iconBg: "bg-jibb-indigo/10 dark:bg-jibb-indigo/20",
    cardBg: "bg-jibb-indigo/[0.01] dark:bg-jibb-indigo/[0.04]",
    borderColor: "border-jibb-indigo/25 dark:border-jibb-indigo/30 hover:border-jibb-indigo/50",
    glowClass: "group-hover:bg-jibb-indigo/10",
    exploreColor: "text-jibb-indigo dark:text-jibb-indigo-light",
    bgImage: "/images/sectors/infrastructure.png",
  },
  chemicals: {
    icon: FlaskConical,
    iconColor: "text-jibb-sakura dark:text-jibb-sakura-light",
    iconBg: "bg-jibb-sakura/10 dark:bg-jibb-sakura/20",
    cardBg: "bg-jibb-sakura/[0.01] dark:bg-jibb-sakura/[0.04]",
    borderColor: "border-jibb-sakura/25 dark:border-jibb-sakura/30 hover:border-jibb-sakura/50",
    glowClass: "group-hover:bg-jibb-sakura/10",
    exploreColor: "text-jibb-sakura dark:text-jibb-sakura-light",
    bgImage: "/images/sectors/chemicals.png",
  },
  emerging: {
    icon: Network,
    iconColor: "text-jibb-orange dark:text-jibb-orange-light",
    iconBg: "bg-jibb-orange/10 dark:bg-jibb-orange/20",
    cardBg: "bg-jibb-orange/[0.01] dark:bg-jibb-orange/[0.04]",
    borderColor: "border-jibb-orange/25 dark:border-jibb-orange/30 hover:border-jibb-orange/50",
    glowClass: "group-hover:bg-jibb-orange/10",
    exploreColor: "text-jibb-orange dark:text-jibb-orange-light",
    bgImage: "/images/sectors/emerging.png",
  },
};

type SectorKey = keyof typeof sectorConfigs;

interface SectorCardProps {
  id: SectorKey;
  title: string;
  description: string;
  focusAreas: string[];
  isFlipped: boolean;
  onFlip: () => void;
}

const SectorCard = ({
  id,
  title,
  description,
  focusAreas,
  isFlipped,
  onFlip,
}: SectorCardProps) => {
  const config = sectorConfigs[id];
  const Icon = config.icon;
  const t = useTranslations("sectors");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onFlip();
    }
  };

  return (
    <div
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isFlipped}
      aria-label={title}
      className="group relative h-[340px] sm:h-[320px] lg:h-[340px] w-full [perspective:1200px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2 rounded-[20px]"
    >
      {/* 3D Card Inner */}
      <div
        className={`relative w-full h-full transition-transform duration-[650ms] [transform-style:preserve-3d] hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 ease-out rounded-[20px] ${isFlipped ? "[transform:rotateY(180deg)]" : ""
          } lg:group-hover:[transform:rotateY(180deg)]`}
      >
        {/* Front Face */}
        <div
          className={`absolute inset-0 w-full h-full [backface-visibility:hidden] ${config.cardBg} border ${config.borderColor} backdrop-blur-sm rounded-[20px] p-5 flex flex-col justify-between shadow-sm transition-all duration-300 overflow-hidden no-hover-fill`}
          style={{ WebkitBackfaceVisibility: "hidden" }}
        >
          {/* Subtle hover glow background */}
          <div aria-hidden="true" className={`absolute inset-0 rounded-[20px] ${config.glowClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

          <div className="relative z-10 flex flex-col h-full">
            {/* Header: Icon + Title inline */}
            <div className="flex items-center gap-3">
              <div className={`p-2.5 w-11 h-11 rounded-xl ${config.iconBg} border border-[#E8E8E8]/10 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 no-hover-fill`}>
                <Icon className={`w-5.5 h-5.5 ${config.iconColor} stroke-[1.5]`} />
              </div>
              <h3 className="text-sm lg:text-base font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                {title}
              </h3>
            </div>

            {/* Embedded Image Placeholder */}
            <div className="relative w-full h-[180px] sm:h-[110px] lg:h-[180px] rounded-xl overflow-hidden mt-4 border border-gray-150/70 dark:border-border/30 bg-slate-50/50 dark:bg-slate-900/50 shadow-inner">
              <img
                src={config.bgImage}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                alt={title}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            </div>

            {/* Bottom: Explore link */}
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${config.exploreColor} mt-auto pt-3`}>
              <span>{t("explore")}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[20px] p-5 flex flex-col justify-between text-white"
          style={{
            background: "linear-gradient(135deg, #0F4C81, #163B65)",
            WebkitBackfaceVisibility: "hidden"
          }}
        >
          <div className="space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20">
            <h3 className="text-sm font-bold tracking-tight">
              {title}
            </h3>
            <p className="text-[12px] sm:text-[11px] text-white/95 leading-relaxed font-normal">
              {description}
            </p>
          </div>

          <div className="space-y-2 mt-3 border-t border-white/10 pt-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
              {t("focusAreasLabel")}
            </span>
            <div className="flex flex-wrap gap-1">
              {focusAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full text-[12px] font-medium bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const KeySectors = () => {
  const t = useTranslations("sectors");
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  const sectorIds: SectorKey[] = [
    "semiconductor",
    "ev",
    "electronics",
    "pharma",
    "renewable",
    "infrastructure",
    "chemicals",
    "emerging",
  ];

  const handleCardFlip = (id: string) => {
    setFlippedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-16 md:py-24 lg:py-28 bg-[#FAFAFA] dark:bg-[#0b0f19] relative overflow-hidden">
      {/* Decorative background visual details */}
      <div aria-hidden="true" className="absolute inset-0 wave-pattern opacity-3 dark:opacity-2 pointer-events-none" />
      <div aria-hidden="true" className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(15,76,129,0.03)_0%,transparent_75%)] pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(242,101,34,0.03)_0%,transparent_75%)] pointer-events-none" />

      <div className="section-container relative z-10 max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center space-y-4 mb-12 md:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0F4C81]/5 dark:bg-[#0F4C81]/15 border border-[#0F4C81]/10 backdrop-blur-md">
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-[#0F4C81] dark:text-[#7b9fe0]">
              {t("tagline")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {t("sectionTitle")}
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t("sectionSubtitle")}
          </p>
        </div>

        {/* Bilateral Policy & CAGR Market Context Banner */}
        <div className="mb-12 max-w-4xl mx-auto p-6 rounded-2xl bg-white dark:bg-[#161f38]/40 border border-[#E8E8E8] dark:border-border/40 backdrop-blur-sm text-left shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="space-y-2 flex-grow">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#F26522]/10 text-[#F26522] text-[10px] font-extrabold uppercase tracking-wider">
              {t("strategicFrameworks")}
            </span>
            <h4 className="text-sm md:text-base font-extrabold text-gray-900 dark:text-white">
              {t("frameworkTitle")}
            </h4>
            <p
              className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: t.raw("frameworkDesc") }}
            />
          </div>
          <div className="flex md:flex-col gap-4 shrink-0 justify-center w-full md:w-auto text-center border-t md:border-t-0 md:border-l border-gray-150 dark:border-border/40 pt-4 md:pt-0 md:pl-6">
            <div>
              <div className="text-2xl font-black text-[#F26522]">
                <AnimatedCounter value={100} prefix="$" suffix="B+" className="text-2xl font-black text-[#F26522]" />
              </div>
              <div className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">
                {t("semiconductorLabel")}
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#0F4C81] dark:text-[#7b9fe0]">
                <AnimatedCounter value={16} suffix="%" className="text-2xl font-black text-[#0F4C81] dark:text-[#7b9fe0]" />
              </div>
              <div className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">
                {t("cagrLabel")}
              </div>
            </div>
          </div>
        </div>

        {/* 3D Flip Card Grid */}
        <ScrollReveal staggerChildren={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sectorIds.map((id) => {
            const title = t(`items.${id}.title`);
            const description = t(`items.${id}.description`);
            const focusAreas = t.raw(`items.${id}.focusAreas`) as string[];

            return (
              <SectorCard
                key={id}
                id={id}
                title={title}
                description={description}
                focusAreas={focusAreas}
                isFlipped={flippedCardId === id}
                onFlip={() => handleCardFlip(id)}
              />
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
};
