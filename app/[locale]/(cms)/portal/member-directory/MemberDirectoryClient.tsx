"use client";

import React, { useState } from "react";
import { Building, Globe, MapPin, Search } from "lucide-react";

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

type MemberDirectoryClientProps = {
  initialMembers: MemberInfo[];
};

export default function MemberDirectoryClient({ initialMembers }: MemberDirectoryClientProps) {
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  const filtered = initialMembers.filter((item) => {
    const matchesSearch =
      (item.company_name || "").toLowerCase().includes(search.toLowerCase()) ||
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

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Member Directory</h1>
        <p className="text-slate-600 mt-1">Connect and coordinate with industrial leaders and ecosystem members across regions.</p>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search organizations or profiles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
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
          <h3 className="font-bold text-slate-800">No members match search</h3>
          <p className="text-xs text-slate-500">Refine your search parameters or check filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 bg-white rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 hover:shadow-sm transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="w-10 h-10 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg flex items-center justify-center font-bold text-base shrink-0">
                    {item.company_name?.charAt(0) || "M"}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border capitalize ${getTierBadgeColor(
                      item.membership_tier
                    )}`}
                  >
                    {item.membership_tier}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 tracking-tight text-base leading-snug">{item.company_name}</h3>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="font-medium text-slate-700">{item.industry || "General"}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>{item.city || "Japan/India"}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {item.company_description || "No description provided by organization."}
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
                    {item.looking_for.length > 3 && (
                      <span className="text-[10px] text-slate-500 font-semibold px-1">+{item.looking_for.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-mono">Region: {item.country || "Both"}</span>
                  {item.website && (
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline font-medium"
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
