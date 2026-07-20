"use client";

import React, { useState, useTransition } from "react";
import { Building, Globe, MapPin, Search, Mail, Eye, EyeOff, CheckCircle, AlertTriangle, Clock, Check, X, CheckCircle2, XCircle } from "lucide-react";
import { updateIntroductionRequestStatus } from "@/features/cms/business/actions/introductions";
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
  status: string | null;
  show_in_directory: boolean | null;
  email: string | null;
};

type IntroRequest = {
  id: string;
  requester_id: string;
  target_member_id: string;
  objective: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  requester: {
    company_name: string | null;
    email: string | null;
  } | null;
  target: {
    company_name: string | null;
    email: string | null;
  } | null;
};

type AdminMemberDirectoryClientProps = {
  initialMembers: MemberInfo[];
  initialRequests: IntroRequest[];
};

export default function AdminMemberDirectoryClient({ initialMembers, initialRequests }: AdminMemberDirectoryClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Tab control
  const [activeTab, setActiveTab] = useState<"members" | "requests">("members");

  // Active Members Filters
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Requests Filters
  const [requestSearch, setRequestSearch] = useState("");
  const [requestStatusFilter, setRequestStatusFilter] = useState("all");

  // Selected request details modal
  const [selectedRequest, setSelectedRequest] = useState<IntroRequest | null>(null);

  const filteredMembers = initialMembers.filter((item) => {
    const matchesSearch =
      (item.company_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.company_description || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(search.toLowerCase());

    const matchesIndustry = selectedIndustry === "all" || item.industry === selectedIndustry;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesIndustry && matchesStatus;
  });

  const filteredRequests = initialRequests.filter((item) => {
    const requesterName = (item.requester?.company_name || "").toLowerCase();
    const targetName = (item.target?.company_name || "").toLowerCase();
    const matchesSearch =
      requesterName.includes(requestSearch.toLowerCase()) ||
      targetName.includes(requestSearch.toLowerCase()) ||
      item.objective.toLowerCase().includes(requestSearch.toLowerCase());

    const matchesStatus = requestStatusFilter === "all" || item.status === requestStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (requestId: string, status: "approved" | "rejected") => {
    startTransition(async () => {
      const res = await updateIntroductionRequestStatus(requestId, status);
      if (res.success) {
        if (selectedRequest?.id === requestId) {
          setSelectedRequest((prev) => prev ? { ...prev, status } : prev);
        }
        router.refresh();
      } else {
        alert(res.error || "Failed to update request status.");
      }
    });
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "platinum":
        return "bg-slate-100 text-slate-850 border-slate-300";
      case "gold":
        return "bg-amber-55/10 text-amber-800 border-amber-200";
      case "silver":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-blue-50 text-blue-750 border-blue-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-rose-50 text-rose-705 border-rose-200";
    }
  };

  const getRequestStatusBadge = (status: IntroRequest["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Acknowledged</span>
          </span>
        );
      case "rejected":
        return (
          <span className="px-2.5 py-0.5 rounded bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
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
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Administrative Member Directory</h1>
        <p className="text-slate-655 mt-1">Review membership details and manage facilitated warm introductions directly within the directory ecosystem.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border cursor-pointer ${
            activeTab === "members"
              ? "bg-blue-600 border-blue-600 text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Manage Members ({initialMembers.length})
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border cursor-pointer flex items-center gap-1.5 ${
            activeTab === "requests"
              ? "bg-blue-600 border-blue-600 text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
          }`}
        >
          <span>Matchmaking Requests</span>
          <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-mono ${
            activeTab === "requests" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
          }`}>
            {initialRequests.filter(r => r.status === "pending").length}
          </span>
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === "members" ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Members</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{initialMembers.length}</h3>
              </div>
              <Building className="w-8 h-8 text-blue-500/20" />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Public in Directory</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {initialMembers.filter(m => m.show_in_directory).length}
                </h3>
              </div>
              <Eye className="w-8 h-8 text-emerald-500/20" />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Approval</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {initialMembers.filter(m => m.status === "pending").length}
                </h3>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500/20" />
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, description, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors cursor-pointer"
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

            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Directory Grid */}
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl max-w-md mx-auto space-y-2">
              <Building className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800">No members match filters</h3>
              <p className="text-xs text-slate-500">Try modifying your filter settings or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMembers.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-205 bg-white rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-350 shadow-sm hover:shadow-md transition-all duration-150"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="w-10 h-10 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg flex items-center justify-center font-bold text-base shrink-0">
                        {item.company_name?.charAt(0) || "M"}
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border capitalize ${getTierBadgeColor(
                            item.membership_tier
                          )}`}
                        >
                          {item.membership_tier}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeColor(
                            item.status || "pending"
                          )}`}
                        >
                          {item.status || "pending"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-850 tracking-tight text-base leading-snug">{item.company_name || "Unnamed Company"}</h3>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 mt-1">
                        <span className="font-medium text-slate-655">{item.industry || "General"}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.city || "Japan/India"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{item.email || "No email linked"}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {item.company_description || "No description provided."}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {item.looking_for && item.looking_for.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.looking_for.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-slate-50 text-[10px] text-slate-600 rounded border border-slate-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-150 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        {item.show_in_directory ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Public</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                            <span>Hidden</span>
                          </>
                        )}
                      </div>
                      {item.website && (
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline font-medium"
                        >
                          <span>Website</span>
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Matchmaking Requests Tab Panel */}
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by requester, target partner, or objective text..."
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
              />
            </div>

            <div className="w-full md:w-48">
              <select
                value={requestStatusFilter}
                onChange={(e) => setRequestStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none cursor-pointer transition-colors"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Acknowledged</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table list */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {filteredRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-500 italic">No matchmaking introduction requests found matching the criteria.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-5">Date</th>
                      <th className="py-3.5 px-5">Requester</th>
                      <th className="py-3.5 px-5">Target Partner</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-5 text-slate-500 font-mono text-xs whitespace-nowrap" suppressHydrationWarning>
                          {new Date(req.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-5">
                          <div className="font-bold text-slate-800">{req.requester?.company_name || "Unknown Company"}</div>
                          <div className="text-xs text-slate-500">{req.requester?.email || "No Email"}</div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="font-bold text-slate-800">{req.target?.company_name || "Unknown Partner"}</div>
                          <div className="text-xs text-slate-550">{req.target?.email || "No Email"}</div>
                        </td>
                        <td className="py-4 px-5">{getRequestStatusBadge(req.status)}</td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex gap-2 justify-end items-center">
                            <button
                              onClick={() => handleStatusChange(req.id, "approved")}
                              disabled={isPending || req.status === "approved"}
                              className="p-1.5 bg-green-50 hover:bg-green-100 text-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-green-200 transition-colors flex items-center justify-center cursor-pointer"
                              title="Acknowledge & Connect request"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.id, "rejected")}
                              disabled={isPending || req.status === "rejected"}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-red-200 transition-colors flex items-center justify-center cursor-pointer"
                              title="Reject connection request"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedRequest(req)}
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                              title="View collaboration objective"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Connection Intent Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl p-6 space-y-4 text-slate-800">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Connection Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">Objective of introduction request</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-650 cursor-pointer p-1 rounded-lg hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-450 uppercase">Requester Company</span>
                <span className="col-span-2 text-slate-900 font-semibold">{selectedRequest.requester?.company_name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-450 uppercase">Target Partner</span>
                <span className="col-span-2 text-slate-900 font-semibold">{selectedRequest.target?.company_name}</span>
              </div>

              <div className="space-y-1.5 pt-1.5 border-t border-slate-105">
                <span className="font-bold text-slate-450 uppercase block">Collaboration Intent & Objective</span>
                <p className="text-slate-850 bg-slate-50 p-2.5 rounded-lg border border-slate-150 leading-relaxed font-medium text-xs whitespace-pre-wrap">
                  {selectedRequest.objective}
                </p>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 uppercase">Introduction Status</span>
                {getRequestStatusBadge(selectedRequest.status)}
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Modify Request Status</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedRequest.id, "approved")}
                  disabled={isPending || selectedRequest.status === "approved"}
                  className="py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acknowledge</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedRequest.id, "rejected")}
                  disabled={isPending || selectedRequest.status === "rejected"}
                  className="py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
