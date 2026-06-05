"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Handshake, Code2, Rocket, ArrowRight } from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

interface Panel {
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgClass: string;
  glow: string;
}

const PANELS: Panel[] = [
  {
    title: "Phase 1: Precision Hardware",
    subtitle: "Japan's Manufacturing Excellence",
    desc: "We align Japanese industrial precision, custom silicon engineering, and high-frequency IoT sensors to build the physical foundation of innovation.",
    icon: Cpu,
    color: "text-jibb-indigo dark:text-jibb-indigo-light",
    bgClass: "bg-gradient-to-br from-jibb-indigo/5 to-transparent",
    glow: "shadow-jibb-glow",
  },
  {
    title: "Phase 2: Integration Sandbox",
    subtitle: "Bilateral Co-Innovation Labs",
    desc: "Your hardware meets the testing arena. In our Tokyo and Noida laboratories, engineers connect sensors directly with processing frameworks.",
    icon: Handshake,
    color: "text-jibb-orange dark:text-jibb-orange-light",
    bgClass: "bg-gradient-to-br from-jibb-orange/5 to-transparent",
    glow: "shadow-jibb-orange-glow",
  },
  {
    title: "Phase 3: AI & Software Adapt",
    subtitle: "India's Software Agility",
    desc: "Deploy advanced machine learning models, cloud backend clusters, and real-time analytical telemetry layers that bring your hardware to life.",
    icon: Code2,
    color: "text-jibb-sakura dark:text-jibb-sakura-light",
    bgClass: "bg-gradient-to-br from-jibb-sakura/5 to-transparent",
    glow: "shadow-jibb-sakura-glow",
  },
  {
    title: "Phase 4: Market Entry & Scale",
    subtitle: "Bicultural Expansion Corridor",
    desc: "Leverage government alliances, localized B2B distribution networks, and strategic funding to launch products secure across global markets.",
    icon: Rocket,
    color: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-gradient-to-br from-emerald-500/5 to-transparent",
    glow: "shadow-emerald-500/10",
  },
];

export function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      // Clean dynamic calculations that update instantly on window resizes
      gsap.to(track, {
        x: () => -(track.scrollWidth - container.clientWidth),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${track.scrollWidth - container.clientWidth}`,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden hidden md:block select-none bg-background">
      <div className="h-screen w-full flex flex-col justify-center relative">
        {/* Section title background indicator */}
        <div className="absolute top-12 left-12 z-20 space-y-1 text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-jibb-orange block animate-pulse">
            Co-Innovation Pipeline
          </span>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            Four Stages of Bilateral Growth
          </h2>
        </div>

        {/* Horizontally scrolling panels container (exactly 400% of parent width) */}
        <div ref={trackRef} className="flex h-full w-[400%] items-center">
          {PANELS.map((panel, idx) => {
            const Icon = panel.icon;
            return (
              <div
                key={idx}
                className="w-1/4 h-full flex items-center justify-center px-12 lg:px-24 shrink-0 relative bg-background border-r border-border/20"
              >
                <div className="grid lg:grid-cols-12 gap-12 items-center max-w-5xl w-full">
                  {/* Left: Illustration Card (Col 6) */}
                  <div className="lg:col-span-6 flex justify-center">
                    <div className={`relative w-80 h-80 rounded-3xl p-8 border border-border/50 bg-card backdrop-blur-md flex flex-col items-center justify-center gap-6 overflow-hidden group hover:border-primary/20 transition-all duration-300 ${panel.glow} ${panel.bgClass}`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                      <div className={`p-5 rounded-3xl bg-primary/5 ${panel.color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="size-10" />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
                        Stage 0{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Right: Copy Description (Col 6) */}
                  <div className="lg:col-span-6 text-left space-y-5">
                    <span className={`text-xs font-bold tracking-wider uppercase ${panel.color}`}>
                      {panel.subtitle}
                    </span>
                    <h3 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                      {panel.title}
                    </h3>
                    <p className="text-sm lg:text-base text-muted-foreground leading-relaxed font-medium">
                      {panel.desc}
                    </p>
                    
                    {idx === PANELS.length - 1 && (
                      <div className="pt-4">
                        <Link href="/membership">
                          <AnimatedButton variant="accent" size="lg" className="gap-2 font-bold shadow-lg">
                            Apply Membership <ArrowRight className="size-4" />
                          </AnimatedButton>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
