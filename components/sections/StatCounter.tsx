"use client";

import { useTranslations } from "next-intl";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Award, Briefcase, TrendingUp, Users } from "lucide-react";
import React from "react";

export function StatCounter() {
  const t = useTranslations();

  const statItems = [
    {
      value: 120,
      suffix: "+",
      prefix: "",
      label: t("stats.partnerships") || "Bilateral Partnerships",
      icon: Briefcase,
      color: "text-jibb-orange",
      glow: "shadow-jibb-orange-glow",
    },
    {
      value: 850,
      suffix: " Cr+",
      prefix: "₹",
      label: t("hero.stat2Label") || "Deal Flow",
      icon: TrendingUp,
      color: "text-jibb-sakura",
      glow: "shadow-jibb-sakura-glow",
    },
    {
      value: 500,
      suffix: "+",
      prefix: "",
      label: "Active Members",
      icon: Users,
      color: "text-blue-400",
      glow: "shadow-jibb-glow",
    },
    {
      value: 8,
      suffix: "",
      prefix: "",
      label: "Key Sectors",
      icon: Award,
      color: "text-emerald-400",
      glow: "shadow-emerald-500/10",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-jibb-gradient">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-gradient-to-r from-jibb-orange/5 to-jibb-sakura/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="section-container relative z-10">
        <ScrollReveal staggerChildren={0.1} direction="up">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {statItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="relative p-6 md:p-8 rounded-3xl bg-white/5 border border-white/8 backdrop-blur-md hover:bg-white/10 hover:border-white/15 transition-all duration-300 flex flex-col items-center text-center group"
                >
                  {/* Glowing background on hover */}
                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${item.glow} blur-xl`} />
                  
                  <div className={`p-3 rounded-2xl bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-300 ${item.color}`}>
                    <Icon className="size-6" />
                  </div>

                  <span className="text-3xl md:text-5xl font-black text-white tracking-tight block">
                    <AnimatedCounter
                      value={item.value}
                      prefix={item.prefix}
                      suffix={item.suffix}
                      duration={1.8}
                    />
                  </span>
                  
                  <span className="text-xs md:text-sm font-semibold text-white/50 group-hover:text-white/80 transition-colors duration-300 mt-2 block">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Small source info at the bottom */}
        <ScrollReveal direction="up" delay={0.3} className="text-center mt-6">
          <span className="text-[10px] text-white/35 font-medium tracking-wide uppercase">
            {t("hero.statNote") || "As of FY 2024"} · Verified by JIBB Bilateral Analytics
          </span>
        </ScrollReveal>
      </div>
    </section>
  );
}
