"use client";

import React from "react";
import { Check, X, Award, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useTranslations } from "next-intl";

interface ComparisonRow {
  id: string;
  name: string;
  associate: string | boolean;
  silver: string | boolean;
  gold: string | boolean;
  platinum: string | boolean;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    id: "01",
    name: "Market Intelligence Reports",
    associate: false,
    silver: "Newsletter Only",
    gold: "Limited Access",
    platinum: "Full Access",
  },
  {
    id: "02",
    name: "Business Matching",
    associate: "5% Discount",
    silver: "10% Discount",
    gold: "20% Discount",
    platinum: "30% Discount",
  },
  {
    id: "03",
    name: "Exhibition/Event Support",
    associate: "No Discount",
    silver: "2.5% Discount",
    gold: "5% Discount",
    platinum: "7.5% Discount",
  },
  {
    id: "04",
    name: "Delegation to Japan",
    associate: false,
    silver: false,
    gold: true,
    platinum: true,
  },
  {
    id: "05",
    name: "Training Programs",
    associate: "5% Discount",
    silver: "10% Discount",
    gold: "3 Free Programs",
    platinum: "7 Free Programs",
  },
  {
    id: "06",
    name: "Opportunities for Collaboration",
    associate: false,
    silver: false,
    gold: "Random Ones",
    platinum: "Selected Ones",
  },
  {
    id: "07",
    name: "Meeting Delegation from Japan",
    associate: false,
    silver: true,
    gold: true,
    platinum: true,
  },
  {
    id: "08",
    name: "Invite Only Events Invitation",
    associate: false,
    silver: false,
    gold: false,
    platinum: true,
  },
  {
    id: "09",
    name: "Advocacy Voice",
    associate: false,
    silver: false,
    gold: false,
    platinum: true,
  },
];

