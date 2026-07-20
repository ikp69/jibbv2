"use client";

import React, { useState, useTransition, useMemo } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { createNewsletter, updateNewsletter, deleteNewsletter } from "@/features/cms/content/actions/newsletters";
import { Trash2, Plus, X, Newspaper, Edit, Calendar, Filter, FileText, Eye, Download } from "lucide-react";

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

type AdminNewslettersClientProps = {
  initialList: Newsletter[];
};

export default function AdminNewslettersClient({ initialList }: AdminNewslettersClientProps) {
  const [list, setList] = useState(initialList);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form Fields
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [visibleTiers, setVisibleTiers] = useState<string[]>(["associate"]);
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [publishDate, setPublishDate] = useState("");

  // Filters
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");

  // Sorting State
  const [sortKey, setSortKey] = useState<string>("publish_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    actionFn: (id: string) => Promise<any>;
    actionName: string;
  } | null>(null);
  const [noticeSuccess, setNoticeSuccess] = useState("");
  const [noticeError, setNoticeError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewNewsletter, setPreviewNewsletter] = useState<Newsletter | null>(null);

  const handleAction = (id: string, actionFn: (id: string) => Promise<any>, actionName: string) => {
    setConfirmAction({ id, actionFn, actionName });
  };

  const executeConfirmedAction = () => {
    if (!confirmAction) return;
    const { id, actionFn } = confirmAction;
    setConfirmAction(null);
    setNoticeError("");
    setNoticeSuccess("");

    startTransition(async () => {
      const res = await actionFn(id);
      if (res.success) {
        setNoticeSuccess(`Newsletter successfully deleted.`);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setNoticeError(res.error || "Failed to delete newsletter");
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

  const handleOpenEdit = (item: Newsletter) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSubject(item.subject || "");
    setContent(item.content || "");
    setFileUrl(item.file_url || "");
    setVisibleTiers(item.visible_tiers);
    setStatus(item.status as any);
    
    if (item.publish_date) {
      const dateObj = new Date(item.publish_date);
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getDate()).padStart(2, "0");
      setPublishDate(`${yyyy}-${mm}-${dd}`);
    } else {
      setPublishDate("");
    }
    
    setIsOpen(true);
  };

  const handleClose = () => {
    setEditingId(null);
    setTitle("");
    setSubject("");
    setContent("");
    setFileUrl("");
    setVisibleTiers(["associate"]);
    setStatus("published");
    setPublishDate("");
    setErrors({});
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setNoticeError("");
    setNoticeSuccess("");

    if (!title) {
      setErrors({ general: "Title is required." });
      return;
    }

    if (visibleTiers.length === 0) {
      setErrors({ general: "Please select at least one visible membership tier." });
      return;
    }

    startTransition(async () => {
      const payload = {
        title,
        subject: subject || undefined,
        content: content || undefined,
        fileUrl: fileUrl || undefined,
        visibleTiers: visibleTiers as any,
        status,
        publishDate: publishDate || undefined,
      };

      const res = editingId 
        ? await updateNewsletter(editingId, payload)
        : await createNewsletter(payload);

      if (res.success) {
        setNoticeSuccess(editingId ? "Newsletter updated successfully." : "Newsletter created successfully.");
        handleClose();
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setErrors({ general: res.error || "Failed to save newsletter" });
      }
    });
  };

  const handleSort = (key: string, order: "asc" | "desc") => {
    setSortKey(key);
    setSortOrder(order);
  };

  // Extract unique months for filtering
  const monthsOptions = useMemo(() => {
    const months = new Set<string>();
    list.forEach((item) => {
      if (item.publish_date) {
        const d = new Date(item.publish_date);
        const name = d.toLocaleString("default", { month: "long" }) + " " + d.getFullYear();
        months.add(name);
      }
    });
    return Array.from(months);
  }, [list]);

  // Filter & Sort list
  const filteredAndSortedList = useMemo(() => {
    let result = list.filter((item) => {
      // Month Match
      let matchesMonth = true;
      if (selectedMonth !== "all" && item.publish_date) {
        const d = new Date(item.publish_date);
        const name = d.toLocaleString("default", { month: "long" }) + " " + d.getFullYear();
        matchesMonth = name === selectedMonth;
      }

      // Tier Match
      let matchesTier = true;
      if (selectedTier !== "all") {
        matchesTier = item.visible_tiers.includes(selectedTier);
      }

      return matchesMonth && matchesTier;
    });

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortKey as keyof Newsletter];
      let bVal = b[sortKey as keyof Newsletter];

      if (aVal === null || aVal === undefined) return sortOrder === "asc" ? 1 : -1;
      if (bVal === null || bVal === undefined) return sortOrder === "asc" ? -1 : 1;

      if (Array.isArray(aVal) || Array.isArray(bVal)) return 0;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });

    return result;
  }, [list, selectedMonth, selectedTier, sortKey, sortOrder]);

  const columns: ColumnDef<Newsletter>[] = [
    {
      header: "Title & Subject",
      accessorKey: "title",
      sortable: true,
      cell: (item) => (
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900 leading-snug">{item.title}</span>
          {item.subject && (
            <p className="text-xs text-slate-500 font-medium">{item.subject}</p>
          )}
        </div>
      ),
    },
    {
      header: "Visible Tiers",
      accessorKey: "visible_tiers",
      cell: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.visible_tiers.map((t, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-[10px] uppercase font-bold text-slate-600 rounded border border-slate-200">
              {t}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Publish Date",
      accessorKey: "publish_date",
      sortable: true,
      cell: (item) => {
        if (!item.publish_date) return <span className="text-slate-500">N/A</span>;
        return <span className="text-xs font-mono text-slate-550" suppressHydrationWarning>{new Date(item.publish_date).toLocaleDateString()}</span>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Actions",
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPreviewNewsletter(item)}
            className="p-1.5 text-slate-555 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Preview Newsletter"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 text-slate-555 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Edit Newsletter"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAction(item.id, deleteNewsletter, "delete")}
            className="p-1.5 text-red-650 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Newsletter"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Newspaper className="w-8 h-8 text-blue-600 shrink-0" />
            <span>Manage Newsletters</span>
          </h1>
          <p className="text-slate-600 mt-1">Create and publish trade briefings, monthly newsletters, and premium circular logs.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-600/10 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Newsletter</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Filter by Month
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Months</option>
            {monthsOptions.map((m, idx) => (
              <option key={idx} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter by Target Tier
          </label>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Tiers</option>
            <option value="associate">Associate</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>
      </div>

      {noticeError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {noticeError}
        </div>
      )}
      {noticeSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg animate-pulse">
          {noticeSuccess}
        </div>
      )}

      {/* Table list */}
      <DataTable
        columns={columns}
        data={filteredAndSortedList}
        getRowId={(item) => item.id}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {/* Action confirmation dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6 space-y-4 text-slate-800">
            <h3 className="text-base font-bold text-slate-900 capitalize">
              Confirm {confirmAction.actionName} Action
            </h3>
            <p className="text-sm text-slate-500">
              Are you sure you want to {confirmAction.actionName} this newsletter? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmedAction}
                className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewNewsletter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 overflow-y-auto font-sans">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8 text-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150 bg-slate-50">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-600" />
                {previewNewsletter.publish_date && (
                  <span className="text-[11px] font-mono text-slate-500 font-semibold" suppressHydrationWarning>
                    {new Date(previewNewsletter.publish_date).toLocaleDateString()}
                  </span>
                )}
                <span className="px-1.5 py-0.5 bg-slate-200 text-[10px] uppercase font-bold text-slate-750 rounded border border-slate-300">Preview</span>
              </div>
              <button
                onClick={() => setPreviewNewsletter(null)}
                className="text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900 leading-snug">{previewNewsletter.title}</h2>
                {previewNewsletter.subject && (
                  <p className="text-sm font-semibold text-slate-600">{previewNewsletter.subject}</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[350px] overflow-y-auto">
                {previewNewsletter.content || <span className="text-slate-450 italic">No text content available. Please refer to the PDF attachment.</span>}
              </div>

              {previewNewsletter.file_url && (
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                  <span className="text-xs font-semibold text-slate-550">Attach PDF version available:</span>
                  <a
                    href={previewNewsletter.file_url}
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

      {/* Dialog Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8 text-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? "Edit Newsletter" : "Create Newsletter"}
              </h2>
              <button onClick={handleClose} className="text-slate-555 hover:text-slate-900 cursor-pointer">
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Bilateral Investment Policy Circular"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Subject Line (Optional)</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Inside: New industrial corridor policy updates"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content Body (Text/HTML)</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write body content here..."
                  rows={6}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">PDF File URL (Optional)</label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://example.com/newsletter-july.pdf"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {/* Tiers Checkboxes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visible Membership Tiers</label>
                <div className="flex flex-wrap gap-4 mt-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {["associate", "silver", "gold", "platinum"].map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm text-slate-700 capitalize cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleTiers.includes(t)}
                        onChange={() => handleTierToggle(t)}
                        className="rounded border-slate-350 bg-white text-blue-600 focus:ring-blue-550/20 w-4 h-4 cursor-pointer"
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Publish Date (Optional)</label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 rounded-lg text-sm focus:outline-none cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={status === "published"}
                        onChange={() => setStatus("published")}
                        className="text-blue-600 focus:ring-blue-550/20 cursor-pointer"
                      />
                      <span>Published</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={status === "draft"}
                        onChange={() => setStatus("draft")}
                        className="text-blue-600 focus:ring-blue-550/20 cursor-pointer"
                      />
                      <span>Draft</span>
                    </label>
                  </div>
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
                    editingId ? "Update Newsletter" : "Publish Newsletter"
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
