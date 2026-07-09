"use client";

import React, { useState, useTransition } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { createCollaboration, updateCollaboration, deleteCollaboration, updateCollaborationInterestStatus } from "@/features/cms/business/actions/collaborations";
import { Plus, X, Trash2, ShieldCheck, Heart, Pencil, AlertCircle, FileText, Briefcase } from "lucide-react";

type Collaboration = {
  id: string;
  title: string;
  description: string;
  industry: string;
  visible_tiers: string[];
  status: string;
  category: "partnerships" | "delegations" | "tradeMissions" | "investment";
  direction: string;
  location: string;
};

type Pitch = {
  id: string;
  collaboration_id: string;
  message: string;
  status: string;
  created_at: string;
  profiles: {
    company_name: string | null;
    email: string | null;
  } | null;
};

type CollaborationClientProps = {
  collaborations: Collaboration[];
  pitches: Pitch[];
};

export default function CollaborationClient({ collaborations, pitches }: CollaborationClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColId, setSelectedColId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  const toggleDescriptionExpand = (id: string) => {
    setExpandedDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [visibleTiers, setVisibleTiers] = useState<string[]>(["associate"]);
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [category, setCategory] = useState<"partnerships" | "delegations" | "tradeMissions" | "investment">("partnerships");
  const [direction, setDirection] = useState("");
  const [location, setLocation] = useState("");
  const [editingCol, setEditingCol] = useState<Collaboration | null>(null);

  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    actionFn: (id: string) => Promise<any>;
    actionName: string;
  } | null>(null);
  const [collabSuccess, setCollabSuccess] = useState("");
  const [collabError, setCollabError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAction = (id: string, actionFn: (id: string) => Promise<any>, actionName: string) => {
    setConfirmAction({ id, actionFn, actionName });
  };

  const executeConfirmedAction = () => {
    if (!confirmAction) return;
    const { id, actionFn } = confirmAction;
    setConfirmAction(null);
    setCollabError("");
    setCollabSuccess("");

    startTransition(async () => {
      const res = await actionFn(id);
      if (res.success) {
        setCollabSuccess("Listing deleted successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setCollabError(res.error || "Failed to delete listing");
      }
    });
  };

  const handleUpdatePitchStatus = (pitchId: string, nextStatus: "pending" | "reviewed" | "approved" | "rejected") => {
    setCollabError("");
    setCollabSuccess("");

    startTransition(async () => {
      const res = await updateCollaborationInterestStatus(pitchId, nextStatus);
      if (res.success) {
        setCollabSuccess(`Interest status updated to ${nextStatus}.`);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setCollabError(res.error || "Failed to update status");
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

  const handleEdit = (item: Collaboration) => {
    setTitle(item.title);
    setDescription(item.description);
    setIndustry(item.industry);
    setVisibleTiers(item.visible_tiers);
    setStatus(item.status as any);
    setCategory(item.category);
    setDirection(item.direction || "");
    setLocation(item.location || "");
    setEditingCol(item);
    setIsOpen(true);
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setIndustry("");
    setVisibleTiers(["associate"]);
    setStatus("published");
    setCategory("partnerships");
    setDirection("");
    setLocation("");
    setEditingCol(null);
    setErrors({});
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setCollabError("");
    setCollabSuccess("");

    if (!title || !description || !industry || !direction || !location) {
      setErrors({ general: "All fields are required." });
      return;
    }

    startTransition(async () => {
      const payload = {
        title,
        description,
        industry,
        visibleTiers: visibleTiers as any,
        status,
        category,
        direction,
        location,
      };

      const res = editingCol 
        ? await updateCollaboration(editingCol.id, payload)
        : await createCollaboration(payload);

      if (res.success) {
        setCollabSuccess(editingCol ? "Strategic Collaboration Listing updated successfully." : "Strategic Collaboration Listing published successfully.");
        setIsOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setErrors({ general: res.error || (editingCol ? "Failed to update collaboration" : "Failed to create collaboration") });
      }
    });
  };

  const columns: ColumnDef<Collaboration>[] = [
    {
      header: "Collaboration Title",
      accessorKey: "title",
      cell: (item) => {
        const isExpanded = !!expandedDescriptions[item.id];
        const isLong = item.description && item.description.length > 80;
        return (
          <div className="max-w-md">
            <span className="font-bold text-slate-900 block leading-tight">{item.title}</span>
            <p className={`text-xs text-slate-500 leading-relaxed mt-1 whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-2"}`}>
              {item.description}
            </p>
            {isLong && (
              <button
                onClick={() => toggleDescriptionExpand(item.id)}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold mt-1 focus:outline-none cursor-pointer"
              >
                {isExpanded ? "Show Less" : "Read More..."}
              </button>
            )}
          </div>
        );
      },
    },
    {
      header: "Industry & Category",
      accessorKey: "industry",
      cell: (item) => (
        <div>
          <span className="text-xs font-semibold text-slate-800">{item.industry}</span>
          <p className="text-[10px] text-slate-500 capitalize mt-0.5">Type: {item.category}</p>
        </div>
      ),
    },
    {
      header: "Direction & Location",
      cell: (item) => (
        <div>
          <span className="text-xs font-bold text-slate-800">{item.direction}</span>
          <p className="text-[10px] text-slate-500 mt-0.5">{item.location}</p>
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
      header: "Status",
      accessorKey: "status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Actions",
      cell: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedColId(selectedColId === item.id ? null : item.id)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              pitches.filter((p) => p.collaboration_id === item.id && p.status === "pending").length > 0
                ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-250 font-bold"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
            }`}
          >
            <span>Expressions ({pitches.filter((p) => p.collaboration_id === item.id).length})</span>
            {pitches.filter((p) => p.collaboration_id === item.id && p.status === "pending").length > 0 && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-550"></span>
              </span>
            )}
          </button>
          <button
            onClick={() => handleEdit(item)}
            className="p-1.5 hover:bg-slate-150 text-blue-600 rounded-lg transition-colors cursor-pointer"
            title="Edit Draft"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAction(item.id, deleteCollaboration, "delete")}
            className="p-1 text-red-655 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete"
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
            <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0" />
            <span>Manage Strategic Collaborations</span>
          </h1>
          <p className="text-slate-655 mt-1">Configure and manage strategic partnerships, joint ventures, and alliances.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Listing</span>
        </button>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Collaborations</span>
            <span className="text-2xl font-extrabold text-slate-900 leading-none">{collaborations.length}</span>
          </div>
        </div>

        <div className={`border rounded-xl p-4 shadow-sm flex items-center gap-4 transition-colors bg-white ${
          pitches.filter((p) => p.status === "pending").length > 0
            ? "border-amber-300 ring-1 ring-amber-300 bg-amber-50/10"
            : "border-slate-200"
        }`}>
          <div className={`p-3 rounded-lg ${
            pitches.filter((p) => p.status === "pending").length > 0 ? "bg-amber-100 text-amber-600 animate-pulse" : "bg-slate-100 text-slate-500"
          }`}>
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Expressions to Review</span>
            <span className={`text-2xl font-extrabold leading-none ${pitches.filter((p) => p.status === "pending").length > 0 ? "text-amber-700" : "text-slate-900"}`}>
              {pitches.filter((p) => p.status === "pending").length}
            </span>
          </div>
        </div>
      </div>

      {collabError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {collabError}
        </div>
      )}
      {collabSuccess && (
        <div className="p-3 bg-emerald-550/10 border border-emerald-500/20 text-emerald-700 text-sm rounded-lg animate-pulse">
          {collabSuccess}
        </div>
      )}

      {/* Main Table list */}
      <DataTable
        columns={columns}
        data={collaborations}
        getRowId={(item) => item.id}
        expandedRowId={selectedColId || undefined}
        renderRowDetails={(collab) => {
          const collabPitches = pitches.filter((p) => p.collaboration_id === collab.id);
          return (
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-blue-600 rounded-full" />
                  <span>Expressions of Interest ({collabPitches.length})</span>
                </h4>
                <button
                  onClick={() => setSelectedColId(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Close Panel
                </button>
              </div>

              {collabPitches.length === 0 ? (
                <p className="text-xs text-slate-500 py-3">No expressions of interest submitted yet.</p>
              ) : (
                <div className="space-y-4">
                  {collabPitches.map((pitch) => (
                    <div key={pitch.id} className="bg-white border border-slate-200 p-4 rounded-lg space-y-3 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <span className="font-bold text-slate-900 text-sm">{pitch.profiles?.company_name || "Unspecified Org"}</span>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{pitch.profiles?.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 font-mono" suppressHydrationWarning>{new Date(pitch.created_at).toLocaleDateString()}</span>
                          <StatusBadge status={pitch.status} />
                        </div>
                      </div>

                      <p className="text-xs text-slate-705 leading-relaxed bg-slate-50/50 p-3 rounded border border-slate-200 whitespace-pre-wrap">
                        {pitch.message}
                      </p>

                      <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-150">
                        <button
                          onClick={() => handleUpdatePitchStatus(pitch.id, "approved")}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded cursor-pointer transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdatePitchStatus(pitch.id, "rejected")}
                          className="px-2.5 py-1 bg-red-550/10 bg-red-50 hover:bg-red-100 text-red-700 border border-red-250 text-xs font-semibold rounded cursor-pointer transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleUpdatePitchStatus(pitch.id, "reviewed")}
                          className="px-2.5 py-1 bg-slate-105 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold rounded cursor-pointer transition-colors"
                        >
                          Mark Reviewed
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      />

      {/* Action confirmation dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 capitalize">
              Confirm {confirmAction.actionName} Action
            </h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to {confirmAction.actionName} this collaboration listing?
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
              <h2 className="text-lg font-bold text-slate-900">
                {editingCol ? "Edit Collaboration Listing" : "Publish Collaboration Listing"}
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
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Opportunity Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Joint R&D partnership for EV battery cooling technology"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Description Details</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline alignment requirements, target expertise, and partnership resources..."
                  rows={4}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Industry Focus</label>
                <input
                  type="text"
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Automotive, Clean Energy, Chemicals"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Opportunity Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="partnerships">Partnership Requests</option>
                    <option value="delegations">Business Delegations</option>
                    <option value="tradeMissions">Trade Missions</option>
                    <option value="investment">Investment Opportunities</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Direction</label>
                  <input
                    type="text"
                    required
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                    placeholder="e.g. JAPAN → INDIA"
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kyoto, Japan or India"
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tiers Checkboxes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Visible Membership Tiers</label>
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

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Status</label>
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
                    editingCol ? "Update Listing" : "Publish"
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
