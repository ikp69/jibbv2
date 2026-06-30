import React from "react";
import { HelpCircle, Star, Calendar, MessageSquare, Map, Landmark } from "lucide-react";

export default function ExhibitionSupportPage() {
  return (
    <div className="space-y-6 font-sans max-w-4xl">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-8 h-8 text-blue-600 shrink-0" />
          <span>Exhibition & Event Support</span>
        </h1>
        <p className="text-slate-600 mt-1">Bilateral trade fair participation assistance, pavilion coordination, and local logistics support.</p>
      </div>

      {/* Feature Announcement Notice Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                Coming in Version 2.0
              </span>
              <h2 className="text-xl font-bold text-slate-900">Module Under Active Development</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Planned Release: Q4 2026</span>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              JIBB is building a comprehensive exhibition support framework to assist members in setting up pavilions, registering for industrial events in India and Japan, and coordinating logistics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Map className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Pavilion Coordination</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Consolidated JIBB member kiosks at major international trade shows (such as India Mobile Congress, Semiconductor India, and Tokyo Expo).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Landmark className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Subsidy & Grants Support</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Assistance in navigating government subsidies and export incentives available for overseas exhibitions.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Calendar className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>B2B Meeting Schedules</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pre-arranged meetings with interested corporate delegators and local trade distributors during the trade fairs.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <MessageSquare className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                  <span>Language Interpreters</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Access to pre-vetted English-Japanese bilingual trade interpreters to support communication at the stands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
