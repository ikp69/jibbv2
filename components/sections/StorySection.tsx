"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatBubble } from "@/components/story/ChatBubble";
import { motion } from "framer-motion";
import {
  MessageSquare,
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
      {/* Background Japanese wave vector accent — used here as a subtle texture only */}
      <div aria-hidden="true" className="absolute inset-0 wave-pattern opacity-5 pointer-events-none" />

      {/* Single subtle glow — one per section rule */}
      <div aria-hidden="true" className="absolute top-[20%] right-[-10%] w-80 h-80 bg-jibb-orange/5 rounded-full blur-3xl" />

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
          {/* storyDesc now comes from i18n — no hardcoded English copy */}
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t("story.storyDesc")}
          </p>
        </div>

        {/* Cinematic Chat & Dialogue Feed */}
        <div className="space-y-6 lg:space-y-8 max-w-4xl mx-auto">

          {/* Kenji message 1 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={bubbleVariants("left")}
          >
            <ChatBubble
              speaker="kenji"
              name={t("story.kenjiName")}
              location="Tokyo"
              size="sm"
            >
              {t("story.kenji1")}
            </ChatBubble>
          </motion.div>

          {/* Aarav message 1 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={bubbleVariants("right")}
          >
            <ChatBubble
              speaker="aarav"
              name={t("story.aaravName")}
              location="Noida"
              size="sm"
            >
              {t("story.aarav1")}
            </ChatBubble>
          </motion.div>

          {/* Kenji message 2 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={bubbleVariants("left")}
          >
            <ChatBubble
              speaker="kenji"
              name={t("story.kenjiName")}
              location="Tokyo"
              size="sm"
            >
              {t("story.kenji2")}
            </ChatBubble>
          </motion.div>

          {/* Aarav message 2 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={bubbleVariants("right")}
          >
            <ChatBubble
              speaker="aarav"
              name={t("story.aaravName")}
              location="Noida"
              size="sm"
            >
              {t("story.aarav2")}
            </ChatBubble>
          </motion.div>

        </div>

        {/* CTA Hero Card */}
        <motion.div
          className="mt-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
        >
          <Card className="relative overflow-hidden p-8 md:p-10 border border-primary/10 shadow-jibb-xl bg-jibb-gradient text-white rounded-[24px]">
            {/* Background vector */}
            <div aria-hidden="true" className="absolute inset-0 wave-pattern opacity-10 pointer-events-none animate-wave-slide" />
            <div aria-hidden="true" className="absolute -bottom-20 -right-20 w-60 h-60 bg-jibb-orange/20 rounded-full blur-2xl" />

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
