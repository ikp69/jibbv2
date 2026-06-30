"use client";

import React, { useState, useTransition } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import MemberFormDialog from "@/features/cms/members/components/member-form-dialog";
import { suspendMember, activateMember, archiveMember, renewMember } from "@/features/cms/members/actions/lifecycle-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserCheck, UserMinus, Archive, RotateCcw, Plus, ExternalLink } from "lucide-react";

type MemberProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  designation: string | null;
  membership_tier: string;
  membership_start_date: string | null;
  membership_end_date: string | null;
  industry: string | null;
  country: string | null;
  status: string;
  is_active: boolean;
};

type MemberListClientProps = {
  initialMembers: MemberProfile[];
};

export default function MemberListClient({ initialMembers }: MemberListClientProps) {
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [sortKey, setSortKey] = useState<string>("company_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [confirmAction, setConfirmAction] = useState<{
    memberId: string;
    actionFn: (id: string) => Promise<any>;
    actionName: string;
  } | null>(null);
  const [renewingMemberId, setRenewingMemberId] = useState<string | null>(null);
  const [renewDateInput, setRenewDateInput] = useState("");
  const [memberSuccess, setMemberSuccess] = useState("");
  const [memberError, setMemberError] = useState("");

  const handleAction = (memberId: string, actionFn: (id: string) => Promise<any>, actionName: string) => {
    setConfirmAction({ memberId, actionFn, actionName });
  };

  const executeConfirmedAction = () => {
    if (!confirmAction) return;
    const { memberId, actionFn, actionName } = confirmAction;
    setConfirmAction(null);
    setMemberError("");
    setMemberSuccess("");

    startTransition(async () => {
      const res = await actionFn(memberId);
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

  const handleRenewPrompt = (memberId: string) => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const yyyy = nextYear.getFullYear();
    const mm = String(nextYear.getMonth() + 1).padStart(2, "0");
    const dd = String(nextYear.getDate()).padStart(2, "0");
    setRenewDateInput(`${yyyy}-${mm}-${dd}`);
    setRenewingMemberId(memberId);
  };

  const executeRenew = () => {
    if (!renewingMemberId || !renewDateInput) return;
    const memberId = renewingMemberId;
    setRenewingMemberId(null);
    setMemberError("");
    setMemberSuccess("");

    if (isNaN(Date.parse(renewDateInput))) {
      setMemberError("Invalid date format. Action aborted.");
      return;
    }

    startTransition(async () => {
      const res = await renewMember(memberId, renewDateInput);
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

  // Filter & Sort Logic
  const filtered = members.filter((member) => {
    const matchesSearch =
      (member.company_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (member.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (member.email || "").toLowerCase().includes(search.toLowerCase());

    const matchesTier = selectedTier === "all" || member.membership_tier === selectedTier;
    const matchesStatus = selectedStatus === "all" || member.status === selectedStatus;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    const valA = String(a[sortKey as keyof MemberProfile] || "").toLowerCase();
    const valB = String(b[sortKey as keyof MemberProfile] || "").toLowerCase();

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginatedData = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: ColumnDef<MemberProfile>[] = [
    {
      header: "Company & Representative",
      accessorKey: "company_name",
      sortable: true,
      cell: (item) => (
        <div>
          <Link
            href={`/en/admin/members/${item.id}`}
            className="font-bold text-slate-900 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
          >
            <span>{item.company_name || "Unspecified"}</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </Link>
          <p className="text-xs text-slate-505 mt-0.5">
            {item.full_name || "No Representative"} • {item.designation || "No Title"}
          </p>
        </div>
      ),
    },
    {
      header: "Contact Email",
      accessorKey: "email",
      sortable: true,
      cell: (item) => <span className="text-slate-655 font-mono text-xs">{item.email || "N/A"}</span>,
    },
    {
      header: "Tier & Industry",
      accessorKey: "membership_tier",
      sortable: true,
      cell: (item) => (
        <div>
          <span className="text-xs font-semibold capitalize text-slate-800">{item.membership_tier}</span>
          <p className="text-[11px] text-slate-505 mt-0.5">{item.industry || "General"}</p>
        </div>
      ),
    },
    {
      header: "Expiry Date",
      accessorKey: "membership_end_date",
      sortable: true,
      cell: (item) => {
        if (!item.membership_end_date) return <span className="text-slate-500">N/A</span>;
        const date = new Date(item.membership_end_date);
        return <span className="text-slate-600 font-mono text-xs" suppressHydrationWarning>{date.toLocaleDateString()}</span>;
      },
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
        <div className="flex items-center gap-2">
          {item.status === "suspended" ? (
            <button
              onClick={() => handleAction(item.id, activateMember, "reactivate")}
              className="p-1.5 hover:bg-slate-100 text-emerald-650 rounded-lg transition-colors cursor-pointer"
              title="Reactivate Member"
            >
              <UserCheck className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => handleAction(item.id, suspendMember, "suspend")}
              className="p-1.5 hover:bg-slate-100 text-amber-600 rounded-lg transition-colors cursor-pointer"
              title="Suspend Member"
            >
              <UserMinus className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => handleRenewPrompt(item.id)}
            className="p-1.5 hover:bg-slate-100 text-blue-600 rounded-lg transition-colors cursor-pointer"
            title="Renew Membership"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {item.status !== "archived" && (
            <button
              onClick={() => handleAction(item.id, archiveMember, "archive")}
              className="p-1.5 hover:bg-red-50 text-red-655 rounded-lg transition-colors cursor-pointer"
              title="Archive Member"
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Members</h1>
          <p className="text-slate-655 mt-1">Register new organization profiles, monitor renewals, and execute state changes.</p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register Member</span>
        </button>
      </div>

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

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Search</label>
          <input
            type="text"
            placeholder="Search company, contact, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Membership Tier</label>
          <select
            value={selectedTier}
            onChange={(e) => {
              setSelectedTier(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
          >
            <option value="all">All Tiers</option>
            <option value="associate">Associate</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="suspended">Suspended</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table listing */}
      <DataTable
        columns={columns}
        data={paginatedData}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={(key, order) => {
          setSortKey(key);
          setSortOrder(order);
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      {/* Modal Dialog Form */}
      <MemberFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
