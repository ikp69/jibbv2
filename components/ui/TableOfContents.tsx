"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AlignLeft, Hash } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: string; // "h2" | "h3"
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // 1. Query headings under article content
    const headingElements = document.querySelectorAll(".jibb-prose h2, .jibb-prose h3");
    if (!headingElements.length) return;

    // 2. Map headings and assign IDs if they don't exist
    const mappedHeadings: TocItem[] = Array.from(headingElements).map((el: any, index) => {
      let id = el.id;
      if (!id) {
        id = el.textContent
          ? el.textContent
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")
          : `heading-${index}`;
        el.id = id;
      }
      return {
        id,
        text: el.textContent || "",
        level: el.tagName.toLowerCase(),
      };
    });

    setHeadings(mappedHeadings);

    // 3. Set up IntersectionObserver to track scroll state
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // triggers active state when heading is in upper-middle viewport
      threshold: 0.1,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Find the heading that is intersecting
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    headingElements.forEach((el) => observer.observe(el));

    // Fallback scroll listener in case headers are spaced far apart
    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      let currentActive = "";

      for (let i = 0; i < headingElements.length; i++) {
        const el = headingElements[i] as HTMLElement;
        if (el.offsetTop <= scrollPos) {
          currentActive = el.id;
        } else {
          break;
        }
      }

      if (currentActive && currentActive !== activeId) {
        setActiveId(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeId]);

  if (!headings.length) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // offset for navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveId(id);
    }
  };

  return (
    <nav className="space-y-4 select-none pr-4">
      <div className="flex items-center gap-2 pb-3 border-b border-border/50">
        <AlignLeft className="size-4 text-jibb-orange animate-soft-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider text-foreground/80">
          Table of Contents
        </span>
      </div>

      <ul className="space-y-2.5 max-h-[70vh] overflow-y-auto no-scrollbar py-1 text-left relative">
        {headings.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={cn(
                "transition-all duration-200",
                item.level === "h3" ? "pl-4 text-xs" : "text-[13px] font-semibold"
              )}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={cn(
                  "flex items-start gap-1.5 py-1 transition-all duration-200 group rounded-md",
                  isActive
                    ? "text-jibb-orange translate-x-1"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Hash className={cn(
                  "size-3.5 mt-0.5 shrink-0 transition-opacity", 
                  isActive ? "text-jibb-orange opacity-100" : "opacity-0 group-hover:opacity-30 text-muted-foreground"
                )} />
                <span className="leading-snug">{item.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
