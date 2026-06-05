"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Smile, Target, Users2 } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface CultureItem {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
}

const VALUES: CultureItem[] = [
  {
    title: "Bilateral Synergy",
    desc: "We bridge Japanese engineering precision with Indian software ingenuity to build superior solutions.",
    icon: Users2,
    color: "text-jibb-orange",
    gradient: "from-jibb-orange/20 to-transparent",
  },
  {
    title: "Continuous Innovation",
    desc: "Our labs are sandbox playgrounds where teams experiment freely with semiconductor tech, AI, and battery software.",
    icon: Sparkles,
    color: "text-blue-400",
    gradient: "from-blue-500/20 to-transparent",
  },
  {
    title: "Bicultural Respect",
    desc: "We support mutual learning, language exchanges, and shared traditions to cultivate high trust across teams.",
    icon: Heart,
    color: "text-jibb-sakura",
    gradient: "from-jibb-sakura/20 to-transparent",
  },
  {
    title: "Shared Purpose",
    desc: "Every project, line of code, and hardware test aims to expand economic and technological collaboration between our nations.",
    icon: Target,
    color: "text-emerald-400",
    gradient: "from-emerald-500/20 to-transparent",
  },
];

export function CultureGallery() {
  return (
    <section className="py-24 relative overflow-hidden bg-jibb-gradient border-t border-white/5">
      {/* Background Decorative Blur */}
      <div className="absolute top-[30%] left-[15%] w-[400px] h-[200px] bg-gradient-to-r from-jibb-orange/5 to-jibb-sakura/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="section-container relative z-10 max-w-5xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Smile className="size-3.5 text-jibb-orange" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/80">
              Our Culture &amp; Values
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Life at the Bureau
          </h2>
          <p className="text-sm text-white/60 max-w-lg mx-auto">
            Discover the values that shape our cross-border co-innovation and daily bilateral operations.
          </p>
        </div>

        {/* Culture Grid */}
        <ScrollReveal staggerChildren={0.15} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl p-6 bg-white/5 border border-white/8 backdrop-blur-md hover:bg-white/10 hover:border-white/15 transition-all duration-300 flex flex-col justify-between min-h-[250px] text-left overflow-hidden shadow-jibb"
              >
                {/* Gradient background hover fade */}
                <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${val.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="space-y-4 relative z-10">
                  <div className={`p-3 rounded-2xl bg-white/5 inline-flex transition-transform duration-300 group-hover:scale-110 ${val.color}`}>
                    <Icon className="size-5.5" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {val.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">
                    {val.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
