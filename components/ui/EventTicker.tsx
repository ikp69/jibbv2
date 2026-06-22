"use client";

import { X } from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { useTickerContext } from "@/components/providers/TickerContext";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export function EventTicker() {
  const { isTickerVisible, setIsTickerVisible } = useTickerContext();
  const t = useTranslations("eventNoticeBoard");

  // Add/remove body class based on ticker visibility
  useEffect(() => {
    if (isTickerVisible) {
      document.body.classList.add("ticker-visible");
      document.body.classList.remove("ticker-hidden");
    } else {
      document.body.classList.add("ticker-hidden");
      document.body.classList.remove("ticker-visible");
    }
  }, [isTickerVisible]);

  const handleDismiss = () => {
    setIsTickerVisible(false);
  };

  // Don't render if dismissed in current session
  if (!isTickerVisible) {
    return null;
  }

  // The content that will scroll
  const tickerContent = (
    <>
      <Link 
        href="/events/india-japan-manufacturing-collaboration-2026">
      <span className="inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/20 backdrop-blur-sm flex-shrink-0 mx-1 md:mx-2">
        🎯
      </span>
      <span className="font-bold text-xs md:text-sm">{t("upcomingEvent")}:</span>
      <span className="mx-1 md:mx-2 text-xs md:text-sm">{t("eventTitle")}</span>
      <span className="mx-0.5 md:mx-1 text-xs md:text-sm">—</span>
      <span className="text-white/90 mr-1 md:mr-2 text-xs md:text-sm">{t("eventDate")}</span>
      <span className="inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 bg-white text-jibb-indigo rounded-full font-bold text-[10px] md:text-xs hover:bg-white/90 transition-all hover:scale-105 shadow-sm mx-1 md:mx-2">{t("registerNow")} →</span>
      </Link>
      <span className="mx-4 md:mx-8 text-white/50 text-xs md:text-sm">•</span>
    </>
  );

  return (
    <div className="fixed top-0 left-0 right-0 h-[38px] md:h-[42px] bg-gradient-to-r from-jibb-indigo via-jibb-indigo/95 to-jibb-orange text-white shadow-md border-b border-white/10 z-[100] overflow-hidden">
      <div className="relative h-full flex items-center px-1 md:px-2">
        {/* Scrolling content container */}
        <div className="flex items-center animate-scroll-left whitespace-nowrap text-sm font-medium">
          {/* Repeat content multiple times for seamless loop */}
          {tickerContent}
          {tickerContent}
          {tickerContent}
          {tickerContent}
        </div>
        
        {/* Close Button - Fixed on the right */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm z-10"
          aria-label="Dismiss event ticker"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* CSS for scrolling animation */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
