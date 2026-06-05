"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const el = spanRef.current;
    if (!el) return;

    if (prefersReducedMotion) {
      el.textContent = `${prefix}${value}${suffix}`;
      return;
    }

    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: value,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          el.textContent = `${prefix}${Math.floor(obj.val)}${suffix}`;
        },
      });
    });

    return () => ctx.revert();
  }, [value, duration, prefix, suffix]);

  return (
    <span ref={spanRef} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
