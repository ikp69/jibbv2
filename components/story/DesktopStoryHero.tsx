"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";




/* ============================================================
   CONVERSATION DATA STRUCTURE
   Maps to i18n keys in messages/{locale}.json → story.*
   ============================================================ */
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
const CHAPTERS = [
  "Cover",
  "Intro",
  "Narration",
  "Pair 1",
  "Pair 2",
  "Pair 3",
  "Pair 4",
  "Converge",
  "Handshake",
  "Join"
];

/* ============================================================
   STORY HERO — Scroll-Driven Cinematic Experience
   ============================================================ */
export function DesktopStoryHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("story");
  const [chapter, setChapter] = useState(0);
  const [canReplay, setCanReplay] = useState(false);
  const chapterRef = useRef(0);
  const canReplayRef = useRef(false);

  /* ---- Navigation handlers ---- */
  const handleSkip = useCallback(() => {
    if (!sectionRef.current) return;
    const bottom =
      sectionRef.current.offsetTop + sectionRef.current.offsetHeight;
    window.scrollTo({ top: bottom + 1, behavior: "smooth" });
  }, []);

  const handleReplay = useCallback(() => {
    if (!sectionRef.current) return;
    window.scrollTo({ top: sectionRef.current.offsetTop, behavior: "smooth" });
  }, []);

  /* ---- GSAP ScrollTrigger + Master Timeline ---- */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const ctx = gsap.context(() => {
      /* ── Initial hidden states ── */
      gsap.set(".story-cover-panel", {
        scale: 1,
        borderRadius: "0px",
        y: "0%",
        autoAlpha: 1,
        force3D: true
      });
      gsap.set(".story-cover-image", {
        scale: 1.05,
        force3D: true
      });
      gsap.set(".story-main-content", {
        y: "100%",
        force3D: true
      });
      gsap.set(".story-narration-wrap", { autoAlpha: 0 });
      gsap.set([".sn-0", ".sn-1", ".sn-2"], { autoAlpha: 0, y: 24 });
      gsap.set(".story-convo-wrap", { autoAlpha: 0 });
      gsap.set([".story-convo-pair-0", ".story-convo-pair-1", ".story-convo-pair-2", ".story-convo-pair-3"], {
        autoAlpha: 0,
        y: 20
      });
      gsap.set(".story-hs-wrap", { autoAlpha: 0, scale: 0.85 });
      gsap.set(".story-hs-glow", { autoAlpha: 0, scale: 0.3 });
      gsap.set(".story-cta-wrap", { autoAlpha: 0 });
      gsap.set(".story-cta-content", { autoAlpha: 0, y: 40 });
      gsap.set([".cta-text-1", ".cta-text-2", ".cta-text-3", ".cta-buttons"], { autoAlpha: 0, y: 20 });
      gsap.set(".story-bg-warm", { autoAlpha: 0 });

      MESSAGES.forEach((msg, i) => {
        gsap.set(`.sb-${i}`, {
          autoAlpha: 0,
          x: msg.speaker === "kenji" ? -30 : 30,
          scale: 0.98,
        });
      });

      /* ── Build master timeline ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3800",      // Increased scroll distance to accommodate cover transition
          pin: panelRef.current,
          pinSpacing: true,   // let GSAP add the spacer div
          anticipatePin: 1,   // prevents jitter when pinning starts
          scrub: 0.5,         // increased for an even smoother, premium floaty feel
          snap: {
            snapTo: "labels",
            duration: { min: 0.3, max: 0.8 },
            ease: "power1.inOut",
          },
          onUpdate: (self) => {
            const p = self.progress;
            const ch = Math.min(
              CHAPTERS.length - 1,
              Math.floor(p * CHAPTERS.length)
            );
            // Only setState when chapter actually changes
            if (ch !== chapterRef.current) {
              chapterRef.current = ch;
              setChapter(ch);
            }
            const shouldReplay = p > 0.15; // Adjusted since cover is phase 1
            if (shouldReplay !== canReplayRef.current) {
              canReplayRef.current = shouldReplay;
              setCanReplay(shouldReplay);
            }
          },
        },
      });

      // Define resting points so animations complete when scrolling stops
      tl.addLabel("cover", 0);
      tl.addLabel("intro", 12);
      tl.addLabel("narration", 24);
      tl.addLabel("pair1", 34);
      tl.addLabel("pair2", 45);
      tl.addLabel("pair3", 55);
      tl.addLabel("pair4", 65);
      tl.addLabel("converge", 76.5);
      tl.addLabel("handshake", 84);
      tl.addLabel("cta", 96.5);

      /* ═══════════════════════════════════════
         PHASE 0 — COVER REVEAL (timeline 0-12)
         ═══════════════════════════════════════ */
      tl.to(".story-cover-panel", {
        scale: 0.9,
        borderRadius: "24px",
        y: "-5vh",
        autoAlpha: 0,
        duration: 12,
        ease: "power2.inOut",
        force3D: true
      }, 0);

      tl.to(".story-cover-image", {
        scale: 0.85,
        duration: 12,
        ease: "power2.inOut",
        force3D: true
      }, 0);

      tl.to(".story-main-content", {
        y: "0%",
        duration: 12,
        ease: "power2.inOut",
        force3D: true
      }, 0);

      /* ═══════════════════════════════════════
         PHASE 1 — INTRO  (timeline 12–22)
         Title visible by default, then fades.
         ═══════════════════════════════════════ */
      tl.to(".story-intro-wrap", {
        autoAlpha: 0,
        y: -40,
        duration: 1.5,
        ease: "power2.in",
      }, 17);

      /* ═══════════════════════════════════════
         PHASE 2 — NARRATION  (timeline 22–32)
         Setting the scene, all sentences together.
         ═══════════════════════════════════════ */
      tl.to(".story-narration-wrap", { autoAlpha: 1, duration: 2 }, 22);
      tl.to([".sn-0", ".sn-1", ".sn-2"], {
        autoAlpha: 1,
        y: 0,
        duration: 1.5,
        stagger: 0, // Fade all 3 lines in together
        ease: "power2.out"
      }, 22.5);
      tl.to(".story-narration-wrap", { autoAlpha: 0, y: -20, duration: 2.5 }, 30.5);

      /* ═══════════════════════════════════════
         PHASE 3 — CONVO PAIR 1  (timeline 32–42)
         ═══════════════════════════════════════ */
      tl.to(".story-convo-wrap", { autoAlpha: 1, duration: 1 }, 32);
      tl.to(".story-convo-pair-0", { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 32.5);
      tl.to([".sb-0", ".sb-1"], { autoAlpha: 1, x: 0, scale: 1, duration: 1.5, ease: "power2.out" }, 32.5);
      // Mascot reactions
      tl.to([".smk-img", ".sma-img"], { scale: 1.05, y: -4, duration: 1.5, ease: "power2.out" }, 32.5);
      tl.to([".smk-img", ".sma-img"], { scale: 1, y: 0, duration: 1.5 }, 34);

      /* ═══════════════════════════════════════
         PHASE 4 — CONVO PAIR 2  (timeline 42–52)
         ═══════════════════════════════════════ */
      tl.to(".story-convo-pair-0", { autoAlpha: 0, y: -20, duration: 2.5, ease: "power2.in" }, 42);
      tl.to(".story-convo-pair-1", { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 43.5);
      tl.to([".sb-2", ".sb-3"], { autoAlpha: 1, x: 0, scale: 1, duration: 1.5, ease: "power2.out" }, 43.5);
      tl.to([".smk-img", ".sma-img"], { scale: 1.05, y: -4, duration: 1.5, ease: "power2.out" }, 43.5);
      tl.to([".smk-img", ".sma-img"], { scale: 1, y: 0, duration: 1.5 }, 45);

      /* ═══════════════════════════════════════
         PHASE 5 — CONVO PAIR 3  (timeline 52–62)
         ═══════════════════════════════════════ */
      tl.to(".story-convo-pair-1", { autoAlpha: 0, y: -20, duration: 2.5, ease: "power2.in" }, 52);
      tl.to(".story-convo-pair-2", { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 53.5);
      tl.to([".sb-4", ".sb-5"], { autoAlpha: 1, x: 0, scale: 1, duration: 1.5, ease: "power2.out" }, 53.5);
      tl.to([".smk-img", ".sma-img"], { scale: 1.05, y: -4, duration: 1.5, ease: "power2.out" }, 53.5);
      tl.to([".smk-img", ".sma-img"], { scale: 1, y: 0, duration: 1.5 }, 55);

      /* ═══════════════════════════════════════
         PHASE 6 — CONVO PAIR 4  (timeline 62–72)
         ═══════════════════════════════════════ */
      tl.to(".story-convo-pair-2", { autoAlpha: 0, y: -20, duration: 2.5, ease: "power2.in" }, 62);
      tl.to(".story-convo-pair-3", { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 63.5);
      tl.to([".sb-6", ".sb-7"], { autoAlpha: 1, x: 0, scale: 1, duration: 1.5, ease: "power2.out" }, 63.5);
      tl.to([".smk-img", ".sma-img"], { scale: 1.05, y: -4, duration: 1.5, ease: "power2.out" }, 63.5);
      tl.to([".smk-img", ".sma-img"], { scale: 1, y: 0, duration: 1.5 }, 65);

      /* ═══════════════════════════════════════
         PHASE 7 — CONVERGENCE  (timeline 72–82)
         Mascots meet in the center.
         ═══════════════════════════════════════ */
      tl.to(".story-convo-pair-3", { autoAlpha: 0, y: -20, duration: 2.5, ease: "power2.in" }, 72);
      tl.to(".story-mascot-kenji", { x: "22vw", duration: 4, ease: "power2.inOut" }, 72.5);
      tl.to(".story-mascot-aarav", { x: "-22vw", duration: 4, ease: "power2.inOut" }, 72.5);

      /* ═══════════════════════════════════════
         PHASE 8 — THE HANDSHAKE  (timeline 82–90)
         Individual images fade out, handshake fades in.
         ═══════════════════════════════════════ */
      tl.to(".story-mascot-kenji", { autoAlpha: 0, duration: 2.5, ease: "power2.in" }, 82);
      tl.to(".story-mascot-aarav", { autoAlpha: 0, duration: 2.5, ease: "power2.in" }, 82);
      tl.to(".story-bg-warm", { autoAlpha: 0.35, duration: 1.5 }, 82);
      tl.to(".story-hs-glow", { autoAlpha: 0.6, scale: 1.1, duration: 1.5, ease: "power2.out" }, 82);
      tl.to(".story-hs-wrap", { autoAlpha: 1, scale: 1, duration: 1.5, ease: "back.out(1.2)" }, 82.5);

      /* ═══════════════════════════════════════
         PHASE 9 — FINAL CTA  (timeline 90–98)
         ═══════════════════════════════════════ */
      tl.to(".story-hs-wrap", { y: "-15vh", scale: 0.95, duration: 4, ease: "power2.inOut" }, 90);
      tl.to(".story-hs-glow", { y: "-15vh", duration: 4, ease: "power2.inOut" }, 90);

      tl.to(".story-cta-wrap", { autoAlpha: 1, duration: 2 }, 90);
      tl.to(".story-cta-content", { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out" }, 90.5);

      tl.to(".cta-text-1", { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 92);
      tl.to(".cta-text-2", { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 93.5);
      tl.to(".cta-text-3", { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 95);
      tl.to(".cta-buttons", { autoAlpha: 1, y: 0, duration: 2, ease: "power2.out" }, 96.5);

      tl.to([".story-mascot-kenji", ".story-mascot-aarav"], { display: "none", duration: 0.1 }, 92);

      // Smooth custom mascot floating tweens to prevent compositor thrash with CSS animations
      gsap.to(".smk-img", {
        y: -8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".sma-img", {
        y: -8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- Overlap-aware bubble positioning for tablet breakpoint ---- */
  useEffect(() => {
    const MIN_GAP = 20; // px minimum gap between overlapping bubbles
    const MQ = "(min-width: 768px) and (max-width: 1200px)";

    const adjustOverlaps = () => {
      const inRange = window.matchMedia(MQ).matches;

      for (let i = 0; i < 4; i++) {
        const pair = sectionRef.current?.querySelector(
          `.story-convo-pair-${i}`
        );
        if (!pair) continue;

        const kBubble = pair.querySelector(
          ".story-bubble-kenji"
        ) as HTMLElement | null;
        const aBubble = pair.querySelector(
          ".story-bubble-aarav"
        ) as HTMLElement | null;
        if (!kBubble || !aBubble) continue;

        // Reset to CSS-defined base position before measuring
        aBubble.style.removeProperty("top");

        if (!inRange) continue;

        // Force reflow so measurements reflect the reset
        void aBubble.offsetHeight;

        // Use offset* properties — immune to GSAP transform animations
        const kRight = kBubble.offsetLeft + kBubble.offsetWidth;
        const kBottom = kBubble.offsetTop + kBubble.offsetHeight;
        const aLeft = aBubble.offsetLeft;
        const aTop = aBubble.offsetTop;
        const aBottom = aTop + aBubble.offsetHeight;

        const overlapsH = kRight > aLeft;
        const overlapsV = kBottom > aTop && kBubble.offsetTop < aBottom;

        if (overlapsH && overlapsV) {
          const shift = kBottom - aTop + MIN_GAP;
          const cssTop = parseFloat(getComputedStyle(aBubble).top) || 0;
          aBubble.style.setProperty(
            "top",
            `${cssTop + shift}px`,
            "important"
          );
        }
      }
    };

    let debounceTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(adjustOverlaps, 150);
    };

    // Run after layout + GSAP settle, and again after fonts load
    const initTimer = setTimeout(adjustOverlaps, 300);
    window.addEventListener("resize", onResize);
    document.fonts?.ready?.then(() => setTimeout(adjustOverlaps, 100));

    return () => {
      clearTimeout(initTimer);
      clearTimeout(debounceTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <section
      ref={sectionRef}
      id="story-hero"
      className="relative"
    >
      {/* ━━━ Pinned Panel ━━━ */}
      <div
        ref={panelRef}
        className="w-full relative overflow-hidden h-screen"
        style={{ height: "100dvh" }}
      >
        {/* Cover Screen Panel */}
        <div
          className="story-cover-panel absolute inset-0 w-full h-full overflow-hidden bg-background"
          style={{
            transformOrigin: "center center",
          }}
        >
          {/* Cover image that we will animate/scale */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <Image
              src="/JIBB_LandingPage_Illustration_Final.webp"
              alt="Cover Illustration"
              fill
              sizes="100vw"
              className="story-cover-image object-cover object-center will-change-transform"
              priority
            />
          </div>
          {/* Subtle overlay on Cover Image */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none z-10" />
        </div>

        {/* Main Story Content Panel */}
        <div className="story-main-content absolute inset-0 w-full h-full flex flex-col overflow-hidden bg-background">
          {/* ═══════════ BACKGROUND LAYER ═══════════ */}
          <div aria-hidden="true" className="story-bg-warm absolute inset-0 bg-jibb-orange/5 pointer-events-none" />

          {/* hero-bg wrapper class for desktop */}
          <div className="hero-bg-desktop absolute inset-0 pointer-events-none z-0">
            {/* Base JIBB V2 background image with optimal opacity */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.99]"
              style={{ backgroundImage: "url('/jibb-v2-bg.png')" }}
            />

            {/* Subtle Grid Vector Background (Precision/Tech) */}
            <div
              className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23243B6B' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {/* Japanese Wave Pattern Vector (Tradition) */}
            <div className="absolute inset-0 wave-pattern opacity-[0.35] dark:opacity-[0.15]" />

            {/* Desktop Overlay Layers */}
            <div className="hero-overlay-desktop-1 absolute inset-0" />
            <div className="hero-overlay-desktop-2 absolute inset-0" />
            <div className="hero-overlay-desktop-3 absolute bottom-0 left-0 right-0" />
            <div className="hero-overlay-desktop-4 absolute inset-0" />
            <div className="hero-overlay-desktop-5 absolute inset-0" />

            {/* Warm glow overlay — revealed during handshake */}
            <div
              className="story-bg-warm absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(251,191,36,0.25) 0%, rgba(233,139,42,0.08) 40%, transparent 70%)",
              }}
            />

            {/* Subtle grid texture */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(36,59,107,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(36,59,107,0.3) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />
          </div>

          {/* ═══════════ CONTENT LAYER ═══════════ */}
          <div className="relative z-10 h-full flex flex-col">
            {/* ── Main Stage: Mascots + Center ── */}
            <div className="flex-1 flex items-center justify-center px-4 md:px-8 lg:px-16 pt-20 md:pt-24 pb-4">
              {/* ──── Kenji Mascot (Desktop) ──── */}
              <div className="story-mascot-kenji hidden md:flex flex-col items-center gap-3 w-56 lg:w-64 xl:w-72 shrink-0 will-change-transform">
                <div className="smk-img relative w-56 h-72 lg:w-64 lg:h-80 xl:w-72 xl:h-96 will-change-transform">
                  <Image
                    src="/mascots/kenji.png"
                    alt="Kenji — Tech Executive from Tokyo"
                    fill
                    className="object-contain drop-shadow-lg"
                    sizes="(max-width: 1024px) 224px, (max-width: 1280px) 256px, 288px"
                    priority
                  />
                </div>
                <span className="text-[11px] font-bold text-jibb-indigo/80 tracking-[0.15em] uppercase select-none">
                  {t("kenjiName")}
                </span>
              </div>

              {/* ──── Center Stage ──── */}
              <div className="story-stage flex-1 max-w-2xl mx-2 md:mx-6 lg:mx-10 h-[60vh] md:h-[62vh] relative">
                {/* ▸ INTRO SCENE */}
                <div className="story-intro-wrap absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-4">
                  {/* Mobile mascots */}
                  <div className="flex md:hidden items-center justify-center gap-8 mb-8">
                    <div className="relative w-32 h-40 sm:w-40 sm:h-48 animate-float">
                      <Image
                        src="/mascots/kenji.png"
                        alt="Kenji"
                        fill
                        className="object-contain drop-shadow-md"
                        sizes="(max-width: 640px) 128px, 160px"
                        priority
                      />
                    </div>
                    <div className="relative w-32 h-40 sm:w-40 sm:h-48 animate-float-delayed">
                      <Image
                        src="/mascots/aarav.png"
                        alt="Aarav"
                        fill
                        className="object-contain drop-shadow-md"
                        sizes="(max-width: 640px) 128px, 160px"
                        priority
                      />
                    </div>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold tracking-tight leading-[1.08]">
                    <span className="text-foreground">{t("buildingBridges")}</span>
                    <br />
                    <span className="bg-gradient-to-r from-jibb-indigo via-jibb-orange to-jibb-sakura bg-clip-text text-transparent">
                      {t("sparkingInnovation")}
                    </span>
                  </h1>

                  <div className="mt-6 md:mt-8 flex items-center gap-3">
                    <div className="h-px w-8 bg-jibb-orange/40" />
                    <span className="text-sm md:text-base font-semibold tracking-[0.18em] uppercase text-jibb-indigo/50">
                      {t("jibbStory")}
                    </span>
                    <div className="h-px w-8 bg-jibb-orange/40" />
                  </div>

                  <p className="mt-6 text-sm text-muted-foreground/60 flex items-center gap-2 select-none">
                    <span className="inline-block w-4 h-4 border-2 border-muted-foreground/30 rounded-full relative">
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="block w-1 h-1 bg-muted-foreground/40 rounded-full animate-bounce" />
                      </span>
                    </span>
                    {t("scrollToBegin")}
                  </p>
                </div>

                {/* ▸ NARRATION SCENE */}
                <div className="story-narration-wrap absolute inset-0 flex flex-col items-center justify-center text-center z-15 px-2 md:px-6">
                  <div className="max-w-lg space-y-5 md:space-y-6">
                    {NARRATION_KEYS.map((key, i) => (
                      <p
                        key={key}
                        className={`sn-${i} text-base md:text-lg lg:text-xl leading-relaxed md:leading-loose text-foreground/75 font-light italic`}
                      >
                        {t(key)}
                      </p>
                    ))}
                  </div>
                </div>

                {/* ▸ CONVERSATION SCENE (Paired cross-fades) */}
                <div className="story-convo-wrap absolute inset-0 z-10 overflow-hidden flex items-center justify-center px-4">
                  <div className="w-full max-w-2xl h-[420px] relative">
                    {[0, 1, 2, 3].map((pairIndex) => {
                      const msg1 = MESSAGES[pairIndex * 2];
                      const msg2 = MESSAGES[pairIndex * 2 + 1];
                      return (
                        <div
                          key={pairIndex}
                          className={`story-convo-pair-${pairIndex} absolute inset-0 flex flex-col justify-center gap-5 will-change-transform pointer-events-none`}
                        >
                          {[msg1, msg2].map((msg, subIndex) => {
                            const isKenji = msg.speaker === "kenji";
                            return (
                              <div
                                key={msg.key}
                                className={`sb-${pairIndex * 2 + subIndex} story-convo-bubble will-change-transform pointer-events-auto ${isKenji
                                  ? "story-bubble-kenji self-start mr-auto max-w-[92%] md:max-w-[82%]"
                                  : "story-bubble-aarav self-end ml-auto max-w-[92%] md:max-w-[82%]"
                                  }`}
                              >
                                <div
                                  className={`flex items-start gap-2.5 md:gap-3 ${!isKenji ? "flex-row-reverse" : ""
                                    }`}
                                >
                                  {/* Avatar */}
                                  <div
                                    className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full shadow-md relative overflow-hidden ${isKenji ? "bg-jibb-indigo" : "bg-jibb-orange"
                                      }`}
                                  >
                                    <Image
                                      src={isKenji ? "/mascots/kenji.png" : "/mascots/aarav.png"}
                                      alt={isKenji ? "Kenji" : "Aarav"}
                                      fill
                                      className="object-cover object-top scale-[1.6] translate-y-[15%]"
                                      sizes="40px"
                                    />
                                  </div>

                                  <div className={!isKenji ? "text-right" : ""}>
                                    {/* Name + Location badge */}
                                    <div
                                      className={`flex items-center gap-2 mb-1 ${!isKenji ? "justify-end" : ""
                                        }`}
                                    >
                                      <span className="text-xs font-bold text-foreground/90">
                                        {t(isKenji ? "kenjiName" : "aaravName")}
                                      </span>
                                      <span
                                        className={`text-[9px] md:text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wider ${isKenji
                                          ? "bg-jibb-indigo/[0.06] text-jibb-indigo/70 border border-jibb-indigo/[0.08]"
                                          : "bg-jibb-orange/[0.06] text-jibb-orange/80 border border-jibb-orange/[0.08]"
                                          }`}
                                      >
                                        {isKenji ? "Tokyo" : "Noida"}
                                      </span>
                                    </div>

                                    {/* Glassmorphic bubble */}
                                    <div
                                      className={`bg-white/60 dark:bg-black/50 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl text-left p-3.5 md:p-5 text-[13px] md:text-[15px] leading-relaxed md:leading-[1.7] text-foreground/80 ${isKenji
                                        ? "rounded-2xl rounded-tl-md"
                                        : "rounded-2xl rounded-tr-md"
                                        }`}
                                    >
                                      &ldquo;{t(msg.key)}&rdquo;
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ▸ HANDSHAKE SCENE */}
                <div className="story-hs-wrap absolute inset-0 flex flex-col items-center justify-center z-20">
                  <div
                    aria-hidden="true"
                    className="story-hs-glow absolute w-56 h-56 md:w-72 md:h-72 rounded-full blur-2xl pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(251,191,36,0.35), rgba(233,139,42,0.15) 50%, transparent 75%)",
                    }}
                  />
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[440px] md:h-[440px] animate-float will-change-transform flex items-center justify-center">
                    <Image
                      src="/mascots/kenji-aarav-handshake.png"
                      alt="Kenji and Aarav Handshake"
                      fill
                      className="object-contain drop-shadow-2xl"
                      sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 440px"
                      priority
                    />
                  </div>
                </div>

                {/* ▸ CTA SCENE */}
                <div className="story-cta-wrap absolute inset-0 flex flex-col items-center justify-end md:justify-center z-20 px-4 pb-12 md:pb-0 md:pt-[28vh]">
                  <div className="story-cta-content text-center max-w-3xl mx-auto space-y-4 md:space-y-5 bg-white/60 dark:bg-black/50 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl w-full">

                    <p className="cta-text-1 text-[15px] md:text-[19px] font-bold text-foreground">
                      {t("ctaBody1")}
                    </p>

                    <p className="cta-text-2 text-sm md:text-[17px] text-foreground/80 font-medium leading-relaxed">
                      {t("ctaBody2")}
                    </p>

                    <p className="cta-text-3 text-[15px] md:text-[19px] font-bold text-foreground">
                      {t("ctaBody3")}
                    </p>

                    <div className="cta-buttons flex flex-wrap items-center justify-center gap-3 md:gap-4 pt-2 md:pt-4">
                      <Link
                        href="/membership"
                        className="inline-flex items-center justify-center px-7 py-3.5 md:px-8 md:py-4 bg-jibb-orange text-white font-bold rounded-xl hover:bg-jibb-orange-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm md:text-base gap-2"
                      >
                        {t("ctaJoin")}
                        <span className="text-white/80">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ──── Aarav Mascot (Desktop) ──── */}
              <div className="story-mascot-aarav hidden md:flex flex-col items-center gap-3 w-56 lg:w-64 xl:w-72 shrink-0 will-change-transform">
                <div className="sma-img relative w-56 h-72 lg:w-64 lg:h-80 xl:w-72 xl:h-96 will-change-transform">
                  <Image
                    src="/mascots/aarav.png"
                    alt="Aarav — Startup Founder from Noida"
                    fill
                    className="object-contain drop-shadow-lg"
                    sizes="(max-width: 1024px) 224px, (max-width: 1280px) 256px, 288px"
                    priority
                  />
                </div>
                <span className="text-[11px] font-bold text-jibb-indigo/80 tracking-[0.15em] uppercase select-none">
                  {t("aaravName")}
                </span>
              </div>
            </div>

            {/* ═══════════ BOTTOM CONTROLS ═══════════ */}
            <div className="relative z-20 px-4 md:px-8 pb-5 md:pb-6 flex items-center justify-between">
              {/* Skip button */}
              <button
                onClick={handleSkip}
                className="text-[11px] md:text-xs font-medium text-muted-foreground/50 hover:text-foreground/80 transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-black/[0.03] select-none"
                id="story-skip"
              >
                <span>{t("skipStory")}</span>
                <span className="text-[10px]">⏭</span>
              </button>

              {/* Chapter progress indicator */}
              <div className="flex items-center gap-1.5 md:gap-2">
                {CHAPTERS.map((label, i) => (
                  <div
                    key={label}
                    className="flex items-center gap-1"
                    title={label}
                  >
                    <div
                      className={`h-[3px] rounded-full transition-all duration-500 ease-out ${chapter === i
                        ? "w-8 md:w-10 bg-jibb-indigo"
                        : chapter > i
                          ? "w-4 md:w-5 bg-jibb-indigo/25"
                          : "w-4 md:w-5 bg-muted-foreground/15"
                        }`}
                    />
                  </div>
                ))}
              </div>

              {/* Replay button */}
              <button
                onClick={handleReplay}
                className={`text-[11px] md:text-xs font-medium text-muted-foreground/50 hover:text-foreground/80 transition-all flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-black/[0.03] select-none ${canReplay
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
                  }`}
                id="story-replay"
              >
                <span>↺</span>
                <span>{t("replay")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
