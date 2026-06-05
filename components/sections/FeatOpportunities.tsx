"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Link } from "@/src/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Handshake,
  Users,
  Compass,
  TrendingUp,
  MapPin,
  Calendar,
  Building2,
  Cpu,
  ArrowRight,
  Target,
  Coins,
} from "lucide-react";

type TabType = "partnerships" | "delegations" | "tradeMissions" | "investment";

export function FeatOpportunities() {
  const t = useTranslations("featOpportunities");
  const [activeTab, setActiveTab] = useState<TabType>("partnerships");

  // Tabs configuration
  const tabs = [
    { id: "partnerships", label: t("tabs.partnerships") || "Partnership Requests", icon: Handshake },
    { id: "delegations", label: t("tabs.delegations") || "Business Delegations", icon: Users },
    { id: "tradeMissions", label: t("tabs.tradeMissions") || "Trade Missions", icon: Compass },
    { id: "investment", label: t("tabs.investment") || "Investment Opportunities", icon: TrendingUp },
  ] as const;

  // Render cards based on the selected tab
  const renderCards = () => {
    switch (activeTab) {
      case "partnerships":
        return [
          {
            id: "p1",
            industry: t("data.partnerships.p1.industry") || "Semiconductors",
            direction: t("data.partnerships.p1.direction") || "JAPAN → INDIA",
            lookingFor: t("data.partnerships.p1.lookingFor") || "Indian Manufacturing Partner",
            details: t("data.partnerships.p1.details") || "PCB supplier & assembly · R&D collaboration on custom silicon architecture.",
            company: t("data.partnerships.p1.company") || "Tokyo Semiconductor Solutions",
            location: t("data.partnerships.p1.location") || "Tokyo, Japan",
            time: t("labels.posted", { time: t("data.partnerships.p1.time") || "3 days" }) || "Posted 3 days ago",
            icon: Cpu,
            themeColor: "text-jibb-indigo dark:text-jibb-indigo-light",
            themeBg: "bg-jibb-indigo/5 dark:bg-jibb-indigo/10",
            borderColor: "border-jibb-indigo/20 dark:border-jibb-indigo-light/20",
            hoverBorderColor: "hover:border-jibb-indigo/40 dark:hover:border-jibb-indigo-light/40",
            glowColor: "shadow-jibb-glow",
            link: "/services/market-entry",
            actionLabel: t("labels.details") || "View Details",
          },
          {
            id: "p2",
            industry: t("data.partnerships.p2.industry") || "Industrial Automation",
            direction: t("data.partnerships.p2.direction") || "INDIA → JAPAN",
            lookingFor: t("data.partnerships.p2.lookingFor") || "Japanese Distributor",
            details: t("data.partnerships.p2.details") || "Strategic technology partner for autonomous assembly & global robotics sales.",
            company: t("data.partnerships.p2.company") || "Bharat Robotics",
            location: t("data.partnerships.p2.location") || "Noida, India",
            time: t("labels.posted", { time: t("data.partnerships.p2.time") || "5 days" }) || "Posted 5 days ago",
            icon: Cpu,
            themeColor: "text-jibb-orange dark:text-jibb-orange-light",
            themeBg: "bg-jibb-orange/5 dark:bg-jibb-orange/10",
            borderColor: "border-jibb-orange/20 dark:border-jibb-orange-light/20",
            hoverBorderColor: "hover:border-jibb-orange/40 dark:hover:border-jibb-orange-light/40",
            glowColor: "shadow-jibb-orange-glow",
            link: "/services/partnership-facilitation",
            actionLabel: t("labels.details") || "View Details",
          },
        ];
      case "delegations":
        return [
          {
            id: "d1",
            title: t("data.delegations.d1.title") || "Japan → India Business Delegation 2026",
            direction: t("data.delegations.d1.direction") || "JAPAN → INDIA",
            date: t("data.delegations.d1.date") || "15–20 March 2026",
            cities: t("data.delegations.d1.cities") || "Delhi, Bengaluru, Hyderabad",
            focus: t("data.delegations.d1.focus") || "Semiconductors · Electronics · AI",
            scale: t("data.delegations.d1.participants") || "40 Japanese Companies",
            benefits: t("data.delegations.d1.benefits") || "B2B Meetings, Factory Visits, Government Networking Events",
            icon: Users,
            themeColor: "text-jibb-orange dark:text-jibb-orange-light",
            themeBg: "bg-jibb-orange/5 dark:bg-jibb-orange/10",
            borderColor: "border-jibb-orange/20 dark:border-jibb-orange-light/20",
            hoverBorderColor: "hover:border-jibb-orange/40 dark:hover:border-jibb-orange-light/40",
            glowColor: "shadow-jibb-orange-glow",
            link: "/membership",
            actionLabel: t("labels.apply") || "Apply Now",
          },
        ];
      case "tradeMissions":
        return [
          {
            id: "m1",
            title: t("data.tradeMissions.m1.title") || "Clean Energy Mission",
            direction: t("data.tradeMissions.m1.direction") || "India ↔ Japan",
            purpose: t("data.tradeMissions.m1.purpose") || "Connecting Indian manufacturers with Japanese green hydrogen buyers.",
            focus: t("data.tradeMissions.m1.focus") || "Renewable Energy & Hydrogen",
            scale: t("data.tradeMissions.m1.scale") || "25 Companies",
            icon: Compass,
            themeColor: "text-jibb-sakura dark:text-jibb-sakura-light",
            themeBg: "bg-jibb-sakura/5 dark:bg-jibb-sakura/10",
            borderColor: "border-jibb-sakura/20 dark:border-jibb-sakura-light/20",
            hoverBorderColor: "hover:border-jibb-sakura/40 dark:hover:border-jibb-sakura-light/40",
            glowColor: "shadow-jibb-sakura-glow",
            link: "/services/partnership-facilitation",
            actionLabel: t("labels.learnMore") || "Learn More",
          },
          {
            id: "m2",
            title: t("data.tradeMissions.m2.title") || "Smart Cities Mission",
            direction: t("data.tradeMissions.m2.direction") || "Japan → India",
            purpose: t("data.tradeMissions.m2.purpose") || "Exploring municipal collaboration in smart grid tech and EV public charging.",
            focus: t("data.tradeMissions.m2.focus") || "Infrastructure & Mobility",
            scale: t("data.tradeMissions.m2.scale") || "15 Companies",
            icon: Compass,
            themeColor: "text-jibb-indigo dark:text-jibb-indigo-light",
            themeBg: "bg-jibb-indigo/5 dark:bg-jibb-indigo/10",
            borderColor: "border-jibb-indigo/20 dark:border-jibb-indigo-light/20",
            hoverBorderColor: "hover:border-jibb-indigo/40 dark:hover:border-jibb-indigo-light/40",
            glowColor: "shadow-jibb-glow",
            link: "/services/market-entry",
            actionLabel: t("labels.learnMore") || "Learn More",
          },
        ];
      case "investment":
        return [
          {
            id: "i1",
            title: t("data.investment.i1.title") || "AI Manufacturing Platform",
            seeking: t("data.investment.i1.seeking") || "$1.5M Seed Funding",
            industry: t("data.investment.i1.industry") || "AI / Manufacturing",
            location: t("data.investment.i1.location") || "India",
            direction: t("data.investment.i1.direction") || "INDIA → JAPAN",
            type: t("data.investment.i1.type") || "Startup Equity",
            icon: Coins,
            themeColor: "text-jibb-orange dark:text-jibb-orange-light",
            themeBg: "bg-jibb-orange/5 dark:bg-jibb-orange/10",
            borderColor: "border-jibb-orange/20 dark:border-jibb-orange-light/20",
            hoverBorderColor: "hover:border-jibb-orange/40 dark:hover:border-jibb-orange-light/40",
            glowColor: "shadow-jibb-orange-glow",
            link: "/innovation-hub",
            actionLabel: t("labels.details") || "View Details",
          },
          {
            id: "i2",
            title: t("data.investment.i2.title") || "Tokyo Venture Group",
            seeking: t("data.investment.i2.seeking") || "Seeking Startups",
            industry: t("data.investment.i2.industry") || "AI, Robotics, Deep Tech",
            location: t("data.investment.i2.location") || "Japan",
            direction: t("data.investment.i2.direction") || "JAPAN → INDIA",
            type: t("data.investment.i2.type") || "VC Fund ($500K–$5M)",
            icon: TrendingUp,
            themeColor: "text-jibb-indigo dark:text-jibb-indigo-light",
            themeBg: "bg-jibb-indigo/5 dark:bg-jibb-indigo/10",
            borderColor: "border-jibb-indigo/20 dark:border-jibb-indigo-light/20",
            hoverBorderColor: "hover:border-jibb-indigo/40 dark:hover:border-jibb-indigo-light/40",
            glowColor: "shadow-jibb-glow",
            link: "/innovation-hub",
            actionLabel: t("labels.details") || "View Details",
          },
          {
            id: "i3",
            title: t("data.investment.i3.title") || "Japanese Electronics Firm",
            seeking: t("data.investment.i3.seeking") || "Joint Venture Partner",
            industry: t("data.investment.i3.industry") || "Consumer Electronics",
            location: t("data.investment.i3.location") || "India / Japan",
            direction: t("data.investment.i3.direction") || "Bilateral JV",
            type: t("data.investment.i3.type") || "$10M+ Joint Investment",
            icon: Target,
            themeColor: "text-jibb-sakura dark:text-jibb-sakura-light",
            themeBg: "bg-jibb-sakura/5 dark:bg-jibb-sakura/10",
            borderColor: "border-jibb-sakura/20 dark:border-jibb-sakura-light/20",
            hoverBorderColor: "hover:border-jibb-sakura/40 dark:hover:border-jibb-sakura-light/40",
            glowColor: "shadow-jibb-sakura-glow",
            link: "/services/partnership-facilitation",
            actionLabel: t("labels.details") || "View Details",
          },
        ];
      default:
        return [];
    }
  };

  return (
    <section className="py-24 bg-background dark:bg-[#0c1122] relative overflow-hidden border-t border-border/20">
      {/* Subtle background details */}
      <div aria-hidden="true" className="absolute top-0 right-0 w-96 h-96 bg-jibb-indigo/3 dark:bg-jibb-indigo/2 rounded-full blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 w-96 h-96 bg-jibb-orange/3 dark:bg-jibb-orange/2 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/10 backdrop-blur-md">
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary dark:text-primary-foreground">
              {t("tagline") || "Opportunity Marketplace"}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            {t("sectionTitle") || "Featured Opportunities"}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("sectionSubtitle") || "Discover active collaboration opportunities between India and Japan."}
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap md:flex-nowrap p-1.5 rounded-xl bg-jibb-cream dark:bg-[#151c30] border border-border/40 gap-1.5 max-w-full overflow-x-auto no-scrollbar justify-center">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-semibold tracking-tight transition-all duration-300 ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeOpportunityTab"
                      className="absolute inset-0 bg-primary dark:bg-jibb-indigo rounded-xl shadow-lg"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">
                    <TabIcon className="size-4 inline-block mr-1.5 align-middle" />
                    <span className="align-middle">{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards Grid with Entrance Animation */}
        <div className="min-h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {renderCards().map((card) => {
                const CardIcon = card.icon;
                return (
                  <div
                    key={card.id}
                    className={`group relative flex flex-col justify-between rounded-2xl bg-card dark:bg-[#161f38]/60 p-7 border border-border/50 transition-all duration-300 hover:shadow-xl ${card.borderColor} ${card.hoverBorderColor}`}
                  >
                    {/* Background glow on hover */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none ${card.glowColor} blur-xl`} />

                    <div>
                      {/* Top Header Row of Card */}
                      <div className="flex justify-between items-start gap-4 mb-5">
                        <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${card.themeColor} py-1 px-3 rounded-full ${card.themeBg}`}>
                          {"industry" in card ? card.industry : t("labels.focus")}
                        </span>
                        <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-widest bg-muted/30 px-2 py-1 rounded">
                          {card.direction}
                        </span>
                      </div>

                      {/* Partnerships layout */}
                      {"lookingFor" in card && (
                        <div className="space-y-4">
                          <div>
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                              {t("labels.lookingFor") || "Looking for:"}
                            </span>
                            <h3 className="text-xl font-bold text-foreground tracking-tight leading-snug">
                              {card.lookingFor}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {card.details}
                          </p>
                        </div>
                      )}

                      {/* Delegations layout */}
                      {activeTab === "delegations" && (
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-foreground tracking-tight leading-snug">
                            {"title" in card ? card.title : ""}
                          </h3>
                          <div className="space-y-2.5 pt-1">
                            <div className="flex items-center gap-2 text-sm text-foreground/80">
                              <Calendar className="size-4 text-jibb-orange flex-shrink-0" />
                              <span className="font-medium">{"date" in card ? card.date : ""}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground/80">
                              <MapPin className="size-4 text-jibb-orange flex-shrink-0" />
                              <span>{"cities" in card ? card.cities : ""}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground/80">
                              <Users className="size-4 text-jibb-orange flex-shrink-0" />
                              <span className="font-semibold">{"scale" in card ? card.scale : ""}</span>
                            </div>
                          </div>
                          <div className="border-t border-border/30 pt-3.5">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                              {t("labels.benefits") || "Benefits:"}
                            </span>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {"benefits" in card ? card.benefits : ""}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Trade Missions layout */}
                      {activeTab === "tradeMissions" && (
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-foreground tracking-tight leading-snug">
                            {"title" in card ? card.title : ""}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {"purpose" in card ? card.purpose : ""}
                          </p>
                          <div className="flex flex-wrap gap-4 pt-2 border-t border-border/30">
                            <div>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5">
                                {t("labels.focus") || "Focus:"}
                              </span>
                              <span className="text-xs font-semibold text-foreground/90">
                                {"focus" in card ? card.focus : ""}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5">
                                {t("labels.participants") || "Participants:"}
                              </span>
                              <span className="text-xs font-semibold text-foreground/90">
                                {"scale" in card ? card.scale : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Investment layout */}
                      {activeTab === "investment" && (
                        <div className="space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">
                                {t("labels.seeking") || "Seeking:"}
                              </span>
                              <h3 className="text-xl font-bold text-foreground tracking-tight">
                                {"title" in card ? card.title : ""}
                              </h3>
                            </div>
                          </div>
                          <div className="p-4 rounded-2xl bg-muted/40 dark:bg-muted/5 border border-border/30 flex items-center justify-between gap-3">
                            <div>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">
                                {t("labels.seeking") || "Seeking:"}
                              </span>
                              <span className="text-lg font-black text-jibb-orange tracking-tight">
                                {"seeking" in card ? card.seeking : ""}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">
                                {t("labels.type") || "Type:"}
                              </span>
                              <span className="text-xs font-semibold text-foreground/80">
                                {"type" in card ? card.type : ""}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-4 pt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Building2 className="size-3.5" />
                              {"industry" in card ? card.industry : ""}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="size-3.5" />
                              {"location" in card ? card.location : ""}
                            </span>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Card Footer Section */}
                    <div className="mt-8">
                      {/* Sub-info for partnerships */}
                      {"company" in card && (
                        <div className="flex items-center justify-between border-t border-border/30 pt-4 mb-4 text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground/80 flex items-center gap-1">
                            <Building2 className="size-3.5 text-jibb-indigo/60" />
                            {card.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3.5 text-jibb-indigo/60" />
                            {card.location}
                          </span>
                        </div>
                      )}

                      <Link href={card.link} className="w-full block">
                        <Button
                          variant="outline"
                          className="w-full justify-between items-center rounded-xl py-5 px-5 font-semibold text-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                        >
                          <span>{card.actionLabel}</span>
                          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>

                      {/* Display posted time for partnerships */}
                      {"time" in card && (
                        <span className="text-[10px] text-muted-foreground/60 text-right block mt-2">
                          {card.time}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* View All Button at the bottom */}
        <ScrollReveal direction="up" delay={0.1} className="text-center mt-14">
          <Link href="/services">
            <Button variant="accent" size="lg" className="px-8 py-6 text-base font-semibold rounded-xl shadow-lg group">
              <span>{t("viewAll") || "View All Opportunities"}</span>
              <ArrowRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </ScrollReveal>
        
      </div>
    </section>
  );
}
