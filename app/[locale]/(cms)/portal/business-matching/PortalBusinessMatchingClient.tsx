"use client";

import React, { useState, useTransition } from "react";
import { submitOpportunityInterest, submitMatchingProposal, updateMatchingProposal } from "@/features/cms/business/actions/opportunities";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase, Calendar, MapPin, Send, X, Check, PlusCircle, ArrowRight, Edit3, Lock, Inbox } from "lucide-react";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  industry: string;
  country: string;
  looking_for: string[];
  deadline: string;
  created_at?: string;
};

type ProposerOpportunity = Opportunity & {
  status: string;
  visible_tiers: string[];
};

type SubmittedPitch = {
  opportunity_id: string;
  message: string;
  supporting_document_url: string | null;
  status: string;
};

type Pitch = {
  id: string;
  opportunity_id: string;
  opportunity_title: string;
  message: string;
  supporting_document_url: string | null;
  status: string;
  created_at: string;
  profiles: {
    company_name: string | null;
    email: string | null;
  } | null;
};

type PortalBusinessMatchingClientProps = {
  opportunities: Opportunity[];
  submittedPitches: SubmittedPitch[];
  myProposals: ProposerOpportunity[];
  pitchesOnMyProposals: Pitch[];
};

const getDaysLeft = (deadlineStr: string) => {
  const deadline = new Date(deadlineStr);
  const today = new Date();
  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Expired";
  if (diffDays === 0) return "Expires today";
  if (diffDays === 1) return "1 day left";
  return `${diffDays} days left`;
};

