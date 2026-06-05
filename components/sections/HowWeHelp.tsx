"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Link } from "@/src/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Handshake,
  Compass,
  Network,
  Globe,
  Briefcase,
  ArrowLeftRight,
  Cpu,
  FlaskConical,
  Coins,
  ArrowRight
} from "lucide-react";

export function HowWeHelp() {
  const t = useTranslations("howWeHelp");

  const cards = [
    {
      id: "japanese",
      title: t("japaneseCompanies.title") || "For Japanese Companies",
      subtitle: t("japaneseCompanies.subtitle") || "Tap into India's tech ecosystem & scale operations.",
      icon: Building2,
      colorClass: "text-jibb-indigo dark:text-jibb-indigo-light",
      bgClass: "bg-jibb-indigo/5 dark:bg-jibb-indigo/10",
      borderHoverClass: "hover:border-jibb-indigo/30 dark:hover:border-jibb-indigo-light/30",
      glowClass: "shadow-jibb-glow",
      items: [
        {
          label: t("japaneseCompanies.bullet1") || "Find Indian partners",
          icon: Handshake,
          iconColor: "text-jibb-indigo dark:text-jibb-indigo-light",
          iconBg: "bg-jibb-indigo/10 dark:bg-jibb-indigo/20",
        },
        {
          label: t("japaneseCompanies.bullet2") || "Market entry guidance",
          icon: Compass,
          iconColor: "text-jibb-orange dark:text-jibb-orange-light",
          iconBg: "bg-jibb-orange/10 dark:bg-jibb-orange/20",
        },
        {
          label: t("japaneseCompanies.bullet3") || "Local network",
          icon: Network,
          iconColor: "text-jibb-sakura dark:text-jibb-sakura-light",
          iconBg: "bg-jibb-sakura/10 dark:bg-jibb-sakura/20",
        },
      ],
      link: "/services/market-entry",
    },
    {
      id: "indian",
      title: t("indianCompanies.title") || "For Indian Companies",
      subtitle: t("indianCompanies.subtitle") || "Access advanced manufacturing & scale in Japan.",
      icon: Globe,
      colorClass: "text-jibb-orange dark:text-jibb-orange-light",
      bgClass: "bg-jibb-orange/5 dark:bg-jibb-orange/10",
      borderHoverClass: "hover:border-jibb-orange/30 dark:hover:border-jibb-orange-light/30",
      glowClass: "shadow-jibb-orange-glow",
      items: [
        {
          label: t("indianCompanies.bullet1") || "Access Japanese market",
          icon: Compass,
          iconColor: "text-jibb-indigo dark:text-jibb-indigo-light",
          iconBg: "bg-jibb-indigo/10 dark:bg-jibb-indigo/20",
        },
        {
          label: t("indianCompanies.bullet2") || "Strategic partnerships",
          icon: Briefcase,
          iconColor: "text-jibb-orange dark:text-jibb-orange-light",
          iconBg: "bg-jibb-orange/10 dark:bg-jibb-orange/20",
        },
        {
          label: t("indianCompanies.bullet3") || "Business matchmaking",
          icon: ArrowLeftRight,
          iconColor: "text-jibb-sakura dark:text-jibb-sakura-light",
          iconBg: "bg-jibb-sakura/10 dark:bg-jibb-sakura/20",
        },
      ],
      link: "/services/partnership-facilitation",
    },
    {
      id: "researchers",
      title: t("researchersStartups.title") || "For Researchers & Startups",
      subtitle: t("researchersStartups.subtitle") || "Collaborate on R&D, labs & funding opportunities.",
      icon: Cpu,
      colorClass: "text-jibb-sakura dark:text-jibb-sakura-light",
      bgClass: "bg-jibb-sakura/5 dark:bg-jibb-sakura/10",
      borderHoverClass: "hover:border-jibb-sakura/30 dark:hover:border-jibb-sakura-light/30",
      glowClass: "shadow-jibb-sakura-glow",
      items: [
        {
          label: t("researchersStartups.bullet1") || "Innovation programs",
          icon: Network,
          iconColor: "text-jibb-indigo dark:text-jibb-indigo-light",
          iconBg: "bg-jibb-indigo/10 dark:bg-jibb-indigo/20",
        },
        {
          label: t("researchersStartups.bullet2") || "Labs",
          icon: FlaskConical,
          iconColor: "text-jibb-orange dark:text-jibb-orange-light",
          iconBg: "bg-jibb-orange/10 dark:bg-jibb-orange/20",
        },
        {
          label: t("researchersStartups.bullet3") || "Funding opportunities",
          icon: Coins,
          iconColor: "text-jibb-sakura dark:text-jibb-sakura-light",
          iconBg: "bg-jibb-sakura/10 dark:bg-jibb-sakura/20",
        },
      ],
      link: "/innovation-hub",
    },
  ];

  return (
    <section className="py-24 bg-jibb-cream/30 dark:bg-[#0b0f19] relative overflow-hidden border-t border-border/20">
      {/* Decorative background visual details */}
      <div aria-hidden="true" className="absolute inset-0 wave-pattern opacity-3 dark:opacity-2 pointer-events-none" />
      <div aria-hidden="true" className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-jibb-orange/3 dark:bg-jibb-orange/2 rounded-full blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-jibb-sakura/3 dark:bg-jibb-sakura/2 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10 max-w-7xl">
        {/* Section Title & Subtitle */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 backdrop-blur-md">
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary dark:text-primary-foreground">
              {t("tagline") || "Tailored Solutions"}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            {t("sectionTitle") || "How We Help"}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("sectionSubtitle") || "Providing tailored support to bridge businesses, innovators, and researchers across the Japan-India corridor."}
          </p>
        </div>

        {/* 3 Cards Grid */}
        <ScrollReveal staggerChildren={0.15} direction="up" className="grid md:grid-cols-3 gap-8">
          {cards.map((card) => {
            const MainIcon = card.icon;
            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`group relative flex flex-col justify-between bg-card dark:bg-card/45 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:shadow-2xl transition-all duration-300 ${card.borderHoverClass}`}
              >
                {/* Glow on hover */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none ${card.glowClass} blur-2xl`} />

                <div>
                  {/* Top card header icon */}
                  <div className={`mb-6 p-4 rounded-2xl ${card.bgClass} inline-flex ${card.colorClass} transition-transform duration-300 group-hover:scale-110`}>
                    <MainIcon className="size-7" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {card.subtitle}
                  </p>

                  <div className="h-px bg-border/40 w-full mb-6" />

                  {/* Bullet points list */}
                  <ul className="space-y-4 mb-8">
                    {card.items.map((item, idx) => {
                      const BulletIcon = item.icon;
                      return (
                        <li key={idx} className="flex items-center gap-3.5 group/item">
                          <div className={`flex-shrink-0 p-2 rounded-xl ${item.iconBg} ${item.iconColor} transition-transform duration-300 group-hover/item:scale-110`}>
                            <BulletIcon className="size-4" />
                          </div>
                          <span className="text-sm font-medium text-foreground/80 dark:text-foreground/90">
                            {item.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Card CTA bottom section */}
                <div className="pt-2">
                  <Link href={card.link} className="w-full block">
                    <Button
                      variant="outline"
                      className="w-full justify-between items-center rounded-xl py-5 px-5 font-semibold text-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                    >
                      <span>{t("learnMore") || "Learn More"}</span>
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
