"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Page Transition Template
 *
 * Next.js `template.tsx` re-mounts on every navigation, triggering
 * the Framer Motion enter animation automatically. GSAP ScrollTrigger
 * setup is deferred by 500ms so it runs after the fade-in animation
 * finishes and the full DOM is painted — prevents blank-screen issues
 * when navigating back to the homepage.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const activeScrollTriggers: gsap.core.Tween[] = [];

    // Mouse move tracker for card glow effects — registered immediately
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const group = target.closest(".group") as HTMLElement;
      if (group) {
        const rect = group.getBoundingClientRect();
        group.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        group.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      }
    };
    document.addEventListener("mousemove", handleMouseMove);

    // Defer GSAP DOM queries until after Framer Motion's enter animation (0.45s)
    // and any layout shifts from Lenis/ScrollTrigger.refresh() settle
    const initTimer = setTimeout(() => {
      const sections = document.querySelectorAll("main section, main header, footer");

      sections.forEach((section: Element) => {
        const el = section as HTMLElement;

        // Skip decorative/non-content sections
        if (
          el.classList.contains("pointer-events-none") ||
          el.id === "logo-marquee-section" ||
          el.classList.contains("events-venue") ||
          (el.tagName === "FOOTER" && el.classList.contains("bg-grid-mesh"))
        ) {
          return;
        }

        // Ensure position is relative so the overlay positions correctly
        const computedStyle = window.getComputedStyle(el);
        if (computedStyle.position === "static") {
          el.style.position = "relative";
        }

        // Skip if grid lines already injected (prevents duplicates on hot-reload)
        if (el.querySelector(".section-grid-lines")) return;

        // Inject grid line overlay
        const gridContainer = document.createElement("div");
        gridContainer.className = "section-grid-lines";

        const verticals = document.createElement("div");
        verticals.className = "section-grid-verticals max-w-[96rem] mx-auto px-5 md:px-12 lg:px-16";

        for (let i = 0; i < 2; i++) {
          const line = document.createElement("div");
          line.className = "section-grid-vertical-line";
          verticals.appendChild(line);
        }

        gridContainer.appendChild(verticals);
        el.insertBefore(gridContainer, el.firstChild);

        // Animate glow on scroll enter
        const enterTween = gsap.fromTo(
          el,
          { "--section-grid-glow": 0 },
          {
            "--section-grid-glow": 1,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 45%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
        activeScrollTriggers.push(enterTween);

        // Animate glow on scroll exit
        const exitTween = gsap.to(el, {
          "--section-grid-glow": 0,
          scrollTrigger: {
            trigger: el,
            start: "bottom 55%",
            end: "bottom 15%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        activeScrollTriggers.push(exitTween);
      });

      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(initTimer);
      document.removeEventListener("mousemove", handleMouseMove);
      activeScrollTriggers.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
