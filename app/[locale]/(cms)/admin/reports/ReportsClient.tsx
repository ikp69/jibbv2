"use client";

import React, { useState, useTransition } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { createReport, deleteReport } from "@/features/cms/content/actions/reports";
import { Plus, X, Trash2, FileText, Download } from "lucide-react";

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

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setCategory("Market Intelligence");
    setResourceType("pdf");
    setFileUrl("");
    setVisibleTiers(["associate"]);
    setErrors({});
    setIsOpen(false);
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
      const res = await createReport({
        title,
        description: description || undefined,
        category,
        resourceType,
        fileUrl,
        tags: [],
        visibleTiers: visibleTiers as any,
      });

      if (res.success) {
        setReportSuccess("Market Report uploaded successfully.");
        setIsOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setErrors({ general: res.error || "Failed to create report" });
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
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
              <h2 className="text-lg font-bold text-slate-900">Upload New Document</h2>
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">File Resource URL</label>
                <input
                  type="url"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://supabase-storage-url.com/bucket/report.pdf"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
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
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
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
                    "Publish Document"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
