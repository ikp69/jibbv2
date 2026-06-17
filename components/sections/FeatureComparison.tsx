"use client";

import React from "react";
import { Check, X, Award, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

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
  const renderCellValue = (value: string | boolean) => {
    if (typeof value === "boolean") {
      if (value) {
        return (
          <div className="flex justify-center">
            <span className="inline-flex items-center justify-center size-6 rounded-md bg-jibb-indigo/15 text-jibb-indigo border border-jibb-indigo/25">
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

    // Custom styling based on value text
    let textStyle = "text-foreground/80 dark:text-foreground/95 font-medium";
    if (value.includes("Free")) {
      textStyle = "text-jibb-indigo dark:text-jibb-indigo-light font-bold";
    } else if (value.includes("Discount")) {
      textStyle = "text-jibb-indigo dark:text-jibb-indigo-light font-semibold";
    } else if (value.includes("Access") || value.includes("Ones") || value.includes("Only")) {
      textStyle = "text-foreground font-semibold";
    }

    return (
      <span className={`text-xs md:text-sm tracking-tight ${textStyle}`}>
        {value}
      </span>
    );
  };

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
              Deliverables &amp; Benefits
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Compare Membership Features
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Review detailed plan limits, discounts, and collaboration structures across our 4 membership tiers.
          </p>
        </div>

        {/* Matrix Container */}
        <ScrollReveal direction="up" className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-5 text-sm font-bold text-foreground uppercase tracking-wider w-[28%]">
                    Benefits &amp; Features
                  </th>
                  <th className="p-5 text-center w-[18%] border-l border-border bg-blue-500/5">
                    <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Associate
                    </div>
                    <span className="block text-[11px] text-muted-foreground font-semibold">Entry Level</span>
                  </th>
                  <th className="p-5 text-center w-[18%] border-l border-border bg-orange-500/5">
                    <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Silver Member
                    </div>
                    <span className="block text-[11px] text-muted-foreground font-semibold">Standard Growth</span>
                  </th>
                  <th className="p-5 text-center w-[18%] border-l border-border bg-jibb-indigo/5 relative">
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-jibb-indigo" />
                    <div className="inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full bg-jibb-indigo/15 dark:bg-jibb-indigo/35 text-jibb-indigo dark:text-jibb-indigo-light text-[10px] font-bold uppercase tracking-wider mb-1">
                      Gold Member <Sparkles className="size-3 fill-jibb-indigo stroke-none animate-pulse" />
                    </div>
                    <span className="block text-[11px] text-muted-foreground font-semibold">Professional Tier</span>
                  </th>
                  <th className="p-5 text-center w-[18%] border-l border-border bg-slate-500/5">
                    <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Platinum Member
                    </div>
                    <span className="block text-[11px] text-muted-foreground font-semibold">Ultimate Access</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors duration-150"
                  >
                    {/* Feature ID & Name */}
                    <td className="p-5">
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-mono font-bold text-muted-foreground/60 mt-0.5">
                          {row.id}
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {row.name}
                        </span>
                      </div>
                    </td>

                    {/* Associate Member */}
                    <td className="p-5 text-center align-middle border-l border-border/40 bg-blue-500/[0.01]">
                      {renderCellValue(row.associate)}
                    </td>

                    {/* Silver Member */}
                    <td className="p-5 text-center align-middle border-l border-border/40 bg-orange-500/[0.01]">
                      {renderCellValue(row.silver)}
                    </td>

                    {/* Gold Member */}
                    <td className="p-5 text-center align-middle border-l border-border/40 bg-jibb-indigo/[0.02]">
                      {renderCellValue(row.gold)}
                    </td>

                    {/* Platinum Member */}
                    <td className="p-5 text-center align-middle border-l border-border/40 bg-slate-500/[0.01]">
                      {renderCellValue(row.platinum)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
