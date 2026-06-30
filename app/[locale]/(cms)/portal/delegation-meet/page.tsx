import React from "react";
import { Users, Presentation, Calendar, Briefcase, Award, CheckCircle } from "lucide-react";

export default function DelegationMeetPage() {
  return (
    <div className="space-y-6 font-sans max-w-4xl">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-8 h-8 text-blue-600 shrink-0" />
          <span>Japan Delegations (Inbound)</span>
        </h1>
        <p className="text-slate-600 mt-1">Networking summits and B2B matches with incoming Japanese government and industry delegations.</p>
      </div>

      {/* Feature Notification Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                Coming in Version 2.0
              </span>
              <h2 className="text-xl font-bold text-slate-900">Inbound Matchmaking Hub</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Planned Release: Q1 2027</span>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              JIBB is building an interactive inbound delegation meeting registry to allow member companies to pitch for direct B2B meetings with incoming Japanese industry groups.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Presentation className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Delegation Pitch Deck</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Submit company profiles and business capabilities directly to incoming trade delegations seeking Indian partners.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Calendar className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>B2B Scheduler</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Book 1-on-1 interview slots with visiting Japanese executives and coordinators in JIBB conference blocks.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Briefcase className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Targeted Sectors</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Receive alerts when incoming delegations match specific manufacturing fields (Automotive, Semiconductors, Chemicals, etc.).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Award className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>VIP Networking access</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Exclusive dinner invitations and reception passes for premium membership tiers (Gold and Platinum).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
