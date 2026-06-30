"use client";

import React, { useState } from "react";
import { Search, FileText, Image, Video, FileSpreadsheet, Play, Download, Trash2, Plus, Info, X } from "lucide-react";

type ResourceItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  resource_type: string;
  thumbnail_url: string | null;
  file_url: string;
  file_size: number | null;
  created_at: string;
};

type AdminMediaLibraryClientProps = {
  initialResources: ResourceItem[];
};

export default function AdminMediaLibraryClient({ initialResources }: AdminMediaLibraryClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showUploadInfo, setShowUploadInfo] = useState(false);

  const filtered = initialResources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesType = selectedType === "all" || item.resource_type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-8 h-8 text-rose-500" />;
      case "image":
        return <Image className="w-8 h-8 text-emerald-500" />;
      case "video":
        return <Video className="w-8 h-8 text-amber-500" />;
      case "spreadsheet":
        return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
      default:
        return <FileText className="w-8 h-8 text-blue-500" />;
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Media Library</h1>
          <p className="text-slate-600 mt-1">Review, coordinate, and organize industrial resources, PDF downloads, and seminar media.</p>
        </div>
        <button
          onClick={() => setShowUploadInfo(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-md shadow-blue-600/10 cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      {showUploadInfo && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg flex items-start gap-2 relative">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Document Management Notice</p>
            <p className="mt-1">Upload functionality can be managed via individual modules (e.g. Announcements, Training Programs or Reports) to associate attachments properly.</p>
          </div>
          <button
            onClick={() => setShowUploadInfo(false)}
            className="absolute top-2 right-2 text-blue-400 hover:text-blue-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search files and descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
          >
            <option value="all">All Categories</option>
            <option value="Market Intelligence">Market Intelligence</option>
            <option value="Reports">Reports</option>
            <option value="Training">Training</option>
            <option value="Guidelines">Guidelines</option>
            <option value="Case Studies">Case Studies</option>
            <option value="Forms">Forms</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
          >
            <option value="all">All File Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="spreadsheet">Spreadsheets</option>
            <option value="presentation">Presentations</option>
            <option value="document">Word Documents</option>
          </select>
        </div>
      </div>

      {/* Library Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl max-w-md mx-auto space-y-2">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800">No files found</h3>
          <p className="text-xs text-slate-500">Refine search text or check your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 bg-white rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 shadow-sm hover:shadow-md transition-all relative group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150">
                    {getFileIcon(item.resource_type)}
                  </div>
                  <span className="px-2 py-0.5 bg-slate-50 text-slate-650 rounded text-[10px] font-semibold border border-slate-200">
                    {item.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 tracking-tight text-base leading-snug truncate" title={item.title}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
                    <span>{item.resource_type.toUpperCase()}</span>
                    <span>•</span>
                    <span>{formatSize(item.file_size)}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {item.description || "No description provided."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-150 flex justify-between items-center text-xs">
                <span className="text-[10px] text-slate-505 font-mono" suppressHydrationWarning>
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded border border-slate-200 transition-colors"
                    title="Download/Open"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
