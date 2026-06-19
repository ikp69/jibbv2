"use client";

import { useState, useEffect } from "react";
import { DesktopStoryHero } from "./DesktopStoryHero";
import { MobileStoryHero } from "./MobileStoryHero";

export function StoryHero() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    
    const handleMediaQueryChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    handleMediaQueryChange(mediaQuery);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaQueryChange);
      return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);
    } else {
      mediaQuery.addListener(handleMediaQueryChange);
      return () => mediaQuery.removeListener(handleMediaQueryChange);
    }
  }, []);

  if (!mounted || isMobile === null) {
    return (
      <section className="relative w-full h-screen overflow-hidden bg-background" style={{ height: "100dvh" }}>
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src="/JIBB_LandingPage_Illustration_Final.webp"
            alt="Cover Illustration"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-black/10 pointer-events-none z-10" />
      </section>
    );
  }

  return isMobile ? <MobileStoryHero /> : <DesktopStoryHero />;
}
