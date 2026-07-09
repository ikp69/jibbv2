"use client";

import React, { useState, useTransition } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { createTraining, deleteTraining, updateTraining } from "@/features/cms/content/actions/training";
import { Plus, X, Trash2, BookOpen, Calendar, MapPin, Users, Edit } from "lucide-react";

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

type TrainingClientProps = {
  initialList: TrainingItem[];
};

export default function TrainingClient({ initialList }: TrainingClientProps) {
  const [list, setList] = useState(initialList);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
      cell: (item) => (
        <div className="space-y-1 text-slate-600 text-xs">
          <div className="flex items-center gap-1.5 font-mono">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span suppressHydrationWarning>{new Date(item.start_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Capacity: {item.capacity} seats</span>
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
      header: "Status",
      accessorKey: "status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Actions",
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 text-slate-550 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
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
      ),
    },
  ];

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

      {/* Action confirmation dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 capitalize">
              Confirm {confirmAction.actionName} Action
            </h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to {confirmAction.actionName} this program?
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
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Program Title</label>
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
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description (Optional)</label>
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
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
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
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration (e.g. 3 Weeks, 5 Hours)</label>
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
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 rounded-lg text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 rounded-lg text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Capacity (Seats)</label>
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
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location / Venue</label>
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
