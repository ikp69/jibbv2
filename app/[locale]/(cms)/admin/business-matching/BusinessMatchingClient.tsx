"use client";

import React, { useState, useTransition, useMemo } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  createOpportunity, 
  deleteOpportunity, 
  updateOpportunityInterestStatus,
  approveOpportunity,
  rejectOpportunity,
  getOpportunityEditHistory
} from "@/features/cms/business/actions/opportunities";
import { Plus, X, Trash2, Calendar, FileText, CheckCircle, AlertCircle, RefreshCw, Briefcase, ThumbsUp, ThumbsDown, Search } from "lucide-react";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  industry: string;
  country: string;
  looking_for: string[];
  deadline: string;
  visible_tiers: string[];
  status: string;
  profiles: {
    company_name: string | null;
    email: string | null;
    membership_tier: string | null;
  } | null;
};

type Pitch = {
  id: string;
  opportunity_id: string;
  message: string;
  supporting_document_url: string | null;
  status: string;
  created_at: string;
  profiles: {
    company_name: string | null;
    email: string | null;
    membership_tier: string | null;
  } | null;
};

type BusinessMatchingClientProps = {
  opportunities: Opportunity[];
  pitches: Pitch[];
};

type TabType = "active" | "pending";

export default function BusinessMatchingClient({ opportunities, pitches }: BusinessMatchingClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  const toggleDescriptionExpand = (id: string) => {
    setExpandedDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Form Fields for Admin-created Opportunities
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState<"Semiconductors" | "Manufacturing" | "Healthcare" | "Automotive" | "Electronics" | "Energy" | "Infrastructure" | "Food" | "General">("General");
  const [country, setCountry] = useState<"Japan" | "India" | "Both">("Both");
  const [lookingForText, setLookingForText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [visibleTiers, setVisibleTiers] = useState<string[]>(["associate"]);
  const [status, setStatus] = useState<"draft" | "published">("published");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [selectedTier, setSelectedTier] = useState<string>("All");

  // Sorting State
  const [sortKey, setSortKey] = useState<string>("deadline");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [matchingSuccess, setMatchingSuccess] = useState("");
  const [matchingError, setMatchingError] = useState("");
  const [selectedHistoryOppId, setSelectedHistoryOppId] = useState<string | null>(null);
  const [editHistoryList, setEditHistoryList] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    actionFn: (id: string) => Promise<any>;
    actionName: string;
  } | null>(null);

  const handleAction = (id: string, actionFn: (id: string) => Promise<any>, actionName: string) => {
    setConfirmAction({ id, actionFn, actionName });
  };

  const executeConfirmedAction = () => {
    if (!confirmAction) return;
    const { id, actionFn } = confirmAction;
    setConfirmAction(null);
    setMatchingError("");
    setMatchingSuccess("");

    startTransition(async () => {
      const res = await actionFn(id);
      if (res.success) {
        setMatchingSuccess("Action executed successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setMatchingError(res.error || "Action failed");
      }
    });
  };

  const handleApprove = (id: string) => {
    setMatchingError("");
    setMatchingSuccess("");
    startTransition(async () => {
      const res = await approveOpportunity(id);
      if (res.success) {
        setMatchingSuccess("Member matching proposal approved and published.");
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setMatchingError(res.error || "Failed to approve proposal");
      }
    });
  };

  const handleReject = (id: string) => {
    setMatchingError("");
    setMatchingSuccess("");
    startTransition(async () => {
      const res = await rejectOpportunity(id);
      if (res.success) {
        setMatchingSuccess("Member matching proposal rejected.");
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setMatchingError(res.error || "Failed to reject proposal");
      }
    });
  };

  const handleUpdatePitchStatus = (pitchId: string, nextStatus: "pending" | "reviewed" | "approved" | "rejected") => {
    setMatchingError("");
    setMatchingSuccess("");

    startTransition(async () => {
      const res = await updateOpportunityInterestStatus(pitchId, nextStatus);
      if (res.success) {
        setMatchingSuccess(`Pitch status updated to ${nextStatus}.`);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setMatchingError(res.error || "Failed to update pitch status");
      }
    });
  };

  const handleLoadHistory = async (oppId: string) => {
    setSelectedHistoryOppId(oppId);
    setHistoryLoading(true);
    const res = await getOpportunityEditHistory(oppId);
    if (res.success && res.history) {
      setEditHistoryList(res.history);
    } else {
      setEditHistoryList([]);
    }
    setHistoryLoading(false);
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
    setIndustry("General");
    setCountry("Both");
    setLookingForText("");
    setDeadline("");
    setVisibleTiers(["associate"]);
    setStatus("published");
    setErrors({});
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMatchingError("");
    setMatchingSuccess("");

    if (!title || !description || !lookingForText || !deadline) {
      setErrors({ general: "All fields are required." });
      return;
    }

    const lookingFor = lookingForText.split(",").map((s) => s.trim()).filter(Boolean);

    startTransition(async () => {
      const res = await createOpportunity({
        title,
        description,
        industry,
        country,
        lookingFor,
        deadline,
        visibleTiers: visibleTiers as any,
        status,
      });

      if (res.success) {
        setMatchingSuccess("Business Matching Opportunity published successfully.");
        setIsOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setErrors({ general: res.error || "Failed to create opportunity" });
      }
    });
  };

  const handleSort = (key: string, order: "asc" | "desc") => {
    setSortKey(key);
    setSortOrder(order);
  };

  // Filter lists based on tab
  const pendingOpportunities = opportunities.filter((o) => o.status === "pending_approval");
  const activeOpportunities = opportunities.filter((o) => o.status !== "pending_approval");

  const filteredAndSortedActive = useMemo(() => {
    let result = [...activeOpportunities];

    // Search by title, description, or company name
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (item.profiles?.company_name && item.profiles.company_name.toLowerCase().includes(query))
      );
    }

    // Industry Filter
    if (selectedIndustry !== "All") {
      result = result.filter((item) => item.industry === selectedIndustry);
    }

    // Country Filter
    if (selectedCountry !== "All") {
      result = result.filter((item) => item.country === selectedCountry);
    }

    // Tier Filter
    if (selectedTier !== "All") {
      result = result.filter((item) =>
        item.visible_tiers.some((t) => t.toLowerCase() === selectedTier.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortKey as keyof Opportunity];
      let bVal = b[sortKey as keyof Opportunity];

      if (aVal === null || aVal === undefined) return sortOrder === "asc" ? 1 : -1;
      if (bVal === null || bVal === undefined) return sortOrder === "asc" ? -1 : 1;

      if (Array.isArray(aVal) || Array.isArray(bVal)) return 0;
      if (typeof aVal === "object" || typeof bVal === "object") return 0;

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
  }, [activeOpportunities, searchQuery, selectedIndustry, selectedCountry, selectedTier, sortKey, sortOrder]);

  const activeColumns: ColumnDef<Opportunity>[] = [
    {
      header: "Opportunity Title",
      accessorKey: "title",
      sortable: true,
      cell: (item) => {
        const isExpanded = !!expandedDescriptions[item.id];
        const isLong = item.description && item.description.length > 80;
        return (
          <div className="max-w-md">
            <span className="font-bold text-slate-900 block leading-tight">{item.title}</span>
            <p className={`text-xs text-slate-500 leading-relaxed mt-1 whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-2"}`}>
              {item.description}
            </p>
            {isLong && (
              <button
                onClick={() => toggleDescriptionExpand(item.id)}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold mt-1 focus:outline-none cursor-pointer"
              >
                {isExpanded ? "Show Less" : "Read More..."}
              </button>
            )}
          </div>
        );
      },
    },
    {
      header: "Proposed By",
      cell: (item) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-800 text-xs">{item.profiles?.company_name || "Admin / System"}</span>
            {item.profiles?.membership_tier && (
              <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[9px] uppercase font-bold text-slate-600 tracking-wider">
                {item.profiles.membership_tier}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{item.profiles?.email || "N/A"}</span>
        </div>
      ),
    },
    {
      header: "Sector & Region",
      accessorKey: "industry",
      sortable: true,
      cell: (item) => (
        <div>
          <span className="text-xs font-semibold text-slate-800">{item.industry}</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Focus: {item.country}</p>
        </div>
      ),
    },
    {
      header: "Requirements",
      accessorKey: "looking_for",
      cell: (item) => {
        const isExpanded = !!expandedDescriptions[item.id];
        const visibleTags = isExpanded ? item.looking_for : item.looking_for.slice(0, 3);
        const remainingTags = isExpanded ? [] : item.looking_for.slice(3);
        return (
          <div className="flex flex-wrap gap-1 items-center max-w-[220px]">
            {visibleTags.map((tag, idx) => (
              <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-[10px] text-slate-600 rounded border border-slate-200 whitespace-nowrap">
                {tag}
              </span>
            ))}
            {remainingTags.length > 0 && (
              <span 
                className="px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 text-[10px] rounded font-semibold cursor-pointer"
                title={remainingTags.join(", ")}
                onClick={() => toggleDescriptionExpand(item.id)}
              >
                +{remainingTags.length}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Deadline",
      accessorKey: "deadline",
      sortable: true,
      cell: (item) => (
        <span className="text-xs font-mono text-slate-550" suppressHydrationWarning>{new Date(item.deadline).toLocaleDateString()}</span>
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
      cell: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedOppId(selectedOppId === item.id ? null : item.id)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              pitches.filter((p) => p.opportunity_id === item.id && p.status === "pending").length > 0
                ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-250 font-bold"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
            }`}
          >
            <span>Pitches ({pitches.filter((p) => p.opportunity_id === item.id).length})</span>
            {pitches.filter((p) => p.opportunity_id === item.id && p.status === "pending").length > 0 && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-550"></span>
              </span>
            )}
          </button>
          <button
            onClick={() => handleAction(item.id, deleteOpportunity, "delete")}
            className="p-1 text-red-655 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const pendingColumns: ColumnDef<Opportunity>[] = [
    {
      header: "Proposed Title",
      accessorKey: "title",
      cell: (item) => {
        const isExpanded = !!expandedDescriptions[item.id];
        const isLong = item.description && item.description.length > 85;
        return (
          <div className="max-w-md">
            <span className="font-bold text-slate-900 block leading-tight">{item.title}</span>
            <p className={`text-xs text-slate-500 leading-relaxed mt-1 whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-2"}`}>
              {item.description}
            </p>
            {isLong && (
              <button
                onClick={() => toggleDescriptionExpand(item.id)}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-bold mt-1 focus:outline-none cursor-pointer"
              >
                {isExpanded ? "Show Less" : "Read More..."}
              </button>
            )}
          </div>
        );
      },
    },
    {
      header: "Proposed By",
      cell: (item) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-800 text-xs">{item.profiles?.company_name || "Unspecified Organization"}</span>
            {item.profiles?.membership_tier && (
              <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[9px] uppercase font-bold text-slate-600 tracking-wider">
                {item.profiles.membership_tier}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{item.profiles?.email || "N/A"}</span>
        </div>
      ),
    },
    {
      header: "Sector & Region",
      accessorKey: "industry",
      cell: (item) => (
        <div>
          <span className="text-xs font-semibold text-slate-800">{item.industry}</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Focus: {item.country}</p>
        </div>
      ),
    },
    {
      header: "Match Requirements",
      accessorKey: "looking_for",
      cell: (item) => {
        const isExpanded = !!expandedDescriptions[item.id];
        const visibleTags = isExpanded ? item.looking_for : item.looking_for.slice(0, 3);
        const remainingTags = isExpanded ? [] : item.looking_for.slice(3);
        return (
          <div className="flex flex-wrap gap-1 items-center max-w-[220px]">
            {visibleTags.map((tag, idx) => (
              <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-[10px] text-slate-600 rounded border border-slate-200 whitespace-nowrap">
                {tag}
              </span>
            ))}
            {remainingTags.length > 0 && (
              <span 
                className="px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 text-[10px] rounded font-semibold cursor-pointer"
                title={remainingTags.join(", ")}
                onClick={() => toggleDescriptionExpand(item.id)}
              >
                +{remainingTags.length}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Proposer Actions",
      cell: (item) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handleApprove(item.id)}
            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-250 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Approve</span>
          </button>
          <button
            onClick={() => handleReject(item.id)}
            className="flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>
          <button
            onClick={() => handleLoadHistory(item.id)}
            className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Edit History</span>
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
            <Briefcase className="w-8 h-8 text-blue-600 shrink-0" />
            <span>Business Matching Control</span>
          </h1>
          <p className="text-slate-655 mt-1">Review member-submitted matching proposals and manage active opportunity pitches.</p>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Matchings</span>
            <span className="text-2xl font-extrabold text-slate-900 leading-none">{activeOpportunities.length}</span>
          </div>
        </div>

        <div className={`border rounded-xl p-4 shadow-sm flex items-center gap-4 transition-colors bg-white ${
          pendingOpportunities.length > 0
            ? "border-rose-300 ring-1 ring-rose-300 bg-rose-50/20"
            : "border-slate-200"
        }`}>
          <div className={`p-3 rounded-lg ${
            pendingOpportunities.length > 0 ? "bg-rose-100 text-rose-600 animate-pulse" : "bg-slate-100 text-slate-500"
          }`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pending Proposals</span>
            <span className={`text-2xl font-extrabold leading-none ${pendingOpportunities.length > 0 ? "text-rose-700" : "text-slate-900"}`}>
              {pendingOpportunities.length}
            </span>
          </div>
        </div>

        <div className={`border rounded-xl p-4 shadow-sm flex items-center gap-4 transition-colors bg-white ${
          pitches.filter((p) => p.status === "pending").length > 0
            ? "border-amber-300 ring-1 ring-amber-300 bg-amber-50/10"
            : "border-slate-200"
        }`}>
          <div className={`p-3 rounded-lg ${
            pitches.filter((p) => p.status === "pending").length > 0 ? "bg-amber-100 text-amber-600 animate-pulse" : "bg-slate-100 text-slate-500"
          }`}>
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pitches to Review</span>
            <span className={`text-2xl font-extrabold leading-none ${pitches.filter((p) => p.status === "pending").length > 0 ? "text-amber-700" : "text-slate-900"}`}>
              {pitches.filter((p) => p.status === "pending").length}
            </span>
          </div>
        </div>
      </div>

      {matchingError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {matchingError}
        </div>
      )}
      {matchingSuccess && (
        <div className="p-3 bg-emerald-555/10 border border-emerald-500/20 text-emerald-700 text-sm rounded-lg animate-pulse">
          {matchingSuccess}
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => { setActiveTab("active"); setSelectedOppId(null); }}
          className={`px-5 py-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === "active"
              ? "border-blue-650 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Active Matchings ({activeOpportunities.length})
        </button>
        <button
          onClick={() => { setActiveTab("pending"); setSelectedOppId(null); }}
          className={`px-5 py-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === "pending"
              ? "border-blue-650 text-blue-600 bg-blue-50/10"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Pending Approvals ({pendingOpportunities.length})
        </button>
      </div>

      {/* Search & Filter Panel (Active Tab Only) */}
      {activeTab === "active" && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, description, or company..."
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
            {/* Industry */}
            <div className="flex-1 md:flex-initial min-w-[160px]">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-700 focus:outline-none"
              >
                <option value="All">All Sectors</option>
                <option value="Semiconductors">Semiconductors</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Automotive">Automotive</option>
                <option value="Electronics">Electronics</option>
                <option value="Energy">Energy</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Food">Food</option>
                <option value="General">General</option>
              </select>
            </div>

            {/* Country */}
            <div className="flex-1 md:flex-initial min-w-[140px]">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-700 focus:outline-none"
              >
                <option value="All">All Regions</option>
                <option value="Japan">Japan</option>
                <option value="India">India</option>
                <option value="Both">Both</option>
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
      )}

      {/* Main Table list */}
      {activeTab === "active" ? (
        <DataTable
          columns={activeColumns}
          data={filteredAndSortedActive}
          getRowId={(item) => item.id}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
          expandedRowId={selectedOppId || undefined}
          renderRowDetails={(opp) => {
            const oppPitches = pitches.filter((p) => p.opportunity_id === opp.id);
            return (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-blue-600 rounded-full" />
                    <span>Submitted Pitches ({oppPitches.length})</span>
                  </h4>
                  <button
                    onClick={() => setSelectedOppId(null)}
                    className="text-xs font-semibold text-slate-505 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Close Panel
                  </button>
                </div>

                {oppPitches.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3">No pitches submitted for this opportunity yet.</p>
                ) : (
                  <div className="space-y-4">
                    {oppPitches.map((pitch) => (
                      <div key={pitch.id} className="bg-white border border-slate-200 p-4 rounded-lg space-y-3 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-sm">{pitch.profiles?.company_name || "Unspecified Org"}</span>
                              {pitch.profiles?.membership_tier && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[9px] uppercase font-bold text-slate-600 tracking-wider">
                                  {pitch.profiles.membership_tier}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{pitch.profiles?.email}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-mono" suppressHydrationWarning>{new Date(pitch.created_at).toLocaleDateString()}</span>
                            <StatusBadge status={pitch.status} />
                          </div>
                        </div>

                        <p className="text-xs text-slate-705 leading-relaxed bg-slate-50/55 p-3 rounded border border-slate-200 whitespace-pre-wrap">
                          {pitch.message}
                        </p>

                        {pitch.supporting_document_url && (
                          <div className="text-xs">
                            <span className="text-slate-500 font-semibold">Supporting File: </span>
                            <a
                              href={pitch.supporting_document_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-605 hover:underline font-mono font-medium"
                            >
                              View Attachment
                            </a>
                          </div>
                        )}

                        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-150">
                          <button
                            onClick={() => handleUpdatePitchStatus(pitch.id, "approved")}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-250 text-xs font-semibold rounded cursor-pointer transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdatePitchStatus(pitch.id, "rejected")}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold rounded cursor-pointer transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleUpdatePitchStatus(pitch.id, "reviewed")}
                            className="px-2.5 py-1 bg-slate-105 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold rounded cursor-pointer transition-colors"
                          >
                            Mark Reviewed
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }}
        />
      ) : (
        <DataTable
          columns={pendingColumns}
          data={pendingOpportunities}
          getRowId={(item) => item.id}
        />
      )}

      {/* Action confirmation dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 capitalize">
              Confirm {confirmAction.actionName} Action
            </h3>
            <p className="text-sm text-slate-600">
              Are you sure you want to {confirmAction.actionName} this opportunity?
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit History Modal */}
      {selectedHistoryOppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto font-sans">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8 text-slate-800 animate-none">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                <span>Proposal Edit History</span>
              </h2>
              <button 
                onClick={() => setSelectedHistoryOppId(null)} 
                className="text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {historyLoading ? (
                <div className="text-center py-8 text-sm text-slate-500">Loading edit logs...</div>
              ) : editHistoryList.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-400">No edits have been made to this proposal since submission.</div>
              ) : (
                <div className="space-y-4">
                  {editHistoryList.map((log, idx) => {
                    const oldV = log.old_values || {};
                    const newV = log.new_values || {};
                    
                    return (
                      <div key={idx} className="border border-slate-200 p-4 rounded-lg bg-slate-50 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-150 pb-2">
                          <span className="font-mono">Edit #{editHistoryList.length - idx}</span>
                          <span suppressHydrationWarning>{new Date(log.created_at).toLocaleString()}</span>
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          {oldV.title !== newV.title && (
                            <div>
                              <span className="font-semibold text-slate-700 block">Title changed:</span>
                              <p className="text-red-600 line-through bg-red-50 p-1 rounded mt-0.5">{oldV.title}</p>
                              <p className="text-emerald-700 bg-emerald-550/10 p-1 rounded mt-0.5">{newV.title}</p>
                            </div>
                          )}
                          {oldV.description !== newV.description && (
                            <div>
                              <span className="font-semibold text-slate-700 block">Description changed:</span>
                              <p className="text-red-650 line-through bg-red-50 p-1.5 rounded mt-0.5 whitespace-pre-wrap">{oldV.description}</p>
                              <p className="text-emerald-700 bg-emerald-550/10 p-1.5 rounded mt-0.5 whitespace-pre-wrap">{newV.description}</p>
                            </div>
                          )}
                          {(oldV.industry !== newV.industry || oldV.country !== newV.country) && (
                            <div>
                              <span className="font-semibold text-slate-700 block">Sector & Region changed:</span>
                              <p className="text-slate-500 bg-slate-100 p-1 rounded mt-0.5">
                                Old: {oldV.industry} (Focus: {oldV.country}) &rarr; New: {newV.industry} (Focus: {newV.country})
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-150 bg-slate-50">
              <button
                type="button"
                onClick={() => setSelectedHistoryOppId(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow cursor-pointer"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
