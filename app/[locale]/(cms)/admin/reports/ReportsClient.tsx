"use client";

import React, { useState, useTransition } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { createReport, deleteReport, updateReport } from "@/features/cms/content/actions/reports";
import { Plus, X, Trash2, FileText, Download, UploadCloud, Eye, FileSpreadsheet, Image, Video, HelpCircle, Calendar, Edit } from "lucide-react";

type ReportItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  resource_type: string;
  file_url: string;
  visible_tiers: string[];
  download_count: number;
  created_at: string;
};

type ReportsClientProps = {
  initialList: ReportItem[];
};

export default function ReportsClient({ initialList }: ReportsClientProps) {
  const [list, setList] = useState(initialList);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"Market Intelligence" | "Reports" | "Training" | "Guidelines">("Market Intelligence");
  const [resourceType, setResourceType] = useState<"pdf" | "image" | "video" | "spreadsheet" | "presentation" | "document">("pdf");
  const [fileUrl, setFileUrl] = useState("");
  const [visibleTiers, setVisibleTiers] = useState<string[]>(["associate"]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    actionFn: (id: string) => Promise<any>;
    actionName: string;
  } | null>(null);
  const [reportSuccess, setReportSuccess] = useState("");
  const [reportError, setReportError] = useState("");

  const handleAction = (id: string, actionFn: (id: string) => Promise<any>, actionName: string) => {
    setConfirmAction({ id, actionFn, actionName });
  };

  const executeConfirmedAction = () => {
    if (!confirmAction) return;
    const { id, actionFn } = confirmAction;
    setConfirmAction(null);
    setReportError("");
    setReportSuccess("");

    startTransition(async () => {
      const res = await actionFn(id);
      if (res.success) {
        setReportSuccess("Report deleted successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setReportError(res.error || "Failed to delete report");
      }
    });
  };

  const handleTierToggle = (tier: string) => {
    if (visibleTiers.includes(tier)) {
      setVisibleTiers(visibleTiers.filter((t) => t !== tier));
    } else {
      setVisibleTiers([...visibleTiers, tier]);
    }
  };

  const handleOpenEdit = (item: ReportItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description || "");
    setCategory(item.category as any);
    setResourceType(item.resource_type as any);
    setFileUrl(item.file_url);
    setVisibleTiers(item.visible_tiers);
    setIsOpen(true);
  };

  const handleClose = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("Market Intelligence");
    setResourceType("pdf");
    setFileUrl("");
    setVisibleTiers(["associate"]);
    setErrors({});
    setIsDragging(false);
    setUploadProgress(0);
    setUploadError("");
    setIsOpen(false);
  };

  const handleFileUpload = async (file: File) => {
    setUploadError("");
    setUploadProgress(10);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      
      const fileExt = file.name.split(".").pop();
      const uniqueId = Math.random().toString(36).substring(2, 9);
      const fileName = `${Date.now()}-${uniqueId}.${fileExt}`;
      
      setUploadProgress(35);

      const { data, error } = await supabase.storage
        .from("member-resources")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      setUploadProgress(75);

      const { data: { publicUrl } } = supabase.storage
        .from("member-resources")
        .getPublicUrl(fileName);

      setFileUrl(publicUrl);
      setUploadProgress(100);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Failed to upload file. Please try again.");
      setUploadProgress(0);
    }
  };

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
            <p className="text-sm font-medium text-slate-650">No inline preview available for this format</p>
            <p className="text-xs text-slate-400 mt-1">Please download the file to view its contents.</p>
          </div>
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setReportError("");
    setReportSuccess("");

    if (!title || !fileUrl) {
      setErrors({ general: "Title and File URL are required." });
      return;
    }

    if (visibleTiers.length === 0) {
      setErrors({ general: "Please select at least one visible membership tier." });
      return;
    }

    startTransition(async () => {
      const payload = {
        title,
        description: description || undefined,
        category,
        resourceType,
        fileUrl,
        tags: [],
        visibleTiers: visibleTiers as any,
      };

      const res = editingId
        ? await updateReport(editingId, payload)
        : await createReport(payload);

      if (res.success) {
        setReportSuccess(editingId ? "Market Report updated successfully." : "Market Report uploaded successfully.");
        handleClose();
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setErrors({ general: res.error || "Failed to save report" });
      }
    });
  };

  const columns: ColumnDef<ReportItem>[] = [
    {
      header: "Title & Details",
      accessorKey: "title",
      cell: (item) => (
        <div>
          <span className="font-bold text-slate-900 block">{item.title}</span>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description || "No description provided."}</p>
        </div>
      ),
    },
    {
      header: "Category & Format",
      accessorKey: "category",
      cell: (item) => (
        <div>
          <span className="text-xs font-semibold text-slate-800">{item.category}</span>
          <p className="text-[10px] text-slate-500 uppercase mt-0.5">{item.resource_type}</p>
        </div>
      ),
    },
    {
      header: "Visible Tiers",
      accessorKey: "visible_tiers",
      cell: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.visible_tiers.map((t, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-[10px] uppercase font-semibold text-slate-650 rounded border border-slate-200">
              {t}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Downloads",
      accessorKey: "download_count",
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>{item.download_count}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (item) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 hover:bg-slate-150 text-slate-550 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Edit Report"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPreviewReport(item)}
            className="p-1.5 hover:bg-slate-150 text-slate-605 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Preview Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <a
            href={item.file_url}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 hover:bg-slate-150 text-blue-600 rounded-lg transition-colors cursor-pointer"
            title="Download Link"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={() => handleAction(item.id, deleteReport, "delete")}
            className="p-1.5 text-red-650 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Report"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600 shrink-0" />
            <span>Manage Market Reports</span>
          </h1>
          <p className="text-slate-600 mt-1">Configure and release market insights, newsletters, and training materials.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Document</span>
        </button>
      </div>

      {reportError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {reportError}
        </div>
      )}
      {reportSuccess && (
        <div className="p-3 bg-emerald-550/10 border border-emerald-500/20 text-emerald-700 text-sm rounded-lg animate-pulse">
          {reportSuccess}
        </div>
      )}

      {/* Table list */}
      <DataTable columns={columns} data={list} getRowId={(item) => item.id} />

      {/* Action confirmation dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 capitalize">
              Confirm {confirmAction.actionName} Action
            </h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to {confirmAction.actionName} this report?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmedAction}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-705 text-white text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Dialog Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/40 backdrop-blur-sm p-4 font-sans overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8 text-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-905">
                {editingId ? "Edit Market Report" : "Upload New Document"}
              </h2>
              <button onClick={handleClose} className="text-slate-500 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {errors.general}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Document Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Semiconductor supply chain research report 2026"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize document findings or scope..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="Market Intelligence">Market Intelligence</option>
                    <option value="Reports">Reports</option>
                    <option value="Training">Training Guides</option>
                    <option value="Guidelines">Guidelines</option>
                    <option value="Case Studies">Case Studies</option>
                    <option value="Forms">Forms</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resource Format</label>
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="pdf">PDF File</option>
                    <option value="image">Image Asset</option>
                    <option value="video">Video URL</option>
                    <option value="spreadsheet">Spreadsheet</option>
                    <option value="presentation">Presentation</option>
                    <option value="document">Text Document</option>
                  </select>
                </div>
              </div>

              {/* File Upload / Drag & Drop */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  File Document
                </label>
                {fileUrl ? (
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="w-5 h-5 text-blue-605 shrink-0" />
                      <div className="text-sm font-medium text-slate-700 truncate">
                        {fileUrl.split("/").pop() || "Uploaded File"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFileUrl("")}
                      className="p-1 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const files = e.dataTransfer.files;
                      if (files && files.length > 0) {
                        await handleFileUpload(files[0]);
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                      isDragging
                        ? "border-blue-500 bg-blue-50/40"
                        : "border-slate-250 hover:border-slate-350 bg-white"
                    }`}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          await handleFileUpload(files[0]);
                        }
                      }}
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center cursor-pointer gap-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm mx-auto">
                        <UploadCloud className="w-5 h-5 text-slate-500" />
                      </div>
                      <div className="text-sm mt-1">
                        <span className="font-bold text-blue-600 hover:text-blue-700">Click to upload</span>
                        <span className="text-slate-500"> or drag and drop</span>
                      </div>
                      <p className="text-xs text-slate-400">PDF, DOCX, XLSX, images up to 25MB</p>
                    </label>
                  </div>
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-blue-600 h-full transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
                {uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
              </div>

              {/* Tiers Checkboxes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Visible Membership Tiers</label>
                <div className="flex flex-wrap gap-4 mt-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {["associate", "silver", "gold", "platinum"].map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm text-slate-700 capitalize cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleTiers.includes(t)}
                        onChange={() => handleTierToggle(t)}
                        className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500/20 w-4 h-4 cursor-pointer"
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-555 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-md transition-colors cursor-pointer flex items-center justify-center min-w-28"
                >
                  {isPending ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    editingId ? "Save Changes" : "Publish Document"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Details Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto font-sans">
          <div className="w-full max-w-[95vw] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
              <h2 className="text-lg font-bold text-slate-900">{previewReport.title}</h2>
              <button
                onClick={() => setPreviewReport(null)}
                className="text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {renderFilePreview(previewReport.resource_type, previewReport.file_url)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
