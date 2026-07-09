"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Megaphone, 
  FileText, 
  Briefcase, 
  Calendar, 
  Building, 
  User, 
  ArrowRight, 
  Clock, 
  Award, 
  Eye, 
  Download, 
  Sparkles, 
  ChevronRight, 
  ExternalLink,
  BookOpen,
  ArrowUpRight
} from "lucide-react";
import { recordViewedResource } from "@/lib/utils";
import { incrementDownloadCount } from "@/features/cms/content/actions/reports";

type DashboardUser = {
  email: string;
  companyName: string | null;
  designation: string | null;
  membershipTier: string;
  role: string;
};

type DashboardStats = {
  matchings: number;
  events: number;
  resources: number;
  announcements: number;
};

type PortalDashboardClientProps = {
  user: DashboardUser;
  stats: DashboardStats;
  announcements: any[];
  upcomingEvents: any[];
};

export default function PortalDashboardClient({
  user,
  stats,
  announcements,
  upcomingEvents,
}: PortalDashboardClientProps) {
  const [recentFiles, setRecentFiles] = useState<any[]>([]);

  // Load recently viewed resources from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("jibb_recently_viewed_resources");
      if (raw) {
        setRecentFiles(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Failed to load recently viewed files from localStorage:", e);
    }
  }, []);

  const getTierColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "platinum":
        return "bg-gradient-to-r from-slate-100 to-slate-300 text-slate-800 border-slate-300 shadow-sm";
      case "gold":
        return "bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-amber-700/10 text-amber-700 border-amber-500/20 shadow-sm";
      case "silver":
        return "bg-gradient-to-r from-slate-200 to-slate-400 text-slate-700 border-slate-350 shadow-sm";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const getFileIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "pdf":
        return <FileText className="w-5 h-5 text-rose-500 shrink-0" />;
      case "spreadsheet":
      case "excel":
        return <FileText className="w-5 h-5 text-emerald-500 shrink-0" />;
      case "image":
        return <FileText className="w-5 h-5 text-blue-500 shrink-0" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500 shrink-0" />;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diff = new Date().getTime() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "Just now";
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Welcoming Banner with Glassmorphism / Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 p-6 md:p-8 text-white shadow-lg border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl -ml-20 -mb-20"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getTierColor(user.membershipTier)}`}>
                {user.membershipTier} Member
              </span>
              {user.membershipTier === "gold" || user.membershipTier === "platinum" ? (
                <span className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5" /> Premium Access Active
                </span>
              ) : null}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Konnichiwa / Namaste, {user.companyName || "Member"}!
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Welcome to the NPO Japan India Business Bureau Portal. Find matching partners, browse strategic trade reports, and sign up for bilateral exchange delegations.
            </p>
          </div>

          <div className="shrink-0 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Award className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Representative</p>
              <p className="text-sm font-semibold text-white">{user.designation || "Representative"}</p>
              <p className="text-xs text-slate-300">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Action Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Matchings", value: stats.matchings, href: "/portal/business-matching", icon: Briefcase, color: "text-blue-600 bg-blue-50 border-blue-100" },
          { label: "Bilateral Events", value: stats.events, href: "/portal/events", icon: Calendar, color: "text-rose-600 bg-rose-50 border-rose-100" },
          { label: "Circulars & Notices", value: stats.announcements, href: "/portal/announcements", icon: Megaphone, color: "text-amber-600 bg-amber-50 border-amber-100" },
          { label: "Training Modules", value: stats.resources, href: "/portal/training", icon: BookOpen, color: "text-emerald-600 bg-emerald-50 border-emerald-100" }
        ].map((card, idx) => (
          <Link 
            key={idx} 
            href={card.href} 
            className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-350 hover:shadow-md transition-all duration-200"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-550 group-hover:text-slate-700 transition-colors">{card.label}</span>
              <p className="text-2xl font-extrabold text-slate-900">{card.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border mt-2 md:mt-0 group-hover:scale-105 transition-transform ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </Link>
        ))}
      </div>

      {/* 3. Columns Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2/3 Area */}
        <div className="xl:col-span-2 space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-150">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-500" />
                <span>Upcoming Exchange & Seminars</span>
              </h2>
              <Link href="/portal/events" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <span>All Events</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <div className="divide-y divide-slate-100">
              {upcomingEvents.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">No upcoming events listed at the moment.</div>
              ) : (
                upcomingEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100">
                          {event.en.format}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {event.en.date}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                        {event.en.title} {event.en.titleHighlight} {event.en.titleEnd}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{event.en.venue}</p>
                    </div>
                    <Link 
                      href={`/portal/events`}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      <span>Register</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Announcements & Trade Circulars */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-150">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-500" />
                <span>Trade Circulars & Announcements</span>
              </h2>
              <Link href="/portal/announcements" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <div className="divide-y divide-slate-100">
              {announcements.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">No active trade notices/circulars.</div>
              ) : (
                announcements.slice(0, 3).map((item) => (
                  <Link 
                    key={item.id} 
                    href="/portal/announcements" 
                    className="block p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {item.is_pinned && (
                          <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 bg-amber-500 text-white rounded">
                            PINNED
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono font-medium" suppressHydrationWarning>
                          {new Date(item.publish_date || item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.summary || item.content_en || "No details provided."}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1/3 Area */}
        <div className="space-y-6">
          {/* Recently Viewed Files */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-150">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Recently Opened Files</span>
              </h2>
            </div>
            
            <div className="p-3 space-y-2 flex-1">
              {recentFiles.length === 0 ? (
                <div className="p-6 text-center text-slate-450 text-xs space-y-3">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>You haven't opened any library files yet.</p>
                  <Link 
                    href="/portal/reports" 
                    className="inline-block px-3 py-1.5 bg-blue-50 text-blue-600 font-bold text-xs rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    Browse Reports
                  </Link>
                </div>
              ) : (
                recentFiles.slice(0, 7).map((file) => (
                  <div 
                    key={file.id} 
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all duration-150"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 bg-white border border-slate-150 rounded shadow-sm">
                        {getFileIcon(file.resource_type)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate leading-snug" title={file.title}>
                          {file.title}
                        </p>
                        <span className="text-[9px] text-slate-450 font-mono flex items-center gap-1">
                          {file.category} &bull; {formatTimeAgo(file.viewedAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <a 
                        href={file.file_url} 
                        download 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => {
                          recordViewedResource(file);
                          incrementDownloadCount(file.id);
                        }}
                        className="p-1.5 text-slate-550 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 rounded transition-colors"
                        title="Download File"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-150">
              <h2 className="text-base font-bold text-slate-800">Quick Portal Actions</h2>
            </div>
            
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { label: "Directory", path: "/portal/member-directory", icon: Building, color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-100" },
                { label: "Profile", path: "/portal/profile", icon: User, color: "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-100" },
                { label: "Matching", path: "/portal/business-matching", icon: Briefcase, color: "bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-100" },
                { label: "Programs", path: "/portal/training", icon: BookOpen, color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100" }
              ].map((act, i) => (
                <Link 
                  key={i} 
                  href={act.path} 
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center font-semibold transition-all duration-150 ${act.color}`}
                >
                  <act.icon className="w-5 h-5 mb-1.5" />
                  <span className="text-[11px] font-bold">{act.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
