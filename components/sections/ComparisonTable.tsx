"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Check, X, ShieldAlert, Award } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function ComparisonTable() {
  const t = useTranslations("membershipPage.comparison");

  // Load comparison rows from locales dynamically or use a fallback.
  // The structure is rows array with objects containing label, trad, jibb
  const rows = [
    {
      label: t("rows.0.label") || "Focus Sectors",
      trad: t("rows.0.trad") || "Generalist sectors, generic advocacy",
      jibb: t("rows.0.jibb") || "Hyper-focused sectors – advanced manufacturing, semiconductors, and automotive components",
      levelTrad: "low",
      levelJibb: "high"
    },
    {
      label: t("rows.1.label") || "Business Matchmaking",
      trad: t("rows.1.trad") || "Passive directory services and generic mixers",
      jibb: t("rows.1.jibb") || "Curated, pre-qualified B2B meetings and reverse buyer-seller meetings",
      levelTrad: "low",
      levelJibb: "high"
    },
    {
      label: t("rows.2.label") || "Execution Depth",
      trad: t("rows.2.trad") || "High level advisory reports",
      jibb: t("rows.2.jibb") || "End-to-end execution: site selection, entity formation, and operational setup",
      levelTrad: "low",
      levelJibb: "high"
    },
    {
      label: t("rows.3.label") || "Training & Mentorship",
      trad: t("rows.3.trad") || "Limited training scope",
      jibb: t("rows.3.jibb") || "Deep implementation of Japanese and Indian standards with expert on-site mentorship",
      levelTrad: "low",
      levelJibb: "high"
    },
    {
      label: t("rows.4.label") || "Success Metrics",
      trad: t("rows.4.trad") || "Event attendance volume",
      jibb: t("rows.4.jibb") || "Results-oriented: MoUs signed, Joint Ventures formed, and factories established",
      levelTrad: "low",
      levelJibb: "high"
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-border/30">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-jibb-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="section-container relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 backdrop-blur-md">
            <Award className="size-4 text-jibb-indigo" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary dark:text-primary-foreground">
              Bilateral Strategy
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            {t("title") || "Moving Beyond Passive Networking"}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("subtitle") || "How the Japan India Business Bureau compares against traditional trade bodies in delivering tangible economic value."}
          </p>
        </div>

        {/* Comparison Grid/Table */}
        <ScrollReveal direction="up" className="rounded-3xl border border-border/50 bg-card/45 backdrop-blur-md overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-6 text-sm font-bold text-foreground uppercase tracking-wider w-[24%]">
                    Parameters
                  </th>
                  <th className="p-6 text-sm font-bold text-muted-foreground uppercase tracking-wider w-[38%] border-l border-border/40">
                    {t("col1") || "Traditional Trade Bodies"}
                  </th>
                  <th className="p-6 text-sm font-bold text-jibb-indigo dark:text-jibb-indigo-light uppercase tracking-wider w-[38%] border-l border-border/40 bg-jibb-indigo/5">
                    {t("col2") || "Japan India Business Bureau"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-border/45 hover:bg-muted/10 transition-colors duration-150"
                  >
                    {/* Parameter Name */}
                    <td className="p-6 align-middle font-bold text-foreground text-sm">
                      {row.label}
                    </td>

                    {/* Traditional Trade Bodies Column */}
                    <td className="p-6 align-middle border-l border-border/40 text-xs md:text-sm text-muted-foreground/85 leading-relaxed">
                      <div className="flex items-start gap-2.5">
                        <span className="inline-flex items-center justify-center size-5 shrink-0 rounded-full bg-red-500/10 text-red-500 mt-0.5">
                          <X className="size-3 stroke-[3]" />
                        </span>
                        <span>{row.trad}</span>
                      </div>
                    </td>

                    {/* JIBB Column */}
                    <td className="p-6 align-middle border-l border-border/40 bg-jibb-indigo/[0.015] text-xs md:text-sm text-foreground dark:text-foreground leading-relaxed font-medium">
                      <div className="flex items-start gap-2.5">
                        <span className="inline-flex items-center justify-center size-5 shrink-0 rounded-full bg-jibb-indigo/15 text-jibb-indigo mt-0.5">
                          <Check className="size-3 stroke-[3]" />
                        </span>
                        <span>{row.jibb}</span>
                      </div>
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
