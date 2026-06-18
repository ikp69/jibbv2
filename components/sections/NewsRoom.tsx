"use client";

import React, { useRef, useState } from "react";
import { Link } from "@/src/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  User, 
  FileText, 
  BookOpen, 
  Share2, 
  ThumbsUp, 
  MessageSquare 
} from "lucide-react";
import { MarkdownPost } from "@/lib/markdown";

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
}

type TabId = "media" | "cases" | "thought" | "social";

const LINKEDIN_POSTS = [
  {
    id: "l1",
    authorName: "Japan India Business Bureau (JIBB)",
    authorHandle: "@npo-jibb",
    timeAgo: "14 hours ago",
    text: "📢 Registration is now open for the India-Japan Semiconductor & Cleanroom Tech Alliance 2026! Join us in Noida as we bring together 30+ Japanese equipment manufacturers and Indian tech partners. Build the next corridor of supply chain resilience.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    likes: 142,
    comments: 28,
  },
  {
    id: "l2",
    authorName: "Japan India Business Bureau (JIBB)",
    authorHandle: "@npo-jibb",
    timeAgo: "2 days ago",
    text: "🤝 Bilateral partnership in action! We are proud to have facilitated the Joint Venture agreement between a leading precision component manufacturer from Kyoto and an industrial assembler based in Noida. This JV marks a milestone in the Make in India initiative.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    likes: 312,
    comments: 45,
  },
  {
    id: "l3",
    authorName: "Japan India Business Bureau (JIBB)",
    authorHandle: "@npo-jibb",
    timeAgo: "7 days ago",
    text: "💡 How is the China+1 strategy shaping electronic manufacturing services in the Gujarat corridor? Read our latest advisory brief on NIIF-JBIC co-investment schemes for green technology startups. Download full report on our Portal.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    likes: 98,
    comments: 12,
  }
];

