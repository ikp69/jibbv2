"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChatBubble } from "@/components/story/ChatBubble";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES: { speaker: "kenji" | "aarav"; key: string }[] = [
  { speaker: "kenji", key: "kenji1" },
  { speaker: "aarav", key: "aarav1" },
  { speaker: "kenji", key: "kenji2" },
  { speaker: "aarav", key: "aarav2" },
  { speaker: "kenji", key: "kenji3" },
  { speaker: "aarav", key: "aarav3" },
  { speaker: "kenji", key: "kenji4" },
  { speaker: "aarav", key: "aarav4" },
];

const NARRATION_KEYS = ["narration1", "narration2", "narration3"] as const;

export function MobileStoryHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("story");

  const [hasReadStory, setHasReadStory] = useState(false);
  const [showStory, setShowStory] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const read = localStorage.getItem("jibb_story_read");
      if (read === "true") {
        setHasReadStory(true);
        setShowStory(false);
      } else {
        localStorage.setItem("jibb_story_read", "true");
      }
    }
  }, []);

  // Auto-scroll story slides right to left every 3 seconds
  useEffect(() => {
    if (!showStory) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === MESSAGES.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(timer);
  }, [showStory]);

  useEffect(() => {
    if (!showStory) return;

    gsap.registerPlugin(ScrollTrigger);

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Fade up elements as they scroll into view
      const revealElements = gsap.utils.toArray(".mobile-reveal");
      revealElements.forEach((el: unknown) => {
        gsap.fromTo(
          el as Element,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el as Element,
              start: "top 100%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
      // Set initial states for handshake assets
      gsap.set(".mobile-hs-handshake", { autoAlpha: 0, scale: 0.8 });
      gsap.set(".mobile-hs-kenji", { x: -140, autoAlpha: 0 });
      gsap.set(".mobile-hs-aarav", { x: 140, autoAlpha: 0 });

      // Handshake animation timeline
      const hsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".mobile-handshake-trigger",
          start: "top 95%",
          toggleActions: "play none none reverse",
        }
      });

      hsTimeline.to(".mobile-hs-kenji", {
        x: -50,
        autoAlpha: 1,
        duration: 1.0,
        ease: "power2.out"
      });
      hsTimeline.to(".mobile-hs-aarav", {
        x: 50,
        autoAlpha: 1,
        duration: 1.0,
        ease: "power2.out"
      }, "<");

      hsTimeline.to([".mobile-hs-kenji", ".mobile-hs-aarav"], {
        autoAlpha: 0,
        scale: 0.9,
        duration: 0.25,
        ease: "power2.in"
      });

      hsTimeline.to(".mobile-hs-handshake", {
        autoAlpha: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.5)"
      }, "-=0.1");
      // Set initial states for CTA elements
      gsap.set(".mobile-cta-card", { autoAlpha: 0, y: 40 });
      gsap.set(".mobile-cta-btn", { scale: 0.3, autoAlpha: 0, transformOrigin: "center center" });

      // CTA scroll timeline
      const ctaTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".mobile-cta-card",
          start: "top 95%",
          toggleActions: "play none none reverse",
        }
      });

      ctaTimeline.to(".mobile-cta-card", {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      });

      ctaTimeline.to(".mobile-cta-btn", {
        scale: 1,
        autoAlpha: 1,
        duration: 0.8,
        ease: "back.out(2.2)"
      }, "-=0.4");

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }, containerRef);

    return () => ctx.revert();
  }, [showStory]);

  return (
    <section ref={containerRef} className="relative w-full pt-20 overflow-hidden">
      {/* Hero Artwork Block at the top */}
      <div className="relative w-full h-[260px] xs:h-[320px] sm:h-[420px] overflow-hidden -mt-20">
        <Image
          src="/JIBB_LandingPage_Illustration_Final.webp"
          alt="JIBB Background Illustration"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top scale-[1.25] opacity-[0.99]"
        />

        {/* Mascot images overlaying the bottom part of the artwork */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-[100px] z-10">
          <div className="relative w-20 h-24 sm:w-28 sm:h-32 animate-float">
            <Image src="/mascots/kenji.png" alt="Kenji" fill className="object-contain" sizes="(max-width: 640px) 80px, 112px" priority />
          </div>
          <div className="relative w-20 h-24 sm:w-28 sm:h-32 animate-float-delayed">
            <Image src="/mascots/aarav.png" alt="Aarav" fill className="object-contain" sizes="(max-width: 640px) 80px, 112px" priority />
          </div>
        </div>

        {/* Gradients to fade out the top and bottom of the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
      </div>

      {/* Blue to Orange Gradient Area for Intro, Narration, and Chat bubbles */}
      <div className="relative w-full pb-6">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, var(--mobile-hero-grad-left) 0%, var(--mobile-hero-grad-right) 100%)"
          }}
        />
        {/* Top vertical fade to blend with artwork bottom border */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-16 -z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to top, transparent, var(--bg-primary))"
          }}
        />
        {/* Bottom vertical fade to blend with handshake section background */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-24 -z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--bg-primary))"
          }}
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col gap-12">
          {/* Intro */}
          <div className="text-center mobile-reveal pt-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              <span className="text-foreground">{t("buildingBridges")},</span>
              <br />
              <span className="bg-gradient-to-r from-jibb-indigo via-jibb-orange to-jibb-sakura bg-clip-text text-transparent">
                {t("sparkingInnovation")}
              </span>
            </h1>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-jibb-orange/40" />
              <span className="text-sm font-semibold tracking-[0.15em] uppercase text-jibb-indigo/60">
                A JIBB Story
              </span>
              <div className="h-px w-8 bg-jibb-orange/40" />
            </div>
          </div>

          {/* Narration (Rendered always) */}
          <div className="space-y-4 text-center">
            {NARRATION_KEYS.map((key) => (
              <p key={key} className="mobile-reveal text-base sm:text-lg text-foreground/80 font-light italic leading-relaxed">
                {t(key)}
              </p>
            ))}
          </div>

          {/* DELIBERATE BUTTON IF NOT SHOWING STORY */}
          {!showStory && (
            <div className="text-center pb-4">
              <Button
                onClick={() => setShowStory(true)}
                variant="outline"
                size="sm"
                className="w-auto gap-1.5 font-semibold px-6 py-2.5 rounded-xl border border-gray-200 dark:border-border/30 bg-white/95 hover:bg-white text-gray-800 dark:text-white dark:bg-slate-900/80 dark:hover:bg-slate-900 shadow-sm"
              >
                <span>{t("readStory")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {showStory && (
            /* Conversation Carousel */
            <div className="w-full max-w-xl mx-auto flex flex-col gap-4">
              <div
                className="relative min-h-[160px] w-full px-1 cursor-pointer"
                onClick={() => setCurrentIndex((prev) => (prev === MESSAGES.length - 1 ? 0 : prev + 1))}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="w-full"
                  >
                    <ChatBubble
                      speaker={MESSAGES[currentIndex].speaker}
                      name={t(MESSAGES[currentIndex].speaker === "kenji" ? "kenjiName" : "aaravName")}
                      location={MESSAGES[currentIndex].speaker === "kenji" ? "Tokyo" : "Noida"}
                      size="sm"
                    >
                      {t(MESSAGES[currentIndex].key)}
                    </ChatBubble>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Controls (Dots only, centered) */}
              <div className="flex justify-center gap-1.5 mt-1 select-none">
                {MESSAGES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      idx === currentIndex
                        ? "w-4 bg-jibb-orange"
                        : "bg-gray-300 dark:bg-gray-700"
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Handshake & CTA section (rests on solid cream page background) */}
      {showStory && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 mt-4">
          {/* Handshake & CTA */}
          <div className="pt-8 flex flex-col items-center">
            <div className="mobile-handshake-trigger relative w-full h-56 sm:h-72 mb-10 flex items-center justify-center">
              {/* Kenji Mascot sliding in from left */}
              <div className="mobile-hs-kenji absolute w-24 h-32 sm:w-32 sm:h-40">
                <Image
                  src="/mascots/kenji.png"
                  alt="Kenji"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 96px, 128px"
                />
              </div>
              {/* Aarav Mascot sliding in from right */}
              <div className="mobile-hs-aarav absolute w-24 h-32 sm:w-32 sm:h-40">
                <Image
                  src="/mascots/aarav.png"
                  alt="Aarav"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 96px, 128px"
                />
              </div>
              {/* Handshake mascot appearing at the center */}
              <div className="mobile-hs-handshake absolute w-56 h-56 sm:w-72 sm:h-72">
                <div aria-hidden="true" className="absolute inset-0 bg-jibb-orange/20 blur-3xl rounded-full" />
                <Image
                  src="/mascots/kenji-aarav-handshake.png"
                  alt="Handshake"
                  fill
                  className="object-contain drop-shadow-xl"
                  sizes="(max-width: 640px) 224px, 288px"
                />
              </div>
            </div>

            <div className="mobile-cta-card bg-card/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-border shadow-xl text-center w-full">
              {/* CTA body — fully i18n'd, no hardcoded English copy */}
              <p className="text-base sm:text-lg font-bold text-foreground mb-3">
                {t("ctaBody1")}
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                {t("ctaBody2")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/membership" className="w-full sm:w-auto">
                  <Button variant="accent" size="lg" className="w-full gap-2 font-bold btn-pulsate mobile-cta-btn">
                    {t("ctaJoin")}
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
