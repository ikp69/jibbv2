"use client";

import React, { useState, useTransition } from "react";
import { HelpCircle, Map, Landmark, Calendar, MessageSquare, Plus, Clock, CheckCircle2, XCircle, AlertCircle, FileText } from "lucide-react";
import { submitSpecialProgramApplication } from "@/features/cms/business/actions/special-programs";
import { useRouter } from "next/navigation";

type Application = {
  id: string;
  member_id: string;
  form_type: string;
  status: "pending" | "approved" | "rejected";
  data: {
    exhibitionName: string;
    participationType: "exhibitor" | "visitor" | "speaker" | "other";
    supportNeeded: string[];
    preferredDate: string;
    comments?: string;
  };
  created_at: string;
};

type ExhibitionSupportClientProps = {
  initialApplications: Application[];
};

export default function ExhibitionSupportClient({ initialApplications }: ExhibitionSupportClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form States
  const [exhibitionName, setExhibitionName] = useState("");
  const [participationType, setParticipationType] = useState<"exhibitor" | "visitor" | "speaker" | "other">("exhibitor");
  const [supportNeeded, setSupportNeeded] = useState<string[]>([]);
  const [preferredDate, setPreferredDate] = useState("");
  const [comments, setComments] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckboxChange = (value: string) => {
    if (supportNeeded.includes(value)) {
      setSupportNeeded(supportNeeded.filter((item) => item !== value));
    } else {
      setSupportNeeded([...supportNeeded, value]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorMsg("");
    setSuccessMsg("");

    if (!exhibitionName) {
      setErrors({ exhibitionName: "Exhibition name is required" });
      return;
    }
    if (!preferredDate) {
      setErrors({ preferredDate: "Preferred date/timeframe is required" });
      return;
    }
    if (supportNeeded.length === 0) {
      setErrors({ supportNeeded: "Please select at least one type of support" });
      return;
    }

    startTransition(async () => {
      const res = await submitSpecialProgramApplication("exhibition_support", {
        exhibitionName,
        participationType,
        supportNeeded,
        preferredDate,
        comments: comments || undefined,
      });

      if (res.success) {
        setSuccessMsg("Exhibition support request submitted successfully.");
        setExhibitionName("");
        setParticipationType("exhibitor");
        setSupportNeeded([]);
        setPreferredDate("");
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
          <HelpCircle className="w-8 h-8 text-blue-600 shrink-0" />
          <span>Exhibition & Event Support</span>
        </h1>
        <p className="text-slate-600 mt-1">Bilateral trade fair participation assistance, pavilion coordination, and local logistics support.</p>
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
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Apply for Support</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Exhibition Name</label>
                  <input
                    type="text"
                    placeholder="e.g. India Mobile Congress 2026"
                    value={exhibitionName}
                    onChange={(e) => setExhibitionName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                  />
                  {errors.exhibitionName && <p className="text-xs text-red-500">{errors.exhibitionName}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Participation Type</label>
                  <select
                    value={participationType}
                    onChange={(e) => setParticipationType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="exhibitor">Exhibitor</option>
                    <option value="visitor">Visitor</option>
                    <option value="speaker">Speaker</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preferred Date / Timeframe</label>
                <input
                  type="text"
                  placeholder="e.g. October 15-18, 2026"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                />
                {errors.preferredDate && <p className="text-xs text-red-500">{errors.preferredDate}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Support Needed</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {[
                    { value: "pavilionCoordination", label: "Pavilion Coordination" },
                    { value: "subsidyGrants", label: "Subsidy & Grants Support" },
                    { value: "b2bMeetings", label: "B2B Meetings Schedules" },
                    { value: "interpreters", label: "Bilingual Interpreters" }
                  ].map((item) => (
                    <label key={item.value} className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={supportNeeded.includes(item.value)}
                        onChange={() => handleCheckboxChange(item.value)}
                        className="rounded border-slate-350 bg-white text-blue-600 focus:ring-blue-500/20 w-4 h-4 cursor-pointer"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
                {errors.supportNeeded && <p className="text-xs text-red-500">{errors.supportNeeded}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Special Requests / Comments</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Describe your stand dimensions, custom interpreter request or other specifics..."
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
                <span>{isPending ? "Submitting..." : "Apply For Support"}</span>
              </button>
            </form>
          </div>

          {/* Submission history list */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Your Submitted Requests</span>
            </h3>

            {initialApplications.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No exhibition support requests submitted yet. Use the form to apply.</p>
            ) : (
              <div className="divide-y divide-slate-100 font-sans">
                {initialApplications.map((app) => (
                  <div key={app.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{app.data.exhibitionName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Preferred Dates: {app.data.preferredDate}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {app.data.supportNeeded.map((support, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-[10px] text-slate-600 rounded border border-slate-200 uppercase font-semibold">
                          {support.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 bg-blue-50 text-[10px] text-blue-700 rounded border border-blue-200 uppercase font-bold">
                        {app.data.participationType}
                      </span>
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
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Support Offerings</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Map className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Pavilion Coordination</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Consolidated JIBB member kiosks at major international trade shows.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Landmark className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Subsidy & Grants Support</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Assistance in navigating government subsidies and export incentives available for exhibitions.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Calendar className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>B2B Meeting Schedules</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Pre-arranged meetings with interested corporate delegators and local trade distributors.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <MessageSquare className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Language Interpreters</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Access to English-Japanese bilingual trade interpreters to support communication at the stands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
