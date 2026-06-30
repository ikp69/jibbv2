"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Briefcase,
  History,
  ArrowRight,
  Megaphone,
  FileText,
  Settings,
  Plus,
} from "lucide-react";

type DashboardStats = {
  members: number;
  collaborations: number;
  opportunities: number;
};

type AuditLogItem = {
  action: string;
  table_name: string;
  created_at: string;
};

type DashboardClientProps = {
  stats: DashboardStats;
  recentLogs: AuditLogItem[];
};

export default function DashboardClient({ stats, recentLogs }: DashboardClientProps) {
  const getActionLabel = (action: string) => {
    switch (action.toLowerCase()) {
      case "login":
        return "User signed in";
      case "change_password":
        return "Reset security password";
      case "create_member":
        return "Registered new corporate profile";
      case "create_opportunity":
        return "Published business opportunity";
      default:
        return action.replace(/_/g, " ");
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="relative p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-red-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">System Overview</span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome to the JIBB Admin Portal</h1>
          <p className="text-sm text-slate-600 max-w-xl">
            Audit bilateral registrations, coordinate strategic collaborations, and manage industrial content visibility across Japanese and Indian regions.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Members Stat */}
        <Link
          href="/admin/members"
          className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ecosystem Members</span>
            <h3 className="text-3xl font-extrabold text-slate-900">{stats.members}</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-500 group-hover:text-blue-600 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
            <Users className="w-5 h-5" />
          </div>
        </Link>

        {/* Collaborations Stat */}
        <Link
          href="/admin/collaboration"
          className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between hover:border-emerald-500 hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Collaborations</span>
            <h3 className="text-3xl font-extrabold text-slate-900">{stats.collaborations}</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-500 group-hover:text-emerald-600 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </Link>

        {/* Opportunities Stat */}
        <Link
          href="/admin/business-matching"
          className="bg-white border border-slate-200 p-5 rounded-xl flex items-center justify-between hover:border-amber-500 hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Matching Opportunities</span>
            <h3 className="text-3xl font-extrabold text-slate-900">{stats.opportunities}</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-500 group-hover:text-amber-600 group-hover:border-amber-200 group-hover:bg-amber-50 transition-all">
            <Briefcase className="w-5 h-5" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions Panel */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Administrative Actions</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/announcements"
              className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 hover:border-blue-400 rounded-lg flex flex-col justify-between h-24 group transition-all"
            >
              <Megaphone className="w-4 h-4 text-blue-600" />
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span>Publish Announcement</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>

            <Link
              href="/admin/reports"
              className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 hover:border-blue-400 rounded-lg flex flex-col justify-between h-24 group transition-all"
            >
              <FileText className="w-4 h-4 text-rose-600" />
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span>Upload Report</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>

            <Link
              href="/admin/members"
              className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 hover:border-blue-400 rounded-lg flex flex-col justify-between h-24 group transition-all"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span>Register Member</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 hover:border-blue-400 rounded-lg flex flex-col justify-between h-24 group transition-all"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span>System Settings</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity Logs */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              <span>Recent Activity Trail</span>
            </h3>
            <Link href="/admin/audit-logs" className="text-xs text-blue-600 hover:underline font-medium">
              View All Logs
            </Link>
          </div>

          <div className="space-y-3">
            {recentLogs.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No recent operations logged.</p>
            ) : (
              recentLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-4 p-3 bg-slate-50/50 border border-slate-100 rounded-lg text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-800 capitalize">{getActionLabel(log.action)}</span>
                    <p className="text-slate-500 font-mono text-[10px]">Relation: {log.table_name}</p>
                  </div>
                  <span suppressHydrationWarning className="text-[10px] text-slate-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
