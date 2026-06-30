"use client";

import React, { useState, useTransition } from "react";
import { submitOpportunityInterest } from "@/features/cms/business/actions/opportunities";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase, Calendar, MapPin, Send, HelpCircle, X, Check } from "lucide-react";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  industry: string;
  country: string;
  looking_for: string[];
  deadline: string;
};

type PortalBusinessMatchingClientProps = {
  opportunities: Opportunity[];
  submittedIds: string[];
};

export default function PortalBusinessMatchingClient({ opportunities, submittedIds }: PortalBusinessMatchingClientProps) {
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [message, setMessage] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [matchingSuccess, setMatchingSuccess] = useState("");
  const [matchingError, setMatchingError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleClose = () => {
    setSelectedOpp(null);
    setMessage("");
    setDocUrl("");
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMatchingError("");
    setMatchingSuccess("");
    if (!selectedOpp) return;

    if (!message || message.length < 10) {
      setErrors({ message: "Your pitch message must be at least 10 characters." });
      return;
    }

    startTransition(async () => {
      const res = await submitOpportunityInterest({
        opportunityId: selectedOpp.id,
        message,
        supportingDocumentUrl: docUrl || undefined,
      });

      if (res.success) {
        setMatchingSuccess("Your expression of interest has been submitted successfully to JIBB administration.");
        setSelectedOpp(null);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setErrors({ general: res.error || "Failed to submit pitch" });
      }
    });
  };

  if (opportunities.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="No Opportunities Available"
        description="There are no active matching opportunities matching your membership tier at this moment."
      />
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bilateral Business Matching</h1>
        <p className="text-slate-600 mt-1">Browse industrial partnership requests and submit pitch inquiries directly.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opportunities.map((opp) => {
          const isSubmitted = submittedIds.includes(opp.id);

          return (
            <div
              key={opp.id}
              className="border border-slate-200 bg-white rounded-xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 shadow-sm transition-colors"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider border border-blue-200">
                    {opp.industry}
                  </span>
                  {isSubmitted && (
                    <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Interest Submitted</span>
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">{opp.title}</h3>
                <p className="text-sm text-slate-655 leading-relaxed line-clamp-3">{opp.description}</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {opp.looking_for.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-xs text-slate-600 rounded border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-150">
                  <div className="flex items-center gap-1.5 text-xs text-slate-505 font-mono">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span suppressHydrationWarning>Expires: {new Date(opp.deadline).toLocaleDateString()}</span>
                  </div>

                  <button
                    disabled={isSubmitted}
                    onClick={() => setSelectedOpp(opp)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      isSubmitted
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-[0.98]"
                    }`}
                  >
                    {isSubmitted ? "Pitch Submitted" : "Submit Pitch"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Pitch Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
              <h2 className="text-lg font-bold text-slate-900">Express Partnership Interest</h2>
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
                <p className="font-semibold text-slate-900 text-sm">{selectedOpp.title}</p>
                <p>Industry Sector: {selectedOpp.industry} | Country: {selectedOpp.country}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Pitch Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain why your company is a match, your alignment credentials, and target alignment..."
                  rows={5}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none"
                />
                {errors.message && <p className="text-xs text-red-650">{errors.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Supporting File / Deck URL (Optional)</label>
                <input
                  type="url"
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  placeholder="https://example.com/company-presentation.pdf"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
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
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-550 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  {isPending ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Inquiries</span>
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
