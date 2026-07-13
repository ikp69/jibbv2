"use client";

import React, { useState, useTransition } from "react";
import { saveNotes } from "@/features/cms/members/actions/save-notes";
import { suspendMember, activateMember, archiveMember, renewMember, forceLogoutSession, forceLogoutAllSessions } from "@/features/cms/members/actions/lifecycle-actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { useRouter } from "next/navigation";
import { Calendar, User, Globe, Briefcase, FileText, CheckCircle, ClipboardList, AlertCircle, FileSpreadsheet } from "lucide-react";

type LogEntry = {
  id: string;
  action: string;
  created_at: string;
  new_values: any;
};

type MemberDetail = {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  designation: string | null;
  membership_tier: string;
  membership_start_date: string | null;
  membership_end_date: string | null;
  phone: string | null;
  industry: string | null;
  country: string | null;
  city: string | null;
  website: string | null;
  company_description: string | null;
  looking_for: string[] | null;
  notes: string | null;
  status: string;
  is_active: boolean;
};

type SessionEntry = {
  id: string;
  session_id: string;
  device_name: string | null;
  browser: string | null;
  operating_system: string | null;
  user_agent: string;
  ip_address: string | null;
  country: string | null;
  city: string | null;
  login_at: string;
  last_activity: string;
  logout_at: string | null;
  revoked_at: string | null;
  revoke_reason: string | null;
};

type MemberDetailTabsProps = {
  member: MemberDetail;
  activityLogs: LogEntry[];
  sessions: SessionEntry[];
};

