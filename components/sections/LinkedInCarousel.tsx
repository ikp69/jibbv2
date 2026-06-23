"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Globe } from "lucide-react";
import { useLocale } from "next-intl";

interface LinkedInCarouselProps {
  posts: { id: string; shareUrn: string }[];
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function LinkedInCarousel({ posts }: LinkedInCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const [adminPasscode, setAdminPasscode] = useState<string | null>(null);

  const fontHeading = locale === "ja"
    ? { fontFamily: "var(--font-noto-sans-jp)" }
    : { fontFamily: "var(--font-heading)" };

  const fontSans = locale === "ja"
    ? { fontFamily: "var(--font-noto-sans-jp)" }
    : { fontFamily: "var(--font-sans)" };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
      };
      const stored = getCookie("jibb_admin_passcode") || sessionStorage.getItem("jibb_admin_passcode");
      if (stored) {
        setAdminPasscode(stored);
      }
    }
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="linkedin-updates" className="py-16 bg-card border-t border-border/40 relative overflow-hidden scroll-mt-20">
      <div aria-hidden="true" className="absolute top-0 right-0 w-96 h-96 bg-jibb-indigo/5 dark:bg-[#7b9fe0]/5 rounded-full blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 w-96 h-96 bg-jibb-orange/5 dark:bg-[#f0a455]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10 max-w-7xl mx-auto px-4">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <span
              className="text-xs font-black uppercase tracking-widest text-primary/80 dark:text-primary-foreground/80"
              style={fontHeading}
            >
              {locale === "ja" ? "ソーシャルフィード" : "Social Feed"}
            </span>
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-tight"
              style={fontHeading}
            >
              {locale === "ja" ? "LinkedIn のアップデート" : "Latest LinkedIn Updates"}
            </h2>
            <p
              className="text-sm text-muted-foreground max-w-2xl leading-relaxed"
              style={fontSans}
            >
              {locale === "ja"
                ? "日印間のパートナーシップ、業界動向、そして私たちの活動に関する最新のソーシャルメディア更新情報。"
                : "Real-time insights, collaboration updates, and milestones from the Japan-India business corridor."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Carousel Controls */}
            <div className="flex items-center gap-1.5 border border-border/30 dark:border-border/10 rounded-full p-1 bg-background/50 backdrop-blur-sm">
              <button
                onClick={() => handleScroll("left")}
                className="p-1.5 rounded-full hover:bg-muted dark:hover:bg-muted/10 transition-colors"
                aria-label="Previous posts"
              >
                <ArrowLeft className="size-4 text-foreground/80" />
              </button>
              <div className="w-px h-4 bg-border/40" />
              <button
                onClick={() => handleScroll("right")}
                className="p-1.5 rounded-full hover:bg-muted dark:hover:bg-muted/10 transition-colors"
                aria-label="Next posts"
              >
                <ArrowRight className="size-4 text-foreground/80" />
              </button>
            </div>

            {/* View All Button */}
            <a
              href="https://linkedin.com/company/japan-india-business-bureau"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-jibb-indigo dark:bg-[#7b9fe0] text-white dark:text-[#0f1629] font-bold text-xs rounded-xl hover:bg-jibb-indigo-light dark:hover:bg-[#9ab5e8] active:scale-[0.98] transition-all shadow-md inline-flex items-center gap-1.5"
            >
              <span>{locale === "ja" ? "すべての投稿を表示" : "VIEW ALL"}</span>
              <ArrowRight className="size-3" />
            </a>
          </div>
        </div>

        {/* Carousel Grid View */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x snap-mandatory pr-6"
          >
            <AnimatePresence mode="popLayout">
              {posts.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground w-full flex flex-col items-center justify-center border border-dashed border-border/40 rounded-3xl bg-card/20 backdrop-blur-sm">
                  <Globe className="size-10 opacity-30 mb-3 text-jibb-orange animate-soft-pulse" />
                  <p className="text-sm font-bold uppercase tracking-wider text-foreground">No Social Updates Active</p>
                  <p className="text-xs opacity-75 mt-1">Please sync items in the Admin panel to populate the feed.</p>
                </div>
              ) : (
                posts.map((post, idx) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex-shrink-0 w-[290px] sm:w-[340px] md:w-[380px] snap-start"
                  >
                    <div className="relative bg-card dark:bg-[#161f38]/45 border border-border/50 hover:border-primary/30 rounded-2xl p-1.5 hover:shadow-jibb-md transition-all duration-300 flex flex-col h-[480px] overflow-hidden">
                      <div className="w-full h-full overflow-y-auto overflow-x-hidden sleek-scrollbar pr-1 rounded-xl">
                        <div className="w-[calc(100%+17px)] h-[800px]">
                          <iframe
                            src={`https://www.linkedin.com/embed/feed/update/${post.shareUrn}?collapsed=1`}
                            height="100%"
                            width="100%"
                            style={{ border: 'none', borderRadius: '12px' }}
                            allowFullScreen
                            title="LinkedIn post"
                            loading="lazy"
                            scrolling="no"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Show More Social Button */}
        {posts.length > 0 && (
          <div className="text-center mt-8">
            <a
              href="https://linkedin.com/company/japan-india-business-bureau"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-background border border-border/60 hover:border-primary/50 text-foreground text-xs font-bold rounded-lg transition-all active:scale-[0.98] inline-flex items-center gap-2 hover:shadow-sm"
              style={fontHeading}
            >
              <span>{locale === "ja" ? "LinkedIn でさらに表示" : "Show More on LinkedIn"}</span>
              <LinkedinIcon className="size-3.5 fill-[#0077b5] text-[#0077b5]" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
