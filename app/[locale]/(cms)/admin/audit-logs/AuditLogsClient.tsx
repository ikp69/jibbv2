"use client";

import React, { useState } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { History, Eye, Terminal } from "lucide-react";

type AuditLog = {
  id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
  old_values: any;
  new_values: any;
  profiles: {
    company_name: string | null;
    email: string | null;
  } | null;
};

type AuditLogsClientProps = {
  initialLogs: AuditLog[];
};

export default function AuditLogsClient({ initialLogs }: AuditLogsClientProps) {
  const [logs, setLogs] = useState(initialLogs);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const columns: ColumnDef<AuditLog>[] = [
    {
      header: "Timestamp",
      accessorKey: "created_at",
      cell: (item) => (
        <span className="font-mono text-xs text-slate-500">
          {new Date(item.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      header: "User / Actor",
      accessorKey: "user_id",
      cell: (item) => (
        <div>
          <span className="font-bold text-slate-900 block">
            {item.profiles?.company_name || "Admin Action"}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
            {item.profiles?.email || "System"}
          </span>
        </div>
      ),
    },
    {
      header: "Action Triggered",
      accessorKey: "action",
      cell: (item) => (
        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 border border-slate-200 text-blue-600 capitalize rounded">
          {item.action.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Context Table",
      accessorKey: "table_name",
      cell: (item) => <span className="font-mono text-xs text-slate-655">{item.table_name}</span>,
    },
    {
      header: "Client IP",
      accessorKey: "ip_address",
      cell: (item) => <span className="font-mono text-xs text-slate-550">{item.ip_address || "N/A"}</span>,
    },
    {
      header: "Parameters",
      cell: (item) => (
        <button
          onClick={() => setSelectedLog(selectedLog?.id === item.id ? null : item)}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-105 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>View JSON</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <History className="w-8 h-8 text-blue-600 shrink-0" />
          <span>System Audit Trails</span>
        </h1>
        <p className="text-slate-600 mt-1">Review operational log histories and database adjustments performed across workspaces.</p>
      </div>

      {/* Main Table list */}
      <DataTable
        columns={columns}
        data={logs}
        getRowId={(item) => item.id}
        expandedRowId={selectedLog?.id || undefined}
        renderRowDetails={(log) => (
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4 shadow-inner text-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-blue-600 rounded-full" />
                <span>Log Details: {log.action.replace(/_/g, " ")}</span>
              </h4>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-xs font-semibold text-slate-505 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Close Panel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-500 uppercase font-semibold">User Agent Details</p>
                <p className="text-slate-700 mt-1 font-mono break-all bg-white p-2.5 border border-slate-200 rounded shadow-sm">
                  {log.user_agent || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-slate-500 uppercase font-semibold">Record ID Target</p>
                <p className="text-slate-700 mt-1 font-mono bg-white p-2.5 border border-slate-200 rounded shadow-sm">
                  {log.record_id || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-slate-550 uppercase font-semibold mb-1">Previous Values (Before Change)</p>
                <pre className="text-[10px] font-mono text-slate-700 p-3 bg-white border border-slate-200 rounded overflow-x-auto max-h-60 shadow-sm">
                  {JSON.stringify(log.old_values, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-xs text-slate-550 uppercase font-semibold mb-1">New Values (After Change)</p>
                <pre className="text-[10px] font-mono text-slate-700 p-3 bg-white border border-slate-200 rounded overflow-x-auto max-h-60 shadow-sm">
                  {JSON.stringify(log.new_values, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
