"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Building,
  Cpu,
  ArrowRight,
  Handshake,
} from "lucide-react";

export function StorySection() {
  const t = useTranslations();

  // Scroll entry variants for dialogues
  const bubbleVariants = (direction: "left" | "right") => ({
    hidden: { 
      opacity: 0, 
      x: direction === "left" ? -30 : 30,
      y: 15 
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
      }
    }
  });

  return (
    <section className="py-24 bg-jibb-neutral relative overflow-hidden">
      {/* Background Japanese wave vector accents */}
      <div className="absolute inset-0 wave-pattern opacity-5 pointer-events-none" />

      {/* Decorative colored glow spheres */}
      <div className="absolute top-[20%] right-[-10%] w-80 h-80 bg-jibb-orange/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[20%] left-[-10%] w-96 h-96 bg-jibb-indigo/5 rounded-full blur-3xl" />

      <div className="section-container relative z-10 max-w-5xl">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
            <MessageSquare className="size-3.5 text-primary" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-primary">
              Bilateral Matchmaking
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            {t("story.sectionTitle")}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Discover how JIBB connects Japanese manufacturing precision with Indian software innovation.
          </p>
        </div>

        {/* Cinematic Chat & Dialogue Feed */}
        <div className="space-y-6 lg:space-y-8 max-w-4xl mx-auto">
          
          {/* Kenji Bubble 1 (Left aligned) */}
          <motion.div 
            className="flex items-start gap-4 max-w-[85%] md:max-w-[75%]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={bubbleVariants("left")}
          >
            {/* Avatar */}
            <motion.div 
              className="size-10 md:size-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md cursor-default"
              whileHover={{ scale: 1.1 }}
            >
              KJ
            </motion.div>
            <div>
              {/* Sender Name & Meta */}
              <div className="flex items-center gap-2 mb-1.5 px-1">
                <span className="text-sm font-bold text-foreground">
                  {t("story.kenjiName")}
                </span>
                <span className="text-[10px] bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Building className="size-2.5" />
                  {t("story.kenjiRole")}
                </span>
              </div>
              {/* Message box */}
              <motion.div 
                className="bg-card rounded-2xl rounded-tl-sm p-4 border border-border shadow-jibb-sm text-sm md:text-base text-foreground/90 leading-relaxed cursor-default origin-left"
                whileHover={{ scale: 1.01, borderColor: "rgba(36, 59, 107, 0.2)", boxShadow: "var(--shadow-jibb-md)" }}
                transition={{ duration: 0.2 }}
              >
                {t("story.kenji1")}
              </motion.div>
            </div>
          </motion.div>

          {/* Aarav Bubble 1 (Right aligned) */}
          <motion.div 
            className="flex items-start gap-4 max-w-[85%] md:max-w-[75%] ml-auto flex-row-reverse"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={bubbleVariants("right")}
          >
            {/* Avatar */}
            <motion.div 
              className="size-10 md:size-12 rounded-xl bg-jibb-orange text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md cursor-default"
              whileHover={{ scale: 1.1 }}
            >
              AR
            </motion.div>
            <div className="text-right">
              {/* Sender Name & Meta */}
              <div className="flex items-center justify-end gap-2 mb-1.5 px-1">
                <span className="text-[10px] bg-jibb-orange/5 text-jibb-orange border border-jibb-orange/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Cpu className="size-2.5" />
                  {t("story.aaravRole")}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {t("story.aaravName")}
                </span>
              </div>
              {/* Message box */}
              <motion.div 
                className="bg-card rounded-2xl rounded-tr-sm p-4 border border-border shadow-jibb-sm text-sm md:text-base text-foreground/90 text-left leading-relaxed cursor-default origin-right"
                whileHover={{ scale: 1.01, borderColor: "rgba(233, 139, 42, 0.2)", boxShadow: "var(--shadow-jibb-md)" }}
                transition={{ duration: 0.2 }}
              >
                {t("story.aarav1")}
              </motion.div>
            </div>
          </motion.div>

          {/* Kenji Bubble 2 (Left aligned) */}
          <motion.div 
            className="flex items-start gap-4 max-w-[85%] md:max-w-[75%]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={bubbleVariants("left")}
          >
            {/* Avatar */}
            <motion.div 
              className="size-10 md:size-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md cursor-default"
              whileHover={{ scale: 1.1 }}
            >
              KJ
            </motion.div>
            <div>
              {/* Sender Name */}
              <div className="flex items-center gap-2 mb-1.5 px-1">
                <span className="text-sm font-bold text-foreground">
                  {t("story.kenjiName")}
                </span>
                <span className="text-[10px] bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Building className="size-2.5" />
                  {t("story.kenjiRole")}
                </span>
              </div>
              {/* Message box */}
              <motion.div 
                className="bg-card rounded-2xl rounded-tl-sm p-4 border border-border shadow-jibb-sm text-sm md:text-base text-foreground/90 leading-relaxed cursor-default origin-left"
                whileHover={{ scale: 1.01, borderColor: "rgba(36, 59, 107, 0.2)", boxShadow: "var(--shadow-jibb-md)" }}
                transition={{ duration: 0.2 }}
              >
                {t("story.kenji2")}
              </motion.div>
            </div>
          </motion.div>

          {/* Aarav Bubble 2 (Right aligned) */}
          <motion.div 
            className="flex items-start gap-4 max-w-[85%] md:max-w-[75%] ml-auto flex-row-reverse"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={bubbleVariants("right")}
          >
            {/* Avatar */}
            <motion.div 
              className="size-10 md:size-12 rounded-xl bg-jibb-orange text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md cursor-default"
              whileHover={{ scale: 1.1 }}
            >
              AR
            </motion.div>
            <div className="text-right">
              {/* Sender Name */}
              <div className="flex items-center justify-end gap-2 mb-1.5 px-1">
                <span className="text-[10px] bg-jibb-orange/5 text-jibb-orange border border-jibb-orange/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Cpu className="size-2.5" />
                  {t("story.aaravRole")}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {t("story.aaravName")}
                </span>
              </div>
              {/* Message box */}
              <motion.div 
                className="bg-card rounded-2xl rounded-tr-sm p-4 border border-border shadow-jibb-sm text-sm md:text-base text-foreground/90 text-left leading-relaxed cursor-default origin-right"
                whileHover={{ scale: 1.01, borderColor: "rgba(233, 139, 42, 0.2)", boxShadow: "var(--shadow-jibb-md)" }}
                transition={{ duration: 0.2 }}
              >
                {t("story.aarav2")}
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* CTA Hero Card - Your Journey Starts Here */}
        <motion.div 
          className="mt-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
        >
          <Card className="relative overflow-hidden p-8 md:p-10 border border-primary/10 shadow-jibb-xl bg-jibb-gradient text-white rounded-[24px]">
            {/* Background vector */}
            <div className="absolute inset-0 wave-pattern opacity-10 pointer-events-none animate-wave-slide" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-jibb-orange/20 rounded-full blur-2xl" />

            <div className="relative z-10 text-center space-y-6">
              <div className="inline-flex p-3 rounded-full bg-white/10 text-white backdrop-blur-md">
                <Handshake className="size-6 text-jibb-orange" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  {t("story.ctaHeadline")}
                </h3>
                <p className="text-sm md:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
                  {t("story.ctaText")}
                </p>
              </div>
              <div className="pt-2">
                <Link href="/membership">
                  <Button
                    variant="accent"
                    size="lg"
                    className="font-semibold shadow-lg hover:shadow-xl group"
                  >
                    {t("story.ctaButton")}
                    <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>

      </div>
    </section>
  );
}
