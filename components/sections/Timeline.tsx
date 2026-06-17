"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, Award, Globe, Building, Flag, CheckCircle } from "lucide-react";

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  align: "left" | "right";
}

const MILESTONES: Milestone[] = [
  {
    year: "2021",
    title: "Bureau Conceived",
    description: "Initial framework drafted in Tokyo to align Japanese precision manufacturing with Indian software talent. Secured support from key ministry and trade alliance partners.",
    icon: Flag,
    color: "text-jibb-orange",
    align: "left",
  },
  {
    year: "2022",
    title: "Tokyo Office Founded",
    description: "Established our primary Tokyo Office in Chiyoda-ku. Enrolled our first 50 corporate members representing robotics and precision hardware fields.",
    icon: Building,
    color: "text-blue-400",
    align: "right",
  },
  {
    year: "2023",
    title: "Noida Hub Launch",
    description: "Opened the Noida R&D Hub, introducing co-working spaces, specialized electronics laboratories, and bilateral incubation programs for startups.",
    icon: Globe,
    color: "text-jibb-sakura",
    align: "left",
  },
  {
    year: "2024",
    title: "Bilateral Corridor Deal Flow",
    description: "Officially catalyzed high-impact programs in EV and Semiconductor sectors. Surpassed ₹850 Cr ($100M+) in facilitated co-innovation deals.",
    icon: Award,
    color: "text-emerald-400",
    align: "right",
  },
  {
    year: "2025",
    title: "500+ Corporate Network",
    description: "Expanded our membership base globally to 500+ active innovators. Signed partnerships with 10+ premium universities and research institutions.",
    icon: CheckCircle,
    color: "text-purple-400",
    align: "left",
  },
];

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      // In reduced motion, make elements visible immediately
      const container = containerRef.current;
      if (container) {
        const cards = container.querySelectorAll(".timeline-card");
        const dots = container.querySelectorAll(".timeline-dot");
        const years = container.querySelectorAll(".timeline-year");
        cards.forEach((el) => gsap.set(el, { opacity: 1, x: 0, y: 0 }));
        dots.forEach((el) => gsap.set(el, { opacity: 1, scale: 1 }));
        years.forEach((el) => gsap.set(el, { opacity: 1, x: 0, y: 0 }));
      }
      return;
    }

    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    const ctx = gsap.context(() => {
      // Animate the vertical timeline line scaling down
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 70%",
            end: "bottom 80%",
            scrub: true,
          },
        }
      );

      // Animate milestone entries
      const entries = container.querySelectorAll(".timeline-entry");
      entries.forEach((entry) => {
        const dot = entry.querySelector(".timeline-dot");
        const card = entry.querySelector(".timeline-card");
        const year = entry.querySelector(".timeline-year");

        const isLeft = entry.getAttribute("data-is-left") === "true";
        const isMobile = window.innerWidth < 768;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: entry,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        if (dot) {
          tl.fromTo(
            dot,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
          );
        }

        if (year) {
          tl.fromTo(
            year,
            {
              x: isMobile ? -20 : (isLeft ? 30 : -30),
              opacity: 0
            },
            { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
            "-=0.25"
          );
        }

        if (card) {
          tl.fromTo(
            card,
            {
              x: isMobile ? 20 : (isLeft ? -40 : 40),
              opacity: 0
            },
            { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
            "-=0.3"
          );
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-jibb-gradient relative overflow-hidden border-t border-white/5">
      {/* Background Decorative Blur */}
      <div className="absolute top-[20%] left-[10%] w-[250px] md:w-[350px] h-[250px] md:h-[350px] bg-jibb-orange/5 rounded-full blur-[60px] md:blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[250px] md:w-[350px] h-[250px] md:h-[350px] bg-jibb-sakura/5 rounded-full blur-[60px] md:blur-[80px] pointer-events-none" />

      <div className="section-container relative z-10 max-w-5xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-16 md:mb-20">
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-jibb-orange">
            Our Journey
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Bureau Milestones &amp; History
          </h2>
          <p className="text-sm text-white/60 max-w-lg mx-auto">
            Following the growth of our bilateral business corridor, bringing together industrial precision and tech innovation.
          </p>
        </div>

        {/* Timeline body */}
        <div ref={containerRef} className="relative mt-8 md:mt-12 select-none">
          {/* Central Line (Left on Mobile, Center on Desktop) */}
          <div className="absolute left-[28px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/10">
            <div
              ref={lineRef}
              className="w-full h-full bg-gradient-to-b from-jibb-orange via-jibb-sakura to-primary origin-top scale-y-0"
            />
          </div>

          <div className="space-y-12 md:space-y-24">
            {MILESTONES.map((m, idx) => {
              const Icon = m.icon;
              const isLeft = m.align === "left";
              return (
                <div
                  key={idx}
                  data-is-left={isLeft}
                  className="timeline-entry relative w-full flex flex-col md:flex-row md:items-center gap-4 md:gap-0"
                >
                  {/* Dot (Left on Mobile, Center on Desktop) */}
                  <div className="absolute left-0 md:left-1/2 top-0 md:top-1/2 md:-translate-y-1/2 md:-translate-x-1/2 flex items-center justify-center z-10 ml-2 md:ml-0 mt-1 md:mt-0">
                    <div className="timeline-dot size-10 rounded-full bg-background border-2 border-white/10 flex items-center justify-center shadow-jibb transition-colors duration-300">
                      <div className={`p-1.5 rounded-full bg-white/5 ${m.color}`}>
                        <Icon className="size-4.5" />
                      </div>
                    </div>
                  </div>

                  {/* Year block */}
                  <div className={`w-full md:w-1/2 pl-16 pr-4 md:px-0 flex ${isLeft ? "md:justify-start md:pl-12 order-1 md:order-2" : "md:justify-end md:pr-12 order-1"}`}>
                    <div className={`timeline-year text-3xl md:text-6xl font-black text-white/10 hover:text-white/20 transition-colors uppercase tracking-widest flex items-center h-full ${isLeft ? "md:text-left" : "md:text-right"}`}>
                      {m.year}
                    </div>
                  </div>

                  {/* Card block */}
                  <div className={`w-full md:w-1/2 pl-16 pr-4 md:px-0 flex ${isLeft ? "md:justify-end md:pr-12 order-2 md:order-1" : "md:justify-start md:pl-12 order-2"}`}>
                    <div className="timeline-card w-full max-w-md p-6 rounded-3xl bg-white/5 border border-white/8 backdrop-blur-md shadow-jibb hover:border-white/12 transition-all duration-300">
                      <h4 className="text-lg font-bold text-white mb-2">{m.title}</h4>
                      <p className="text-xs text-white/60 leading-relaxed font-medium">{m.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
