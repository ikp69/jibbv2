"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      // 1. Reset scroll to top instantly
      lenis.scrollTo(0, { immediate: true });

      // 2. Wait for Next.js DOM render to settle, then refresh GSAP trigger positions
      const timer1 = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      // 3. Secondary refresh after page transitions (450ms) and layout shifts settle
      const timer2 = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 600);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [pathname, lenis]);

  return null;
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Premium exponential deceleration momentum
        smoothWheel: true,
      }}
    >
      <ScrollToTop />
      {children}
    </ReactLenis>
  );
}
