"use client";

import React, { useState } from "react";
import { BookOpen, Search, Calendar, MapPin, Users, ChevronDown, ChevronUp, CheckCircle, Info, RefreshCw, X, AlertTriangle } from "lucide-react";
import { registerForTraining, cancelTrainingRegistration } from "@/features/cms/content/actions/portal-training";
import { EmptyState } from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";

type TrainingProgram = {
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

type Registration = {
  id: string;
  training_id: string;
  member_id: string;
  status: "pending" | "approved" | "rejected";
};

type PortalTrainingClientProps = {
  programs: TrainingProgram[];
  registrations: Registration[];
  currentUserId: string;
};

export default function PortalTrainingClient({ programs, registrations, currentUserId }: PortalTrainingClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Status and feedback states
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleRegister = async (trainingId: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsPending(true);

    try {
      const res = await registerForTraining(trainingId);
      if (res.success) {
        setSuccessMsg("Registration request submitted successfully.");
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

  const handleCancel = async (trainingId: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsPending(true);

    try {
      const res = await cancelTrainingRegistration(trainingId);
      if (res.success) {
        setSuccessMsg("Your registration has been cancelled.");
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

  // Filter
  const filtered = programs.filter((item) => {
    const term = search.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(term) ||
      (item.description || "").toLowerCase().includes(term);
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-600 shrink-0" />
          <span>Training & Skill Development</span>
        </h1>
        <p className="text-slate-600 mt-1">Browse upcoming capacity development workshops, business culture courses, and corporate training programs.</p>
      </div>

      {/* Inline Feedback Alerts */}
      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-green-500 hover:text-green-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Feedback Alerts */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg("")} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search programs and course names..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Disciplines</option>
            <option value="Culture">Culture</option>
            <option value="Language">Language</option>
            <option value="Corporate">Corporate</option>
            <option value="Leadership">Leadership</option>
            <option value="Problem Solving">Problem Solving</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
          </select>
        </div>
      </div>

      {/* Programs List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Programs Available"
          description="There are no active training schedules matching your filtering options."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            
            // Map registration status
            const userReg = registrations.find(
              (r) => r.training_id === item.id && r.member_id === currentUserId
            );
            const registeredCount = registrations.filter(
              (r) => r.training_id === item.id && r.status !== "rejected"
            ).length;
            const seatsRemaining = Math.max(0, item.capacity - registeredCount);
            
            const isRegistered = !!userReg;
            const regStatus = userReg?.status; // 'pending', 'approved', 'rejected'

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Duration: {item.duration}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>

                    {/* Metadata Badges Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-505 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span suppressHydrationWarning>{new Date(item.start_date).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-xs">{item.location}</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{seatsRemaining} of {item.capacity} seats remaining</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                      title={isExpanded ? "Collapse course details" : "Expand course details"}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {isRegistered ? (
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider ${
                          regStatus === "approved"
                            ? "bg-green-50 border border-green-200 text-green-700"
                            : "bg-amber-50 border border-amber-200 text-amber-700"
                        }`}>
                          {regStatus === "approved" ? "Approved" : "Pending Review"}
                        </span>
                        
                        <button
                          onClick={() => handleCancel(item.id)}
                          disabled={isPending}
                          className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Cancel Sign-up
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRegister(item.id)}
                        disabled={isPending || seatsRemaining === 0}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer disabled:cursor-not-allowed"
                      >
                        {seatsRemaining === 0 ? "Seats Full" : "Register Program"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-slate-100 bg-slate-50/50">
                    <div className="pt-4 space-y-4 text-sm text-slate-700">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course Syllabus & Description</h4>
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {item.description || "Detailed syllabus and agenda particulars will be issued by email invitation prior to course initiation."}
                        </p>
                      </div>

                      <div className="p-4 bg-white rounded-xl border border-slate-200 flex items-start gap-2 text-xs text-slate-500">
                        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <p>Registration cancellations must be requested at least 48 hours prior to start date. A JIBB representative will facilitate coordinator matching once approved.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
