"use client";

import React, { useState } from "react";
import { Calendar, Search, MapPin, Users, ChevronDown, ChevronUp, CheckCircle, Info, X, AlertTriangle } from "lucide-react";
import { registerForEvent, cancelEventRegistration } from "@/features/cms/content/actions/portal-events";
import { EmptyState } from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";

type EventItem = {
  id: string;
  title: string;
  description: string | null;
  banner: string | null;
  location: string;
  event_date: string;
  registration_deadline: string;
  capacity: number;
  visible_tiers: string[];
  status: string;
  approved_count?: number;
};

type Registration = {
  id: string;
  event_id: string;
  member_id: string;
  status: "pending" | "approved" | "rejected";
  message: string | null;
};

type PortalEventsClientProps = {
  events: EventItem[];
  registrations: Registration[];
  currentUserId: string;
};

export default function PortalEventsClient({ events, registrations, currentUserId }: PortalEventsClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Registration form dialog
  const [showRegDialog, setShowRegDialog] = useState<string | null>(null); // holds eventId
  const [regMessage, setRegMessage] = useState("");

  // Feedback states
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRegDialog) return;

    setErrorMsg("");
    setSuccessMsg("");
    setIsPending(true);

    try {
      const res = await registerForEvent(showRegDialog, regMessage);
      if (res.success) {
        setSuccessMsg("Event registration request submitted successfully.");
        setShowRegDialog(null);
        setRegMessage("");
        router.refresh();
      } else {
        setErrorMsg(res.error || "Failed to submit registration.");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  const handleCancel = async (eventId: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsPending(true);

    try {
      const res = await cancelEventRegistration(eventId);
      if (res.success) {
        setSuccessMsg("Your registration has been cancelled successfully.");
        router.refresh();
      } else {
        setErrorMsg(res.error || "Failed to cancel registration.");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  const filtered = events.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(term) ||
      (item.description || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Calendar className="w-8 h-8 text-blue-600 shrink-0" />
          <span>Invite-Only Events</span>
        </h1>
        <p className="text-slate-600 mt-1">Exclusive business networking dinners, high-level bilateral roundtables, and VIP delegator meets.</p>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-green-500 hover:text-green-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Notification Alert */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg("")} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Row */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search VIP summits and exclusive events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Events Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Events Found"
          description="There are no scheduled roundtables or networking events matching your active session filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            
            const userReg = registrations.find(
              (r) => r.event_id === item.id && r.member_id === currentUserId
            );
            const seatsRemaining = Math.max(0, item.capacity - (item.approved_count || 0));
            
            const isRegistered = !!userReg;
            const regStatus = userReg?.status;

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  {item.banner ? (
                    <img
                      src={item.banner}
                      alt={item.title}
                      className="w-full h-44 object-cover border-b border-slate-100"
                    />
                  ) : (
                    <div className="w-full h-36 bg-gradient-to-br from-slate-50 to-slate-100/50 border-b border-slate-100 flex items-center justify-center text-slate-350">
                      <Calendar className="w-10 h-10 stroke-1" />
                    </div>
                  )}

                  <div className="p-5 space-y-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                          Invite Only
                        </span>
                        <span className="text-xs font-mono text-slate-500" suppressHydrationWarning>
                          Deadline: {new Date(item.registration_deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-505 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <span suppressHydrationWarning>{new Date(item.event_date).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <Users className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{seatsRemaining} of {item.capacity} seats remaining</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100/50 bg-slate-50/50 flex flex-col space-y-3">
                  <div className="flex items-center justify-between gap-4 w-full">
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-505 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? "Hide Details" : "View Agenda"}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isRegistered ? (
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          regStatus === "approved"
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-amber-50 border-amber-200 text-amber-700"
                        }`}>
                          {regStatus === "approved" ? "Approved" : "Pending"}
                        </span>
                        <button
                          onClick={() => handleCancel(item.id)}
                          disabled={isPending}
                          className="px-3 py-1.5 border border-red-200 text-red-650 hover:bg-red-50 text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowRegDialog(item.id)}
                        disabled={isPending || seatsRemaining === 0}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer disabled:cursor-not-allowed"
                      >
                        {seatsRemaining === 0 ? "Fully Booked" : "RSVP Program"}
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-200/50 space-y-2 text-xs text-slate-600 leading-relaxed">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-slate-400 uppercase tracking-wider">Executive Overview & Agenda</h4>
                        <p className="whitespace-pre-wrap">{item.description || "The detailed schedule will be shared directly with registered VIP attendees."}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RSVP Registration Modal Dialog */}
      {showRegDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
              <h3 className="text-base font-bold text-slate-900">Event RSVP Details</h3>
              <button
                onClick={() => setShowRegDialog(null)}
                className="text-slate-400 hover:text-slate-650"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Coordinator Message / Requirements (Optional)
                </label>
                <textarea
                  placeholder="Specify any dietary restrictions, coordinator requirements, or meeting objectives..."
                  value={regMessage}
                  onChange={(e) => setRegMessage(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-150 flex gap-2 text-xs text-slate-505">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Attendance is subject to capacity confirmation. You will receive an official notification circular once approved.</span>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRegDialog(null)}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  Submit RSVP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
