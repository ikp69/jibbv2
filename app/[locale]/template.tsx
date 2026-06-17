"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Page Transition Template
 *
 * Next.js `template.tsx` re-mounts on every navigation, triggering
 * the Framer Motion enter animation automatically. This provides a
 * smooth fade-in + slide-up on every page transition without needing
 * AnimatePresence exit animations (which are complex in App Router).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Dynamic grid overlay builder for sections
    const sections = document.querySelectorAll("main section, main header, footer");
    const activeScrollTriggers: any[] = [];

    sections.forEach((section: any) => {
      // Avoid modifying overlays or structures that shouldn't have layout grids (like absolute background panels)
      if (
        section.classList.contains("pointer-events-none") ||
        section.id === "logo-marquee-section" ||
        section.classList.contains("events-venue") ||
        section.tagName === "FOOTER" && section.classList.contains("bg-grid-mesh")
      ) {
        return;
      }

      // Ensure position is relative/absolute/fixed so overlay positions relative to this section boundary
      const computedStyle = window.getComputedStyle(section);
      if (computedStyle.position === "static") {
        section.style.position = "relative";
      }

      // Skip if already has custom section grids
      if (section.querySelector(".section-grid-lines")) return;

      // 1. Build Section Grid Lines component
      const gridContainer = document.createElement("div");
      gridContainer.className = "section-grid-lines";

      // 2. Build 2 vertical layout alignment lines matching the left and right boundaries
      const verticals = document.createElement("div");
      verticals.className = "section-grid-verticals max-w-[96rem] mx-auto px-5 md:px-12 lg:px-16";

      for (let i = 0; i < 2; i++) {
        const line = document.createElement("div");
        line.className = "section-grid-vertical-line";
        verticals.appendChild(line);
      }

      gridContainer.appendChild(verticals);
      
      // Prepend to section before other child elements
      section.insertBefore(gridContainer, section.firstChild);

      // 3. Animate the glow effect when scroll enters / moves near the section
      const enterTween = gsap.fromTo(
        section,
        {
          "--section-grid-glow": 0,
        },
        {
          "--section-grid-glow": 1,
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 45%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
      activeScrollTriggers.push(enterTween);

      const exitTween = gsap.to(section, {
        "--section-grid-glow": 0,
        scrollTrigger: {
          trigger: section,
          start: "bottom 55%",
          end: "bottom 15%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      activeScrollTriggers.push(exitTween);
    });

    // Mouse move tracker for card glow effects
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const group = target.closest(".group") as HTMLElement;
      if (group) {
        const rect = group.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        group.style.setProperty("--mouse-x", `${x}px`);
        group.style.setProperty("--mouse-y", `${y}px`);
      }
    };
    document.addEventListener("mousemove", handleMouseMove);

    // Cleanup triggers and state on navigation
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      activeScrollTriggers.forEach((t) => {
        if (t.scrollTrigger) t.scrollTrigger.kill();
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
        ease: [0.25, 0.1, 0.25, 1], // --ease-smooth
      }}
    >
      {children}
    </motion.div>
  );
}

