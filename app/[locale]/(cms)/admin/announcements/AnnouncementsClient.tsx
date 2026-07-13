"use client";

import React, { useState, useTransition, useMemo } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { createAnnouncement, deleteAnnouncement, togglePinAnnouncement, updateAnnouncement } from "@/features/cms/content/actions/announcements";
import { useRouter } from "next/navigation";
import { Pin, Trash2, Plus, X, Megaphone, Edit, Eye, Search, ChevronDown } from "lucide-react";

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
  expiry_date: string | null;
  created_at: string;
};

type AnnouncementsClientProps = {
  initialList: Announcement[];
};

export default function AnnouncementsClient({ initialList }: AnnouncementsClientProps) {
  const router = useRouter();
  const [list, setList] = useState(initialList);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  // Search, filter, sort
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "pinned">("newest");
  const [previewItem, setPreviewItem] = useState<Announcement | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<"horizontal" | "square" | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [attachment, setAttachment] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [visibleTiers, setVisibleTiers] = useState<string[]>(["associate"]);
  const [isPinned, setIsPinned] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [publishDate, setPublishDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    actionFn: (id: string) => Promise<any>;
    actionName: string;
  } | null>(null);
  const [noticeSuccess, setNoticeSuccess] = useState("");
  const [noticeError, setNoticeError] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter and search logic
  const filteredAndSearchedList = useMemo(() => {
    let result = [...list];

    // Search filter
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.content.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Tier filter
    if (tierFilter !== "all") {
      result = result.filter((item) => item.visible_tiers.includes(tierFilter));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "pinned") {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return new Date(b.publish_date || b.created_at).getTime() - new Date(a.publish_date || a.created_at).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.publish_date || a.created_at).getTime() - new Date(b.publish_date || b.created_at).getTime();
      } else {
        return new Date(b.publish_date || b.created_at).getTime() - new Date(a.publish_date || a.created_at).getTime();
      }
    });

    return result;
  }, [list, search, statusFilter, tierFilter, sortBy]);

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
        setNoticeSuccess(`Announcement successfully updated.`);
        // Reload from server after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setNoticeError(res.error || "Failed to update announcement");
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

  const handleOpenEdit = (item: Announcement) => {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setBannerImage(item.banner_image || "");
    setAttachment(item.attachment || "");
    setExternalLink(item.external_link || "");
    setVisibleTiers(item.visible_tiers);
    setIsPinned(item.is_pinned);
    setStatus(item.status as any);
    if (item.publish_date) {
      setPublishDate(new Date(item.publish_date).toISOString().split("T")[0]);
    } else {
      setPublishDate("");
    }
    if (item.expiry_date) {
      setExpiryDate(new Date(item.expiry_date).toISOString().split("T")[0]);
    } else {
      setExpiryDate("");
    }
    setIsOpen(true);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const ratio = img.naturalWidth / img.naturalHeight;
    // Consider square if aspect ratio is between 0.8 and 1.2
    setImageAspectRatio(ratio > 0.8 && ratio < 1.2 ? "square" : "horizontal");
  };

  const handleClose = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setBannerImage("");
    setAttachment("");
    setExternalLink("");
    setVisibleTiers(["associate"]);
    setIsPinned(false);
    setStatus("published");
    setPublishDate("");
    setExpiryDate("");
    setErrors({});
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setNoticeError("");
    setNoticeSuccess("");

    if (!title || !content) {
      setErrors({ general: "Title and Content are required fields." });
      return;
    }

    if (visibleTiers.length === 0) {
      setErrors({ general: "Please select at least one visible membership tier." });
      return;
    }

    startTransition(async () => {
      const payload = {
        title,
        content,
        bannerImage: bannerImage || undefined,
        attachment: attachment || undefined,
        externalLink: externalLink || undefined,
        visibleTiers: visibleTiers as any,
        isPinned,
        status,
        publishDate: publishDate || undefined,
        expiryDate: expiryDate || undefined,
      };

      const res = editingId
        ? await updateAnnouncement(editingId, payload)
        : await createAnnouncement(payload);

      if (res.success) {
        setNoticeSuccess(editingId ? "Announcement updated successfully." : "Announcement created successfully.");
        setIsOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setErrors({ general: res.error || "Failed to save announcement" });
      }
    });
  };

  const columns: ColumnDef<Announcement>[] = [
    {
      header: "Title & Content",
      accessorKey: "title",
      cell: (item) => (
        <div>
          <div className="flex items-center gap-2">
            {item.is_pinned && <Pin className="w-3.5 h-3.5 text-blue-600 rotate-45 shrink-0" />}
            <span className="font-bold text-slate-900">{item.title}</span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.content}</p>
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
      header: "Publish Date",
      accessorKey: "publish_date",
      cell: (item) => {
        if (!item.publish_date) return <span className="text-slate-500">N/A</span>;
        return <span className="text-xs font-mono text-slate-550" suppressHydrationWarning>{new Date(item.publish_date).toLocaleDateString()}</span>;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Actions",
      cell: (item) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPreviewItem(item)}
            className="p-1.5 text-slate-550 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Preview Announcement"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 text-slate-550 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Edit Announcement"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAction(item.id, togglePinAnnouncement, "pin/unpin")}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-slate-100/70 ${
              item.is_pinned ? "text-blue-600" : "text-slate-400 hover:text-slate-800"
            }`}
            title="Toggle Pin"
          >
            <Pin className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAction(item.id, deleteAnnouncement, "delete")}
            className="p-1.5 text-red-605 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Announcement"
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
            <Megaphone className="w-8 h-8 text-blue-600 shrink-0" />
            <span>Manage Announcements</span>
          </h1>
          <p className="text-slate-600 mt-1">Publish localized notices and alerts visible to member dashboard screens.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Notice</span>
        </button>
      </div>

      {noticeError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {noticeError}
        </div>
      )}
      {noticeSuccess && (
        <div className="p-3 bg-emerald-550/10 border border-emerald-500/20 text-emerald-700 text-sm rounded-lg animate-pulse">
          {noticeSuccess}
        </div>
      )}

      {/* Search, Filter, and Sort Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors cursor-pointer appearance-none pr-8 min-w-fit"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors cursor-pointer appearance-none pr-8 min-w-fit"
          >
            <option value="all">All Tiers</option>
            <option value="associate">Associate</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors cursor-pointer appearance-none pr-8 min-w-fit"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="pinned">Pinned</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-slate-600">
        Showing <span className="font-semibold text-slate-900">{filteredAndSearchedList.length}</span> of{" "}
        <span className="font-semibold text-slate-900">{list.length}</span> announcements
      </div>

      {/* Table list */}
      <DataTable columns={columns} data={filteredAndSearchedList} getRowId={(item) => item.id} />

      {/* Action confirmation dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 capitalize">
              Confirm {confirmAction.actionName} Action
            </h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to {confirmAction.actionName} this announcement?
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

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-200 animate-in fade-in font-sans">
          <div className="absolute inset-0" onClick={() => setPreviewItem(null)} />
          
          {/* Layout changes based on image aspect ratio */}
          <div className={`bg-white rounded-2xl shadow-2xl w-full relative z-10 overflow-hidden border border-slate-100 transition-all duration-200 animate-in zoom-in-95 max-h-[90vh] flex flex-col ${
            imageAspectRatio === "square" ? "lg:flex-row max-w-4xl" : "max-w-3xl"
          }`}>
            {/* Banner Image - Conditional Position */}
            {previewItem.banner_image && (
              <div className={`relative bg-slate-50 flex items-center justify-center overflow-hidden ${
                imageAspectRatio === "square"
                  ? "w-full lg:w-2/5 h-auto lg:h-full border-b lg:border-b-0 lg:border-r border-slate-150 flex-shrink-0"
                  : "w-full h-auto border-b border-slate-150"
              }`} style={imageAspectRatio === "horizontal" ? { maxHeight: "300px" } : {}}>
                <img
                  src={previewItem.banner_image}
                  alt={previewItem.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onLoad={handleImageLoad}
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Content Section */}
            <div className={`flex-1 flex flex-col overflow-hidden ${
              imageAspectRatio === "square" && previewItem.banner_image ? "w-full lg:w-3/5" : "w-full"
            }`}>
              {/* Header */}
              <div className="p-6 border-b border-slate-150 flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {previewItem.is_pinned && (
                      <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                        <Pin className="w-3 h-3 shrink-0" />
                        <span>Pinned</span>
                      </span>
                    )}
                    <StatusBadge status={previewItem.status} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 leading-snug break-words">
                    {previewItem.title}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setPreviewItem(null);
                    setImageAspectRatio(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  aria-label="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-6 overflow-y-auto flex-1 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-normal">
                {previewItem.content}
              </div>

              {/* Metadata Footer - Always stick to bottom */}
              <div className="p-6 border-t border-slate-150 bg-slate-50/50 space-y-3 text-xs shrink-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 font-semibold block mb-1.5">Visible Tiers:</span>
                    <div className="flex flex-wrap gap-1">
                      {previewItem.visible_tiers.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 uppercase font-semibold text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block mb-1">Publish Date:</span>
                    <p className="text-slate-900 font-mono">
                      {previewItem.publish_date ? new Date(previewItem.publish_date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                {previewItem.external_link && (
                  <div>
                    <span className="text-slate-500 font-semibold block mb-1">External Link:</span>
                    <p className="text-blue-600 truncate text-[11px]">{previewItem.external_link}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/40 backdrop-blur-sm p-4 font-sans overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8 text-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-905">
                {editingId ? "Edit Announcement" : "Create Announcement"}
              </h2>
              <button onClick={handleClose} className="text-slate-500 hover:text-slate-905 cursor-pointer">
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
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual bilateral business meet 2026 scheduling"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notice Content</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write announcement body details here..."
                  rows={4}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none"
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
                        className="rounded border-slate-350 bg-white text-blue-600 focus:ring-blue-550/20 w-4 h-4 cursor-pointer"
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">External Link (Optional)</label>
                  <input
                    type="url"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Banner Image URL (Optional)</label>
                  <input
                    type="url"
                    value={bannerImage}
                    onChange={(e) => setBannerImage(e.target.value)}
                    placeholder="https://example.com/banner.png"
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Publish Date (Optional)</label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 rounded-lg text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded border-slate-350 bg-white text-blue-600 focus:ring-blue-550/20 w-4 h-4 cursor-pointer"
                  />
                  <span>Pin Notice to top of member dashboard</span>
                </label>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "published"}
                      onChange={() => setStatus("published")}
                      className="text-blue-600 focus:ring-blue-550/20 cursor-pointer"
                    />
                    <span>Publish Immediately</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "draft"}
                      onChange={() => setStatus("draft")}
                      className="text-blue-600 focus:ring-blue-550/20 cursor-pointer"
                    />
                    <span>Save Draft</span>
                  </label>
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
                    editingId ? "Save Changes" : "Publish Notice"
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
