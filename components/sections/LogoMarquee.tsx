"use client";

import { useTranslations } from "next-intl";
import { ExternalLink, Landmark, Briefcase, Globe, Shield, Zap, Sparkles } from "lucide-react";
import React from "react";

interface Partner {
  name: string;
  href: string;
  type: string;
  logo: string;
}

const PARTNERS: Partner[] = [
  //{ name: "METI Japan", href: "https://www.meti.go.jp/english/", type: "Government", logo: "/logos/meti-logo.jpeg" },
  // { name: "Guidance Tamil Nadu", href: "https://investingintamilnadu.com", type: "Agency", logo: "/logos/gui-logo-black.png" },
  //{ name: "JETRO", href: "https://www.jetro.go.jp/en/", type: "Agency", logo: "/logos/jetro-logo.png" },
  // { name: "Invest India", href: "https://www.investindia.gov.in", type: "Agency", logo: "/logos/invest-india-logo.png" },
  { name: "CII", href: "https://www.cii.in", type: "Chamber", logo: "/logos/cii-logo.png" },
  //{ name: "FICCI", href: "https://ficci.in", type: "Chamber", logo: "/logos/ficci-logo.png" },
  //{ name: "JICA", href: "https://www.jica.go.jp/english/", type: "Agency", logo: "/logos/jica-logo.png" },
  { name: "IMTMA", href: "https://www.imtma.in", type: "Chamber", logo: "/logos/imtma-logo.png" },
  { name: "AMTTF", href: "http://www.amttf.in", type: "Agency", logo: "/logos/amttf-logo.png" },
  { name: "Japan India Semiconductor Committee", href: "#", type: "Committee", logo: "/logos/JISC Png.png" },
  { name: "India Semiconductor Mission", href: "https://ism.gov.in", type: "Government", logo: "/logos/ism_header_logo.png" },
  // { name: "World Development Council", href: "https://www.worlddevelopment.org", type: "Council", logo: "/logos/wdc-logo.png" },
  //{ name: "JBIC", href: "https://www.jbic.go.jp/en/", type: "Agency", logo: "/logos/jbic-logo.png" },
  { name: "Toho Koki Seisakusho", href: "https://tohokoki.jp/", type: "Partner", logo: "/logos/toho-logo.jpg" },
  { name: "Kuraray", href: "https://www.kuraray.com/in-en/", type: "Partner", logo: "/logos/kuraray-logo.png" },
  { name: "Indobox", href: "https://indobox.co.jp/", type: "Partner", logo: "/logos/indobox-logo.png" },
  { name: "Lith-On", href: "https://lith-on.com/", type: "Partner", logo: "/logos/lithon-logo.png" }
];

export function LogoMarquee() {
  const t = useTranslations();

  // Duplicate list to ensure seamless looping
  const duplicatedPartners = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section className="py-10 relative overflow-hidden bg-white dark:bg-[#0c101d] border-y border-border/40 select-none">
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
          gap: 3.5rem;
          align-items: center;
          animation: marquee-scroll 45s linear infinite;
        }
        .animate-marquee-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="section-container relative z-10 text-center space-y-4 mb-12">
        <div className="space-y-2 max-w-3xl mx-auto">
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-jibb-orange">
            {t("partners.sectionTitle") || "Global Networks"}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
            {t("partners.headline") || "Supported by Bilateral Trade & Development Leaders"}
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            {t("partners.sectionSubtitle") || "Facilitating seamless collaboration across governmental bodies, chambers, and academic institutions."}
          </p>
        </div>
      </div>

      {/* Gradient masks on left/right edges */}
      <div className="relative w-full flex items-center overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-white dark:from-[#0c101d] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-white dark:from-[#0c101d] to-transparent z-20 pointer-events-none" />

        {/* Marquee Inner Container */}
        <div className="animate-marquee-scroll py-2">
          {duplicatedPartners.map((partner, idx) => {
            return (
              <a
                key={`${partner.name}-${idx}`}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-16 w-36 md:h-20 md:w-44 shrink-0 transition-transform duration-300 hover:scale-105"
                title={partner.name}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain transition-all duration-300"
                />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
