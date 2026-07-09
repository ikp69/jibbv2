"use client";

import React, { useState, useTransition } from "react";
import { submitOpportunityInterest, submitMatchingProposal } from "@/features/cms/business/actions/opportunities";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase, Calendar, MapPin, Send, X, Check, PlusCircle, ArrowRight } from "lucide-react";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  industry: string;
  country: string;
  looking_for: string[];
  deadline: string;
};

type SubmittedPitch = {
  opportunity_id: string;
  message: string;
  supporting_document_url: string | null;
  status: string;
};

type PortalBusinessMatchingClientProps = {
  opportunities: Opportunity[];
  submittedPitches: SubmittedPitch[];
};

export default function PortalBusinessMatchingClient({ opportunities, submittedPitches }: PortalBusinessMatchingClientProps) {
  // Propose Match Form State
  const [showProposeForm, setShowProposeForm] = useState(false);
  const [propTitle, setPropTitle] = useState("");
  const [propDesc, setPropDesc] = useState("");
  const [propIndustry, setPropIndustry] = useState<"Semiconductors" | "Manufacturing" | "Healthcare" | "Automotive" | "Electronics" | "Energy" | "Infrastructure" | "Food" | "General">("General");
  const [propCountry, setPropCountry] = useState<"Japan" | "India" | "Both">("Both");
  const [propLookingForText, setPropLookingForText] = useState("");
  const [propDeadline, setPropDeadline] = useState("");

  // Express Pitch Interest Modal State
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [pitchMessage, setPitchMessage] = useState("");
  const [pitchDocUrl, setPitchDocUrl] = useState("");

  // View Pitch Modal State
  const [viewPitch, setViewPitch] = useState<SubmittedPitch | null>(null);
  const [viewPitchOpp, setViewPitchOpp] = useState<Opportunity | null>(null);

  // Errors / Success States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [matchingSuccess, setMatchingSuccess] = useState("");
  const [matchingError, setMatchingError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleClosePitchModal = () => {
    setSelectedOpp(null);
    setPitchMessage("");
    setPitchDocUrl("");
    setErrors({});
  };

  const handleCloseProposeForm = () => {
    setPropTitle("");
    setPropDesc("");
    setPropIndustry("General");
    setPropCountry("Both");
    setPropLookingForText("");
    setPropDeadline("");
    setErrors({});
    setShowProposeForm(false);
  };

  // Submit Member Proposal
  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMatchingError("");
    setMatchingSuccess("");

    if (!propTitle || !propDesc || !propLookingForText || !propDeadline) {
      setErrors({ proposal: "All fields are required." });
      return;
    }

    const lookingFor = propLookingForText.split(",").map((s) => s.trim()).filter(Boolean);

    startTransition(async () => {
      const res = await submitMatchingProposal({
        title: propTitle,
        description: propDesc,
        industry: propIndustry,
        country: propCountry,
        lookingFor,
        deadline: propDeadline,
        visibleTiers: ["associate", "silver", "gold", "platinum"],
        status: "pending_approval",
      });

      if (res.success) {
        setMatchingSuccess("Your matching proposal has been submitted to JIBB admin for approval. Once approved, it will be active on the dashboard.");
        handleCloseProposeForm();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErrors({ proposal: res.error || "Failed to submit proposal" });
      }
    });
  };

  // Submit Pitch/Interest on other member's opportunity
  const handlePitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMatchingError("");
    setMatchingSuccess("");
    if (!selectedOpp) return;

    if (!pitchMessage || pitchMessage.length < 10) {
      setErrors({ message: "Your pitch message must be at least 10 characters." });
      return;
    }

    startTransition(async () => {
      const res = await submitOpportunityInterest({
        opportunityId: selectedOpp.id,
        message: pitchMessage,
        supportingDocumentUrl: pitchDocUrl || undefined,
      });

      if (res.success) {
        setMatchingSuccess("Your partnership expression of interest was submitted successfully.");
        setSelectedOpp(null);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setErrors({ pitch: res.error || "Failed to submit pitch" });
      }
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Business Matching</h1>
          <p className="text-slate-600 mt-1">Submit matching proposals or connect with active approved opportunities.</p>
        </div>
        <button
          onClick={() => setShowProposeForm(!showProposeForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md cursor-pointer transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Propose a Match</span>
        </button>
      </div>

      {matchingError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {matchingError}
        </div>
      )}
      {matchingSuccess && (
        <div className="p-3 bg-emerald-550/10 border border-emerald-500/20 text-emerald-700 text-sm rounded-lg">
          {matchingSuccess}
        </div>
      )}

      {/* Propose Form Section */}
      {showProposeForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md animate-none">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span>Submit Matching Proposal</span>
            </h2>
            <button onClick={handleCloseProposeForm} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleProposeSubmit} className="space-y-4">
            {errors.proposal && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {errors.proposal}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">What are you looking for? (Proposal Title)</label>
              <input
                type="text"
                required
                value={propTitle}
                onChange={(e) => setPropTitle(e.target.value)}
                placeholder="e.g. Seeking high-volume steel distributors in Maharashtra"
                className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Detailed Proposal (How, Why, What, When)</label>
              <textarea
                required
                value={propDesc}
                onChange={(e) => setPropDesc(e.target.value)}
                placeholder="Describe your goals: What is the partnership model? How will it operate? Why should partners collaborate? What is the expected timeline?"
                rows={5}
                className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Industry Sector</label>
                <select
                  value={propIndustry}
                  onChange={(e) => setPropIndustry(e.target.value as any)}
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
                  value={propCountry}
                  onChange={(e) => setPropCountry(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none"
                >
                  <option value="Japan">Japan</option>
                  <option value="India">India</option>
                  <option value="Both">Both Regions</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-555 uppercase tracking-wider">Deadline for Proposals</label>
                <input
                  type="date"
                  required
                  value={propDeadline}
                  onChange={(e) => setPropDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-555 uppercase tracking-wider">Match Keywords / Needs (Comma Separated)</label>
                <input
                  type="text"
                  required
                  value={propLookingForText}
                  onChange={(e) => setPropLookingForText(e.target.value)}
                  placeholder="e.g. Distribution networks, Warehouse, Logistics"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCloseProposeForm}
                className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                {isPending ? "Submitting..." : "Submit Matching Proposal"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Marketplace Opportunities Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <span>Active Approved Matchings</span>
        </h2>

        {opportunities.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No Matching Opportunities"
            description="There are currently no active approved matching opportunities. Be the first to submit a proposal!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opp) => {
              const userPitch = submittedPitches.find((p) => p.opportunity_id === opp.id);
              const isSubmitted = !!userPitch;

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
                        <span className="px-2 py-0.5 bg-emerald-550/10 border border-emerald-500/20 text-emerald-700 text-[10px] font-bold rounded flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Interest Submitted</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">{opp.title}</h3>
                    <p className="text-sm text-slate-655 leading-relaxed whitespace-pre-wrap">{opp.description}</p>
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

                      {isSubmitted ? (
                        <button
                          onClick={() => {
                            setViewPitch(userPitch);
                            setViewPitchOpp(opp);
                          }}
                          className="px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-sm"
                        >
                          View My Pitch
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedOpp(opp)}
                          className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-[0.98] cursor-pointer"
                        >
                          Express Interest
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Express Pitch Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
              <h2 className="text-lg font-bold text-slate-900">Express Partnership Interest</h2>
              <button onClick={handleClosePitchModal} className="text-slate-500 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePitchSubmit} className="p-6 space-y-4">
              {errors.pitch && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {errors.pitch}
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
                  value={pitchMessage}
                  onChange={(e) => setPitchMessage(e.target.value)}
                  placeholder="Explain why your company is a match, how you fit the required criteria, and target collaboration benefits..."
                  rows={5}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none resize-none"
                />
                {errors.message && <p className="text-xs text-red-650">{errors.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Supporting File / Deck URL (Optional)</label>
                <input
                  type="url"
                  value={pitchDocUrl}
                  onChange={(e) => setPitchDocUrl(e.target.value)}
                  placeholder="https://example.com/company-pitch.pdf"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={handleClosePitchModal}
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
                      <span>Submit Pitch Interest</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Submitted Pitch Modal */}
      {viewPitch && viewPitchOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
              <h2 className="text-lg font-bold text-slate-900">Your Submitted Pitch</h2>
              <button 
                onClick={() => { setViewPitch(null); setViewPitchOpp(null); }} 
                className="text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-slate-700">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1">
                <p className="font-semibold text-slate-900 text-sm">{viewPitchOpp.title}</p>
                <p className="text-xs text-slate-500">Industry Sector: {viewPitchOpp.industry} | Country: {viewPitchOpp.country}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Your Pitch Message</span>
                <p className="bg-slate-50/50 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap leading-relaxed">
                  {viewPitch.message}
                </p>
              </div>

              {viewPitch.supporting_document_url && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Supporting Document</span>
                  <a
                    href={viewPitch.supporting_document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <span>View Submitted File</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-150">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pitch Status:</span>
                  <StatusBadge status={viewPitch.status} />
                </div>
                <button
                  type="button"
                  onClick={() => { setViewPitch(null); setViewPitchOpp(null); }}
                  className="px-4 py-2 text-sm font-semibold text-slate-505 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
