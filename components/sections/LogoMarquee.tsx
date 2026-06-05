"use client";

import { useTranslations } from "next-intl";
import { ExternalLink, Landmark, Briefcase, Globe, Shield, Zap, Sparkles } from "lucide-react";
import React from "react";

interface Partner {
  name: string;
  href: string;
  type: "government" | "chamber" | "agency";
  icon: React.ComponentType<{ className?: string }>;
}

const PARTNERS: Partner[] = [
  { name: "METI Japan", href: "https://www.meti.go.jp/english/", type: "government", icon: Landmark },
  { name: "DPIIT India", href: "https://dpiit.gov.in", type: "government", icon: Landmark },
  { name: "JETRO", href: "https://www.jetro.go.jp/en/", type: "agency", icon: Globe },
  { name: "Invest India", href: "https://www.investindia.gov.in", type: "agency", icon: Zap },
  { name: "FICCI", href: "https://ficci.in", type: "chamber", icon: Briefcase },
  { name: "Keidanren", href: "https://www.keidanren.or.jp/en/", type: "chamber", icon: Shield },
  { name: "JICA", href: "https://www.jica.go.jp/english/", type: "agency", icon: Globe },
  { name: "CII", href: "https://www.cii.in", type: "chamber", icon: Briefcase },
  { name: "Startup India", href: "https://www.startupindia.gov.in", type: "agency", icon: Sparkles },
];

export function LogoMarquee() {
  const t = useTranslations();

  // Duplicate list to ensure seamless looping
  const duplicatedPartners = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section className="py-16 relative overflow-hidden bg-jibb-indigo border-y border-white/5 select-none">
      <style jsx global>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.3333%);
          }
        }
        .animate-marquee-scroll {
          display: flex;
          width: max-content;
          gap: 1.5rem;
          animation: marquee-scroll 35s linear infinite;
        }
        .animate-marquee-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Decorative background lights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-32 bg-jibb-orange/5 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-32 bg-jibb-sakura/5 rounded-full blur-[60px] pointer-events-none" />

      <div className="section-container relative z-10 text-center space-y-8 mb-12">
        <div className="space-y-2 max-w-2xl mx-auto">
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-jibb-orange">
            {t("partners.sectionTitle")}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Supported by Bilateral Trade &amp; Development Leaders
          </h2>
          <p className="text-sm text-white/60">
            {t("partners.sectionSubtitle")}
          </p>
        </div>
      </div>

      {/* Gradient masks on left/right edges */}
      <div className="relative w-full flex items-center overflow-hidden py-4">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-jibb-indigo to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-jibb-indigo to-transparent z-20 pointer-events-none" />

        {/* Marquee Inner Container */}
        <div className="animate-marquee-scroll py-2">
          {duplicatedPartners.map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <a
                key={`${partner.name}-${idx}`}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-3.5 px-6 py-4.5 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-md hover:bg-white/10 hover:border-jibb-orange/30 hover:shadow-jibb-orange-glow transition-all duration-300 select-none min-w-[200px]"
              >
                <div className="p-2 rounded-xl bg-white/5 group-hover:bg-jibb-orange/15 transition-all duration-300">
                  <Icon className="size-5.5 text-white/50 group-hover:text-jibb-orange group-hover:scale-110 transition-all duration-300" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-white/70 group-hover:text-white transition-colors duration-300">
                    {partner.name}
                  </span>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider group-hover:text-white/60 transition-colors duration-300">
                    {partner.type}
                  </span>
                </div>
                <ExternalLink className="size-3 text-white/20 group-hover:text-white/50 absolute top-3.5 right-3.5 transition-colors" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
