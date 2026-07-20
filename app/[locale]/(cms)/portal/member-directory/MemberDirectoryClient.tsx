"use client";

import React, { useState, useTransition } from "react";
import { Building, MapPin, Search, Send, X, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { submitIntroductionRequest } from "@/features/cms/business/actions/introductions";
import { useRouter } from "next/navigation";

type MemberInfo = {
  id: string;
  company_name: string | null;
  company_description: string | null;
  industry: string | null;
  country: string | null;
  city: string | null;
  website: string | null;
  looking_for: string[] | null;
  membership_tier: string;
};

type IntroRequest = {
  id: string;
  target_member_id: string;
  status: "pending" | "approved" | "rejected";
};

type MemberDirectoryClientProps = {
  initialMembers: MemberInfo[];
  initialRequests: IntroRequest[];
};

export default function MemberDirectoryClient({ initialMembers, initialRequests }: MemberDirectoryClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  // Connection request modal states
  const [activeTarget, setActiveTarget] = useState<MemberInfo | null>(null);
  const [objective, setObjective] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const filtered = initialMembers.filter((item) => {
    const anonymizedName = `${item.industry || "General"} Partner`;
    const matchesSearch =
      anonymizedName.toLowerCase().includes(search.toLowerCase()) ||
      (item.company_description || "").toLowerCase().includes(search.toLowerCase());

    const matchesIndustry = selectedIndustry === "all" || item.industry === selectedIndustry;

    return matchesSearch && matchesIndustry;
  });

  const getTierBadgeColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "platinum":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "gold":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "silver":
        return "bg-slate-50 text-slate-600 border-slate-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };


  const handleConnectRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTarget) return;

    setErrorMsg("");
    setSuccessMsg("");

    if (objective.trim().length < 15) {
      setErrorMsg("Objective statement must be at least 15 characters long.");
      return;
    }

    startTransition(async () => {
      const res = await submitIntroductionRequest(activeTarget.id, objective);
      if (res.success) {
        setSuccessMsg("Your introduction request has been submitted to the JIBB Admin team.");
        setObjective("");
        setTimeout(() => {
          setActiveTarget(null);
          setSuccessMsg("");
        }, 2000);
        router.refresh();
      } else {
        setErrorMsg(res.error || "Failed to submit request.");
      }
    });
  };

  const getConnectionStatus = (memberId: string) => {
    return initialRequests.find((r) => r.target_member_id === memberId);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Member Directory</h1>
        <p className="text-slate-600 mt-1">Discover expert profiles in the ecosystem and request facilitated warm introductions through the JIBB matchmaker.</p>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search matching expertise or profile details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm text-slate-900 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Industries</option>
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
      </div>

      {/* Directory Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-300 rounded-xl max-w-md mx-auto space-y-2">
          <Building className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800">No matching profiles</h3>
          <p className="text-xs text-slate-500">Try modifying your filter settings or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const req = getConnectionStatus(item.id);
            const anonymizedName = `${item.industry || "General"} Partner`;
            
            return (
              <div
                key={item.id}
                className="border border-slate-200 bg-white rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-350 hover:shadow-sm transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-900 tracking-tight text-base leading-snug">{anonymizedName}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border capitalize shrink-0 ${getTierBadgeColor(
                        item.membership_tier
                      )}`}
                    >
                      {item.membership_tier}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{item.industry || "General"}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>{item.city || "Japan/India"}, {item.country || "Ecosystem"}</span>
                    </div>
                  </div>

                  {item.company_description?.startsWith("Specializes in: ") && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-700">Specializes in:</span>{" "}
                      {item.company_description.replace("Specializes in: ", "")}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  {item.looking_for && item.looking_for.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.looking_for.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-slate-50 text-[10px] text-slate-600 rounded border border-slate-200">
                          {tag}
                        </span>
                      ))}
                      {item.looking_for.length > 3 && (
                        <span className="text-[10px] text-slate-500 font-semibold px-1">+{item.looking_for.length - 3} more</span>
                      )}
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100">
                    {req ? (
                      req.status === "approved" ? (
                        <div className="py-2 px-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 w-full">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Acknowledged</span>
                        </div>
                      ) : req.status === "rejected" ? (
                        <div className="py-2 px-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 w-full">
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>Not Connected</span>
                        </div>
                      ) : (
                        <div className="py-2 px-3 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 w-full">
                          <Clock className="w-4 h-4 shrink-0 animate-pulse" />
                          <span>Connection Pending Review</span>
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => {
                          setActiveTarget(item);
                          setObjective("");
                          setErrorMsg("");
                          setSuccessMsg("");
                        }}
                        className="py-2 px-3 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Request Connection</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Connection Objective Form Dialog Modal */}
      {activeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl p-6 space-y-4 text-slate-800">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Request Faciliated Introduction</h3>
                <p className="text-xs text-slate-500 mt-0.5">Introduce my organization to: <span className="font-semibold text-slate-700">{activeTarget.industry || "General"} Partner</span></p>
              </div>
              <button
                onClick={() => setActiveTarget(null)}
                className="text-slate-400 hover:text-slate-650 cursor-pointer p-1 rounded-lg hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleConnectRequest} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Connection Intent & Objective</label>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Outline exactly what you seek to achieve with this partner (e.g. technology search, trade distribution partnership, study tour meeting block, etc.). Min 15 characters."
                  rows={5}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none resize-none transition-colors"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTarget(null)}
                  className="px-4 py-2 border border-slate-250 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isPending ? "Submitting..." : "Send Request"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