export function NewsRoom({ mediaPosts, caseStudies, thoughtLeadership }: NewsRoomProps) {
  const [activeTab, setActiveTab] = useState<TabId>("media");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: "media", label: "Media & Insights", count: mediaPosts.length },
    { id: "cases", label: "Case Studies", count: caseStudies.length },
    { id: "thought", label: "Thought Leadership", count: thoughtLeadership.length },
    { id: "social", label: "Social Feed (LinkedIn)", count: LINKEDIN_POSTS.length },
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
      case "media":
        return {
          title: "Media & Insights",
          viewAllLink: "/insights",
          viewAllText: "View All",
          items: mediaPosts.map(post => ({
            id: post.slug,
            title: post.title,
            desc: post.description,
            date: post.date,
            author: post.author,
            image: post.image,
            link: `/insights/${post.slug}`,
            badge: "Insight"
          }))
        };
      case "cases":
        return {
          title: "Blog",
          viewAllLink: "/resources/blog",
          viewAllText: "View All",
          items: caseStudies.map(post => ({
            id: post.slug,
            title: post.title,
            desc: post.description,
            date: post.date,
            author: post.author,
            image: post.image,
            link: `/resources/blog/${post.slug}`,
            badge: "Blog"
          }))
        };
      case "thought":
        return {
          title: "Thought Leadership",
          viewAllLink: "/thought-leadership",
          viewAllText: "View All",
          items: thoughtLeadership.map(post => ({
            id: post.slug,
            title: post.title,
            desc: post.description,
            date: post.date,
            author: post.author,
            image: post.image,
            link: `/thought-leadership/${post.slug}`,
            badge: "Thought Leadership"
          }))
        };
      case "social":
        return {
          title: "Social Feed",
          viewAllLink: "https://www.linkedin.com/company/japan-india-business-bureau",
          viewAllText: "View All",
          isExternal: true,
          items: LINKEDIN_POSTS.map(post => ({
            id: post.id,
            title: post.text,
            desc: post.text,
            date: post.timeAgo,
            author: post.authorName,
            image: post.image,
            link: "https://www.linkedin.com/company/japan-india-business-bureau",
            badge: "LinkedIn",
            isSocial: true,
            authorHandle: post.authorHandle,
            likes: post.likes,
            comments: post.comments
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
              Newsroom
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Discover what's going on at JIBB and across the bilateral microelectronics, advanced manufacturing, and deep-tech corridor.
            </p>
          </div>
          <div className="shrink-0">
            <Link 
              href="/insights" 
              className="inline-flex items-center gap-2 text-jibb-indigo dark:text-jibb-indigo-light font-bold hover:underline group"
            >
              <span>VISIT NEWSROOM</span>
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
                  className={`relative py-4 px-1 text-sm md:text-base font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${
                    isActive 
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
                <span>VIEW ALL POSTS</span>
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
              {content.items.map((item: any, idx: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="flex-shrink-0 w-[290px] sm:w-[340px] md:w-[380px] snap-start"
                >
                  {item.isSocial ? (
                    // LinkedIn Style Card
                    <div className="bg-card dark:bg-[#161f38]/45 border border-border/50 hover:border-primary/30 rounded-2xl p-5 hover:shadow-jibb-md transition-all duration-300 flex flex-col h-[400px] justify-between">
                      <div>
                        {/* LinkedIn Post Header */}
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-2.5">
                            <div className="size-9 rounded-full bg-jibb-indigo flex items-center justify-center text-white text-xs font-black shrink-0">
                              JIBB
                            </div>
                            <div>
                              <h4 className="text-xs font-extrabold text-foreground leading-tight">
                                {item.author}
                              </h4>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {item.authorHandle} • {item.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-[#0077b5] shrink-0">
                            <LinkedinIcon className="size-4 fill-current" />
                          </div>
                        </div>

                        {/* Text content */}
                        <p className="text-xs text-foreground/90 leading-relaxed line-clamp-4 mb-4 whitespace-pre-line">
                          {item.desc}
                        </p>
                      </div>

                      {/* Image Banner */}
                      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-4 border border-border/30 bg-muted shrink-0">
                        <img 
                          src={item.image} 
                          alt="LinkedIn post visual"
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* LinkedIn Likes/Comments */}
                      <div className="flex items-center justify-between border-t border-border/30 pt-3 text-[11px] text-muted-foreground shrink-0 font-medium">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="size-3 text-jibb-orange" />
                          <span>{item.likes} Likes</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span>{item.comments} Comments</span>
                          <Share2 className="size-3 hover:text-foreground cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Standard Newsroom Card
                    <div className="bg-card dark:bg-[#161f38]/45 border border-border/50 hover:border-primary/30 rounded-2xl overflow-hidden hover:shadow-jibb-md transition-all duration-300 flex flex-col h-[400px] justify-between group">
                      {/* Image at Top */}
                      <div className="relative aspect-[16/10] w-full bg-muted overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-background/90 dark:bg-black/80 backdrop-blur-sm border border-border/40 text-[9px] font-bold uppercase tracking-wider text-primary dark:text-[#7b9fe0]">
                          {item.badge}
                        </div>
                      </div>

                      {/* Info & Content */}
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div className="space-y-2.5">
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
                          <h4 className="text-sm md:text-base font-extrabold text-foreground tracking-tight leading-snug line-clamp-2 group-hover:text-jibb-indigo dark:group-hover:text-jibb-indigo-light transition-colors">
                            {item.title}
                          </h4>

                          {/* Description */}
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {item.desc}
                          </p>
                        </div>

                        {/* Learn More link */}
                        <div className="pt-4 border-t border-border/30">
                          <Link 
                            href={item.link}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-[#7b9fe0] hover:underline"
                          >
                            <span>LEARN MORE</span>
                            <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Show More Social Button if we are on Social Feed tab */}
        {activeTab === "social" && (
          <div className="text-center mt-8">
            <a
              href="https://www.linkedin.com/company/npo-jibb"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-background border border-border/60 hover:border-primary/50 text-foreground text-xs font-bold rounded-lg transition-all active:scale-[0.98] inline-flex items-center gap-2 hover:shadow-sm"
            >
              <span>Show More on LinkedIn</span>
              <LinkedinIcon className="size-3.5 fill-[#0077b5] text-[#0077b5]" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
