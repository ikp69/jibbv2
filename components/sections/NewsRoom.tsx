"use client";

import React, { useRef, useState, useEffect } from "react";
import { Link, useRouter } from "@/src/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { PRESS_RELEASES_DATA } from "./PressReleasesSection";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  User,
  Globe,
  Trash2,
  RefreshCw
} from "lucide-react";
import { MarkdownPost } from "@/lib/markdown";
import { deleteLinkedInPost } from "@/app/actions/linkedin";

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

interface NewsRoomProps {
  mediaPosts: MarkdownPost[];
  caseStudies: MarkdownPost[];
  thoughtLeadership: MarkdownPost[];
  linkedinPosts?: { id: string; shareUrn: string }[];
}

type TabId = "media" | "thought" | "social";

export function NewsRoom({ mediaPosts, caseStudies, thoughtLeadership, linkedinPosts }: NewsRoomProps) {
  const t = useTranslations("newsroom");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<TabId>("social");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeLinkedInPosts = linkedinPosts || [];
  const [adminPasscode, setAdminPasscode] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

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

  const handleDeleteSocialPost = async (id: string) => {
    if (!adminPasscode) return;
    if (!confirm("Are you sure you want to delete this LinkedIn post from the home feed?")) {
      return;
    }
    setIsDeleting(id);
    try {
      const result = await deleteLinkedInPost(id, adminPasscode);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to delete post.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the post.");
    } finally {
      setIsDeleting(null);
    }
  };

  const tabs = [
    { id: "social", label: t("tabs.social") || "Social Feed (LinkedIn)", count: activeLinkedInPosts.length },
    { id: "thought", label: t("tabs.thought") || "Thought Leadership", count: thoughtLeadership.length },
    { id: "media", label: t("tabs.media") || "Media & Insights", count: mediaPosts.length },
  ] as const;

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getActiveContent = () => {
    switch (activeTab) {
      case "social":
        return {
          title: t("tabs.social") || "Social Feed",
          viewAllLink: "https://linkedin.com/company/japan-india-business-bureau",
          viewAllText: t("viewAll") || "View All",
          isExternal: true,
          items: activeLinkedInPosts.map(post => ({
            id: post.id,
            shareUrn: post.shareUrn,
            isSocial: true,
          }))
        };
      case "thought":
        return {
          title: t("tabs.thought") || "Thought Leadership",
          viewAllLink: "/resources/thought-leadership",
          viewAllText: t("viewAll") || "View All",
          items: thoughtLeadership.map(post => ({
            id: post.slug,
            title: post.title,
            desc: post.description,
            date: post.date,
            author: post.author,
            image: post.image,
            link: `/resources/thought-leadership/${post.slug}`,
            badge: "Thought Leadership"
          }))
        };
      case "media":
        return {
          title: t("tabs.media") || "Media & Insights",
          viewAllLink: "/resources/insights",
          viewAllText: t("viewAll") || "View All",
          items: PRESS_RELEASES_DATA.map(pr => ({
            id: pr.id,
            title: locale === "ja" ? pr.title.ja : pr.title.en,
            desc: locale === "ja" ? pr.snippet.ja : pr.snippet.en,
            date: pr.date,
            author: pr.publisher,
            link: pr.url,
            badge: "Press Release"
          }))
        };
    }
  };

  const content = getActiveContent() as any;

  return (
    <section className="py-24 bg-jibb-cream/20 dark:bg-[#0b0f19] border-t border-border/30 relative overflow-hidden">
      {/* Decorative patterns */}
      <div aria-hidden="true" className="absolute top-0 right-0 w-96 h-96 bg-jibb-indigo/5 dark:bg-[#7b9fe0]/5 rounded-full blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 w-96 h-96 bg-jibb-orange/5 dark:bg-[#f0a455]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10 max-w-7xl mx-auto px-4">

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight uppercase">
              {t("title")}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/resources/insights"
              className="inline-flex items-center gap-2 text-jibb-indigo dark:text-jibb-indigo-light font-bold hover:underline group"
            >
              <span>{t("visitNewsroom")}</span>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Tab Headers */}
        <div className="border-b border-border/40 mb-12">
          <div className="flex overflow-x-auto no-scrollbar gap-2 sm:gap-6 md:gap-8 pb-px">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-4 px-1 text-sm md:text-base font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${isActive
                    ? "text-primary dark:text-[#7b9fe0]"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="newsroomActiveLine"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-jibb-orange dark:bg-jibb-orange-light rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Panel Header controls */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <h3 className="text-lg md:text-xl font-extrabold text-foreground uppercase tracking-wider">
            {content.title}
          </h3>

          <div className="flex items-center gap-3">
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
            {content.isExternal ? (
              <a
                href={content.viewAllLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-jibb-indigo dark:bg-[#7b9fe0] text-white dark:text-[#0f1629] font-bold text-xs rounded-xl hover:bg-jibb-indigo-light dark:hover:bg-[#9ab5e8] active:scale-[0.98] transition-all shadow-md inline-flex items-center gap-1.5"
              >
                <span>{t("viewAllPosts")}</span>
                <ArrowRight className="size-3" />
              </a>
            ) : (
              <Link
                href={content.viewAllLink}
                className="px-4 py-2 bg-jibb-indigo dark:bg-[#7b9fe0] text-white dark:text-[#0f1629] font-bold text-xs rounded-xl hover:bg-jibb-indigo-light dark:hover:bg-[#9ab5e8] active:scale-[0.98] transition-all shadow-md inline-flex items-center gap-1.5"
              >
                <span>{content.viewAllText.toUpperCase()}</span>
                <ArrowRight className="size-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Carousel Grid View */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x snap-mandatory"
          >
            <AnimatePresence mode="popLayout">
              {content.items.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground w-full flex flex-col items-center justify-center border border-dashed border-border/40 rounded-3xl bg-card/20 backdrop-blur-sm animate-in fade-in duration-300">
                  <Globe className="size-10 opacity-30 mb-3 text-jibb-orange animate-soft-pulse" />
                  <p className="text-sm font-bold uppercase tracking-wider text-foreground">{t("noSocial")}</p>
                  <p className="text-xs opacity-75 mt-1">{t("syncAdmin")}</p>
                </div>
              ) : (
                content.items.map((item: any, idx: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex-shrink-0 w-[290px] sm:w-[340px] md:w-[380px] snap-start"
                  >
                  {item.isSocial ? (
                    // LinkedIn Embed Card
                    <div className="relative bg-card dark:bg-[#161f38]/45 border border-border/50 hover:border-primary/30 rounded-2xl p-1.5 hover:shadow-jibb-md transition-all duration-300 flex flex-col h-[480px] overflow-hidden">
                      {adminPasscode && (
                        <button
                          onClick={() => handleDeleteSocialPost(item.id)}
                          disabled={isDeleting === item.id}
                          className="absolute top-4 right-4 z-20 p-2 bg-red-500 hover:bg-red-600 disabled:bg-red-700 text-white rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center border border-white/10"
                          title="Delete LinkedIn Post"
                        >
                          {isDeleting === item.id ? (
                            <RefreshCw className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </button>
                      )}
                      <div className="w-full h-full overflow-y-auto overflow-x-hidden sleek-scrollbar pr-3">
                        <div className="w-[calc(100%+17px)] h-[670px]">
                          <iframe
                             src={`https://www.linkedin.com/embed/feed/update/${item.shareUrn}?collapsed=1`}
                            height="100%"
                            width="100%"
                            style={{ border: 'none', borderRadius: '12px' }}
                            allowFullScreen
                            title="LinkedIn post"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Standard Newsroom Card
                    <div className={`bg-card dark:bg-[#161f38]/45 border border-border/50 hover:border-primary/30 rounded-2xl overflow-hidden hover:shadow-jibb-md transition-all duration-300 flex flex-col justify-between group ${item.image ? "h-[400px]" : "h-[250px]"}`}>
                      {/* Image at Top */}
                      {item.image ? (
                        <div className="relative aspect-[17/8] w-full bg-[#0a0f1d] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-[1.02]"
                          />
                          <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-background/90 dark:bg-black/80 backdrop-blur-sm border border-border/40 text-[9px] font-bold uppercase tracking-wider text-primary dark:text-[#7b9fe0]">
                            {item.badge}
                          </div>
                        </div>
                      ) : null}

                      {/* Info & Content */}
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div className="space-y-2">
                          {!item.image && (
                            <span className="inline-block px-2 py-0.5 rounded-md bg-primary/5 dark:bg-[#161f38] border border-border/40 text-[9px] font-bold uppercase tracking-wider text-primary dark:text-[#7b9fe0]">
                              {item.badge}
                            </span>
                          )}

                          {/* Date and Author */}
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-semibold">
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3 text-jibb-orange/80" />
                              {item.date}
                            </span>
                            <span className="flex items-center gap-1 line-clamp-1">
                              <User className="size-3 text-jibb-orange/80" />
                              {item.author}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-sm font-extrabold text-foreground tracking-tight leading-snug line-clamp-2 group-hover:text-jibb-indigo dark:group-hover:text-jibb-indigo-light transition-colors">
                            {item.title}
                          </h4>

                          {/* Description */}
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {item.desc}
                          </p>
                        </div>

                        {/* Learn More link */}
                        <div className="pt-3 border-t border-border/30">
                          {item.link.startsWith("http") ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-[#7b9fe0] hover:underline"
                            >
                              <span>{t("learnMore")}</span>
                              <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </a>
                          ) : (
                            <Link
                              href={item.link}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-[#7b9fe0] hover:underline"
                            >
                              <span>{t("learnMore")}</span>
                              <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )))}
            </AnimatePresence>
          </div>
        </div>

        {/* Show More Social Button if we are on Social Feed tab */}
        {activeTab === "social" && (
          <div className="text-center mt-8">
            <a
              href="https://linkedin.com/company/japan-india-business-bureau"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-background border border-border/60 hover:border-primary/50 text-foreground text-xs font-bold rounded-lg transition-all active:scale-[0.98] inline-flex items-center gap-2 hover:shadow-sm"
            >
              <span>{t("showMoreLinkedIn")}</span>
              <LinkedinIcon className="size-3.5 fill-[#0077b5] text-[#0077b5]" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
