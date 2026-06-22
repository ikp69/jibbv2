"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Compass, CheckCircle2, ChevronRight, Play, Settings, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function WorkProcess() {
  const t = useTranslations("servicesPage.howWeWork");
  const [activeTab, setActiveTab] = useState<number>(0);

  // We have 3 phases: phase1, phase2, phase3
  const phases = [
    {
      index: 0,
      title: t("phase1.title") || "Phase 1: Planning",
      subtitle: t("phase1.subtitle") || "Market entry, feasibility, and custom blueprints",
      icon: <Compass className="size-6 text-jibb-orange" />,
      bgIcon: Compass,
      glow: "group-hover:bg-jibb-orange/15",
      accent: "bg-jibb-orange",
      border: "hover:border-jibb-orange/30",
      items: t.raw("phase1.items") || []
    },
    {
      index: 1,
      title: t("phase2.title") || "Phase 2: Project Execution",
      subtitle: t("phase2.subtitle") || "Incorporation, setups, and recruitment",
      icon: <Settings className="size-6 text-jibb-indigo" />,
      bgIcon: Settings,
      glow: "group-hover:bg-jibb-indigo/15",
      accent: "bg-jibb-indigo",
      border: "hover:border-jibb-indigo/30",
      items: t.raw("phase2.items") || []
    },
    {
      index: 2,
      title: t("phase3.title") || "Phase 3: Advisory",
      subtitle: t("phase3.subtitle") || "Regulatory, sales, and HR expansion consulting",
      icon: <ShieldCheck className="size-6 text-jibb-sakura" />,
      bgIcon: ShieldCheck,
      glow: "group-hover:bg-jibb-sakura/15",
      accent: "bg-jibb-sakura",
      border: "hover:border-jibb-sakura/30",
      items: t.raw("phase3.items") || []
    }
  ];

  return (
    <section className="py-24 bg-jibb-cream/15 dark:bg-[#0b0f19]/35 relative overflow-hidden border-t border-b border-border/10">
      {/* Decorative Blur elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-jibb-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-jibb-indigo/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 backdrop-blur-md">
            <Play className="size-3 text-jibb-orange fill-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary dark:text-primary-foreground">
              {t("ourMethodology") || "Our Methodology"}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            {t("title") || "How We Work"}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("subtitle") || "A structured, three-phase operational methodology that transforms bilateral concepts into thriving corporate realities."}
          </p>
        </div>

        {/* Responsive Layout: Desktop Interactive Steps, Mobile Stacked Details */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Side: Tabs / Steps Selector */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            {phases.map((phase) => {
              const isActive = activeTab === phase.index;
              return (
                <button
                  key={phase.index}
                  onClick={() => setActiveTab(phase.index)}
                  className={`group relative text-left p-6 rounded-2xl border transition-all duration-300 backdrop-blur-sm shadow-sm flex items-start gap-4 ${
                    isActive
                      ? `bg-card border-primary ring-1 ring-primary/20 scale-[1.02] shadow-jibb`
                      : "bg-card/60 border-border/40 hover:bg-card/90"
                  } ${phase.border}`}
                >
                  <div className={`p-3.5 rounded-xl shrink-0 ${isActive ? "bg-primary/10" : "bg-muted/60"}`}>
                    {phase.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-foreground text-base md:text-lg tracking-tight">
                      {phase.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {phase.subtitle}
                    </p>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="size-5 text-muted-foreground" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Side: Active Phase Details Card */}
          <div className="lg:col-span-7">
            <div className="h-full bg-card dark:bg-card/45 backdrop-blur-md rounded-3xl p-8 border border-border/60 shadow-lg relative overflow-hidden flex flex-col justify-between">
              {/* Giant faint icon watermark */}
              <div className="absolute -top-10 -right-10 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                {React.createElement(phases[activeTab].bgIcon, { className: "size-48" })}
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${phases[activeTab].accent}`} />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/80">
                    {t("phaseDetails") || "Phase Details"}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                    {phases[activeTab].title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">
                    {phases[activeTab].subtitle}
                  </p>
                </div>

                <div className="h-[1px] bg-border/40 w-full" />

                {/* Bullets List */}
                <ul className="space-y-3.5">
                  {phases[activeTab].items.map((item: string, idx: number) => {
                    const parts = item.split(":");
                    const title = parts.length > 1 ? parts[0] + ":" : "";
                    const desc = parts.length > 1 ? parts.slice(1).join(":") : item;

                    return (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start gap-3 text-xs md:text-sm text-foreground/80 font-medium"
                      >
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>
                          {title && <strong className="text-foreground font-extrabold">{title} </strong>}
                          <span className="text-muted-foreground/90 font-medium">{desc}</span>
                        </span>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