export function FeatureComparison() {
  const t = useTranslations("membershipPage.comparison");

  const renderCellValue = (value: string | boolean, tier: "associate" | "silver" | "gold" | "platinum") => {
    if (typeof value === "boolean") {
      if (value) {
        let iconColor = "bg-jibb-indigo/15 text-jibb-indigo border-jibb-indigo/25";
        if (tier === "associate") iconColor = "bg-blue-500/15 text-blue-500 border-blue-500/25";
        if (tier === "silver") iconColor = "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/25";
        if (tier === "gold") iconColor = "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25";
        if (tier === "platinum") iconColor = "bg-slate-500/30 text-slate-700 dark:text-slate-200 border-slate-500/50";

        return (
          <div className="flex justify-center">
            <span className={`inline-flex items-center justify-center size-6 rounded-md border ${iconColor}`}>
              <Check className="size-3.5 stroke-[3]" />
            </span>
          </div>
        );
      } else {
        return (
          <div className="flex justify-center">
            <span className="inline-flex items-center justify-center size-6 rounded-md bg-red-500/10 text-red-500/70 dark:text-red-400/70 border border-red-500/10">
              <X className="size-3.5 stroke-[2.5]" />
            </span>
          </div>
        );
      }
    }

    // Custom styling based on value text and tier
    let textStyle = "text-foreground/80 dark:text-foreground/95 font-medium";
    if (value.includes("Free") || value.includes("無料")) {
      if (tier === "gold") textStyle = "text-amber-600 dark:text-amber-400 font-bold";
      else if (tier === "platinum") textStyle = "text-slate-600 dark:text-slate-400 font-bold";
      else textStyle = "text-jibb-indigo dark:text-jibb-indigo-light font-bold";
    } else if (value.includes("Discount") || value.includes("割引")) {
      if (tier === "associate") textStyle = "text-blue-600 dark:text-blue-400 font-semibold";
      else if (tier === "silver") textStyle = "text-slate-600 dark:text-slate-400 font-semibold";
      else if (tier === "gold") textStyle = "text-amber-600 dark:text-amber-400 font-semibold";
      else if (tier === "platinum") textStyle = "text-slate-600 dark:text-slate-400 font-semibold";
      else textStyle = "text-jibb-indigo dark:text-jibb-indigo-light font-semibold";
    } else if (value.includes("Access") || value.includes("アクセス") || value.includes("Ones") || value.includes("Only") || value.includes("のみ")) {
      textStyle = "text-foreground font-semibold";
    }

    return (
      <span className={`text-xs md:text-sm tracking-tight ${textStyle}`}>
        {value}
      </span>
    );
  };

  const matrixKeys = ["m01", "m02", "m03", "m04", "m05", "m06", "m07", "m08", "m09"];

  return (
    <section className="py-24 relative overflow-hidden bg-jibb-cream/10 dark:bg-[#0b0f19]/20 border-t border-border/20">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-32 bg-jibb-indigo/5 rounded-full blur-[70px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-32 bg-jibb-orange/5 rounded-full blur-[70px] pointer-events-none" />

      <div className="section-container relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 backdrop-blur-md">
            <Award className="size-3.5 text-jibb-indigo" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-foreground/80">
              {t("badge")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Matrix Container */}
        <ScrollReveal direction="up" className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-5 text-sm font-bold text-foreground uppercase tracking-wider w-[28%]">
                    {t("colTitle")}
                  </th>
                  <th className="p-5 text-center w-[18%] border-l border-border bg-blue-500/5">
                    <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                      {t("associate")}
                    </div>
                    <span className="block text-[11px] text-muted-foreground font-semibold">{t("associateDesc")}</span>
                  </th>
                  <th className="p-5 text-center w-[18%] border-l border-border bg-slate-500/5">
                    <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                      {t("silver")}
                    </div>
                    <span className="block text-[11px] text-muted-foreground font-semibold">{t("silverDesc")}</span>
                  </th>
                  <th className="p-5 text-center w-[18%] border-l border-border bg-amber-500/5 relative">
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-amber-500" />
                    <div className="inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      {t("gold")} <Sparkles className="size-3 fill-amber-500 text-amber-500 stroke-none animate-pulse" />
                    </div>
                    <span className="block text-[11px] text-muted-foreground font-semibold">{t("goldDesc")}</span>
                  </th>
                  <th className="p-5 text-center w-[18%] border-l border-border bg-slate-500/10 relative">
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-slate-400" />
                    <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold uppercase tracking-wider mb-1">
                      {t("platinum")}
                    </div>
                    <span className="block text-[11px] text-muted-foreground font-semibold">{t("platinumDesc")}</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {matrixKeys.map((key, idx) => {
                  const idStr = String(idx + 1).padStart(2, "0");
                  const name = t.has(`matrix.${key}.name`) ? t(`matrix.${key}.name`) : COMPARISON_ROWS[idx].name;
                  const associateVal = t.has(`matrix.${key}.associate`) ? t.raw(`matrix.${key}.associate`) : COMPARISON_ROWS[idx].associate;
                  const silverVal = t.has(`matrix.${key}.silver`) ? t.raw(`matrix.${key}.silver`) : COMPARISON_ROWS[idx].silver;
                  const goldVal = t.has(`matrix.${key}.gold`) ? t.raw(`matrix.${key}.gold`) : COMPARISON_ROWS[idx].gold;
                  const platinumVal = t.has(`matrix.${key}.platinum`) ? t.raw(`matrix.${key}.platinum`) : COMPARISON_ROWS[idx].platinum;

                  return (
                    <tr
                      key={key}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors duration-150"
                    >
                      <td className="p-5">
                        <div className="flex items-start gap-3">
                          <span className="text-xs font-mono font-bold text-muted-foreground/60 mt-0.5">
                            {idStr}
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {name}
                          </span>
                        </div>
                      </td>

                      <td className="p-5 text-center align-middle border-l border-border/40 bg-blue-500/[0.01]">
                        {renderCellValue(associateVal, "associate")}
                      </td>

                      <td className="p-5 text-center align-middle border-l border-border/40 bg-slate-500/[0.01]">
                        {renderCellValue(silverVal, "silver")}
                      </td>

                      <td className="p-5 text-center align-middle border-l border-border/40 bg-amber-500/[0.01]">
                        {renderCellValue(goldVal, "gold")}
                      </td>

                      <td className="p-5 text-center align-middle border-l border-border/40 bg-slate-500/[0.03]">
                        {renderCellValue(platinumVal, "platinum")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
