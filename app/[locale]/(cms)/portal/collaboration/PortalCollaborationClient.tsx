"use client";

import React, { useState, useTransition } from "react";
import { submitCollaborationInterest } from "@/features/cms/business/actions/collaborations";
import { EmptyState } from "@/components/ui/empty-state";
import { ShieldCheck, Calendar, X, Send, Check } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

type Collaboration = {
  id: string;
  title: string;
  description: string;
  industry: string;
};

type PortalCollaborationClientProps = {
  collaborations: Collaboration[];
  submittedInterests: { collaboration_id: string; status: string }[];
};

export default function PortalCollaborationClient({ collaborations, submittedInterests }: PortalCollaborationClientProps) {
  const [selectedCol, setSelectedCol] = useState<Collaboration | null>(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [collabSuccess, setCollabSuccess] = useState("");
  const [collabError, setCollabError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleClose = () => {
    setSelectedCol(null);
    setMessage("");
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setCollabError("");
    setCollabSuccess("");
    if (!selectedCol) return;

    if (!message || message.length < 10) {
      setErrors({ message: "Your message must be at least 10 characters." });
      return;
    }

    startTransition(async () => {
      const res = await submitCollaborationInterest({
        collaborationId: selectedCol.id,
        message,
      });

      if (res.success) {
        setCollabSuccess("Your expression of interest has been submitted successfully to JIBB administration.");
        setSelectedCol(null);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setErrors({ general: res.error || "Failed to submit pitch" });
      }
    });
  };

  if (collaborations.length === 0) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="No Collaboration Opportunities"
        description="There are no active strategic collaborations matching your membership tier at this moment."
      />
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Strategic Collaborations</h1>
        <p className="text-slate-600 mt-1">Review strategic alignment proposals and submit collaboration ideas.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collaborations.map((col) => {
          const interest = submittedInterests.find((item) => item.collaboration_id === col.id);
          const isSubmitted = !!interest;

          return (
            <div
              key={col.id}
              className="border border-slate-200 bg-white rounded-xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 shadow-sm transition-colors"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider border border-blue-200">
                    {col.industry}
                  </span>
                  {isSubmitted && (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Interest Submitted</span>
                      </span>
                      {interest.status && (
                        <StatusBadge status={interest.status} className="text-[10px] px-2 py-0.5 rounded uppercase font-bold" />
                      )}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">{col.title}</h3>
                <p className="text-sm text-slate-655 leading-relaxed line-clamp-3">{col.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-150 flex justify-end">
                <button
                  disabled={isSubmitted}
                  onClick={() => setSelectedCol(col)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      isSubmitted
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-[0.98]"
                    }`}
                >
                  {isSubmitted ? "Pitch Submitted" : "Express Interest"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Pitch Modal */}
      {selectedCol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
              <h2 className="text-lg font-bold text-slate-900">Express Collaboration Interest</h2>
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

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-600 text-xs space-y-1">
                <p className="font-semibold text-slate-900 text-sm">{selectedCol.title}</p>
                <p>Industry Sector: {selectedCol.industry}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Alignment Pitch</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Summarize your company's alignment with this proposal, requested resources, and joint benefits..."
                  rows={6}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none"
                />
                {errors.message && <p className="text-xs text-red-650">{errors.message}</p>}
              </div>

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
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  {isPending ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Alignment Pitch</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
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
