"use client";

import { useRef, useEffect, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ============================================================
   AnimatedHeading — Word-by-word GSAP scroll reveal
   Uses manual span splitting (free, no GSAP SplitText license).

   Usage:
     <AnimatedHeading text={t("hero.title")} className="text-5xl font-bold text-white" />
     <AnimatedHeading text="Hello World" as="h2" />
   ============================================================ */

interface AnimatedHeadingProps {
  /** The text string to split and animate (plain text only, no JSX). */
  text: string;
  /** The heading tag to render. Defaults to "h1". */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  /** Additional CSS classes to apply to the heading. */
  className?: string;
  /** Stagger delay between each word reveal in seconds. Default: 0.06s */
  staggerDelay?: number;
  /** ScrollTrigger start position. Default: "top 85%" */
  triggerStart?: string;
  /** If true, animates immediately instead of waiting for scroll. Default: false */
  immediate?: boolean;
}

export function AnimatedHeading({
  text,
  as: Tag = "h1",
  className = "",
  staggerDelay = 0.06,
  triggerStart = "top 85%",
  immediate = false,
}: AnimatedHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Show all words immediately without animation
      const words = containerRef.current?.querySelectorAll(".ah-word");
      words?.forEach((w) => {
        (w as HTMLElement).style.opacity = "1";
        (w as HTMLElement).style.transform = "none";
        (w as HTMLElement).style.filter = "none";
      });
      return;
    }

    const words = containerRef.current?.querySelectorAll(".ah-word");
    if (!words?.length) return;

    const ctx = gsap.context(() => {
      const animConfig: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.5,
        stagger: staggerDelay,
        ease: "power2.out",
      };

      if (immediate) {
        // Animate immediately on mount (useful for hero visible on load)
        gsap.fromTo(
          words,
          { opacity: 0, y: 18, filter: "blur(3px)" },
          { ...animConfig, delay: 0.15 }
        );
      } else {
        // Animate on scroll into view
        gsap.fromTo(
          words,
          { opacity: 0, y: 18, filter: "blur(3px)" },
          {
            ...animConfig,
            scrollTrigger: {
              trigger: containerRef.current,
              start: triggerStart,
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [staggerDelay, triggerStart, immediate]);

  // Split text by spaces, preserving whitespace as non-breaking spaces
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag ref={containerRef as React.Ref<never>} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="ah-word inline-block"
          style={{ opacity: 0, willChange: "opacity, transform, filter" }}
        >
          {word}
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </Tag>
  );
}
