"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, Variants } from "framer-motion";
import { Settings, Cpu, Car, Wrench, Network } from "lucide-react";

interface PillarItem {
  id: number;
  title: string;
  subtext: string;
  icon: React.ReactNode;
}

export function HighvalueEcosystem() {
  const t = useTranslations("highvalueEcosystem");
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const pillars: PillarItem[] = [
    {
      id: 1,
      title: t("title1"),
      subtext: t("sub1"),
      icon: <Settings className="size-12 text-[#102a43] stroke-[1.5]" />,
    },
    {
      id: 3,
      title: t("title2"),
      subtext: t("sub2"),
      icon: <Cpu className="size-12 text-[#102a43] stroke-[1.5]" />,
    },
    {
      id: 4,
      title: t("title3"),
      subtext: t("sub3"),
      icon: <Car className="size-12 text-[#102a43] stroke-[1.5]" />,
    },
    {
      id: 5,
      title: t("title4"),
      subtext: t("sub4"),
      icon: <Wrench className="size-12 text-[#102a43] stroke-[1.5]" />,
    },
    {
      id: 6,
      title: t("title5"),
      subtext: t("sub5"),
      icon: <Network className="size-12 text-[#102a43] stroke-[1.5]" />,
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const pillarVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // Always render desktop grid to prevent hydration mismatch
  // Mobile carousel will be handled via CSS media queries
  const renderPillars = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-3 lg:grid-cols-5 gap-4 items-stretch mb-6 overflow-x-auto md:overflow-visible"
    >
      {pillars.map((pillar) => (
        <motion.div
          key={pillar.id}
          variants={pillarVariants}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className="relative flex flex-col pt-12 select-none group"
        >
          {/* Left and Right Borders */}
          <div className="absolute bottom-6 top-12 border-l-2 border-r-2 border-[#102a43] pointer-events-none left-3 right-3" />

          {/* Broken Top Border */}
          <div className="absolute top-12 left-3 w-[calc(50%-40px)] h-[2px] bg-[#102a43]" />
          <div className="absolute top-12 right-3 w-[calc(50%-40px)] h-[2px] bg-[#102a43]" />

          {/* Centered Icon in the gap */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 z-10 flex items-center justify-center">
            {pillar.icon}
          </div>

          {/* Main Column Body */}
          <div className="flex-1 bg-white px-5 pt-8 pb-4 text-center flex flex-col justify-center min-h-[260px]">
            {/* Orange Horizontal Line inside the body below the icon gap */}
            <div className="w-20 h-1.5 bg-[#e25c22] mx-auto mb-6 rounded-full" />

            <h4 className="text-[14px] md:text-[15px] font-bold text-[#e25c22] leading-snug tracking-tight mb-2 uppercase">
              {pillar.title}
            </h4>
            <p className="text-[12px] md:text-[13px] text-[#e25c22] opacity-90 leading-relaxed font-semibold">
              {pillar.subtext}
            </p>
          </div>

          {/* Stacked Pedestal Base Blocks */}
          <div className="relative z-10 w-full mt-auto">
            {/* Horizontal line above steps */}
            {/* <div className="h-[2px] bg-[#102a43] mx-3" /> */}
            {/* Base Step 1 - Top step (narrower) */}
            <div className="h-4 border-l-2 border-r-2 border-t-2 border-[#102a43] bg-white mx-1" />
            {/* Base Step 2 - Bottom step (wider, extends more) */}
            <div className="h-4 border-l-2 border-r-2 border-t-2 border-b-2 border-[#102a43] bg-white mx-0" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <section className="py-20 bg-white border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-2">
            {t("heading")}
          </h2>
        </div>

        {/* Dynamic Column Grid */}
        {renderPillars()}

        {/* Navy Pedestal Base Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-[#0b2545] border-2 border-[#102a43] text-white p-6 md:p-8 rounded-none shadow-md text-center"
        >
          <p className="text-[13px] md:text-[14px] leading-relaxed font-bold tracking-wide">
            {t.rich("bannerText", {
              orange: (chunks) => <span className="text-[#f79256] uppercase">{chunks}</span>,
              orangeVal: (chunks) => <span className="text-[#f79256]">{chunks}</span>,
              underline: (chunks) => <span className="underline decoration-[#f79256] decoration-2">{chunks}</span>
            })}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
