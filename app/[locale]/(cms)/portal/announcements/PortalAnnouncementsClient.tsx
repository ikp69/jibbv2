"use client";

import React, { useState } from "react";
import { Search, Megaphone, Calendar, Pin, Download, ExternalLink, ChevronDown, ChevronUp, Bell } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

type Announcement = {
  id: string;
  title: string;
  content: string;
  banner_image: string | null;
  attachment: string | null;
  external_link: string | null;
  visible_tiers: string[];
  is_pinned: boolean;
  status: string;
  publish_date: string | null;
  created_at: string;
};

type PortalAnnouncementsClientProps = {
  announcements: Announcement[];
};

export default function PortalAnnouncementsClient({ announcements }: PortalAnnouncementsClientProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"newest" | "oldest" | "pinned">("newest");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Toggle detail expansion
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Search filter
  const searched = announcements.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(term) ||
      item.content.toLowerCase().includes(term)
    );
  });

  // Sorting
  const sorted = [...searched].sort((a, b) => {
    // Pinned announcements always rank first
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;

    const dateA = new Date(a.publish_date || a.created_at).getTime();
    const dateB = new Date(b.publish_date || b.created_at).getTime();

    if (filterType === "oldest") {
      return dateA - dateB;
    }
    // Default or "newest" sorting
    return dateB - dateA;
  });

  // Filter specifically for pinned
  const finalAnnouncements = filterType === "pinned"
    ? sorted.filter((item) => item.is_pinned)
    : sorted;

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Megaphone className="w-8 h-8 text-blue-600 shrink-0" />
          <span>Announcements & Communications</span>
        </h1>
        <p className="text-slate-600 mt-1">Official circulars, advisory notifications, and strategic updates from the JIBB executive committee.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search circulars, directives, and notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="pinned">Filter: Pinned Only</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      {finalAnnouncements.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Announcements Found"
          description="There are no active advisory circulars matching your search query or membership tier."
        />
      ) : (
        <div className="space-y-4">
          {finalAnnouncements.map((item) => {
            const isExpanded = expandedId === item.id;
            const publishDateString = item.publish_date
              ? new Date(item.publish_date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Recent";

            return (
              <div
                key={item.id}
                className={`border bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${
                  item.is_pinned
                    ? "border-blue-200 ring-1 ring-blue-50/50"
                    : "border-slate-200"
                }`}
              >
                {/* Announcement Card Header Header */}
                <div className="p-5 flex items-start gap-4 justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.is_pinned && (
                        <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Pin className="w-3 h-3 shrink-0" />
                          <span>Pinned Circular</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span suppressHydrationWarning>{publishDateString}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors self-start shrink-0"
                    title={isExpanded ? "Collapse Content" : "Expand Content"}
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Expanded Content Block */}
                <div
                  className={`px-5 pb-5 border-t border-slate-100 bg-slate-50/50 transition-all ${
                    isExpanded ? "block" : "hidden"
                  }`}
                >
                  <div className="pt-4 space-y-4">
                    {item.banner_image && (
                      <img
                        src={item.banner_image}
                        alt={item.title}
                        className="w-full max-h-64 object-cover rounded-lg border border-slate-200"
                      />
                    )}

                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-normal">
                      {item.content}
                    </div>

                    {/* Resources & Links Panel */}
                    {(item.attachment || item.external_link) && (
                      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200/50">
                        {item.attachment && (
                          <a
                            href={item.attachment}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-505" />
                            <span>Download PDF circular</span>
                          </a>
                        )}

                        {item.external_link && (
                          <a
                            href={item.external_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
                          >
                            <span>Read full brief</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
