"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AlignLeft, Hash, ChevronRight } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: string; // "h2" | "h3"
}

interface TocGroup {
  parent: TocItem;
  children: TocItem[];
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);

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

  // Group h3s under their preceding h2
  const groups: TocGroup[] = [];
  let currentGroup: TocGroup | null = null;

  headings.forEach((item) => {
    if (item.level === "h2") {
      currentGroup = { parent: item, children: [] };
      groups.push(currentGroup);
    } else {
      if (currentGroup) {
        currentGroup.children.push(item);
      } else {
        // Fallback if h3 comes before any h2
        groups.push({ parent: item, children: [] });
      }
    }
  });

  // Find the group to which activeId belongs
  const activeGroupParentId = groups.find(
    (g) => g.parent.id === activeId || g.children.some((c) => c.id === activeId)
  )?.parent.id;

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

      <ul className="space-y-3 max-h-[70vh] overflow-y-auto no-scrollbar py-1 text-left relative">
        {groups.map((group) => {
          const isParentActive = activeId === group.parent.id;
          const isGroupActive = activeGroupParentId === group.parent.id;
          const isHovered = hoveredGroupId === group.parent.id;
          const isExpanded = isGroupActive || isHovered;

          return (
            <li
              key={group.parent.id}
              className="space-y-1.5 transition-all duration-200"
              onMouseEnter={() => setHoveredGroupId(group.parent.id)}
              onMouseLeave={() => setHoveredGroupId(null)}
            >
              {/* Parent Item */}
              <a
                href={`#${group.parent.id}`}
                onClick={(e) => handleClick(e, group.parent.id)}
                className={cn(
                  "flex items-center gap-1.5 py-1 text-[13px] font-bold transition-all duration-200 group/item rounded-md",
                  isParentActive || (isGroupActive && group.children.length === 0)
                    ? "text-jibb-orange translate-x-1"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {group.children.length > 0 && (
                  <ChevronRight
                    className={cn(
                      "size-3.5 shrink-0 transition-transform duration-200",
                      isExpanded ? "rotate-90 text-jibb-orange" : "text-muted-foreground/50 group-hover/item:text-foreground"
                    )}
                  />
                )}
                {group.children.length === 0 && (
                  <Hash
                    className={cn(
                      "size-3.5 shrink-0 transition-opacity",
                      isParentActive ? "text-jibb-orange opacity-100" : "opacity-0 group-hover/item:opacity-30 text-muted-foreground"
                    )}
                  />
                )}
                <span className="leading-snug">{group.parent.text}</span>
              </a>

              {/* Children (Accordion) */}
              {group.children.length > 0 && (
                <ul
                  className={cn(
                    "pl-4 border-l border-border/50 space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-[500px] opacity-100 py-0.5" : "max-h-0 opacity-0 py-0 pointer-events-none"
                  )}
                >
                  {group.children.map((child) => {
                    const isChildActive = child.id === activeId;
                    return (
                      <li key={child.id}>
                        <a
                          href={`#${child.id}`}
                          onClick={(e) => handleClick(e, child.id)}
                          className={cn(
                            "flex items-center gap-1.5 py-1 text-xs transition-all duration-200 group/child rounded-md",
                            isChildActive
                              ? "text-jibb-orange font-semibold translate-x-1"
                              : "text-muted-foreground/80 hover:text-foreground"
                          )}
                        >
                          <Hash
                            className={cn(
                              "size-3 mt-0.5 shrink-0 transition-opacity",
                              isChildActive ? "text-jibb-orange opacity-100" : "opacity-0 group-hover/child:opacity-30 text-muted-foreground"
                            )}
                          />
                          <span className="leading-snug">{child.text}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
