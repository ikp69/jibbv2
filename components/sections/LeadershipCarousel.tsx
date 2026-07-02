"use client";

import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from "lucide-react";
import { Link } from "@/src/i18n/navigation";

interface Member {
  key: string;
  img: string;
}

const MEMBERS: Member[] = [
  { key: "varun", img: "/leaders/varun-tyagi.png" },
  { key: "shigemaro", img: "/leaders/shigemaro-yasui.png" },
  { key: "ujjawal", img: "/leaders/ujjawal-dahiya.png" },
  { key: "vardaan", img: "/leaders/vardaan-chaudhary.png" },
  { key: "nobuchika", img: "/leaders/nobichuka-akiya.png" },
  { key: "mai", img: "/leaders/mai-hashikura.png" },
  { key: "aya", img: "/leaders/aya-saito.png" },
  { key: "gyanendra", img: "/leaders/gyanendra-yadav.png" },
  { key: "akash", img: "/leaders/akash-pandey.png" },
  { key: "pratiksha", img: "/leaders/pratiksha-pandey.png" },
  { key: "hitesh", img: "/leaders/hitesh-gupttaa.png" },
];

export function LeadershipCarousel() {
  const t = useTranslations("leadershipPage");
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % MEMBERS.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + MEMBERS.length) % MEMBERS.length);
  };

  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardEl = container.children[index] as HTMLElement;
    if (cardEl) {
      const offsetLeft = cardEl.offsetLeft - (container.clientWidth / 2) + (cardEl.clientWidth / 2);
      container.scrollTo({
        left: offsetLeft,
        behavior: "smooth",
      });
    }
  };

  // Automatically scroll to the active card after the DOM re-renders and widths update
  React.useEffect(() => {
    // A small timeout ensures that CSS transitions have initialized and the layout is stable
    const timer = setTimeout(() => {
      scrollToCard(activeIndex);
    }, 100);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <div className="w-full space-y-6">
      {/* Header controls layout matching the requested layout */}
      <div className="flex items-center justify-between">
        <Link href="/about/leadership">
          <button className="text-sm font-bold text-primary hover:text-jibb-orange flex items-center gap-1.5 group transition-colors">
            <span>{t("viewAllLeaders")}</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </Link>

        {/* Right Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="p-2 md:p-2.5 rounded-lg md:rounded-xl bg-muted/65 border border-border/60 hover:bg-muted/90 active:scale-95 transition-all"
            aria-label="Previous leadership member"
          >
            <ChevronLeft className="size-4 md:size-5 text-foreground" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 md:p-2.5 rounded-lg md:rounded-xl bg-muted/65 border border-border/60 hover:bg-muted/90 active:scale-95 transition-all"
            aria-label="Next leadership member"
          >
            <ChevronRight className="size-4 md:size-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Accordion Carousel Row */}
      <div 
        ref={scrollContainerRef}
        className="flex flex-row overflow-x-auto no-scrollbar gap-3 md:gap-4 pb-4 w-full cursor-grab active:cursor-grabbing select-none"
      >
        {MEMBERS.map((member, i) => {
          const isActive = i === activeIndex;
          const name = t(`members.${member.key}.name`);
          const role = t(`members.${member.key}.role`);
          const location = t(`members.${member.key}.location`);
          const bio = t(`members.${member.key}.bio`);
          
          // Safe name extraction that handles fallback keys
          const safeName = typeof name === 'string' && !name.startsWith('members.') ? name : member.key;

          return (
            <div
              key={member.key}
              onClick={() => {
                setActiveIndex(i);
              }}
              className={`relative shrink-0 h-[500px] md:h-[620px] rounded-3xl overflow-hidden border border-border/50 transition-all duration-500 ease-in-out cursor-pointer group shadow-jibb-sm hover:shadow-jibb-md ${
                isActive 
                  ? "w-[290px] md:w-[460px] bg-gradient-to-tr from-jibb-indigo/10 to-jibb-orange/10 border-jibb-indigo/30" 
                  : "w-20 md:w-28 bg-muted/40 hover:bg-muted/70"
              }`}
            >
              {/* Profile Image with Greyscale/Color Toggle */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.img}
                alt={safeName}
                className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 pointer-events-none select-none ${
                  isActive 
                    ? "grayscale-0 scale-100 opacity-95" 
                    : "grayscale opacity-60 group-hover:opacity-85 scale-105"
                }`}
              />

              {/* Gradient Backdrop Overlays for readability */}
              <div 
                className={`absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 transition-opacity duration-500 ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-30"
                }`}
              />

              {/* Collapsed view indicator (displays initials or vertically stacked thin dots) */}
              {!isActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 group-hover:bg-foreground/60 transition-colors" />
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 group-hover:bg-foreground/60 transition-colors mt-1.5" />
                  <span className="text-[10px] font-bold tracking-widest text-foreground/40 uppercase rotate-90 origin-center whitespace-nowrap mt-8">
                    {safeName.split(" ")[0]}
                  </span>
                </div>
              )}

              {/* Expanded Card Details (Top Left / Bottom Left) */}
              {isActive && (
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 text-white z-10 pointer-events-none">
                  {/* Top Left: Role and Name */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase text-jibb-orange-light block">
                      {role}
                    </span>
                    <h3 className="text-xl md:text-3xl font-black tracking-tight drop-shadow-sm">
                      {safeName}
                    </h3>
                  </div>

                  {/* Bottom Left: Bio & Location */}
                  <div className="space-y-3 text-left max-w-sm md:max-w-md animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <p className="text-xs md:text-sm text-white/80 leading-relaxed font-medium line-clamp-3">
                      "{bio}"
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-white/70">
                      <MapPin className="size-3.5 text-jibb-orange-light" />
                      <span>{location}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
