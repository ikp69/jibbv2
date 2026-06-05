"use client";

import { useRef, useEffect, type ReactNode, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ============================================================
   ScrollReveal — Reusable GSAP ScrollTrigger wrapper

   Animates children into view when they scroll into the viewport.
   Supports staggered child animations via the `staggerChildren` prop.

   Usage:
     <ScrollReveal>
       <div>I fade up when scrolled into view</div>
     </ScrollReveal>

     <ScrollReveal staggerChildren={0.1} direction="left">
       <Card /><Card /><Card />
     </ScrollReveal>
   ============================================================ */

type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  /** Additional CSS classes. */
  className?: string;
  /** ScrollTrigger start position. Default: "top 88%" */
  triggerStart?: string;
  /** Animation duration in seconds. Default: 0.65 */
  duration?: number;
  /** Direction to animate from. Default: "up" */
  direction?: Direction;
  /** Distance in pixels. Default: 40 */
  distance?: number;
  /** If > 0, animates direct children with this stagger delay. Default: 0 (animate container only) */
  staggerChildren?: number;
  /** Delay before animation starts. Default: 0 */
  delay?: number;
  /** GSAP easing. Default: "power2.out" */
  ease?: string;
  /** HTML tag for the wrapper. Default: "div" */
  as?: ElementType;
  /** Initial scale for scale-in animation. Default: 1 (no scaling) */
  scale?: number;
}

function getDirectionOffset(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance, x: 0 };
    case "down":
      return { y: -distance, x: 0 };
    case "left":
      return { y: 0, x: -distance };
    case "right":
      return { y: 0, x: distance };
    case "none":
      return { y: 0, x: 0 };
  }
}

export function ScrollReveal({
  children,
  className = "",
  triggerStart = "top 88%",
  duration = 0.65,
  direction = "up",
  distance = 40,
  staggerChildren = 0,
  delay = 0,
  ease = "power2.out",
  as: Tag = "div",
  scale = 1,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const el = containerRef.current;
    if (!el) return;

    const { x, y } = getDirectionOffset(direction, distance);

    const ctx = gsap.context(() => {
      const fromVars: gsap.TweenVars = { opacity: 0, y, x };
      if (scale !== 1) {
        fromVars.scale = scale;
      }

      const toVars: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start: triggerStart,
          toggleActions: "play none none none",
        },
      };

      if (staggerChildren > 0) {
        // Stagger direct children
        const items = el.children;
        if (!items.length) return;

        gsap.fromTo(
          Array.from(items),
          fromVars,
          {
            ...toVars,
            stagger: staggerChildren,
          }
        );
      } else {
        // Animate the container itself
        gsap.fromTo(
          el,
          fromVars,
          toVars
        );
      }
    }, el);

    return () => ctx.revert();
  }, [direction, distance, duration, staggerChildren, delay, ease, triggerStart]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = Tag as any;

  return (
    <Component
      ref={containerRef}
      className={className}
      style={staggerChildren > 0 ? undefined : { opacity: 0 }}
    >
      {children}
    </Component>
  );
}
