"use client";

import { useState, useEffect } from "react";
import { DesktopStoryHero } from "./DesktopStoryHero";
import { MobileStoryHero } from "./MobileStoryHero";

export function StoryHero() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
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

  if (isMobile === null) {
    return (
      <>
        <div className="hidden md:block">
          <DesktopStoryHero />
        </div>
        <div className="block md:hidden">
          <MobileStoryHero />
        </div>
      </>
    );
  }

  return isMobile ? <MobileStoryHero /> : <DesktopStoryHero />;
}
