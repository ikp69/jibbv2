"use client";

import React, { useState, useTransition } from "react";
import { Plane, Compass, FileCheck, Landmark, Users, Calendar, Plus, Clock, CheckCircle2, XCircle, AlertCircle, FileText } from "lucide-react";
import { submitSpecialProgramApplication } from "@/features/cms/business/actions/special-programs";
import { useRouter } from "next/navigation";

type Application = {
  id: string;
  member_id: string;
  form_type: string;
  status: "pending" | "approved" | "rejected";
  data: {
    sector: string;
    preferredDates: string;
    interests: string[];
    delegateCount: number;
    comments?: string;
  };
  created_at: string;
};

type DelegationJapanClientProps = {
  initialApplications: Application[];
};

export default function DelegationJapanClient({ initialApplications }: DelegationJapanClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form States
  const [sector, setSector] = useState("");
  const [preferredDates, setPreferredDates] = useState("");
  const [delegateCount, setDelegateCount] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [comments, setComments] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckboxChange = (value: string) => {
    if (interests.includes(value)) {
      setInterests(interests.filter((item) => item !== value));
    } else {
      setInterests([...interests, value]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorMsg("");
    setSuccessMsg("");

    if (!sector) {
      setErrors({ sector: "Industry sector is required" });
      return;
    }
    if (!preferredDates) {
      setErrors({ preferredDates: "Preferred visit dates are required" });
      return;
    }
    if (interests.length === 0) {
      setErrors({ interests: "Please select at least one interest" });
      return;
    }

    startTransition(async () => {
      const res = await submitSpecialProgramApplication("delegation_japan", {
        sector,
        preferredDates,
        delegateCount,
        interests,
        comments: comments || undefined,
      });

      if (res.success) {
        setSuccessMsg("Japan delegation application submitted successfully.");
        setSector("");
        setPreferredDates("");
        setDelegateCount(1);
        setInterests([]);
        setComments("");
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
          <Plane className="w-8 h-8 text-blue-600 shrink-0" />
          <span>Delegation to Japan</span>
        </h1>
        <p className="text-slate-600 mt-1">Industrial study tours, matchmaking delegations, and governmental agency meetings in Japan.</p>
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
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Apply for Delegation</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry Sector</label>
                  <input
                    type="text"
                    placeholder="e.g. Clean Energy, Automotive, IT"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                  />
                  {errors.sector && <p className="text-xs text-red-500">{errors.sector}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preferred Travel Dates</label>
                  <input
                    type="text"
                    placeholder="e.g. November 2026 or Nov 10-17"
                    value={preferredDates}
                    onChange={(e) => setPreferredDates(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                  />
                  {errors.preferredDates && <p className="text-xs text-red-500">{errors.preferredDates}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Number of Delegates</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={delegateCount}
                  onChange={(e) => setDelegateCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Core Interests</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {[
                    { value: "itineraryCoordination", label: "Itinerary & Factory Visits" },
                    { value: "visaSupport", label: "Visa Support Letters" },
                    { value: "jetroMeetings", label: "JETRO & METI Roundtables" },
                    { value: "networkingReceptions", label: "VIP Networking Access" }
                  ].map((item) => (
                    <label key={item.value} className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={interests.includes(item.value)}
                        onChange={() => handleCheckboxChange(item.value)}
                        className="rounded border-slate-350 bg-white text-blue-600 focus:ring-blue-500/20 w-4 h-4 cursor-pointer"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
                {errors.interests && <p className="text-xs text-red-500">{errors.interests}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Objective of Visit</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Describe your goals: joint venture partners search, technology transfer, factory tour expectations..."
                  rows={4}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isPending ? "Submitting..." : "Apply For Study Tour"}</span>
              </button>
            </form>
          </div>

          {/* Submission history list */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Your Submitted Delegation Visits</span>
            </h3>

            {initialApplications.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No delegation applications submitted yet. Use the form to apply.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {initialApplications.map((app) => (
                  <div key={app.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Sector: {app.data.sector}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Preferred Dates: {app.data.preferredDates} &bull; Delegates: {app.data.delegateCount}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {app.data.interests.map((interest, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-[10px] text-slate-605 rounded border border-slate-200 uppercase font-semibold">
                          {interest.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      ))}
                    </div>
                    {app.data.comments && (
                      <p className="text-xs text-slate-605 bg-slate-50 p-2.5 rounded-lg border border-slate-150 leading-relaxed">
                        {app.data.comments}
                      </p>
                    )}
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
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Bilateral Tour Offerings</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Compass className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Itinerary Coordination</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Pre-vetted corporate site visits, travel logistics, and hotel coordinates in major business clusters (Tokyo, Osaka, Nagoya).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <FileCheck className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Visa & Entry Briefs</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Consolidated templates and visa processing support documentation.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Landmark className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>JETRO & METI Roundtables</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Forums and roundtable meetings with trade associations like JETRO and METI.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Users className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Networking Receptions</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Exclusive networking events connecting Indian delegators with Japanese partners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
