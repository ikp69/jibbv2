"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface AnimatedCounterProps {
  /** The target number to count up to. */
  value: number;
  /** Duration in seconds. Default: 1.5 */
  duration?: number;
  /** Suffix to append (e.g. "+", "%"). */
  suffix?: string;
  /** Prefix to prepend (e.g. "¥", "₹"). */
  prefix?: string;
  /** Optional class names. */
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1.5,
  suffix = "",
  prefix = "",
  className = "",
}: AnimatedCounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const el = spanRef.current;
    if (!el) return;

    if (prefersReducedMotion) {
      el.textContent = `${prefix}${value}${suffix}`;
      return;
    }

    // Skip if already animated (React strict mode / re-mount guard)
    if (hasAnimated.current) return;

    const counter = { value: 0 };

    // Create tween in paused state — only plays when element enters viewport
    const tween = gsap.to(counter, {
      value,
      duration,
      ease: "power2.out",
      paused: true,
      onUpdate: () => {
        el.textContent = `${prefix}${Math.floor(counter.value)}${suffix}`;
      },
      onComplete: () => {
        // Ensure final value is exact (no floor rounding leftover)
        el.textContent = `${prefix}${value}${suffix}`;
      },
    });

    // Use Intersection Observer instead of GSAP ScrollTrigger.
    // ScrollTrigger miscalculates trigger positions for elements inside
    // nested absolutely-positioned containers (e.g. the floating stat cards
    // in WhoWeAre), especially with Lenis smooth scroll. This causes the
    // count-up animation to fire and complete off-screen before the user
    // reaches the section. Intersection Observer uses the browser's native
    // visibility tracking, which correctly handles all positioning contexts.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            tween.play();
            observer.disconnect();
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -15% 0px" } // fires when top of element reaches 85% of viewport (same as old "top 85%")
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      tween.kill();
    };
  }, [value, duration, prefix, suffix]);

  return (
    <span ref={spanRef} className={className} suppressHydrationWarning>
      {prefix}0{suffix}
    </span>
  );
}
