"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Award, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function MemberBenefits() {
  const t = useTranslations("membershipPage.whyBecomeMember");

  // Retrieve values arrays
  const jpItems = t.raw("japaneseEntities.items") || [];
  const inItems = t.raw("indianEntities.items") || [];

  return (
    <section className="py-24 bg-background relative overflow-hidden border-b border-border/20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(242,101,34,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="section-container relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 backdrop-blur-md">
            <Award className="size-4 text-jibb-orange animate-soft-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary dark:text-primary-foreground">
              Bilateral Advantages
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            {t("title") || "Why Become Our Member?"}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("subtitle") || "Unlocking dual-corridor resources, on-ground networks, and trade acceleration programs."}
          </p>
        </div>

        {/* Side-by-Side Splits */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Japanese Entities Column */}
          <ScrollReveal direction="left" className="h-full">
            <div className="group h-full bg-card dark:bg-card/45 border border-border/55 hover:border-jibb-orange/30 p-8 rounded-3xl transition-all duration-300 hover:shadow-jibb relative overflow-hidden flex flex-col justify-between">
              {/* Subtle watermark image/flag indicator for Japan */}
              <div className="absolute top-5 right-5 pointer-events-none select-none opacity-[0.03] dark:opacity-[0.05] text-7xl font-extrabold">
                JP
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-8 rounded-full bg-jibb-orange" />
                  <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
                    {t("japaneseEntities.title") || "For Japanese Entities"}
                  </h3>
                </div>

                <div className="h-[1px] bg-border/40 w-full" />

                <ul className="space-y-3">
                  {jpItems.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-muted-foreground font-semibold leading-relaxed">
                      <CheckCircle2 className="size-4 text-jibb-orange shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Indian Entities Column */}
          <ScrollReveal direction="right" className="h-full">
            <div className="group h-full bg-card dark:bg-card/45 border border-border/55 hover:border-jibb-indigo/30 p-8 rounded-3xl transition-all duration-300 hover:shadow-jibb relative overflow-hidden flex flex-col justify-between">
              {/* Subtle watermark image/flag indicator for India */}
              <div className="absolute top-5 right-5 pointer-events-none select-none opacity-[0.03] dark:opacity-[0.05] text-7xl font-extrabold">
                IN
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-8 rounded-full bg-jibb-indigo" />
                  <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
                    {t("indianEntities.title") || "For Indian Entities"}
                  </h3>
                </div>

                <div className="h-[1px] bg-border/40 w-full" />

                <ul className="space-y-3">
                  {inItems.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-muted-foreground font-semibold leading-relaxed">
                      <CheckCircle2 className="size-4 text-jibb-indigo shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
