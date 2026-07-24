"use client";

import React from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Code2, FlaskConical, Gift, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useTranslations } from "next-intl";

interface ProcessStep {
  step: string;
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  borderColor: string;
}

const STEPS: ProcessStep[] = [
  {
    step: "01",
    key: "review",
    icon: ClipboardCheck,
    color: "text-jibb-orange",
    borderColor: "group-hover:border-jibb-orange/30",
  },
  {
    step: "02",
    key: "matchmaking",
    icon: Code2,
    color: "text-blue-400",
    borderColor: "group-hover:border-blue-400/30",
  },
  {
    step: "03",
    key: "sandbox",
    icon: FlaskConical,
    color: "text-jibb-sakura",
    borderColor: "group-hover:border-jibb-sakura/30",
  },
  {
    step: "04",
    key: "welcome",
    icon: Gift,
    color: "text-emerald-400",
    borderColor: "group-hover:border-emerald-400/30",
  },
];

export function HiringProcess() {
  const t = useTranslations("hiringProcess");

  return (
    <section className="py-24 bg-jibb-gradient-subtle relative overflow-hidden border-t border-white/5">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-gradient-to-r from-jibb-orange/3 to-jibb-sakura/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="section-container relative z-10 max-w-5xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-jibb-indigo/10 backdrop-blur-md">
            <Sparkles className="size-3.5 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-jibb-indigo">
              {t("badge")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Steps Grid */}
        <ScrollReveal staggerChildren={0.15} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl p-6 bg-card border border-border/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[260px] text-left"
              >
                {/* Visual Step Number Label */}
                <span className="absolute top-4 right-6 text-3xl font-black text-muted/20 select-none group-hover:text-muted/30 transition-colors">
                  {item.step}
                </span>

                <div className="space-y-4">
                  <div className={`p-3 rounded-2xl bg-primary/5 inline-flex transition-transform duration-300 group-hover:scale-110 ${item.color}`}>
                    <Icon className="size-5.5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-foreground tracking-tight">
                      {t(`steps.${item.key}.title`)}
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                      {t(`steps.${item.key}.desc`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
