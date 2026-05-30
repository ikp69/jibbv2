"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { routing } from "@/src/i18n/routing";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const localeLabels: Record<string, { flag: string; label: string }> = {
  en: { flag: "🇺🇸", label: "English" },
  ja: { flag: "🇯🇵", label: "日本語" },
};

export function LanguageSwitcher({
  className,
  triggerClassName,
}: {
  className?: string;
  triggerClassName?: string;
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale as (typeof routing.locales)[number] });
    setOpen(false);
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors",
          triggerClassName
        )}
        aria-label="Switch language"
        aria-expanded={open}
      >
        <Globe className="size-4" />
        <span className="text-base leading-none">{localeLabels[locale]?.flag}</span>
        <span className="hidden sm:inline text-sm">{localeLabels[locale]?.label}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-card rounded-xl border border-border shadow-jibb-md z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors hover:bg-muted",
                loc === locale
                  ? "font-semibold text-primary bg-primary/5"
                  : "text-foreground"
              )}
            >
              <span className="text-base">{localeLabels[loc]?.flag}</span>
              <span>{localeLabels[loc]?.label}</span>
              {loc === locale && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
