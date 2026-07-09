"use client";

import React, { useState, useMemo } from "react";
import { Search, Calendar, Eye, Download, X, Newspaper, ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

type Newsletter = {
  id: string;
  title: string;
  subject: string | null;
  content: string | null;
  file_url: string | null;
  visible_tiers: string[];
  status: string;
  publish_date: string;
  created_at: string;
};

type MemberNewslettersClientProps = {
  initialList: Newsletter[];
};

export default function MemberNewslettersClient({ initialList }: MemberNewslettersClientProps) {
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [activeNewsletter, setActiveNewsletter] = useState<Newsletter | null>(null);

  // Extract unique months for filtering
  const monthsOptions = useMemo(() => {
    const months = new Set<string>();
    initialList.forEach((item) => {
      if (item.publish_date) {
        const d = new Date(item.publish_date);
        const name = d.toLocaleString("default", { month: "long" }) + " " + d.getFullYear();
        months.add(name);
      }
    });
    return Array.from(months);
  }, [initialList]);

  // Search & Month Filter
  const filtered = useMemo(() => {
    return initialList.filter((item) => {
      const term = search.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(term) ||
        (item.subject || "").toLowerCase().includes(term) ||
        (item.content || "").toLowerCase().includes(term);

      let matchesMonth = true;
      if (selectedMonth !== "all" && item.publish_date) {
        const d = new Date(item.publish_date);
        const name = d.toLocaleString("default", { month: "long" }) + " " + d.getFullYear();
        matchesMonth = name === selectedMonth;
      }

      return matchesSearch && matchesMonth;
    });
  }, [initialList, search, selectedMonth]);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Newspaper className="w-8 h-8 text-blue-600 shrink-0" />
          <span>Bilateral Trade Newsletters</span>
        </h1>
        <p className="text-slate-600 mt-1">Read the latest monthly dispatches, industry briefings, and bilateral trade reports published by JIBB.</p>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search titles, subjects, content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Months</option>
            {monthsOptions.map((month, idx) => (
              <option key={idx} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Newsletters Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No Newsletters Available"
          description="There are no published newsletters matching your active filters or membership credentials."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-slate-350 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-450 font-mono flex items-center gap-1 font-semibold" suppressHydrationWarning>
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(item.publish_date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  {item.subject && (
                    <p className="text-xs font-semibold text-slate-600 line-clamp-1">{item.subject}</p>
                  )}
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed pt-1">
                    {item.content || "No text preview. Open PDF version to read."}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-150 flex items-center justify-between gap-4">
                <button
                  onClick={() => setActiveNewsletter(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Read Article</span>
                </button>

                {item.file_url && (
                  <a
                    href={item.file_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reading Modal Details */}
      {activeNewsletter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 overflow-y-auto font-sans">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8 text-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150 bg-slate-50">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-600" />
                <span className="text-[11px] font-mono text-slate-500 font-semibold" suppressHydrationWarning>
                  {new Date(activeNewsletter.publish_date).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => setActiveNewsletter(null)}
                className="text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900 leading-snug">{activeNewsletter.title}</h2>
                {activeNewsletter.subject && (
                  <p className="text-sm font-semibold text-slate-600">{activeNewsletter.subject}</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[350px] overflow-y-auto">
                {activeNewsletter.content || <span className="text-slate-450 italic">No text content available. Please refer to the PDF attachment.</span>}
              </div>

              {activeNewsletter.file_url && (
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                  <span className="text-xs font-semibold text-slate-550">Attach PDF version available:</span>
                  <a
                    href={activeNewsletter.file_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
