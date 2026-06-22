"use client";

import { Link } from "@/src/i18n/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function EventNoticeBoard() {
  const t = useTranslations("eventNoticeBoard");
  const [countdown, setCountdown] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const eventDate = new Date("2026-07-03T10:00:00+09:00");
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const eventDate = t("eventDate");

  return (
    <section className="py-12 md:py-16 bg-background relative overflow-hidden">
      <div className="section-container max-w-7xl px-4 md:px-6">
        <Link href="/events/india-japan-manufacturing-collaboration-2026">
          <div className="group relative cursor-pointer">
            
            {/* Mobile Layout: Vertical Stack (Timer on top, Image below) */}
            <div className="flex flex-col md:hidden gap-6 items-center">
              
              {/* Timer Section - Mobile */}
              <div className="w-full max-w-sm">
                <div className="bg-gradient-to-br from-jibb-indigo via-jibb-indigo/90 to-jibb-orange rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="text-center">
                    <h3 className="text-white font-black text-sm mb-6 tracking-tight">
                      {t("countdownTitle")}
                    </h3>
                    
                    {/* Countdown Display */}
                    <div className="grid grid-cols-4 gap-2 mb-6">
                      {[
                        { value: countdown.days, label: t("days") },
                        { value: countdown.hours, label: t("hours") },
                        { value: countdown.minutes, label: t("minutes") },
                        { value: countdown.seconds, label: t("seconds") },
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white/10 rounded-2xl py-3 px-2 backdrop-blur-sm border border-white/20">
                          <div className="text-white font-black text-xl md:text-2xl leading-none">
                            {String(item.value).padStart(2, "0")}
                          </div>
                          <div className="text-white/70 text-[10px] font-bold mt-1 uppercase tracking-wider">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button className="w-full bg-white text-jibb-indigo hover:bg-white/90 font-black py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-sm">
                      {t("registerNow")}
                    </button>
                  </div>
                </div>
              </div>

              {/* Event Image - Mobile */}
              <div className="w-full max-w-sm">
                <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 aspect-square">
                  <img
                    src="/events/JIBB_Event_3_July_2026_square.jpg"
                    alt={t("eventTitle")}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Animated Text - Mobile */}
              <div className="w-full max-w-sm h-16">
                <div className="relative h-full flex items-center justify-center bg-gradient-to-r from-jibb-orange via-jibb-sakura to-jibb-orange rounded-2xl overflow-hidden shadow-md">
                  {/* Animated text scroll */}
                  <div className="flex animate-scroll-infinite whitespace-nowrap">
                    <span className="text-white font-black text-lg px-8 inline-block">
                      🎯 {t("joinUs")} {eventDate.toUpperCase()} • 🎯 {t("joinUs")} {eventDate.toUpperCase()} •
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Desktop Layout: Hero Bento-Style with Overlapping Cards */}
            <div className="hidden md:block relative">
              
              {/* Main Container with Perspective */}
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                
                {/* Left: Featured Image */}
                <div className="relative group/hero">
                  {/* Main Image Card */}
                  <div className="relative rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 aspect-square">
                    <img
                      src="/events/JIBB_Event_3_July_2026_square.jpg"
                      alt={t("eventTitle")}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/hero:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/hero:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Right: Content Stack */}
                <div className="space-y-6 lg:space-y-8">
                  
                  {/* Event Title & Timer Grid */}
                  <div className="bg-gradient-to-br from-jibb-indigo via-jibb-indigo/95 to-jibb-indigo/90 rounded-[2rem] p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:translate-x-2">
                    
                    {/* Title */}
                    <div className="mb-8">
                      <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-white/10 rounded-full backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-jibb-orange animate-pulse" />
                        <span className="text-white/90 text-xs font-bold uppercase tracking-wider">
                          {t("upcomingEvent")}
                        </span>
                      </div>
                      <h3 className="text-white font-black text-3xl lg:text-4xl mb-3 tracking-tight leading-tight">
                        {t("eventTitle")}
                      </h3>
                      <div className="flex items-center gap-3 text-white/80 text-sm font-semibold">
                        <span>📅 {eventDate}</span>
                      </div>
                    </div>

                    {/* All Countdown Units: Days + Hours/Min/Sec */}
                    <div className="grid grid-cols-4 gap-3 mb-8">
                      {/* Days - Full Size */}
                      <div className="bg-white/10 rounded-2xl py-5 px-3 backdrop-blur-sm border border-white/20 text-center hover:bg-white/15 hover:scale-105 transition-all duration-300">
                        <div className="text-white font-black text-3xl lg:text-4xl leading-none">
                          {String(countdown.days).padStart(2, "0")}
                        </div>
                        <div className="text-white/60 text-xs font-bold mt-2 uppercase tracking-wider">
                          {t("days")}
                        </div>
                      </div>

                      {/* Hours */}
                      <div className="bg-white/10 rounded-2xl py-5 px-3 backdrop-blur-sm border border-white/20 text-center hover:bg-white/15 hover:scale-105 transition-all duration-300">
                        <div className="text-white font-black text-2xl lg:text-3xl leading-none">
                          {String(countdown.hours).padStart(2, "0")}
                        </div>
                        <div className="text-white/60 text-xs font-bold mt-2 uppercase tracking-wider">
                          {t("hours")}
                        </div>
                      </div>

                      {/* Minutes */}
                      <div className="bg-white/10 rounded-2xl py-5 px-3 backdrop-blur-sm border border-white/20 text-center hover:bg-white/15 hover:scale-105 transition-all duration-300">
                        <div className="text-white font-black text-2xl lg:text-3xl leading-none">
                          {String(countdown.minutes).padStart(2, "0")}
                        </div>
                        <div className="text-white/60 text-xs font-bold mt-2 uppercase tracking-wider">
                          {t("minutes")}
                        </div>
                      </div>

                      {/* Seconds */}
                      <div className="bg-white/10 rounded-2xl py-5 px-3 backdrop-blur-sm border border-white/20 text-center hover:bg-white/15 hover:scale-105 transition-all duration-300">
                        <div className="text-white font-black text-2xl lg:text-3xl leading-none">
                          {String(countdown.seconds).padStart(2, "0")}
                        </div>
                        <div className="text-white/60 text-xs font-bold mt-2 uppercase tracking-wider">
                          {t("seconds")}
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full bg-white text-jibb-indigo hover:bg-jibb-orange hover:text-white font-black py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 text-base group/btn flex items-center justify-center gap-2">
                      <span>{t("registerNow")}</span>
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>

                  </div>

                  {/* Animated Banner */}
                  <div className="relative rounded-[2rem] overflow-hidden shadow-lg bg-gradient-to-r from-jibb-orange via-jibb-sakura to-jibb-orange p-6 lg:p-8 min-h-[120px] flex items-center justify-center hover:shadow-xl transition-all duration-300">
                    {/* Animated Text Scroll */}
                    <div className="absolute inset-0 flex items-center overflow-hidden">
                      <div className="flex animate-scroll-infinite whitespace-nowrap">
                        <span className="text-white font-black text-2xl lg:text-3xl px-12 inline-block">
                          🎯 {t("joinUs")} • {eventDate.toUpperCase()} • {t("dontMissOut").toUpperCase()} •
                        </span>
                        <span className="text-white font-black text-2xl lg:text-3xl px-12 inline-block">
                          🎯 {t("joinUs")} • {eventDate.toUpperCase()} • {t("dontMissOut").toUpperCase()} •
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </Link>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes scroll-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-vertical {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(-200%);
          }
        }

        .animate-scroll-infinite {
          animation: scroll-infinite 15s linear infinite;
        }

        .animate-scroll-vertical {
          animation: scroll-vertical 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

