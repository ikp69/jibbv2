"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChatBubble } from "@/components/story/ChatBubble";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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

  useEffect(() => {
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
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full pt-20 pb-16 overflow-hidden">
      {/* Background — absolute (not fixed) to avoid iOS Safari glitch */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.3]"
          style={{ backgroundImage: "url('/jibb-v2-bg.png')" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/90"
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col gap-16">

        {/* Intro */}
        <div className="text-center mobile-reveal pt-8">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative w-24 h-32 sm:w-32 sm:h-40">
              <Image src="/mascots/kenji.png" alt="Kenji" fill className="object-contain" sizes="(max-width: 640px) 96px, 128px" priority />
            </div>
            <div className="relative w-24 h-32 sm:w-32 sm:h-40">
              <Image src="/mascots/aarav.png" alt="Aarav" fill className="object-contain" sizes="(max-width: 640px) 96px, 128px" priority />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            <span className="text-foreground">Building Bridges,</span>
            <br />
            <span className="bg-gradient-to-r from-jibb-indigo via-jibb-orange to-jibb-sakura bg-clip-text text-transparent">
              Sparking Innovation.
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

        {/* Narration */}
        <div className="space-y-4 text-center">
          {NARRATION_KEYS.map((key) => (
            <p key={key} className="mobile-reveal text-base sm:text-lg text-foreground/80 font-light italic leading-relaxed">
              {t(key)}
            </p>
          ))}
        </div>

        {/* Conversation — shared ChatBubble primitive */}
        <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
          {MESSAGES.map((msg, i) => (
            <div key={i} className="mobile-reveal">
              <ChatBubble
                speaker={msg.speaker}
                name={t(msg.speaker === "kenji" ? "kenjiName" : "aaravName")}
                location={msg.speaker === "kenji" ? "Tokyo" : "Noida"}
                size="sm"
              >
                {t(msg.key)}
              </ChatBubble>
            </div>
          ))}
        </div>

        {/* Handshake & CTA */}
        <div className="pt-8 flex flex-col items-center">
          <div className="mobile-reveal relative w-56 h-56 sm:w-72 sm:h-72 mb-10">
            <div aria-hidden="true" className="absolute inset-0 bg-jibb-orange/20 blur-3xl rounded-full" />
            <Image
              src="/mascots/kenji-aarav-handshake.png"
              alt="Handshake"
              fill
              className="object-contain drop-shadow-xl relative z-10"
              sizes="(max-width: 640px) 224px, 288px"
            />
          </div>

          <div className="mobile-reveal bg-card/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-border shadow-xl text-center w-full">
            {/* CTA body — fully i18n'd, no hardcoded English copy */}
            <p className="text-base sm:text-lg font-bold text-foreground mb-3">
              {t("ctaBody1")}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              {t("ctaBody2")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/membership" className="w-full sm:w-auto">
                <Button variant="accent" size="lg" className="w-full gap-2 font-bold">
                  {t("ctaJoin")}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/innovation-hub" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full gap-2 font-semibold">
                  {t("ctaExplore")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
