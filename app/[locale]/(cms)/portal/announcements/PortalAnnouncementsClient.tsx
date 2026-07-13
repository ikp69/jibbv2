"use client";

import React, { useState } from "react";
import { Search, Megaphone, Calendar, Pin, Download, ExternalLink, ChevronRight, Bell, X } from "lucide-react";
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
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

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
                onClick={() => setSelectedAnnouncement(item)}
                className={`border bg-white rounded-xl shadow-sm hover:shadow-md hover:border-slate-350 active:scale-[0.99] transition-all duration-200 cursor-pointer overflow-hidden p-5 flex items-start gap-4 justify-between ${
                  item.is_pinned
                    ? "border-blue-200 ring-1 ring-blue-50/50 bg-gradient-to-r from-white to-blue-50/10"
                    : "border-slate-200"
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedAnnouncement(item);
                  }
                }}
              >
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
                  
                  <p className="text-slate-500 text-sm line-clamp-2 font-normal leading-relaxed">
                    {item.content}
                  </p>
                </div>

                <div
                  className="p-1 text-slate-400 group-hover:text-slate-700 rounded-lg self-center shrink-0"
                >
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-200 animate-in fade-in">
          <div 
            className="absolute inset-0" 
            onClick={() => setSelectedAnnouncement(null)} 
          />
          
          <div 
            className={`bg-white rounded-2xl shadow-2xl w-full flex flex-col md:flex-row relative z-10 overflow-hidden border border-slate-100 transition-all duration-200 animate-in zoom-in-95 ${
              selectedAnnouncement.banner_image ? "max-w-6xl" : "max-w-2xl"
            }`}
            style={{ height: "85vh", maxHeight: "90vh" }}
          >
            {/* Left side: Banner Image */}
            {selectedAnnouncement.banner_image && (
              <div className="w-full md:w-auto md:flex-shrink-0 h-auto md:h-full relative bg-slate-50 shrink-0 border-b md:border-b-0 md:border-r border-slate-150 flex items-center justify-center overflow-hidden" style={{ minHeight: "16rem", maxWidth: "100%", aspectRatio: "auto" }}>
                <img
                  src={selectedAnnouncement.banner_image}
                  alt={selectedAnnouncement.title}
                  className="w-full h-full object-contain md:object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Right side: Announcement Details */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header */}
              <div className="p-6 border-b border-slate-150 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedAnnouncement.is_pinned && (
                      <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Pin className="w-3 h-3 shrink-0" />
                        <span>Pinned Circular</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span suppressHydrationWarning>
                        {selectedAnnouncement.publish_date
                          ? new Date(selectedAnnouncement.publish_date).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Recent"}
                      </span>
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 leading-snug">
                    {selectedAnnouncement.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shrink-0 animate-in fade-in"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-normal">
                {selectedAnnouncement.content}
              </div>

              {/* Footer / Resource links */}
              {(selectedAnnouncement.attachment || selectedAnnouncement.external_link) && (
                <div className="p-6 border-t border-slate-150 bg-slate-50/50 flex flex-wrap items-center gap-3">
                  {selectedAnnouncement.attachment && (
                    <a
                      href={selectedAnnouncement.attachment}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-slate-505" />
                      <span>Download PDF circular</span>
                    </a>
                  )}

                  {selectedAnnouncement.external_link && (
                    <a
                      href={selectedAnnouncement.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
                    >
                      <span>Read full brief</span>
                      <ExternalLink className="w-4 h-4 shrink-0" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
