"use client";

import React, { useState, useTransition, useMemo } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { createEvent, deleteEvent, updateEvent } from "@/features/cms/content/actions/events";
import { updateEventRegistrationStatus } from "@/features/cms/content/actions/registrations";
import { Plus, X, Trash2, Calendar, MapPin, Users, HelpCircle, Edit, UserCheck, Clock, Check, Ban, Printer, Search } from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  event_date: string;
  registration_deadline: string;
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

type EventRegistration = {
  id: string;
  event_id: string;
  member_id: string;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  profiles: RegistrationProfile | RegistrationProfile[] | null;
};

type EventsClientProps = {
  initialList: EventItem[];
  initialRegistrations: EventRegistration[];
};

export default function EventsClient({ initialList, initialRegistrations }: EventsClientProps) {
  const [list, setList] = useState(initialList);
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Active drawer for viewing participants
  const [activeEventForParticipants, setActiveEventForParticipants] = useState<EventItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [capacity, setCapacity] = useState(50);
  const [visibleTiers, setVisibleTiers] = useState<string[]>(["gold", "platinum"]);
  const [status, setStatus] = useState<"draft" | "open">("open");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedTier, setSelectedTier] = useState<string>("All");

  // Sorting State
  const [sortKey, setSortKey] = useState<string>("event_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    actionFn: (id: string) => Promise<any>;
    actionName: string;
  } | null>(null);
  const [eventsSuccess, setEventsSuccess] = useState("");
  const [eventsError, setEventsError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAction = (id: string, actionFn: (id: string) => Promise<any>, actionName: string) => {
    setConfirmAction({ id, actionFn, actionName });
  };

  const executeConfirmedAction = () => {
    if (!confirmAction) return;
    const { id, actionFn } = confirmAction;
    setConfirmAction(null);
    setEventsError("");
    setEventsSuccess("");

    startTransition(async () => {
      const res = await actionFn(id);
      if (res.success) {
        setEventsSuccess("Event deleted successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setEventsError(res.error || "Failed to delete event");
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

  const handleOpenEdit = (item: EventItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description || "");
    setLocation(item.location);
    if (item.event_date) {
      setEventDate(new Date(item.event_date).toISOString().slice(0, 16));
    }
    if (item.registration_deadline) {
      setRegistrationDeadline(new Date(item.registration_deadline).toISOString().slice(0, 16));
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
    setLocation("");
    setEventDate("");
    setRegistrationDeadline("");
    setCapacity(50);
    setVisibleTiers(["gold", "platinum"]);
    setStatus("open");
    setErrors({});
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setEventsError("");
    setEventsSuccess("");

    if (!title || !location || !eventDate || !registrationDeadline) {
      setErrors({ general: "Title, Location, Event Date and Deadline are required fields." });
      return;
    }

    if (new Date(registrationDeadline) >= new Date(eventDate)) {
      setErrors({ general: "Registration deadline must be before the event date." });
      return;
    }

    if (visibleTiers.length === 0) {
      setErrors({ general: "Select at least one visible membership tier." });
      return;
    }

    startTransition(async () => {
      const payload = {
        title,
        description: description || undefined,
        location,
        eventDate,
        registrationDeadline,
        capacity,
        visibleTiers: visibleTiers as any,
        status,
      };

      const res = editingId
        ? await updateEvent(editingId, payload)
        : await createEvent(payload);

      if (res.success) {
        setEventsSuccess(editingId ? "Event updated successfully." : "Invite-Only Event added successfully.");
        handleClose();
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setErrors({ general: res.error || "Failed to save event" });
      }
    });
  };

  const handleRegistrationStatus = (regId: string, nextStatus: "approved" | "rejected") => {
    setEventsError("");
    setEventsSuccess("");

    startTransition(async () => {
      const res = await updateEventRegistrationStatus(regId, nextStatus);
      if (res.success) {
        setEventsSuccess(`Registration status updated to ${nextStatus}.`);

        // Optimistic UI updates
        setRegistrations((prev) =>
          prev.map((r) => (r.id === regId ? { ...r, status: nextStatus } : r))
        );
      } else {
        setEventsError(res.error || "Failed to update registration status");
      }
    });
  };

  // Get registrations for a specific event
  const getEventRegs = (eventId: string) => {
    return registrations.filter((r) => r.event_id === eventId);
  };

  const handlePrintAttendeeList = (title: string, regs: EventRegistration[]) => {
    const approvedRegs = regs.filter((r) => r.status === "approved");
    if (approvedRegs.length === 0) {
      alert("There are no approved attendees for this event yet.");
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
              <div style="font-size: 11pt; color: #475569; margin-top: 4px;"><strong>Event:</strong> ${title}</div>
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

  const handleSort = (key: string, order: "asc" | "desc") => {
    setSortKey(key);
    setSortOrder(order);
  };

  const filteredAndSortedList = useMemo(() => {
    let result = [...list];

    // Search by title, description, or location
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query)) ||
          item.location.toLowerCase().includes(query)
      );
    }

    // Status Filter
    if (selectedStatus !== "All") {
      result = result.filter((item) => item.status === selectedStatus);
    }

    // Tier Filter
    if (selectedTier !== "All") {
      result = result.filter((item) =>
        item.visible_tiers.some((t) => t.toLowerCase() === selectedTier.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortKey as keyof EventItem];
      let bVal = b[sortKey as keyof EventItem];

      if (aVal === null || aVal === undefined) return sortOrder === "asc" ? 1 : -1;
      if (bVal === null || bVal === undefined) return sortOrder === "asc" ? -1 : 1;

      if (Array.isArray(aVal) || Array.isArray(bVal)) return 0;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return result;
  }, [list, searchQuery, selectedStatus, selectedTier, sortKey, sortOrder]);

  const DescriptionCell = ({ text }: { text: string | null }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    if (!text) return <p className="text-xs text-slate-500 mt-0.5">No description.</p>;

    const shouldTruncate = text.length > 80;

    return (
      <p className="text-xs text-slate-500 mt-0.5 max-w-md">
        {isExpanded || !shouldTruncate ? text : `${text.slice(0, 80)}...`}{" "}
        {shouldTruncate && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer focus:outline-none ml-1 inline-block"
          >
            {isExpanded ? "Read Less" : "Read More..."}
          </button>
        )}
      </p>
    );
  };

  const columns: ColumnDef<EventItem>[] = [
    {
      header: "Event Title",
      accessorKey: "title",
      sortable: true,
      cell: (item) => (
        <div>
          <span className="font-bold text-slate-900 block">{item.title}</span>
          <DescriptionCell text={item.description} />
        </div>
      ),
    },
    {
      header: "Schedule & Limit",
      accessorKey: "event_date",
      sortable: true,
      cell: (item) => {
        const itemRegs = getEventRegs(item.id);
        const approvedCount = itemRegs.filter((r) => r.status === "approved").length;
        const pendingCount = itemRegs.filter((r) => r.status === "pending").length;

        return (
          <div className="space-y-1 text-slate-600 text-xs">
            <div className="flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span suppressHydrationWarning>{new Date(item.event_date).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                Guests: <strong className="text-slate-900">{approvedCount}</strong>/{item.capacity}
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
      sortable: true,
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
          {item.visible_tiers.map((t, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-[10px] uppercase font-semibold text-slate-650 rounded border border-slate-200">
              {t}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Actions",
      cell: (item) => {
        const itemRegs = getEventRegs(item.id);
        const pendingCount = itemRegs.filter((r) => r.status === "approved").length;

        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveEventForParticipants(item)}
              className="p-1.5 hover:bg-blue-550/10 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer relative"
              title="View Registrations"
            >
              <UserCheck className="w-4 h-4" />
              {itemRegs.filter((r) => r.status === "pending").length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
              )}
            </button>
            <button
              onClick={() => handleOpenEdit(item)}
              className="p-1.5 hover:bg-slate-150 text-slate-550 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Edit Event"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAction(item.id, deleteEvent, "delete")}
              className="p-1.5 text-red-655 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete Event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const participantRegs = activeEventForParticipants ? getEventRegs(activeEventForParticipants.id) : [];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-8 h-8 text-blue-600 shrink-0" />
            <span>Manage Invite-Only Events</span>
          </h1>
          <p className="text-slate-655 mt-1">Publish bilateral trade summits, roundtable dinners, and matchings events.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Event</span>
        </button>
      </div>

      {eventsError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {eventsError}
        </div>
      )}
      {eventsSuccess && (
        <div className="p-3 bg-emerald-550/10 border border-emerald-500/20 text-emerald-700 text-sm rounded-lg animate-pulse">
          {eventsSuccess}
        </div>
      )}

      {/* Search & Filter Panel */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by event title, details, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status */}
          <div className="flex-1 md:flex-initial min-w-[160px]">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="open">Open Registration</option>
              <option value="draft">Draft Notice</option>
            </select>
          </div>

          {/* Tier */}
          <div className="flex-1 md:flex-initial min-w-[160px]">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-700 focus:outline-none"
            >
              <option value="All">All Tiers</option>
              <option value="Associate">Associate</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table list */}
      <DataTable
        columns={columns}
        data={filteredAndSortedList}
        getRowId={(item) => item.id}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {/* View Registrations / Participants Drawer */}
      {activeEventForParticipants && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm p-0 font-sans">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col text-slate-800 animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-150 bg-slate-50">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Registrations Review</span>
                <h2 className="text-lg font-bold text-slate-900 line-clamp-1 mt-0.5">
                  {activeEventForParticipants.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {participantRegs.filter((r) => r.status === "approved").length > 0 && (
                  <button
                    onClick={() => handlePrintAttendeeList(activeEventForParticipants.title, participantRegs)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    title="Download attendee list as printable landscape sign-in sheet"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Download Sheet</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveEventForParticipants(null)}
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
                    <p className="font-semibold text-slate-850">No registrations yet</p>
                    <p className="text-xs text-slate-500 mt-1">No registration sign-ups have been recorded for this event.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {participantRegs.map((reg) => {
                    const p = Array.isArray(reg.profiles) ? reg.profiles[0] : reg.profiles;
                    return (
                      <div
                        key={reg.id}
                        className="p-4 border border-slate-200 rounded-xl bg-white flex flex-col shadow-sm gap-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-550/10 bg-red-50 border border-red-200 hover:bg-red-100 text-red-705 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
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

                        {reg.message && (
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-655 leading-relaxed whitespace-pre-wrap">
                            <strong className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Registration Message:</strong>
                            {reg.message}
                          </div>
                        )}
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
            <p className="text-sm text-slate-600">
              Are you sure you want to {confirmAction.actionName} this event?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-550 hover:text-slate-800 transition-colors cursor-pointer"
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-905">
                {editingId ? "Edit Invite-Only Event" : "Create Invite-Only Event"}
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
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Event Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. India-Japan Semiconductor Roundtable 2026"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bilateral meeting agenda details, security checks..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Event Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registration Deadline</label>
                  <input
                    type="datetime-local"
                    required
                    value={registrationDeadline}
                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Capacity (Guests)</label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Venue / Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Imperial Hotel Tokyo, Sakura Hall"
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tiers Checkboxes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Visible Membership Tiers</label>
                <div className="flex flex-wrap gap-4 mt-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {["associate", "silver", "gold", "platinum"].map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm text-slate-705 capitalize cursor-pointer">
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
                  className="px-4 py-2 text-sm font-semibold text-slate-555 hover:text-slate-800 transition-colors cursor-pointer"
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
