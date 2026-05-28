"use client";

import { DesktopStoryHero } from "./DesktopStoryHero";
import { MobileStoryHero } from "./MobileStoryHero";

export function StoryHero() {
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
