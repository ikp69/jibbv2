"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Calendar, Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PressRelease {
  id: string;
  title: {
    en: string;
    ja: string;
  };
  publisher: string;
  logoColor: string; // Tailwind color class for badge representation
  date: string;
  category: {
    en: string;
    ja: string;
  };
  url: string;
  snippet: {
    en: string;
    ja: string;
  };
  language: "en" | "ja" | "both";
}

const PRESS_RELEASES_DATA: PressRelease[] = [
  {
    id: "pr-1",
    title: {
      en: "Unlocking India's Manufacturing Growth Story",
      ja: "インドの製造業成長ストーリーを紐解く"
    },
    publisher: "IssueWire",
    logoColor: "bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-600/20",
    date: "2026-06-15",
    category: {
      en: "Manufacturing",
      ja: "製造業"
    },
    url: "https://www.issuewire.com/unlocking-indias-manufacturing-growth-story-1868412827331788",
    snippet: {
      en: "An in-depth exploration of India's rapid rise as a global manufacturing hub, highlighting crucial bilateral initiatives, infrastructure expansion, and FDI opportunities.",
      ja: "グローバルな製造ハブとしてのインドの急速な台頭、重要な二国間イニシアチブ、インフラの拡大、および対内直接投資（FDI）の機会を浮き彫りにする詳細な調査。"
    },
    language: "en"
  },
  {
    id: "pr-2",
    title: {
      en: "Unlocking India's Manufacturing Growth Story",
      ja: "インドの製造業成長ストーリーを紐解く"
    },
    publisher: "PRLog",
    logoColor: "bg-orange-600/10 text-orange-600 dark:text-orange-400 border-orange-600/20",
    date: "2026-06-14",
    category: {
      en: "Manufacturing",
      ja: "製造業"
    },
    url: "https://www.prlog.org/13152465-unlocking-indias-manufacturing-growth-story.html",
    snippet: {
      en: "Highlighting how JIBB and partner institutions are building bridges to support Japanese investments in India's key industrial zones.",
      ja: "JIBBとパートナー機関がどのように橋渡しを行い、インドの主要工業地帯における日本企業の投資を支援しているかを強調します。"
    },
    language: "en"
  },
  {
    id: "pr-3",
    title: {
      en: "Japan India Business Bureau Steps Up Cross-Border Push at Electronica India 2026",
      ja: "日印ビジネスビューロー、エレクトロニカ・インディア2026にて二国間連携を強化"
    },
    publisher: "IssueWire",
    logoColor: "bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-600/20",
    date: "2026-05-10",
    category: {
      en: "Technology",
      ja: "テクノロジー"
    },
    url: "https://www.issuewire.com/japan-india-business-bureau-steps-up-cross-border-push-at-electronica-india-2026-1862343474842925",
    snippet: {
      en: "JIBB announces strategic coordination at Electronica India 2026 to foster semiconductor, components, and electronics system design manufacturing between Japanese and Indian firms.",
      ja: "JIBBは、エレクトロニカ・インディア2026において、日本とインドの企業間における半導体、電子部品、および電子機器システム設計製造（ESDM）を促進するための戦略的協調を発表しました。"
    },
    language: "en"
  },
  {
    id: "pr-4",
    title: {
      en: "Japan India Business Bureau Steps Up Cross-Border Push at Electronica India 2026",
      ja: "日印ビジネスビューロー、エレクトロニカ・インディア2026にて二国間連携を強化"
    },
    publisher: "Express Press Release",
    logoColor: "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border-indigo-600/20",
    date: "2026-04-13",
    category: {
      en: "Technology",
      ja: "テクノロジー"
    },
    url: "https://express-press-release.net/news/2026/04/13/1746767",
    snippet: {
      en: "A detailed release covering JIBB's participation at Electronica India, showcasing technological collaboration corridors and investment frameworks.",
      ja: "エレクトロニカ・インディアへのJIBBの参加、技術的なコラボレーション・コリドー、および投資の枠組みを紹介する詳細なリリース。"
    },
    language: "en"
  },
  {
    id: "pr-5",
    title: {
      en: "Electronica and Productronica India Uncovered: Japan-India Collaborations",
      ja: "エレクトロニカおよびプロダクトロニカ・インディアの全貌：日印コラボレーション"
    },
    publisher: "OpenPR",
    logoColor: "bg-purple-600/10 text-purple-600 dark:text-purple-400 border-purple-600/20",
    date: "2026-04-12",
    category: {
      en: "Innovation",
      ja: "イノベーション"
    },
    url: "https://www.openpr.com/news/4467535/electronica-and-productronica-india-uncovered-japan-india",
    snippet: {
      en: "Comprehensive press coverage of the bilateral showcases, featuring key highlights from the joint pavilions and tech corridors sponsored by industrial associations.",
      ja: "二国間のショーケースに関する包括的なプレス報道。業界団体が協賛する共同パビリオンおよび技術コリドーからの主要なハイライトを特集します。"
    },
    language: "en"
  }
];

// Memoize publishers array to prevent recalculation
const PUBLISHERS = ["All", ...Array.from(new Set(PRESS_RELEASES_DATA.map(pr => pr.publisher)))];

interface PressReleasesSectionProps {
  locale: string;
}

