"use client";

import React, { useState } from "react";
import { Building, Globe, MapPin, Search, Mail, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";

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

type AdminMemberDirectoryClientProps = {
  initialMembers: MemberInfo[];
};

export default function AdminMemberDirectoryClient({ initialMembers }: AdminMemberDirectoryClientProps) {
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filtered = initialMembers.filter((item) => {
    const matchesSearch =
      (item.company_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.company_description || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(search.toLowerCase());

    const matchesIndustry = selectedIndustry === "all" || item.industry === selectedIndustry;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesIndustry && matchesStatus;
  });

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

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Administrative Member Directory</h1>
        <p className="text-slate-600 mt-1">Review and manage organizational visibility and membership tiers in the ecosystem.</p>
      </div>

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
            className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
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
            className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
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
      {filtered.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl max-w-md mx-auto space-y-2">
          <Building className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800">No members match filters</h3>
          <p className="text-xs text-slate-500">Try modifying your filter settings or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((item) => (
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
                    <span className="font-medium text-slate-650">{item.industry || "General"}</span>
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
    </div>
  );
}
