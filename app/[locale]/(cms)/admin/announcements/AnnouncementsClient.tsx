"use client";

import React, { useState, useTransition } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { createAnnouncement, deleteAnnouncement, togglePinAnnouncement } from "@/features/cms/content/actions/announcements";
import { useRouter } from "next/navigation";
import { Pin, Trash2, Plus, X, Megaphone } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  content: string;
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
  const [isPending, startTransition] = useTransition();

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

  const handleClose = () => {
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
      const res = await createAnnouncement({
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
      });

      if (res.success) {
        setNoticeSuccess("Announcement created successfully.");
        setIsOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setErrors({ general: res.error || "Failed to create announcement" });
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
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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

      {/* Dialog Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/40 backdrop-blur-sm p-4 font-sans overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
              <h2 className="text-lg font-bold text-slate-900">Create Announcement</h2>
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
                    "Publish Notice"
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
