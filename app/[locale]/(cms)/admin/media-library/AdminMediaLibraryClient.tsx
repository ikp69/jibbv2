"use client";

import React, { useState } from "react";
import { Search, FileText, Image, Video, FileSpreadsheet, Download, Plus, Info, X, Eye } from "lucide-react";

type ResourceItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  resource_type: string;
  thumbnail_url: string | null;
  file_url: string;
  file_size: number | null;
  visible_tiers: string[];
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
  const [previewResource, setPreviewResource] = useState<ResourceItem | null>(null);

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

  const renderFilePreview = (type: string, url: string) => {
    if (!url) return null;
    const lowerType = type.toLowerCase();
    
    switch (lowerType) {
      case "pdf":
        return (
          <div className="w-full h-[calc(90vh-140px)] border border-slate-200 rounded-lg overflow-hidden bg-slate-100 shadow-inner">
            <iframe
              src={`${url}#toolbar=0`}
              className="w-full h-full"
              title="PDF Preview"
            />
          </div>
        );
      case "image":
        return (
          <div className="w-full max-h-[calc(90vh-140px)] flex items-center justify-center border border-slate-200 rounded-lg overflow-hidden bg-slate-100 p-2 shadow-inner">
            <img
              src={url}
              alt="File Preview"
              className="max-w-full max-h-[calc(90vh-160px)] object-contain rounded-md"
            />
          </div>
        );
      case "video":
        return (
          <div className="w-full border border-slate-200 rounded-lg overflow-hidden bg-slate-100 shadow-inner">
            <video
              src={url}
              controls
              className="w-full max-h-[calc(90vh-140px)] object-contain"
            />
          </div>
        );
      case "spreadsheet":
      case "document":
      case "presentation":
        return (
          <div className="w-full h-[calc(90vh-140px)] border border-slate-200 rounded-lg overflow-hidden bg-slate-100 shadow-inner">
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
              className="w-full h-full"
              title="Document Preview"
            />
          </div>
        );
      default:
        return (
          <div className="p-8 border border-dashed border-slate-200 rounded-lg text-center bg-slate-50">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">Preview not available for this file type</p>
          </div>
        );
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 bg-white rounded-lg p-4 flex flex-col justify-between hover:border-slate-300 shadow-sm hover:shadow-md transition-all relative group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="p-2 bg-slate-50 rounded border border-slate-150 flex-shrink-0">
                    {getFileIcon(item.resource_type)}
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 tracking-tight text-sm leading-tight line-clamp-2" title={item.title}>
                      {item.title}
                    </h3>
                    <span className="px-1.5 py-0.5 bg-slate-50 text-slate-650 rounded text-[10px] font-semibold border border-slate-200 w-fit">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span>{item.resource_type.toUpperCase()}</span>
                  <span>•</span>
                  <span>{formatSize(item.file_size)}</span>
                </div>

                {item.visible_tiers && item.visible_tiers.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.visible_tiers.map((tier) => (
                      <span
                        key={tier}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded text-[10px] font-medium border border-amber-200"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        {tier}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-150 flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-mono" suppressHydrationWarning>
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewResource(item)}
                    className="p-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded border border-slate-200 hover:border-blue-300 transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={item.file_url}
                    download
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded border border-slate-200 transition-colors"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-[95vw] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
              <h2 className="text-lg font-bold text-slate-900">{previewResource.title}</h2>
              <button
                onClick={() => setPreviewResource(null)}
                className="text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {renderFilePreview(previewResource.resource_type, previewResource.file_url)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
