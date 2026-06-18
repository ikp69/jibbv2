"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

function LenisScrollTriggerBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Feed Lenis scroll events into ScrollTrigger so it tracks virtual scroll position.
    // Without this, ScrollTrigger reads native scrollY which Lenis overrides — causing
    // triggers (like AnimatedCounter) to fire at wrong positions or not at all.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis via GSAP's ticker instead of requestAnimationFrame directly.
    // This keeps both in sync on the same frame loop.
    const tickerHandler = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerHandler);

    // Prevent GSAP from compensating for frame drops — Lenis handles its own smoothing.
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tickerHandler);
    };
  }, [lenis]);

  return null;
}

function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Reset scroll to top instantly on route change
    lenis.scrollTo(0, { immediate: true });

    // Refresh ScrollTrigger positions after DOM settles
    const timer1 = setTimeout(() => ScrollTrigger.refresh(), 100);
    // Secondary refresh after Framer Motion page transition completes (450ms)
    const timer2 = setTimeout(() => ScrollTrigger.refresh(), 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname, lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      autoRaf={false} // Disable Lenis' own RAF — GSAP ticker drives it instead
      options={{
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }}
    >
      <LenisScrollTriggerBridge />
      <ScrollToTop />
      {children}
    </ReactLenis>
  );
}