export default function MemberDetailTabs({ member, activityLogs, sessions }: MemberDetailTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "notes" | "sessions" | "docs">("overview");
  const [notesText, setNotesText] = useState(member.notes || "");
  const [isPending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<{
    actionFn: (id: string) => Promise<any>;
    actionName: string;
  } | null>(null);
  const [renewingMemberId, setRenewingMemberId] = useState<string | null>(null);
  const [renewDateInput, setRenewDateInput] = useState("");
  const [memberSuccess, setMemberSuccess] = useState("");
  const [memberError, setMemberError] = useState("");
  const [unmaskedSessions, setUnmaskedSessions] = useState<Record<string, boolean>>({});

  const toggleIpMask = (sid: string) => {
    setUnmaskedSessions((prev) => ({ ...prev, [sid]: !prev[sid] }));
  };

  const maskIpAddress = (ip: string | null, isUnmasked: boolean) => {
    if (!ip) return "N/A";
    if (isUnmasked) return ip;
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.xxx.xxx`;
    }
    return ip.substring(0, 8) + "...";
  };

  const handleForceLogoutSession = (sessionId: string) => {
    setMemberError("");
    setMemberSuccess("");
    startTransition(async () => {
      const res = await forceLogoutSession(member.id, sessionId);
      if (res.success) {
        setMemberSuccess("Session successfully revoked.");
        router.refresh();
      } else {
        setMemberError(res.error || "Failed to revoke session");
      }
    });
  };

  const handleForceLogoutAll = () => {
    setMemberError("");
    setMemberSuccess("");
    startTransition(async () => {
      const res = await forceLogoutAllSessions(member.id);
      if (res.success) {
        setMemberSuccess("All sessions successfully revoked.");
        router.refresh();
      } else {
        setMemberError(res.error || "Failed to revoke sessions");
      }
    });
  };

  const handleSaveNotes = () => {
    setMemberError("");
    setMemberSuccess("");
    startTransition(async () => {
      const res = await saveNotes(member.id, notesText);
      if (res.success) {
        setMemberSuccess("Internal notes updated successfully.");
        router.refresh();
      } else {
        setMemberError(res.error || "Failed to update notes");
      }
    });
  };

  const handleAction = (actionFn: (id: string) => Promise<any>, actionName: string) => {
    setConfirmAction({ actionFn, actionName });
  };

  const executeConfirmedAction = () => {
    if (!confirmAction) return;
    const { actionFn, actionName } = confirmAction;
    setConfirmAction(null);
    setMemberError("");
    setMemberSuccess("");

    startTransition(async () => {
      const res = await actionFn(member.id);
      if (res.success) {
        setMemberSuccess(`Member successfully ${actionName}d.`);
        router.refresh();
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setMemberError(res.error || `Failed to ${actionName} member`);
      }
    });
  };

  const handleRenewPrompt = () => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const yyyy = nextYear.getFullYear();
    const mm = String(nextYear.getMonth() + 1).padStart(2, "0");
    const dd = String(nextYear.getDate()).padStart(2, "0");
    setRenewDateInput(`${yyyy}-${mm}-${dd}`);
    setRenewingMemberId(member.id);
  };

  const executeRenew = () => {
    if (!renewingMemberId || !renewDateInput) return;
    setRenewingMemberId(null);
    setMemberError("");
    setMemberSuccess("");

    if (isNaN(Date.parse(renewDateInput))) {
      setMemberError("Invalid date format. Action aborted.");
      return;
    }

    startTransition(async () => {
      const res = await renewMember(member.id, renewDateInput);
      if (res.success) {
        setMemberSuccess("Membership renewed successfully.");
        router.refresh();
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setMemberError(res.error || "Failed to renew membership");
      }
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {memberError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {memberError}
        </div>
      )}
      {memberSuccess && (
        <div className="p-3 bg-emerald-550/10 border border-emerald-500/20 text-emerald-700 text-sm rounded-lg animate-pulse">
          {memberSuccess}
        </div>
      )}

      {/* Action confirmation dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 capitalize">
              Confirm {confirmAction.actionName} Action
            </h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to {confirmAction.actionName} this member?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-505 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmedAction}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-705 text-white text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renewal Prompt Dialog */}
      {renewingMemberId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Renew Membership Expiry
            </h3>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Membership Expiry Date</label>
              <input
                type="date"
                required
                value={renewDateInput}
                onChange={(e) => setRenewDateInput(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRenewingMemberId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-505 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeRenew}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-705 text-white text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Renew Expiry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner and Quick details */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shrink-0">
            {member.company_name?.charAt(0) || "M"}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{member.company_name}</h1>
              <StatusBadge status={member.status} />
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-100 border border-slate-200 text-slate-655">
                {member.membership_tier} Tier
              </span>
            </div>
            <p className="text-sm text-slate-550 mt-1">Representative: {member.full_name} ({member.designation})</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2.5">
          {member.status === "suspended" ? (
            <button
              onClick={() => handleAction(activateMember, "reactivate")}
              className="px-3.5 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-emerald-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              Reactivate Member
            </button>
          ) : (
            <button
              onClick={() => handleAction(suspendMember, "suspend")}
              className="px-3.5 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-amber-600 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              Suspend Member
            </button>
          )}

          <button
            onClick={handleRenewPrompt}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-md transition-colors"
          >
            Renew Membership
          </button>

          {member.status !== "archived" && (
            <button
              onClick={() => handleAction(archiveMember, "archive")}
              className="px-3.5 py-2 border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 text-red-750 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              Archive
            </button>
          )}
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200">
        {(["overview", "activity", "notes", "sessions", "docs"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3.5 text-sm font-semibold capitalize border-b-2 transition-all cursor-pointer ${
              activeTab === tab
                ? "border-blue-500 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            {tab === "docs" ? "documents" : tab === "notes" ? "internal notes" : tab === "sessions" ? "active sessions" : tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Organization details */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-150 pb-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Organization Overview</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Industry Sector</p>
                    <p className="text-slate-800 font-medium mt-0.5">{member.industry || "General"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-505 uppercase font-semibold">Country Operations</p>
                    <p className="text-slate-800 font-medium mt-0.5">{member.country || "Both"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-505 uppercase font-semibold">Location / City</p>
                    <p className="text-slate-800 font-medium mt-0.5">{member.city || "Not Provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-505 uppercase font-semibold">Website</p>
                    <p className="text-slate-800 mt-0.5 font-medium">
                      {member.website ? (
                        <a
                          href={member.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span>Visit Site</span>
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        "None"
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <p className="text-xs text-slate-505 uppercase font-semibold">Description</p>
                  <p className="text-slate-655 text-sm leading-relaxed whitespace-pre-line">
                    {member.company_description || "No description provided."}
                  </p>
                </div>

                {member.looking_for && member.looking_for.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <p className="text-xs text-slate-505 uppercase font-semibold">Partnerships Looking For</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {member.looking_for.map((item, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 text-xs text-slate-655 font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Representative and Validity details */}
            <div className="space-y-6">
              {/* Validity Card */}
              <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-150 pb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Membership Validity</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-550 uppercase font-semibold">Valid From</p>
                    <p className="text-slate-600 font-mono text-sm mt-0.5" suppressHydrationWarning>
                      {member.membership_start_date ? new Date(member.membership_start_date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-550 uppercase font-semibold">Valid Until (Expiry)</p>
                    <p className="text-slate-600 font-mono text-sm mt-0.5" suppressHydrationWarning>
                      {member.membership_end_date ? new Date(member.membership_end_date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Representative Card */}
              <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-150 pb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Primary Representative</span>
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-505 uppercase font-semibold">Name & Designation</p>
                    <p className="text-slate-800 font-medium mt-0.5">{member.full_name}</p>
                    <p className="text-xs text-slate-500">{member.designation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-505 uppercase font-semibold">Email</p>
                    <p className="text-slate-600 font-mono text-xs mt-0.5">{member.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-505 uppercase font-semibold">Phone</p>
                    <p className="text-slate-800 mt-0.5">{member.phone || "Not Provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Activities Tab */}
        {activeTab === "activity" && (
          <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-150 pb-3">
              <ClipboardList className="w-4 h-4 text-blue-600" />
              <span>Activity Trail & Audit Trail</span>
            </h3>

            {activityLogs.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No recent activity logged for this member.</p>
            ) : (
              <div className="relative border-l border-slate-200 pl-6 ml-3 space-y-6">
                {activityLogs.map((log) => {
                  const date = new Date(log.created_at);
                  return (
                    <div key={log.id} className="relative">
                      {/* Circle indicator */}
                      <span className="absolute -left-[30px] top-1.5 flex h-2.5 w-2.5 rounded-full bg-blue-600 border border-white" />
                      <div className="text-xs text-slate-500 font-mono">{date.toLocaleString()}</div>
                      <div className="text-sm font-semibold text-slate-900 mt-0.5 capitalize">
                        {log.action.replace(/_/g, " ")}
                      </div>
                      {log.new_values && (
                        <pre className="mt-2 text-[10px] font-mono text-slate-700 p-2.5 bg-slate-50 border border-slate-200 rounded overflow-x-auto max-w-lg">
                          {JSON.stringify(log.new_values, null, 2)}
                        </pre>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Internal Notes Tab */}
        {activeTab === "notes" && (
          <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-150 pb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Administrative Internal Notes</span>
            </h3>
            <p className="text-xs text-slate-500">
              These notes are strictly for admin references and will never be shown to the member representative.
            </p>
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Record notes on membership renewals, calls, or correspondence..."
              rows={8}
              className="w-full px-4 py-3 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-905 placeholder-slate-400 focus:outline-none transition-colors resize-none"
            />
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveNotes}
                disabled={isPending}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold cursor-pointer shadow-md transition-colors"
              >
                {isPending ? "Saving..." : "Save Internal Notes"}
              </button>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === "sessions" && (
          <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-150 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-blue-600" />
                  <span>Active & Historical Sessions</span>
                </h3>
                <p className="text-xs text-slate-505 mt-1">
                  Monitor active device connections and invalidate unauthorized sessions.
                </p>
              </div>
              {sessions.some((s) => !s.revoked_at) && (
                <button
                  onClick={handleForceLogoutAll}
                  disabled={isPending}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-705 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-md transition-colors disabled:opacity-50"
                >
                  Force Logout All Devices
                </button>
              )}
            </div>

            {sessions.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No login sessions found for this member.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Device & OS</th>
                      <th className="py-3 px-4">IP & Location</th>
                      <th className="py-3 px-4">Activity Timeline</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sessions.map((session) => {
                      const isUnmasked = !!unmaskedSessions[session.session_id];
                      const isActive = !session.revoked_at;
                      return (
                        <tr key={session.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-4">
                            <span className="font-semibold text-slate-800 block">
                              {session.browser || "Unknown Browser"} on {session.operating_system || "Unknown OS"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block max-w-xs truncate" title={session.user_agent}>
                              {session.user_agent}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs">
                            <div className="flex items-center gap-1.5 font-mono">
                              <span>{maskIpAddress(session.ip_address, isUnmasked)}</span>
                              <button
                                onClick={() => toggleIpMask(session.session_id)}
                                className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                {isUnmasked ? "Hide" : "Show"}
                              </button>
                            </div>
                            <span className="text-slate-500 mt-0.5 block">
                              {session.city || "Unknown City"}, {session.country || "Unknown Country"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs font-mono text-slate-550">
                            <div>Login: {new Date(session.login_at).toLocaleString()}</div>
                            <div className="text-slate-400 mt-0.5">Last Seen: {new Date(session.last_activity).toLocaleString()}</div>
                          </td>
                          <td className="py-4 px-4">
                            {isActive ? (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-250 text-xs font-semibold rounded-full">
                                Active
                              </span>
                            ) : (
                              <div className="space-y-0.5">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 text-xs font-semibold rounded-full">
                                  Revoked
                                </span>
                                <span className="text-[10px] text-slate-400 block font-sans">
                                  Reason: {session.revoke_reason || "Logout"}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            {isActive && (
                              <button
                                onClick={() => handleForceLogoutSession(session.session_id)}
                                disabled={isPending}
                                className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg text-xs font-semibold cursor-pointer border border-red-200 transition-colors disabled:opacity-50"
                              >
                                Force Sign Out
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "docs" && (
          <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-150 pb-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              <span>Associated Membership Documents</span>
            </h3>

            {/* Empty docs placeholder */}
            <div className="text-center py-10 border border-dashed border-slate-200 bg-slate-50/50 rounded-xl max-w-md mx-auto space-y-3">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <p className="text-sm font-semibold text-slate-900">No documents uploaded</p>
                <p className="text-xs text-slate-500 mt-1">Official certificates and verification files will appear here.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
