"use client";

import React, { useState, useTransition } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { createTraining, deleteTraining, updateTraining } from "@/features/cms/content/actions/training";
import { updateTrainingRegistrationStatus } from "@/features/cms/content/actions/registrations";
import { Plus, X, Trash2, BookOpen, Calendar, MapPin, Users, Edit, UserCheck, AlertCircle, Clock, Check, Ban, Printer } from "lucide-react";

type TrainingItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  duration: string;
  location: string;
  start_date: string;
  end_date: string;
  capacity: number;
  visible_tiers: string[];
  status: string;
};

type RegistrationProfile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  membership_tier: string;
};

type TrainingRegistration = {
  id: string;
  training_id: string;
  member_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  profiles: RegistrationProfile | RegistrationProfile[] | null;
};

type TrainingClientProps = {
  initialList: TrainingItem[];
  initialRegistrations: TrainingRegistration[];
};

export default function TrainingClient({ initialList, initialRegistrations }: TrainingClientProps) {
  const [list, setList] = useState(initialList);
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Active drawer for viewing participants
  const [activeTrainingForParticipants, setActiveTrainingForParticipants] = useState<TrainingItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"Culture" | "Language" | "Corporate" | "Leadership" | "Seminar">("Corporate");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [capacity, setCapacity] = useState(20);
  const [visibleTiers, setVisibleTiers] = useState<string[]>(["associate"]);
  const [status, setStatus] = useState<"draft" | "open">("open");

  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    actionFn: (id: string) => Promise<any>;
    actionName: string;
  } | null>(null);
  const [trainingSuccess, setTrainingSuccess] = useState("");
  const [trainingError, setTrainingError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAction = (id: string, actionFn: (id: string) => Promise<any>, actionName: string) => {
    setConfirmAction({ id, actionFn, actionName });
  };

  const executeConfirmedAction = () => {
    if (!confirmAction) return;
    const { id, actionFn } = confirmAction;
    setConfirmAction(null);
    setTrainingError("");
    setTrainingSuccess("");

    startTransition(async () => {
      const res = await actionFn(id);
      if (res.success) {
        setTrainingSuccess("Program deleted successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setTrainingError(res.error || "Failed to delete program");
      }
    });
  };

  const handleTierToggle = (tier: string) => {
    if (visibleTiers.includes(tier)) {
      setVisibleTiers(visibleTiers.filter((t) => t !== tier));
    } else {
      setVisibleTiers([...visibleTiers, tier]);
    }
  };

  const handleOpenEdit = (item: TrainingItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description || "");
    setCategory(item.category as any);
    setDuration(item.duration);
    setLocation(item.location);
    if (item.start_date) {
      setStartDate(new Date(item.start_date).toISOString().split("T")[0]);
    }
    if (item.end_date) {
      setEndDate(new Date(item.end_date).toISOString().split("T")[0]);
    }
    setCapacity(item.capacity);
    setVisibleTiers(item.visible_tiers);
    setStatus(item.status as any);
    setIsOpen(true);
  };

  const handleClose = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("Corporate");
    setDuration("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setCapacity(20);
    setVisibleTiers(["associate"]);
    setStatus("open");
    setErrors({});
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setTrainingError("");
    setTrainingSuccess("");

    if (!title || !duration || !location || !startDate || !endDate) {
      setErrors({ general: "All date, location and title fields are required." });
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setErrors({ general: "End date must be after start date." });
      return;
    }

    if (visibleTiers.length === 0) {
      setErrors({ general: "Select at least one membership tier." });
      return;
    }

    startTransition(async () => {
      const payload = {
        title,
        description: description || undefined,
        category,
        duration,
        location,
        startDate,
        endDate,
        capacity,
        visibleTiers: visibleTiers as any,
        status,
      };

      const res = editingId
        ? await updateTraining(editingId, payload)
        : await createTraining(payload);

      if (res.success) {
        setTrainingSuccess(editingId ? "Training Program updated successfully." : "Training Program added successfully.");
        handleClose();
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setErrors({ general: res.error || "Failed to save program" });
      }
    });
  };

  const handleRegistrationStatus = (regId: string, nextStatus: "approved" | "rejected") => {
    setTrainingError("");
    setTrainingSuccess("");

    startTransition(async () => {
      const res = await updateTrainingRegistrationStatus(regId, nextStatus);
      if (res.success) {
        setTrainingSuccess(`Registration status updated to ${nextStatus}.`);

        // Optimistic UI updates
        setRegistrations((prev) =>
          prev.map((r) => (r.id === regId ? { ...r, status: nextStatus } : r))
        );
      } else {
        setTrainingError(res.error || "Failed to update registration status");
      }
    });
  };

  // Get registrations for a specific training
  const getTrainingRegs = (trainingId: string) => {
    return registrations.filter((r) => r.training_id === trainingId);
  };

  const handlePrintAttendeeList = (title: string, regs: TrainingRegistration[]) => {
    const approvedRegs = regs.filter((r) => r.status === "approved");
    if (approvedRegs.length === 0) {
      alert("There are no approved attendees for this program yet.");
      return;
    }

    // Group by tier
    const tiersOrder = ["platinum", "gold", "silver", "associate"];
    const grouped: Record<string, typeof approvedRegs> = {};
    tiersOrder.forEach((t) => { grouped[t] = []; });

    approvedRegs.forEach((reg) => {
      const p = Array.isArray(reg.profiles) ? reg.profiles[0] : reg.profiles;
      const tier = (p?.membership_tier || "associate").toLowerCase();
      if (!grouped[tier]) {
        grouped[tier] = [];
      }
      grouped[tier].push(reg);
    });

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let tablesHtml = "";
    tiersOrder.forEach((tier) => {
      const list = grouped[tier];
      if (list.length === 0) return;

      tablesHtml += `
        <div class="tier-section">
          <h2 class="tier-header">${tier.toUpperCase()} MEMBER TIER</h2>
          <table>
            <thead>
              <tr>
                <th style="width: 25%">Company Name</th>
                <th style="width: 20%">Representative Name</th>
                <th style="width: 20%">Email</th>
                <th style="width: 15%">Contact Number</th>
                <th style="width: 10%">Signature</th>
                <th style="width: 10%">Remarks</th>
              </tr>
            </thead>
            <tbody>
              ${list.map((reg) => {
        const p = Array.isArray(reg.profiles) ? reg.profiles[0] : reg.profiles;
        return `
                  <tr>
                    <td><strong>${p?.company_name || "N/A"}</strong></td>
                    <td>${p?.full_name || "N/A"}</td>
                    <td>${p?.email || "N/A"}</td>
                    <td>${p?.phone || "N/A"}</td>
                    <td class="empty-cell"></td>
                    <td class="empty-cell"></td>
                  </tr>
                `;
      }).join("")}
            </tbody>
          </table>
        </div>
      `;
    });

    printWindow.document.write(`
      <html>
        <head>
          <title>Attendee Sign-In List - ${title}</title>
          <style>
            @page {
              size: landscape;
              margin: 15mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #1e293b;
              margin: 0;
              padding: 0;
              font-size: 11pt;
            }
            .header {
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 10px;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .header h1 {
              margin: 0;
              font-size: 18pt;
              color: #0f172a;
            }
            .header-meta {
              font-size: 9pt;
              color: #64748b;
              text-align: right;
            }
            .tier-section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .tier-header {
              font-size: 11pt;
              font-weight: bold;
              background-color: #f1f5f9;
              padding: 6px 12px;
              margin: 0 0 10px 0;
              border-left: 4px solid #3b82f6;
              color: #334155;
              letter-spacing: 0.05em;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 8px 10px;
              text-align: left;
              vertical-align: middle;
            }
            th {
              background-color: #f8fafc;
              font-weight: bold;
              font-size: 9.5pt;
              color: #475569;
            }
            td {
              font-size: 9.5pt;
            }
            .empty-cell {
              background-color: #fafafa;
            }
            .footer {
              position: fixed;
              bottom: 0;
              width: 100%;
              text-align: center;
              font-size: 8pt;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>ATTENDEE SIGN-IN SHEET</h1>
              <div style="font-size: 11pt; color: #475569; margin-top: 4px;"><strong>Program:</strong> ${title}</div>
            </div>
            <div class="header-meta">
              <div>Japan India Business Bureau (JIBB)</div>
              <div>Generated: ${new Date().toLocaleDateString()}</div>
            </div>
          </div>
          ${tablesHtml}
          <div class="footer">
            Japan India Business Bureau &copy; ${new Date().getFullYear()} - Confidential Internal Document
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const columns: ColumnDef<TrainingItem>[] = [
    {
      header: "Program Title",
      accessorKey: "title",
      cell: (item) => (
        <div>
          <span className="font-bold text-slate-900 block">{item.title}</span>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description || "No description."}</p>
        </div>
      ),
    },
    {
      header: "Category & Duration",
      accessorKey: "category",
      cell: (item) => (
        <div>
          <span className="text-xs font-semibold text-slate-800">{item.category}</span>
          <p className="text-[10px] text-slate-500 mt-0.5">{item.duration}</p>
        </div>
      ),
    },
    {
      header: "Schedule & Capacity",
      cell: (item) => {
        const itemRegs = getTrainingRegs(item.id);
        const approvedCount = itemRegs.filter((r) => r.status === "approved").length;
        const pendingCount = itemRegs.filter((r) => r.status === "pending").length;

        return (
          <div className="space-y-1 text-slate-600 text-xs">
            <div className="flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span suppressHydrationWarning>{new Date(item.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                Seats: <strong className="text-slate-900">{approvedCount}</strong>/{item.capacity}
              </span>
            </div>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 font-semibold px-1.5 py-0.5 rounded border border-amber-200">
                <Clock className="w-3 h-3" />
                {pendingCount} pending reviews
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: (item) => (
        <div className="flex items-center gap-1 text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate max-w-xs">{item.location}</span>
        </div>
      ),
    },
    {
      header: "Visible Tiers",
      accessorKey: "visible_tiers",
      cell: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.visible_tiers.map((tier) => (
            <span
              key={tier}
              className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wider border border-slate-200"
            >
              {tier}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Actions",
      cell: (item) => {
        const itemRegs = getTrainingRegs(item.id);
        const pendingCount = itemRegs.filter((r) => r.status === "pending").length;

        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTrainingForParticipants(item)}
              className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer relative"
              title="View Registrations"
            >
              <UserCheck className="w-4 h-4" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
              )}
            </button>
            <button
              onClick={() => handleOpenEdit(item)}
              className="p-1.5 text-slate-555 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Edit Program"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAction(item.id, deleteTraining, "delete")}
              className="p-1.5 text-red-655 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete Program"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const participantRegs = activeTrainingForParticipants ? getTrainingRegs(activeTrainingForParticipants.id) : [];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-600 shrink-0" />
            <span>Manage Training Programs</span>
          </h1>
          <p className="text-slate-600 mt-1">Configure classes, workshops, and business seminars for JIBB members.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Program</span>
        </button>
      </div>

      {trainingError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {trainingError}
        </div>
      )}
      {trainingSuccess && (
        <div className="p-3 bg-emerald-550/10 border border-emerald-500/20 text-emerald-700 text-sm rounded-lg animate-pulse">
          {trainingSuccess}
        </div>
      )}

      {/* Table list */}
      <DataTable columns={columns} data={list} getRowId={(item) => item.id} />

      {/* View Registrations / Participants Drawer */}
      {activeTrainingForParticipants && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm p-0 font-sans">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col text-slate-800 animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-150 bg-slate-50">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Registrations Review</span>
                <h2 className="text-lg font-bold text-slate-900 line-clamp-1 mt-0.5">
                  {activeTrainingForParticipants.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {participantRegs.filter((r) => r.status === "approved").length > 0 && (
                  <button
                    onClick={() => handlePrintAttendeeList(activeTrainingForParticipants.title, participantRegs)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    title="Download attendee list as printable landscape sign-in sheet"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Download Sheet</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveTrainingForParticipants(null)}
                  className="text-slate-500 hover:text-slate-905 cursor-pointer p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {participantRegs.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <Users className="w-10 h-10 text-slate-400 mx-auto" />
                  <div>
                    <p className="font-semibold text-slate-850">No participants yet</p>
                    <p className="text-xs text-slate-500 mt-1">No registration sign-ups have been recorded for this workshop.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {participantRegs.map((reg) => {
                    const p = Array.isArray(reg.profiles) ? reg.profiles[0] : reg.profiles;
                    return (
                      <div
                        key={reg.id}
                        className="p-4 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {p?.company_name || "Unspecified Organization"}
                            </span>
                            {p?.membership_tier && (
                              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[9px] uppercase font-bold text-slate-600 tracking-wider">
                                {p.membership_tier}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 font-medium">
                            Rep: {p?.full_name || "Unknown Coordinator"} • <span className="font-mono text-slate-500">{p?.email || "No Email"}</span>
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono block" suppressHydrationWarning>
                            Requested at: {new Date(reg.created_at).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                          {reg.status === "pending" ? (
                            <>
                              <button
                                disabled={isPending}
                                onClick={() => handleRegistrationStatus(reg.id, "approved")}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                disabled={isPending}
                                onClick={() => handleRegistrationStatus(reg.id, "rejected")}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-650 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          ) : (
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${reg.status === "approved"
                              ? "bg-emerald-50 border-emerald-250 text-emerald-700"
                              : "bg-red-50 border-red-200 text-red-700"
                              }`}>
                              {reg.status}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action confirmation dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 capitalize">
              Confirm {confirmAction.actionName} Action
            </h3>
            <p className="text-sm text-slate-650">
              Are you sure you want to {confirmAction.actionName} this program?
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

      {/* Dialog Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/40 backdrop-blur-sm p-4 font-sans overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8 text-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? "Edit Training Program" : "Create Training Program"}
              </h2>
              <button onClick={handleClose} className="text-slate-500 hover:text-slate-905 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {errors.general}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Program Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cross-Cultural Corporate Etiquette Seminar"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline syllabus, key goals, and targets..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-550 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="Corporate">Corporate Training</option>
                    <option value="Culture">Cultural Onboarding</option>
                    <option value="Language">Language Class</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-550 uppercase tracking-wider">Duration (e.g. 3 Weeks, 5 Hours)</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 2 Days, 4 Hours total"
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-550 uppercase tracking-wider">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 rounded-lg text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-550 uppercase tracking-wider">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 rounded-lg text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-550 uppercase tracking-wider">Capacity (Seats)</label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 rounded-lg text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-555 uppercase tracking-wider">Location / Venue</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Hybrid / Tokyo Hall / Online Zoom"
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tiers Checkboxes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Visible Membership Tiers</label>
                <div className="flex flex-wrap gap-4 mt-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {["associate", "silver", "gold", "platinum"].map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm text-slate-700 capitalize cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleTiers.includes(t)}
                        onChange={() => handleTierToggle(t)}
                        className="rounded border-slate-350 bg-white text-blue-600 focus:ring-blue-550/20 w-4 h-4 cursor-pointer"
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "open"}
                      onChange={() => setStatus("open")}
                      className="text-blue-600 focus:ring-blue-550/20 cursor-pointer"
                    />
                    <span>Open Registration</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "draft"}
                      onChange={() => setStatus("draft")}
                      className="text-blue-600 focus:ring-blue-550/20 cursor-pointer"
                    />
                    <span>Draft Notice</span>
                  </label>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-md transition-colors cursor-pointer flex items-center justify-center min-w-28"
                >
                  {isPending ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    editingId ? "Save Changes" : "Publish Program"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
