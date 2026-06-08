"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface PageHeroProps {
  children: React.ReactNode;
  className?: string;
  bgText?: string;
}

export function PageHero({
  children,
  className = "py-20 lg:py-28",
  bgText,
}: PageHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const bgTextSpanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const container = containerRef.current;
    const background = backgroundRef.current;
    const content = contentRef.current;
    const scrollContent = scrollContentRef.current;
    const bgTextEl = bgTextRef.current;
    const bgTextSpanEl = bgTextSpanRef.current;
    if (!container || !content || !scrollContent) return;

    if (prefersReducedMotion) {
      gsap.set(content, { opacity: 1, x: 0 });
      if (bgTextEl) gsap.set(bgTextEl, { opacity: 1, scale: 1 });
      if (bgTextSpanEl) gsap.set(bgTextSpanEl, { opacity: 1, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Entrance animation: Animates the outer content container on load
      gsap.fromTo(
        content,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
        }
      );

      // Entrance animation for massive backdrop text (scales down + fades in)
      if (bgTextEl) {
        gsap.fromTo(
          bgTextEl,
          { scale: 1.15, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.6,
            ease: "power3.out",
          }
        );
      }

      // Scroll animation: Massive text translates right (parallax offset) and fades
      // Targets the inner span to avoid clashing with the outer load animation
      if (bgTextSpanEl) {
        gsap.to(bgTextSpanEl, {
          x: 120,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // 2. Scroll animation: Animates the inner scroll wrapper as you scroll down
      // Resolves opacity race condition by targeting a separate DOM layer
      gsap.to(scrollContent, {
        x: -450,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 3. Parallax background curtain effect: Background layers move slower than scroll
      if (background) {
        gsap.to(background, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, []);

  // Calculate dynamic font size to prevent overflow based on the length of the string
  const textLength = bgText ? bgText.length : 0;
  const fontSizeMobile = textLength ? `${Math.min(12, 80 / textLength)}vw` : "12vw";
  const fontSizeDesktop = textLength ? `${Math.min(18, 120 / textLength)}vw` : "18vw";

  return (
    <section
      ref={containerRef}
      className={cn("relative overflow-hidden bg-jibb-gradient page-hero-section z-0 rounded-b-xl", className)}
    >
      {/* Background Wrapper for Parallax effect */}
      <div ref={backgroundRef} className="absolute inset-0 pointer-events-none -z-10">
        {/* Radial Gradient Background - always dark to match the hardcoded white text on pages */}
        <div 
          aria-hidden="true" 
          className="absolute inset-0 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,transparent_40%,rgba(15,22,41,0.8)_100%)]"
        />

        {/* Wave pattern overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 wave-pattern opacity-10 animate-wave-slide"
        />

        {/* Ambient Glow Accents */}
        <div
          aria-hidden="true"
          className="absolute -top-40 right-[15%] w-[500px] h-[500px] bg-jibb-indigo/10 rounded-full blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-jibb-sakura/8 rounded-full blur-[100px]"
        />
      </div>

      {/* Massive Display Backdrop Text */}
      {bgText && (
        <div
          ref={bgTextRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden -z-10"
        >
          <style>{`
            .bg-text-dynamic {
              font-size: ${fontSizeMobile};
            }
            @media (min-width: 768px) {
              .bg-text-dynamic {
                font-size: ${fontSizeDesktop};
              }
            }
          `}</style>
          <span 
            ref={bgTextSpanRef}
            className="bg-text-dynamic font-black uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-white/[0.08] to-white/0 leading-none block"
          >
            {bgText}
          </span>
        </div>
      )}

      {/* Page Content Container */}
      <div ref={contentRef} className="relative z-10">
        <div ref={scrollContentRef} className="w-full h-full">
          {children}
        </div>
      </div>
    </section>
  );
}

