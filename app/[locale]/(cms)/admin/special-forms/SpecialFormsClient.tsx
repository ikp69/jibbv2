"use client";

import React, { useState, useTransition } from "react";
import { FileSpreadsheet, Eye, Search, Check, X, Clock, HelpCircle, Plane, Users, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { updateSpecialProgramApplicationStatus } from "@/features/cms/business/actions/special-programs";
import { useRouter } from "next/navigation";

type Application = {
  id: string;
  member_id: string;
  form_type: "exhibition_support" | "delegation_japan" | "delegation_meet";
  status: "pending" | "approved" | "rejected";
  data: any;
  created_at: string;
  profiles: {
    id: string;
    company_name: string | null;
    email: string | null;
    full_name: string | null;
  } | null;
};

type SpecialFormsClientProps = {
  initialApplications: Application[];
};

export default function SpecialFormsClient({ initialApplications }: SpecialFormsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Selected application for detail modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleStatusChange = (id: string, newStatus: Application["status"]) => {
    startTransition(async () => {
      const res = await updateSpecialProgramApplicationStatus(id, newStatus);
      if (res.success) {
        // Update selected app in modal if open
        if (selectedApp?.id === id) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
        router.refresh();
      } else {
        alert(res.error || "Failed to update status.");
      }
    });
  };

  const getFormTypeBadge = (type: Application["form_type"]) => {
    switch (type) {
      case "exhibition_support":
        return (
          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-755 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Exhibition Support</span>
          </span>
        );
      case "delegation_japan":
        return (
          <span className="px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-750 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <Plane className="w-3.5 h-3.5" />
            <span>Japan Tour</span>
          </span>
        );
      case "delegation_meet":
        return (
          <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-750 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <Users className="w-3.5 h-3.5" />
            <span>Inbound B2B</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-2 py-0.5 rounded bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Acknowledged</span>
          </span>
        );

      case "rejected":
        return (
          <span className="px-2 py-0.5 rounded bg-red-50 border border-red-200 text-red-750 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <X className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <Clock className="w-3.5 h-3.5 animate-pulse text-amber-500" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  // Filter applications
  const filtered = initialApplications.filter((app) => {
    const company = (app.profiles?.company_name || "").toLowerCase();
    const email = (app.profiles?.email || "").toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch = company.includes(query) || email.includes(query);

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesType = typeFilter === "all" || app.form_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-905 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-8 h-8 text-blue-600 shrink-0" />
            <span>Special Program Registrations</span>
          </h1>
          <p className="text-slate-550 mt-1">Review member submissions for exhibition support, outbound delegations, and B2B matchmaking sessions.</p>
        </div>
      </div>

      {/* Program Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        {[
          { id: "all", label: "All Programs", count: initialApplications.length },
          { id: "exhibition_support", label: "Exhibition Support", count: initialApplications.filter(a => a.form_type === "exhibition_support").length },
          { id: "delegation_japan", label: "Delegation to Japan", count: initialApplications.filter(a => a.form_type === "delegation_japan").length },
          { id: "delegation_meet", label: "Japan Inbound Meet", count: initialApplications.filter(a => a.form_type === "delegation_meet").length }
        ].map((tab) => {
          const isActive = typeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-4 py-2 text-xs font-bold transition-all rounded-lg cursor-pointer flex items-center gap-1.5 border ${
                isActive
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-mono ${
                isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none cursor-pointer transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Acknowledged</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main applications table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 italic">No registrations found matching the criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Member</th>
                  <th className="py-3.5 px-5">Program</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 text-slate-500 font-mono text-xs whitespace-nowrap" suppressHydrationWarning>
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-800">{app.profiles?.company_name || "Unknown Company"}</div>
                      <div className="text-xs text-slate-550">{app.profiles?.email || "No Email"}</div>
                    </td>
                    <td className="py-4 px-5">{getFormTypeBadge(app.form_type)}</td>
                    <td className="py-4 px-5">{getStatusBadge(app.status)}</td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex gap-2 justify-end items-center">
                        <button
                          onClick={() => handleStatusChange(app.id, "approved")}
                          disabled={isPending || app.status === "approved"}
                          className="p-1.5 bg-green-50 hover:bg-green-100 text-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-green-200 transition-colors flex items-center justify-center cursor-pointer"
                          title="Acknowledge request"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(app.id, "rejected")}
                          disabled={isPending || app.status === "rejected"}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-red-200 transition-colors flex items-center justify-center cursor-pointer"
                          title="Reject request"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                          title="View submitted details"
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

      {/* Details Preview Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl p-6 space-y-5 text-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Application Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">Submitted by: {selectedApp.profiles?.company_name}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-655 cursor-pointer p-1 rounded-lg hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Dynamic JSON payload parser */}
              {selectedApp.form_type === "exhibition_support" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-slate-450 uppercase">Exhibition Name</span>
                    <span className="col-span-2 text-slate-900 font-semibold">{selectedApp.data.exhibitionName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-slate-450 uppercase">Participation Type</span>
                    <span className="col-span-2 text-slate-900 font-semibold capitalize">{selectedApp.data.participationType}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-slate-450 uppercase">Preferred Dates</span>
                    <span className="col-span-2 text-slate-900 font-semibold">{selectedApp.data.preferredDate}</span>
                  </div>
                  <div className="space-y-1 pt-1.5 border-t border-slate-100">
                    <span className="font-bold text-slate-450 uppercase block">Support Needed</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedApp.data.supportNeeded.map((support: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded uppercase font-semibold">
                          {support.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedApp.form_type === "delegation_japan" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-slate-450 uppercase">Industry Sector</span>
                    <span className="col-span-2 text-slate-900 font-semibold">{selectedApp.data.sector}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-slate-450 uppercase">Preferred Travel Dates</span>
                    <span className="col-span-2 text-slate-900 font-semibold">{selectedApp.data.preferredDates}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-slate-450 uppercase">Number of Delegates</span>
                    <span className="col-span-2 text-slate-900 font-semibold">{selectedApp.data.delegateCount}</span>
                  </div>
                  <div className="space-y-1 pt-1.5 border-t border-slate-100">
                    <span className="font-bold text-slate-450 uppercase block">Core Interests</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedApp.data.interests.map((interest: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded uppercase font-semibold">
                          {interest.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedApp.form_type === "delegation_meet" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-slate-450 uppercase">Target Delegation</span>
                    <span className="col-span-2 text-slate-900 font-semibold">{selectedApp.data.targetDelegation}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="font-bold text-slate-450 uppercase">Preferred B2B Slot</span>
                    <span className="col-span-2 text-slate-900 font-semibold">{selectedApp.data.preferredTimeSlot}</span>
                  </div>
                  <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                    <span className="font-bold text-slate-450 uppercase block">Meeting Pitch & Objective</span>
                    <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-150 leading-relaxed font-medium">
                      {selectedApp.data.pitchPurpose}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-450 uppercase block">Products/Services to Showcase</span>
                    <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-150 leading-relaxed font-medium">
                      {selectedApp.data.showcaseDetails}
                    </p>
                  </div>
                </div>
              )}

              {/* General comments section if available */}
              {selectedApp.form_type !== "delegation_meet" && selectedApp.data.comments && (
                <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                  <span className="font-bold text-slate-450 uppercase block">User Objective / Comments</span>
                  <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-150 leading-relaxed font-medium">
                    {selectedApp.data.comments}
                  </p>
                </div>
              )}

              {/* Status Section */}
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500 uppercase">Current Status</span>
                {getStatusBadge(selectedApp.status)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Modify Registration Status</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedApp.id, "approved")}
                  disabled={isPending || selectedApp.status === "approved"}
                  className="py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acknowledge</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedApp.id, "rejected")}
                  disabled={isPending || selectedApp.status === "rejected"}
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
