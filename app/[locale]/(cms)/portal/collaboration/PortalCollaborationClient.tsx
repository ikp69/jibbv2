"use client";

import React, { useState, useTransition } from "react";
import { submitCollaborationInterest } from "@/features/cms/business/actions/collaborations";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  ShieldCheck, 
  Calendar, 
  X, 
  Send, 
  Check, 
  Handshake, 
  Users, 
  Compass, 
  TrendingUp, 
  Cpu,
  MapPin,
  ArrowRight,
  Eye,
  Newspaper
} from "lucide-react";

type Collaboration = {
  id: string;
  title: string;
  description: string;
  industry: string;
  category: "partnerships" | "delegations" | "tradeMissions" | "investment";
  direction: string;
  location: string;
};

type PortalCollaborationClientProps = {
  collaborations: Collaboration[];
  submittedInterests: { collaboration_id: string; status: string; message?: string; created_at?: string }[];
};

type TabType = "partnerships" | "delegations" | "tradeMissions" | "investment";

export default function PortalCollaborationClient({ collaborations, submittedInterests }: PortalCollaborationClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("partnerships");
  const [selectedCol, setSelectedCol] = useState<Collaboration | null>(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [collabSuccess, setCollabSuccess] = useState("");
  const [collabError, setCollabError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [viewPitch, setViewPitch] = useState<{ collaboration_id: string; status: string; message?: string; created_at?: string } | null>(null);
  const [viewPitchCol, setViewPitchCol] = useState<Collaboration | null>(null);

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

  // Tabs configuration matching FeatOpportunities.tsx
  const tabs = [
    { id: "partnerships", label: "Partnership Requests", icon: Handshake },
    { id: "delegations", label: "Business Delegations", icon: Users },
    { id: "tradeMissions", label: "Trade Missions", icon: Compass },
    { id: "investment", label: "Investment Opportunities", icon: TrendingUp },
  ] as const;

  // Filter collaborations by selected tab
  const filteredCollaborations = collaborations.filter((col) => col.category === activeTab);

  // Layout color configurations based on category
  const themeColors = {
    partnerships: {
      text: "text-jibb-indigo dark:text-jibb-indigo-light",
      bg: "bg-jibb-indigo/5 dark:bg-jibb-indigo/10",
      border: "border-jibb-indigo/20 dark:border-jibb-indigo-light/20",
      hover: "hover:border-jibb-indigo/40",
      pill: "bg-blue-50 text-blue-700 border-blue-200"
    },
    delegations: {
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      border: "border-emerald-200 dark:border-emerald-800/20",
      hover: "hover:border-emerald-400",
      pill: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    tradeMissions: {
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/20",
      border: "border-amber-200 dark:border-amber-800/20",
      hover: "hover:border-amber-400",
      pill: "bg-amber-50 text-amber-700 border-amber-200"
    },
    investment: {
      text: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/20",
      border: "border-rose-200 dark:border-rose-800/20",
      hover: "hover:border-rose-400",
      pill: "bg-rose-50 text-rose-700 border-rose-200"
    }
  };

  const activeTheme = themeColors[activeTab];

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0" />
          <span>Strategic Collaborations</span>
        </h1>
        <p className="text-slate-600 mt-1">
          Become a member and discover active collaboration opportunities between India and Japan.
        </p>
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

      {/* Tabs Selector Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feed Layout */}
      {filteredCollaborations.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No Opportunities Found"
          description={`There are currently no active opportunities under ${tabs.find(t => t.id === activeTab)?.label}.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollaborations.map((col) => {
            const interest = submittedInterests.find((item) => item.collaboration_id === col.id);
            const isSubmitted = !!interest;

            return (
              <div
                key={col.id}
                className={`border bg-white rounded-xl p-6 flex flex-col justify-between space-y-5 transition-all shadow-sm hover:shadow-md ${activeTheme.border} ${activeTheme.hover}`}
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex justify-between items-start gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${activeTheme.pill}`}>
                      {col.industry}
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wide">
                      {col.direction}
                    </span>
                  </div>

                  {/* Looking For */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">LOOKING FOR:</span>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                      {col.title}
                    </h3>
                  </div>

                  {/* Details */}
                  <p className="text-sm text-slate-655 leading-relaxed line-clamp-4">
                    {col.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  {/* Region Information */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{col.location}</span>
                    </span>

                     {isSubmitted && interest && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {interest.status === "pending" ? (
                          <span className="px-2 py-0.5 bg-amber-50 border border-amber-250 text-amber-700 text-[10px] font-bold rounded flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span>Pitch Sent</span>
                          </span>
                        ) : interest.status === "reviewed" ? (
                          <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold rounded flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Seen by Admin</span>
                          </span>
                        ) : interest.status === "approved" ? (
                          <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-250 text-emerald-700 text-[10px] font-bold rounded flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Connected</span>
                          </span>
                        ) : (
                          <StatusBadge status={interest.status} className="text-[10px] py-0.5 px-2 font-bold" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Connection Button */}
                  {isSubmitted ? (
                    <div className="flex gap-2">
                      <div className="w-full py-2.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-450 border border-slate-200 flex items-center justify-center gap-1.5 select-none">
                        <span>Pitch Submitted</span>
                      </div>
                      <button
                        onClick={() => {
                          setViewPitch(interest);
                          setViewPitchCol(col);
                        }}
                        className="px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors flex items-center justify-center"
                        title="View Submitted Pitch"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedCol(col)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Connect via Admin</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                <p>Industry Sector: {selectedCol.industry} | Category: {tabs.find(t => t.id === selectedCol.category)?.label}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Alignment Pitch</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain why your company is a match, what resources you offer, and how you want to connect..."
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
                      <span>Submit Interest</span>
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
      {viewPitch && viewPitchCol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
              <h2 className="text-lg font-bold text-slate-900">Your Submitted Pitch</h2>
              <button 
                onClick={() => { setViewPitch(null); setViewPitchCol(null); }} 
                className="text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-slate-700">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1">
                <p className="font-semibold text-slate-900 text-sm">{viewPitchCol.title}</p>
                <p className="text-xs text-slate-500">Industry Sector: {viewPitchCol.industry} | Category: {tabs.find(t => t.id === viewPitchCol.category)?.label}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Your Alignment Pitch</span>
                <p className="bg-slate-50/50 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap leading-relaxed">
                  {viewPitch.message || "No pitch message content available."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-150">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-455 uppercase tracking-wider">Pitch Status:</span>
                  <StatusBadge status={viewPitch.status} />
                </div>
                <button
                  type="button"
                  onClick={() => { setViewPitch(null); setViewPitchCol(null); }}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
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
