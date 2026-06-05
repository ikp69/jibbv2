"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Code, Database, Network, Sparkles, ArrowLeftRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface TechNode {
  id: string;
  title: string;
  description: string;
  side: "japan" | "india" | "bridge";
  icon: React.ComponentType<{ className?: string }>;
  tech: string[];
}

const TECH_NODES: TechNode[] = [
  {
    id: "hardware",
    title: "Japan Hardware Precision",
    description: "State-of-the-art semiconductor fabrication, IoT sensor calibration, robotic kinematics, and hardware-level security.",
    side: "japan",
    icon: Cpu,
    tech: ["Custom Silicon", "MEMS Sensors", "Robotic Controller", "Optoelectronics"],
  },
  {
    id: "gateway",
    title: "JIBB Bilateral Bridge",
    description: "Bicultural API gateways, secure cross-border data routing, localized compliance translation layers, and identity federation.",
    side: "bridge",
    icon: Network,
    tech: ["Bicultural API", "Bilateral DB", "ISO/IEC Compliance", "SAML SSO"],
  },
  {
    id: "software",
    title: "India Software & AI",
    description: "Advanced machine learning pipelines, cloud-native scalability, real-time analytics, and modular battery management systems.",
    side: "india",
    icon: Code,
    tech: ["AI Core Models", "BMS Software", "Cloud Kubernetes", "Realtime Streams"],
  },
];

export function TechStack() {
  const [activeNodeId, setActiveNodeId] = useState<string>("gateway");

  const activeNode = TECH_NODES.find((node) => node.id === activeNodeId) || TECH_NODES[1];

  return (
    <section className="py-24 bg-jibb-gradient text-white relative overflow-hidden border-t border-white/5">
      <style jsx global>{`
        @keyframes pulse-dash {
          to {
            stroke-dashoffset: -40;
          }
        }
        .animate-pulse-dash {
          stroke-dasharray: 8 4;
          animation: pulse-dash 2s linear infinite;
        }
      `}</style>

      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-jibb-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="section-container relative z-10 max-w-5xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Network className="size-3.5 text-jibb-orange" />
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-white/80">
              Technology Stack
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Tokyo–Noida Co-Innovation Architecture
          </h2>
          <p className="text-sm text-white/60 max-w-lg mx-auto">
            Visualizing the integration of Japanese hardware precision with Indian software and AI agility.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Interactive SVG Diagram (Col 7) */}
          <ScrollReveal direction="left" className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-3xl p-6 bg-white/3 border border-white/8 backdrop-blur-md shadow-jibb-xl overflow-hidden">
              <svg viewBox="0 0 400 300" className="w-full h-full select-none">
                {/* Connecting animated path lines */}
                {/* Left to Center */}
                <path
                  d="M 80 150 Q 140 150 200 150"
                  fill="none"
                  stroke="url(#gradient-left)"
                  strokeWidth="3"
                  className="animate-pulse-dash"
                />
                {/* Right to Center */}
                <path
                  d="M 320 150 Q 260 150 200 150"
                  fill="none"
                  stroke="url(#gradient-right)"
                  strokeWidth="3"
                  className="animate-pulse-dash"
                />

                {/* Definitions for Gradients */}
                <defs>
                  <linearGradient id="gradient-left" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#243B6B" />
                    <stop offset="100%" stopColor="#E98B2A" />
                  </linearGradient>
                  <linearGradient id="gradient-right" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D96C6C" />
                    <stop offset="100%" stopColor="#E98B2A" />
                  </linearGradient>
                </defs>

                {/* Left Node: Japan Hardware */}
                <g 
                  className="cursor-pointer group" 
                  onClick={() => setActiveNodeId("hardware")}
                >
                  <circle
                    cx="80"
                    cy="150"
                    r="40"
                    fill="#1e2d4d"
                    stroke={activeNodeId === "hardware" ? "#243B6B" : "rgba(255,255,255,0.1)"}
                    strokeWidth="3"
                    className="transition-all duration-300 group-hover:fill-[#243B6B]/40"
                  />
                  <foreignObject x="60" y="130" width="40" height="40">
                    <div className="w-full h-full flex items-center justify-center text-blue-400">
                      <Cpu className="size-6" />
                    </div>
                  </foreignObject>
                  <text
                    x="80"
                    y="210"
                    textAnchor="middle"
                    fill="white"
                    className="text-[10px] font-bold tracking-wider uppercase"
                  >
                    Hardware (JP)
                  </text>
                </g>

                {/* Center Node: JIBB Bridge */}
                <g 
                  className="cursor-pointer group" 
                  onClick={() => setActiveNodeId("gateway")}
                >
                  <circle
                    cx="200"
                    cy="150"
                    r="45"
                    fill="#2a2220"
                    stroke={activeNodeId === "gateway" ? "#E98B2A" : "rgba(255,255,255,0.1)"}
                    strokeWidth="3"
                    className="transition-all duration-300 group-hover:fill-[#E98B2A]/20"
                  />
                  <foreignObject x="177" y="127" width="46" height="46">
                    <div className="w-full h-full flex items-center justify-center text-jibb-orange">
                      <ArrowLeftRight className="size-7 animate-soft-pulse" />
                    </div>
                  </foreignObject>
                  <text
                    x="200"
                    y="215"
                    textAnchor="middle"
                    fill="white"
                    className="text-[10px] font-bold tracking-wider uppercase"
                  >
                    JIBB Gateway
                  </text>
                </g>

                {/* Right Node: India Software */}
                <g 
                  className="cursor-pointer group" 
                  onClick={() => setActiveNodeId("software")}
                >
                  <circle
                    cx="320"
                    cy="150"
                    r="40"
                    fill="#2e1b1d"
                    stroke={activeNodeId === "software" ? "#D96C6C" : "rgba(255,255,255,0.1)"}
                    strokeWidth="3"
                    className="transition-all duration-300 group-hover:fill-[#D96C6C]/40"
                  />
                  <foreignObject x="300" y="130" width="40" height="40">
                    <div className="w-full h-full flex items-center justify-center text-jibb-sakura">
                      <Code className="size-6" />
                    </div>
                  </foreignObject>
                  <text
                    x="320"
                    y="210"
                    textAnchor="middle"
                    fill="white"
                    className="text-[10px] font-bold tracking-wider uppercase"
                  >
                    AI &amp; Software (IN)
                  </text>
                </g>
              </svg>
            </div>
          </ScrollReveal>

          {/* Details Column (Col 5) */}
          <ScrollReveal direction="right" className="lg:col-span-5 text-left h-full flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/5 text-jibb-orange">
                      {React.createElement(activeNode.icon, { className: "size-6" })}
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {activeNode.title}
                    </h3>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {activeNode.description}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-jibb-orange block mb-3">
                    Supported Tech &amp; Integrations
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeNode.tech.map((techItem) => (
                      <span
                        key={techItem}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 font-semibold text-white/80"
                      >
                        {techItem}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