export function PressReleasesSection({ locale }: PressReleasesSectionProps) {
  const [isJa, setIsJa] = useState(false);
  const [mounted, setMounted] = useState(false);

  // States for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState("All");
  const [showAll, setShowAll] = useState(false);

  // Hydration fix: only set state after mount on client
  useEffect(() => {
    setIsJa(locale === "ja");
    setMounted(true);
  }, [locale]);

  // Filter press releases
  const filteredPRs = PRESS_RELEASES_DATA.filter(pr => {
    const matchesSearch =
      pr.title[isJa ? "ja" : "en"].toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.snippet[isJa ? "ja" : "en"].toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.publisher.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPublisher = selectedPublisher === "All" || pr.publisher === selectedPublisher;

    return matchesSearch && matchesPublisher;
  });

  const visiblePRs = showAll ? filteredPRs : filteredPRs.slice(0, 4);

  // Prevent rendering of interactive elements before hydration
  if (!mounted) {
    return (
      <section id="press-releases" className="py-20 bg-background relative overflow-hidden border-t border-border/40 scroll-mt-20">
        <div aria-hidden="true" className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-jibb-indigo/5 dark:bg-[#7b9fe0]/3 rounded-full blur-[100px] pointer-events-none animate-pulse duration-5000" />
        <div className="section-container relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-left w-full mb-10 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-primary/80 dark:text-primary-foreground/80">
              Media Relations & Press
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              External Press Releases
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Official announcements and bilateral milestone updates published across global wire services and premium journals.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="press-releases" className="py-20 bg-background relative overflow-hidden border-t border-border/40 scroll-mt-20">
      {/* Background radial soft lights */}
      <div aria-hidden="true" className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-jibb-indigo/5 dark:bg-[#7b9fe0]/3 rounded-full blur-[100px] pointer-events-none animate-pulse duration-5000" />

      <div className="section-container relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-left w-full mb-10 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-primary/80 dark:text-primary-foreground/80">
            {isJa ? "メディア報道 & プレス" : "Media Relations & Press"}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            {isJa ? "外部プレスリリース" : "External Press Releases"}
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {isJa
              ? "大手グローバル・地方メディア配信サービスにおけるJIBB의公式発表と最新の報道情報。"
              : "Official announcements and bilateral milestone updates published across global wire services and premium journals."}
          </p>
        </div>

        {/* Filter controls */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-3xl p-6 mb-10 shadow-jibb-sm space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={isJa ? "リリースを検索..." : "Search releases..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-jibb-orange/30 focus:border-jibb-orange transition-all"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
              <div className="flex items-center gap-2 bg-background border border-border/60 rounded-2xl p-1 shrink-0">
                <span className="text-xs font-semibold px-2 text-muted-foreground flex items-center gap-1.5">
                  <SlidersHorizontal className="size-3" /> {isJa ? "配信元:" : "Wire:"}
                </span>
                <select
                  value={selectedPublisher}
                  onChange={(e) => setSelectedPublisher(e.target.value)}
                  className="text-xs font-medium bg-transparent outline-none border-none py-1.5 px-3 pr-8 rounded-xl cursor-pointer text-foreground focus:ring-0"
                >
                  {PUBLISHERS.map(pub => (
                    <option key={pub} value={pub}>
                      {pub === "All" ? (isJa ? "すべて" : "All Wires") : pub}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Press Releases Grid */}
        {filteredPRs.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border/60 rounded-3xl bg-card/10">
            <p className="text-muted-foreground text-sm font-medium">
              {isJa ? "条件に合うプレスリリースが見つかりませんでした。" : "No press releases matching your filters were found."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {visiblePRs.map((pr) => (
                <div
                  key={pr.id}
                  className="group relative bg-card border border-border/60 hover:border-jibb-orange/30 rounded-3xl p-6 hover:shadow-jibb-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top Bar (Publisher + Date) */}
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-wide uppercase ${pr.logoColor}`}>
                        {pr.publisher}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="size-3" />
                        {pr.date}
                      </span>
                    </div>

                    {/* Title & Tag */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[9px] py-0 px-2 font-semibold">
                          {pr.category[isJa ? "ja" : "en"]}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                          EN
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground tracking-tight leading-snug group-hover:text-jibb-orange transition-colors">
                        {pr.title[isJa ? "ja" : "en"]}
                      </h3>
                    </div>

                    {/* Snippet */}
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {pr.snippet[isJa ? "ja" : "en"]}
                    </p>
                  </div>

                  {/* Bottom link CTA */}
                  <div className="border-t border-border/40 mt-6 pt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground/75 font-medium">
                      {isJa ? "外部配信サイトへ移動します" : "Redirects to external news wire"}
                    </span>
                    <a
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-jibb-orange hover:text-jibb-orange-dark transition-colors"
                    >
                      <span>{isJa ? "リリース全文を読む" : "Read Full Release"}</span>
                      <ExternalLink className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {filteredPRs.length > 4 && (
              <div className="text-center mt-10">
                <Button
                  onClick={() => setShowAll(!showAll)}
                  variant="outline"
                  className="px-6 py-2.5 bg-background border border-border/60 hover:border-primary/50 text-foreground text-xs font-bold rounded-lg transition-all active:scale-[0.98]"
                >
                  {showAll
                    ? (isJa ? "閉じる" : "Show Less")
                    : (isJa ? "もっと見る" : "More Releases")}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
