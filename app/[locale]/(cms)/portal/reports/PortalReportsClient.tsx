"use client";

import React, { useState } from "react";
import { Search, FileText, Download, Calendar, Filter, X, Eye, FileSpreadsheet, Image, Video, HelpCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

type ReportResource = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  resource_type: string;
  thumbnail_url: string | null;
  file_url: string;
  file_size: number | null;
  tags: string[];
  visible_tiers: string[];
  download_count: number;
  created_at: string;
};

type PortalReportsClientProps = {
  reports: ReportResource[];
};

export default function PortalReportsClient({ reports }: PortalReportsClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [previewReport, setPreviewReport] = useState<ReportResource | null>(null);

  // Search filter
  const filtered = reports.filter((item) => {
    const term = search.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(term) ||
      (item.description || "").toLowerCase().includes(term) ||
      item.tags.some((tag) => tag.toLowerCase().includes(term));

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesType = selectedType === "all" || item.resource_type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-8 h-8 text-rose-500" />;
      case "spreadsheet":
        return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />;
      case "image":
        return <Image className="w-8 h-8 text-blue-500" />;
      case "video":
        return <Video className="w-8 h-8 text-amber-500" />;
      default:
        return <FileText className="w-8 h-8 text-slate-500" />;
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "Unknown Size";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="w-8 h-8 text-blue-600 shrink-0" />
          <span>Research & Intelligence Library</span>
        </h1>
        <p className="text-slate-600 mt-1">Access premium economic insights, sector analyses, investment briefs, and bilateral reports.</p>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search titles, industries, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Market Intelligence">Market Intelligence</option>
            <option value="Reports">Reports</option>
            <option value="Guidelines">Guidelines</option>
            <option value="Case Studies">Case Studies</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All File Formats</option>
            <option value="pdf">PDF Documents</option>
            <option value="spreadsheet">Spreadsheets</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Reports Available"
          description="There are no research documents matching your active filters or membership credentials."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatSize(item.file_size)}
                  </span>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 mt-1">
                    {getFileIcon(item.resource_type)}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {item.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-150 flex items-center justify-between gap-4">
                <span className="flex items-center gap-1 text-[10px] text-slate-505 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span suppressHydrationWarning>{new Date(item.created_at).toLocaleDateString()}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewReport(item)}
                    className="p-2 text-slate-505 hover:text-slate-800 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                    title="Preview Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <a
                    href={item.file_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
              <h2 className="text-lg font-bold text-slate-900">Intelligence Details</h2>
              <button
                onClick={() => setPreviewReport(null)}
                className="text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
                  {getFileIcon(previewReport.resource_type)}
                </div>
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                    {previewReport.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {previewReport.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Executive Summary</h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {previewReport.description || "No description provided for this library resource."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block font-medium">Published Date</span>
                  <span className="font-semibold text-slate-900" suppressHydrationWarning>{new Date(previewReport.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">File Specifications</span>
                  <span className="font-semibold text-slate-900 capitalize">{previewReport.resource_type} ({formatSize(previewReport.file_size)})</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
                <button
                  onClick={() => setPreviewReport(null)}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
                <a
                  href={previewReport.file_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-550 text-white text-sm font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Resource</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
