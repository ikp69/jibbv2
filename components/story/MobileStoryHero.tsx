"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

    const ctx = gsap.context(() => {
      // Fade up elements as they scroll into view
      const revealElements = gsap.utils.toArray(".mobile-reveal");
      revealElements.forEach((el: any) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
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
      {/* Background (Fixed) */}
      <div className="absolute inset-0 pointer-events-none -z-10 h-full w-full">
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-[0.3]"
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
              <Image src="/mascots/kenji.png" alt="Kenji" fill className="object-contain" priority />
            </div>
            <div className="relative w-24 h-32 sm:w-32 sm:h-40">
              <Image src="/mascots/aarav.png" alt="Aarav" fill className="object-contain" priority />
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

        {/* Conversation (WhatsApp Style) */}
        <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
          {MESSAGES.map((msg, i) => {
            const isKenji = msg.speaker === "kenji";
            return (
              <div
                key={i}
                className={`mobile-reveal flex w-full ${isKenji ? "justify-start" : "justify-end"}`}
              >
                <div className={`flex items-end gap-2.5 max-w-[88%] sm:max-w-[80%] ${!isKenji ? "flex-row-reverse" : ""}`}>
                  {/* Small Avatar */}
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md ${isKenji ? "bg-jibb-indigo" : "bg-jibb-orange"}`}>
                    {isKenji ? "KJ" : "AR"}
                  </div>
                  
                  <div>
                    <div className={`text-[10px] font-bold mb-1 opacity-60 ${!isKenji ? "text-right" : ""}`}>
                      {t(isKenji ? "kenjiName" : "aaravName")} • {isKenji ? "Tokyo" : "Noida"}
                    </div>
                    <div className={`p-4 text-[14px] leading-relaxed backdrop-blur-md border shadow-sm ${
                      isKenji 
                        ? "bg-white/80 dark:bg-black/40 border-jibb-indigo/20 text-foreground/90 rounded-2xl rounded-bl-sm"
                        : "bg-jibb-orange/10 dark:bg-jibb-orange/5 border-jibb-orange/20 text-foreground/90 rounded-2xl rounded-br-sm"
                    }`}>
                      &ldquo;{t(msg.key)}&rdquo;
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Handshake & CTA */}
        <div className="pt-8 flex flex-col items-center">
          <div className="mobile-reveal relative w-56 h-56 sm:w-72 sm:h-72 mb-10">
            <div className="absolute inset-0 bg-jibb-orange/20 blur-3xl rounded-full" />
            <Image
              src="/mascots/kenji-aarav-handshake.png"
              alt="Handshake"
              fill
              className="object-contain drop-shadow-xl relative z-10"
            />
          </div>

          <div className="mobile-reveal bg-card/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-border shadow-xl text-center w-full">
            <p className="text-base sm:text-lg font-bold text-foreground mb-4">
              Kenji and Aarav turned a complex cross-border challenge into a massive success story.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              You can do the same. Expand your reach, innovate without borders, and join our world-class ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/membership"
                className="w-full sm:w-auto px-6 py-3.5 bg-jibb-orange text-white font-bold rounded-xl shadow-lg"
              >
                {t("ctaJoin")} →
              </Link>
              <Link
                href="/innovation-hub"
                className="w-full sm:w-auto px-6 py-3.5 bg-background text-foreground font-semibold rounded-xl border border-border shadow-sm"
              >
                {t("ctaExplore")}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
