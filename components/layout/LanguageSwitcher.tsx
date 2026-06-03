"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { routing } from "@/src/i18n/routing";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function LanguageSwitcher({
  className,
}: {
  className?: string;
  triggerClassName?: string; // Keep for compatibility with parent callers
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Local state for instant visual feedback during route transition lag
  const [localLocale, setLocalLocale] = useState(locale);

  // Sync state when router finishes locale updates
  useEffect(() => {
    setLocalLocale(locale);
  }, [locale]);

  function switchLocale(newLocale: "en" | "ja") {
    if (localLocale === newLocale) return;
    setLocalLocale(newLocale); // Instant transition animation
    router.replace(pathname, { locale: newLocale });
  }

  function handleToggle() {
    const nextLocale = localLocale === "en" ? "ja" : "en";
    switchLocale(nextLocale);
  }

  const isEn = localLocale === "en";

  return (
    <div 
      className={cn(
        "flex items-center justify-center", 
        className
      )}
    >
      <div 
        onClick={handleToggle}
        className="relative h-8 w-[92px] flex items-center bg-secondary/85 dark:bg-secondary/45 rounded-full border border-border/80 hover:border-border cursor-pointer select-none transition-all duration-300"
        role="button"
        aria-label="Toggle language"
      >
        {/* Sliding active indicator with brand gradients (Symmetric transition) */}
        <div 
          className={cn(
            "absolute top-[3px] bottom-[3px] left-[3px] w-[42px] rounded-full transition-transform duration-300 ease-out shadow-sm",
            isEn ? "translate-x-0" : "translate-x-[44px]"
          )}
        >
          <div 
            className={cn(
              "w-full h-full rounded-full transition-all duration-300",
              isEn 
                ? "bg-gradient-to-r from-jibb-orange to-jibb-orange-light shadow-jibb-orange-glow/30" 
                : "bg-gradient-to-r from-jibb-sakura to-jibb-sakura-light shadow-jibb-glow/30"
            )}
          />
        </div>

        {/* English Label Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            switchLocale("en");
          }}
          className={cn(
            "relative z-10 w-[43px] h-full flex items-center justify-center text-[10px] font-extrabold tracking-wider transition-colors duration-300 ml-[3px] cursor-pointer",
            isEn ? "text-white" : "text-muted-foreground hover:text-foreground"
          )}
        >
          EN
        </button>

        {/* Japanese Label Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            switchLocale("ja");
          }}
          className={cn(
            "relative z-10 w-[43px] h-full flex items-center justify-center text-[10px] font-extrabold tracking-wider transition-colors duration-300 cursor-pointer",
            !isEn ? "text-white" : "text-muted-foreground hover:text-foreground"
          )}
        >
          JA
        </button>
      </div>
    </div>
  );
}
