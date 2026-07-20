"use client";

import React, { useState, useTransition } from "react";
import { Users, Presentation, Calendar, Briefcase, Award, Plus, Clock, CheckCircle2, XCircle, AlertCircle, FileText } from "lucide-react";
import { submitSpecialProgramApplication } from "@/features/cms/business/actions/special-programs";
import { useRouter } from "next/navigation";

type Application = {
  id: string;
  member_id: string;
  form_type: string;
  status: "pending" | "approved" | "rejected";
  data: {
    targetDelegation: string;
    pitchPurpose: string;
    showcaseDetails: string;
    preferredTimeSlot: string;
  };
  created_at: string;
};

type DelegationMeetClientProps = {
  initialApplications: Application[];
};

export default function DelegationMeetClient({ initialApplications }: DelegationMeetClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form States
  const [targetDelegation, setTargetDelegation] = useState("");
  const [pitchPurpose, setPitchPurpose] = useState("");
  const [showcaseDetails, setShowcaseDetails] = useState("");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorMsg("");
    setSuccessMsg("");

    let newErrors: Record<string, string> = {};
    if (!targetDelegation) {
      newErrors.targetDelegation = "Target delegation is required";
    }
    if (!preferredTimeSlot) {
      newErrors.preferredTimeSlot = "Preferred time slot is required";
    }
    if (pitchPurpose.length < 10) {
      newErrors.pitchPurpose = "Pitch must be at least 10 characters";
    }
    if (showcaseDetails.length < 10) {
      newErrors.showcaseDetails = "Details must be at least 10 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    startTransition(async () => {
      const res = await submitSpecialProgramApplication("delegation_meet", {
        targetDelegation,
        pitchPurpose,
        showcaseDetails,
        preferredTimeSlot,
      });

      if (res.success) {
        setSuccessMsg("B2B meeting request submitted successfully.");
        setTargetDelegation("");
        setPitchPurpose("");
        setShowcaseDetails("");
        setPreferredTimeSlot("");
        router.refresh();
      } else {
        setErrorMsg(res.error || "Failed to submit request.");
      }
    });
  };

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-2.5 py-0.5 rounded bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Acknowledged</span>
          </span>
        );

      case "rejected":
        return (
          <span className="px-2.5 py-0.5 rounded bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <XCircle className="w-3.5 h-3.5" />
            <span>Not Approved</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <Clock className="w-3.5 h-3.5 animate-pulse text-amber-500" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-600 shrink-0" />
          <span>Japan Delegations (Inbound)</span>
        </h1>
        <p className="text-slate-600 mt-1">Networking summits and B2B matches with incoming Japanese government and industry delegations.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle Column: Form & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick application form */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Apply for Meeting</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Inbound Delegation</label>
                  <input
                    type="text"
                    placeholder="e.g. Kansai Clean-Tech Trade Mission"
                    value={targetDelegation}
                    onChange={(e) => setTargetDelegation(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                  />
                  {errors.targetDelegation && <p className="text-xs text-red-500">{errors.targetDelegation}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preferred Time Slot</label>
                  <input
                    type="text"
                    placeholder="e.g. July 25th Afternoon or 2:00 PM"
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                  />
                  {errors.preferredTimeSlot && <p className="text-xs text-red-500">{errors.preferredTimeSlot}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pitch Purpose & Objective</label>
                <textarea
                  value={pitchPurpose}
                  onChange={(e) => setPitchPurpose(e.target.value)}
                  placeholder="Provide a clear outline of why your company should meet this visiting Japanese group..."
                  rows={4}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none resize-none transition-colors"
                />
                {errors.pitchPurpose && <p className="text-xs text-red-500">{errors.pitchPurpose}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Products & Services to Showcase</label>
                <textarea
                  value={showcaseDetails}
                  onChange={(e) => setShowcaseDetails(e.target.value)}
                  placeholder="Details of products, case studies, technologies, or industrial plants you want to display..."
                  rows={4}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none resize-none transition-colors"
                />
                {errors.showcaseDetails && <p className="text-xs text-red-500">{errors.showcaseDetails}</p>}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isPending ? "Submitting..." : "Apply For B2B Meeting"}</span>
              </button>
            </form>
          </div>

          {/* Submission history list */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Your B2B Meeting Requests</span>
            </h3>

            {initialApplications.length === 0 ? (
              <p className="text-xs text-slate-505 italic">No inbound B2B meeting requests submitted yet. Use the form to apply.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {initialApplications.map((app) => (
                  <div key={app.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Delegation: {app.data.targetDelegation}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Preferred Slot: {app.data.preferredTimeSlot}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs text-slate-655"><span className="font-bold text-slate-700">Pitch Purpose:</span> {app.data.pitchPurpose}</p>
                      <p className="text-xs text-slate-655"><span className="font-bold text-slate-700">Showcase Products:</span> {app.data.showcaseDetails}</p>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono" suppressHydrationWarning>
                      Submitted: {new Date(app.created_at).toLocaleString("en-US")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side / Sidebar: Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Matchmaking Offerings</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Presentation className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Delegation Pitch Deck</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Submit company profiles and business capabilities directly to incoming trade delegations.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Calendar className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>B2B Scheduler</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Book 1-on-1 interview slots with visiting Japanese executives and coordinators.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Briefcase className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Targeted Sectors</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Receive alerts when incoming delegations match specific manufacturing fields.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Award className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>VIP Networking Access</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Exclusive dinner invitations and reception passes for Gold and Platinum tiers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
