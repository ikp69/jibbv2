"use client";

import React, { useState, useTransition } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { createOpportunity, deleteOpportunity, updateOpportunityInterestStatus } from "@/features/cms/business/actions/opportunities";
import { Plus, X, Trash2, Calendar, FileText, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  industry: string;
  country: string;
  looking_for: string[];
  deadline: string;
  visible_tiers: string[];
  status: string;
};

type Pitch = {
  id: string;
  opportunity_id: string;
  message: string;
  supporting_document_url: string | null;
  status: string;
  created_at: string;
  profiles: {
    company_name: string | null;
    email: string | null;
  } | null;
};

type BusinessMatchingClientProps = {
  opportunities: Opportunity[];
  pitches: Pitch[];
};

export default function BusinessMatchingClient({ opportunities, pitches }: BusinessMatchingClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState<"Semiconductors" | "Manufacturing" | "Healthcare" | "Automotive" | "Electronics" | "Energy" | "Infrastructure" | "Food" | "General">("General");
  const [country, setCountry] = useState<"Japan" | "India" | "Both">("Both");
  const [lookingForText, setLookingForText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [visibleTiers, setVisibleTiers] = useState<string[]>(["associate"]);
  const [status, setStatus] = useState<"draft" | "published">("published");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    actionFn: (id: string) => Promise<any>;
    actionName: string;
  } | null>(null);
  const [matchingSuccess, setMatchingSuccess] = useState("");
  const [matchingError, setMatchingError] = useState("");

  const handleAction = (id: string, actionFn: (id: string) => Promise<any>, actionName: string) => {
    setConfirmAction({ id, actionFn, actionName });
  };

  const executeConfirmedAction = () => {
    if (!confirmAction) return;
    const { id, actionFn } = confirmAction;
    setConfirmAction(null);
    setMatchingError("");
    setMatchingSuccess("");

    startTransition(async () => {
      const res = await actionFn(id);
      if (res.success) {
        setMatchingSuccess("Opportunity deleted successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setMatchingError(res.error || "Failed to delete opportunity");
      }
    });
  };

  const handleUpdatePitchStatus = (pitchId: string, nextStatus: "pending" | "reviewed" | "approved" | "rejected") => {
    setMatchingError("");
    setMatchingSuccess("");

    startTransition(async () => {
      const res = await updateOpportunityInterestStatus(pitchId, nextStatus);
      if (res.success) {
        setMatchingSuccess(`Pitch status updated to ${nextStatus}.`);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setMatchingError(res.error || "Failed to update pitch status");
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
    setIndustry("General");
    setCountry("Both");
    setLookingForText("");
    setDeadline("");
    setVisibleTiers(["associate"]);
    setStatus("published");
    setErrors({});
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMatchingError("");
    setMatchingSuccess("");

    if (!title || !description || !lookingForText || !deadline) {
      setErrors({ general: "All fields are required." });
      return;
    }

    const lookingFor = lookingForText.split(",").map((s) => s.trim()).filter(Boolean);

    startTransition(async () => {
      const res = await createOpportunity({
        title,
        description,
        industry,
        country,
        lookingFor,
        deadline,
        visibleTiers: visibleTiers as any,
        status,
      });

      if (res.success) {
        setMatchingSuccess("Business Matching Opportunity published successfully.");
        setIsOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setErrors({ general: res.error || "Failed to create opportunity" });
      }
    });
  };

  const columns: ColumnDef<Opportunity>[] = [
    {
      header: "Opportunity Title",
      accessorKey: "title",
      cell: (item) => (
        <div>
          <span className="font-bold text-slate-900 block">{item.title}</span>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
        </div>
      ),
    },
    {
      header: "Sector & Region",
      accessorKey: "industry",
      cell: (item) => (
        <div>
          <span className="text-xs font-semibold text-slate-800">{item.industry}</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Focus: {item.country}</p>
        </div>
      ),
    },
    {
      header: "Requirements",
      accessorKey: "looking_for",
      cell: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.looking_for.map((tag, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-[10px] text-slate-600 rounded border border-slate-200">
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Deadline",
      accessorKey: "deadline",
      cell: (item) => (
        <span className="text-xs font-mono text-slate-550" suppressHydrationWarning>{new Date(item.deadline).toLocaleDateString()}</span>
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
            onClick={() => setSelectedOppId(selectedOppId === item.id ? null : item.id)}
            className="px-2.5 py-1 bg-slate-105 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            Pitches ({pitches.filter((p) => p.opportunity_id === item.id).length})
          </button>
          <button
            onClick={() => handleAction(item.id, deleteOpportunity, "delete")}
            className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Business Matching</h1>
          <p className="text-slate-655 mt-1">Configure cross-border matching opportunities and review member pitch letters.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Opportunity</span>
        </button>
      </div>

      {matchingError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {matchingError}
        </div>
      )}
      {matchingSuccess && (
        <div className="p-3 bg-emerald-550/10 border border-emerald-500/20 text-emerald-700 text-sm rounded-lg animate-pulse">
          {matchingSuccess}
        </div>
      )}

      {/* Main Table list */}
      <DataTable
        columns={columns}
        data={opportunities}
        getRowId={(item) => item.id}
        expandedRowId={selectedOppId || undefined}
        renderRowDetails={(opp) => {
          const oppPitches = pitches.filter((p) => p.opportunity_id === opp.id);
          return (
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-blue-600 rounded-full" />
                  <span>Submitted Pitches ({oppPitches.length})</span>
                </h4>
                <button
                  onClick={() => setSelectedOppId(null)}
                  className="text-xs font-semibold text-slate-505 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Close Panel
                </button>
              </div>

              {oppPitches.length === 0 ? (
                <p className="text-xs text-slate-500 py-3">No pitches submitted for this opportunity yet.</p>
              ) : (
                <div className="space-y-4">
                  {oppPitches.map((pitch) => (
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

                      {pitch.supporting_document_url && (
                        <div className="text-xs">
                          <span className="text-slate-500 font-semibold">Supporting File: </span>
                          <a
                            href={pitch.supporting_document_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-605 hover:underline font-mono font-medium"
                          >
                            View Attachment
                          </a>
                        </div>
                      )}

                      <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-150">
                        <button
                          onClick={() => handleUpdatePitchStatus(pitch.id, "approved")}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-250 text-xs font-semibold rounded cursor-pointer transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdatePitchStatus(pitch.id, "rejected")}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded cursor-pointer transition-colors"
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
              Are you sure you want to {confirmAction.actionName} this opportunity?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-505 hover:text-slate-800 transition-colors cursor-pointer"
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
              <h2 className="text-lg font-bold text-slate-900">Publish Business Opportunity</h2>
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
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Opportunity Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Seeking Semiconductor wafer production machinery partner"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description Details</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe details of technology required, timeline, and company credentials..."
                  rows={4}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry Sector</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="Semiconductors">Semiconductors</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Energy">Energy</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Food">Food</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Region</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="Japan">Japan</option>
                    <option value="India">India</option>
                    <option value="Both">Both Regions</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 rounded-lg text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Requirements (Comma Separated)</label>
                  <input
                    type="text"
                    required
                    value={lookingForText}
                    onChange={(e) => setLookingForText(e.target.value)}
                    placeholder="e.g. Machinery, Export License, Joint Venture"
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
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
                    "Publish"
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