export default function PortalBusinessMatchingClient({
  opportunities,
  submittedPitches,
  myProposals,
  pitchesOnMyProposals
}: PortalBusinessMatchingClientProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "my-corner">("browse");
  const [expandedProposals, setExpandedProposals] = useState<Record<string, boolean>>({});

  const toggleProposalExpand = (id: string) => {
    setExpandedProposals((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Propose Match Form State (Used for both Create and Edit)
  const [showProposeForm, setShowProposeForm] = useState(false);
  const [editingOpp, setEditingOpp] = useState<ProposerOpportunity | null>(null);

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
    setEditingOpp(null);
    setPropTitle("");
    setPropDesc("");
    setPropIndustry("General");
    setPropCountry("Both");
    setPropLookingForText("");
    setPropDeadline("");
    setErrors({});
    setShowProposeForm(false);
  };

  const handleOpenEditProposal = (opp: ProposerOpportunity) => {
    setEditingOpp(opp);
    setPropTitle(opp.title);
    setPropDesc(opp.description);
    setPropIndustry(opp.industry as any);
    setPropCountry(opp.country as any);
    setPropLookingForText(opp.looking_for.join(", "));
    if (opp.deadline) {
      setPropDeadline(new Date(opp.deadline).toISOString().split("T")[0]);
    }
    setShowProposeForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit Member Proposal (Insert or Update)
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
      const payload = {
        title: propTitle,
        description: propDesc,
        industry: propIndustry,
        country: propCountry,
        lookingFor,
        deadline: propDeadline,
        visibleTiers: (editingOpp ? editingOpp.visible_tiers : ["associate", "silver", "gold", "platinum"]) as any,
        status: (editingOpp ? editingOpp.status : "pending_approval") as any,
      };

      const res = editingOpp
        ? await updateMatchingProposal(editingOpp.id, payload)
        : await submitMatchingProposal(payload);

      if (res.success) {
        setMatchingSuccess(editingOpp
          ? "Your proposal has been updated successfully."
          : "Your matching proposal has been submitted to JIBB admin for approval. Once approved, it will be active on the dashboard."
        );
        handleCloseProposeForm();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
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
    <div className="space-y-6 font-sans text-slate-850">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Business Matching</h1>
          <p className="text-slate-600 mt-1">Submit matching proposals or connect with active approved opportunities.</p>
        </div>
        <button
          onClick={() => {
            if (showProposeForm) handleCloseProposeForm();
            else setShowProposeForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md cursor-pointer transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Propose a Match</span>
        </button>
      </div>

      {matchingError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg animate-fade-in">
          {matchingError}
        </div>
      )}
      {matchingSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 text-sm rounded-lg animate-fade-in">
          {matchingSuccess}
        </div>
      )}

      {/* Propose/Edit Form Section */}
      {showProposeForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span>{editingOpp ? "Edit Matching Proposal" : "Submit Matching Proposal"}</span>
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
                {isPending ? "Submitting..." : editingOpp ? "Save Changes" : "Submit Matching Proposal"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("browse")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${activeTab === "browse"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
        >
          Browse Opportunities ({opportunities.length})
        </button>
        <button
          onClick={() => setActiveTab("my-corner")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${activeTab === "my-corner"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
        >
          My Proposals & Pitch Inbox
        </button>
      </div>

      {/* Browse tab view */}
      {activeTab === "browse" && (
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
                    className="border border-slate-200 bg-white rounded-xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-350 shadow-sm transition-colors"
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
                      <div>
                        <p className={`text-sm text-slate-600 leading-relaxed whitespace-pre-wrap ${!!expandedProposals[opp.id] ? "" : "line-clamp-4"}`}>
                          {opp.description}
                        </p>
                        {opp.description && opp.description.length > 200 && (
                          <button
                            onClick={() => toggleProposalExpand(opp.id)}
                            className="text-xs text-blue-650 hover:text-blue-850 font-bold mt-1.5 focus:outline-none cursor-pointer"
                          >
                            {!!expandedProposals[opp.id] ? "Show Less" : "Read More..."}
                          </button>
                        )}
                      </div>
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
                        <div className="flex flex-col gap-1 text-xs text-slate-500 font-mono">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                            <span suppressHydrationWarning>Expires: {new Date(opp.deadline).toLocaleDateString()} ({getDaysLeft(opp.deadline)})</span>
                          </div>
                          {opp.created_at && (
                            <span className="text-[10px] text-slate-400 pl-5.5" suppressHydrationWarning>
                              Added: {new Date(opp.created_at).toLocaleDateString()}
                            </span>
                          )}
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
      )}

      {/* My corner tab view */}
      {activeTab === "my-corner" && (
        <div className="space-y-8">
          {/* Section 1: My Proposed Matchings */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span>My Matching Proposals</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Manage proposals you have submitted. Editing is permitted only while review is pending approval.</p>

            {myProposals.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-slate-500 text-sm bg-white">
                You have not submitted any matching proposals yet. Click &quot;Propose a Match&quot; to begin.
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 h-11">
                        <th className="px-4 py-3">Proposal Details</th>
                        <th className="px-4 py-3">Sector & Region</th>
                        <th className="px-4 py-3">Deadline</th>
                        <th className="px-4 py-3">Approval Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 text-slate-700">
                      {myProposals.map((opp) => {
                        const isExpanded = !!expandedProposals[opp.id];
                        const isLong = opp.description && opp.description.length > 100;
                        return (
                          <tr key={opp.id} className="hover:bg-slate-50/50 transition-colors align-top">
                            <td className="px-4 py-3 max-w-md">
                              <span className="font-bold text-slate-900 block leading-tight">{opp.title}</span>
                              <div className="mt-1">
                                <p className={`text-xs text-slate-600 leading-relaxed whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-2"}`}>
                                  {opp.description}
                                </p>
                                {isLong && (
                                  <button
                                    onClick={() => toggleProposalExpand(opp.id)}
                                    className="text-[11px] text-blue-650 hover:text-blue-850 font-bold mt-1 focus:outline-none cursor-pointer inline-flex items-center"
                                  >
                                    {isExpanded ? "Show Less" : "Read More..."}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs font-semibold text-slate-800">{opp.industry}</span>
                              <p className="text-[10px] text-slate-500">Focus: {opp.country}</p>
                            </td>
                            <td className="px-4 py-3 text-xs font-mono">
                              <span suppressHydrationWarning>{new Date(opp.deadline).toLocaleDateString()}</span>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={opp.status} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              {opp.status === "pending_approval" ? (
                                <button
                                  onClick={() => handleOpenEditProposal(opp)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit Proposal</span>
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-slate-450 bg-slate-100 px-2.5 py-1 rounded-lg border border-transparent font-medium" title="Once approved or declined, modifications are locked.">
                                  <Lock className="w-3 h-3" />
                                  <span>Locked</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Pitches Inbox */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Inbox className="w-5 h-5 text-blue-600" />
              <span>Incoming Pitches Inbox</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Review expressions of interest submitted by other JIBB members on your approved matching opportunities.</p>

            {pitchesOnMyProposals.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-slate-500 text-sm bg-white">
                No pitches have been submitted on your listings yet. Approved proposals will accumulate incoming pitches here.
              </div>
            ) : (
              <div className="space-y-4">
                {pitchesOnMyProposals.map((pitch) => (
                  <div key={pitch.id} className="bg-white border border-slate-200 p-5 rounded-xl space-y-3 shadow-sm hover:border-slate-350 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-2.5">
                      <div>
                        <span className="text-xs font-semibold text-blue-600 block uppercase tracking-wider">Opportunity Title: {pitch.opportunity_title}</span>
                        <span className="font-bold text-slate-900 text-sm mt-1 block">From: {pitch.profiles?.company_name || "Unspecified Organization"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 font-mono" suppressHydrationWarning>{new Date(pitch.created_at).toLocaleDateString()}</span>
                        <StatusBadge status={pitch.status} />
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap">
                      {pitch.message}
                    </p>

                    {pitch.supporting_document_url && (
                      <div className="text-xs flex items-center gap-1">
                        <span className="text-slate-500 font-semibold">Supporting Document: </span>
                        <a
                          href={pitch.supporting_document_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-650 hover:underline font-mono"
                        >
                          View Deck / File
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
