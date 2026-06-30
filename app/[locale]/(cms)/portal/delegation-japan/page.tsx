import React from "react";
import { Plane, Compass, FileCheck, Landmark, Users, Calendar } from "lucide-react";

export default function DelegationJapanPage() {
  return (
    <div className="space-y-6 font-sans max-w-4xl">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Plane className="w-8 h-8 text-blue-600 shrink-0" />
          <span>Delegation to Japan</span>
        </h1>
        <p className="text-slate-600 mt-1">Industrial study tours, matchmaking delegations, and governmental agency meetings in Japan.</p>
      </div>

      {/* Feature Notification Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                Coming in Version 2.0
              </span>
              <h2 className="text-xl font-bold text-slate-900">Bilateral Tour Coordination Page</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Planned Release: Q1 2027</span>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              JIBB is developing an integrated delegation registration and itinerary management hub to support member companies on industrial visits to Japan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Compass className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Itinerary Coordination</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Real-time updates on pre-vetted corporate site visits, travel logistics, and hotel coordinates in major business clusters (Tokyo, Osaka, Nagoya).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <FileCheck className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Visa & Entry Briefs</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Consolidated templates and visa processing support documentation for corporate delegation visas to Japan.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Landmark className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>JETRO & METI Roundtables</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Scheduled forums and roundtable meetings with trade associations like JETRO (Japan External Trade Organization) and METI.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Users className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Networking Receptions</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Exclusive networking events connecting Indian delegators with Japanese manufacturing partners and investment houses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
