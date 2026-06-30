"use client";

import React, { useState, useTransition } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { createEvent, deleteEvent } from "@/features/cms/content/actions/events";
import { Plus, X, Trash2, Calendar, MapPin, Users, HelpCircle } from "lucide-react";

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

type EventsClientProps = {
  initialList: EventItem[];
};

export default function EventsClient({ initialList }: EventsClientProps) {
  const [list, setList] = useState(initialList);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [capacity, setCapacity] = useState(50);
  const [visibleTiers, setVisibleTiers] = useState<string[]>(["gold", "platinum"]);
  const [status, setStatus] = useState<"draft" | "open">("open");

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

  const handleClose = () => {
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
      const res = await createEvent({
        title,
        description: description || undefined,
        location,
        eventDate,
        registrationDeadline,
        capacity,
        visibleTiers: visibleTiers as any,
        status,
      });

      if (res.success) {
        setEventsSuccess("Invite-Only Event added successfully.");
        setIsOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setErrors({ general: res.error || "Failed to create event" });
      }
    });
  };

  const columns: ColumnDef<EventItem>[] = [
    {
      header: "Event Title",
      accessorKey: "title",
      cell: (item) => (
        <div>
          <span className="font-bold text-slate-900 block">{item.title}</span>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description || "No description."}</p>
        </div>
      ),
    },
    {
      header: "Schedule & Limit",
      cell: (item) => (
        <div className="space-y-1 text-slate-600 text-xs">
          <div className="flex items-center gap-1.5 font-mono">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{new Date(item.event_date).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Capacity: {item.capacity} guests</span>
          </div>
        </div>
      ),
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
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Actions",
      cell: (item) => (
        <button
          onClick={() => handleAction(item.id, deleteEvent, "delete")}
          className="p-1.5 text-red-655 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Delete Event"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

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

      {/* Table list */}
      <DataTable columns={columns} data={list} getRowId={(item) => item.id} />

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
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
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
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
              <h2 className="text-lg font-bold text-slate-900">Create Invite-Only Event</h2>
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
                    "Publish Event"
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
