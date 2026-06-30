"use client";

import React, { useState, useTransition } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { updateFormStatus } from "./actions";
import { FileSpreadsheet, Mail, UserCheck, Briefcase, Bell, Eye, Check, X, FileText, Download } from "lucide-react";

type ContactInquiry = {
  id: string;
  inquiry_type: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
};

type MembershipApplication = {
  id: string;
  membership_tier: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  industry: string;
  company_size: string;
  message: string;
  status: string;
  created_at: string;
  approved_at: string | null;
};

type CareerApplication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  resume_url: string;
  cover_letter: string;
  status: string;
  created_at: string;
};

type NewsletterSubscriber = {
  id: string;
  email: string;
  source: string;
  created_at: string;
};

type WebsiteFormsClientProps = {
  contacts: ContactInquiry[];
  memberships: MembershipApplication[];
  careers: CareerApplication[];
  newsletters: NewsletterSubscriber[];
};

export default function WebsiteFormsClient({
  contacts,
  memberships,
  careers,
  newsletters,
}: WebsiteFormsClientProps) {
  const [activeTab, setActiveTab] = useState<"contacts" | "memberships" | "careers" | "newsletters">("contacts");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdateStatus = (
    tableName: "contact_inquiries" | "membership_applications" | "career_applications",
    id: string,
    status: string
  ) => {
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      const res = await updateFormStatus(tableName, id, status);
      if (res.success) {
        setSuccessMsg(`Form status updated to ${status}.`);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setErrorMsg(res.error || "Failed to update status");
      }
    });
  };

  // Contacts Columns
  const contactColumns: ColumnDef<ContactInquiry>[] = [
    {
      header: "Timestamp",
      accessorKey: "created_at",
      cell: (item) => (
        <span className="text-xs font-mono text-slate-500" suppressHydrationWarning>
          {new Date(item.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Sender Name",
      accessorKey: "name",
      cell: (item) => (
        <div>
          <span className="font-bold text-slate-900 block">{item.name}</span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">{item.email}</span>
        </div>
      ),
    },
    {
      header: "Inquiry Type",
      accessorKey: "inquiry_type",
      cell: (item) => (
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded uppercase tracking-wide">
          {item.inquiry_type}
        </span>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (item) => <span className="text-xs text-slate-600">{item.phone || "N/A"}</span>,
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
          onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Letter</span>
        </button>
      ),
    },
  ];

  // Memberships Columns
  const membershipColumns: ColumnDef<MembershipApplication>[] = [
    {
      header: "Timestamp",
      accessorKey: "created_at",
      cell: (item) => (
        <span className="text-xs font-mono text-slate-500" suppressHydrationWarning>
          {new Date(item.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Company Details",
      accessorKey: "company_name",
      cell: (item) => (
        <div>
          <span className="font-bold text-slate-900 block">{item.company_name}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 font-medium">Rep: {item.contact_person}</span>
        </div>
      ),
    },
    {
      header: "Tier / Sector",
      accessorKey: "membership_tier",
      cell: (item) => (
        <div>
          <span className="text-xs font-bold text-slate-800 uppercase block">{item.membership_tier}</span>
          <span className="text-[10px] text-slate-500 font-medium">{item.industry}</span>
        </div>
      ),
    },
    {
      header: "Email & Phone",
      accessorKey: "email",
      cell: (item) => (
        <div>
          <span className="text-xs text-slate-800 font-mono block">{item.email}</span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">{item.phone || "N/A"}</span>
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
          onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Review App</span>
        </button>
      ),
    },
  ];

  // Careers Columns
  const careerColumns: ColumnDef<CareerApplication>[] = [
    {
      header: "Timestamp",
      accessorKey: "created_at",
      cell: (item) => (
        <span className="text-xs font-mono text-slate-500" suppressHydrationWarning>
          {new Date(item.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Applicant Details",
      accessorKey: "name",
      cell: (item) => (
        <div>
          <span className="font-bold text-slate-900 block">{item.name}</span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">{item.email}</span>
        </div>
      ),
    },
    {
      header: "Position",
      accessorKey: "position",
      cell: (item) => <span className="text-xs font-semibold text-slate-800">{item.position}</span>,
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (item) => <span className="text-xs text-slate-600 font-mono">{item.phone || "N/A"}</span>,
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
          onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Profile</span>
        </button>
      ),
    },
  ];

  // Newsletter Columns
  const newsletterColumns: ColumnDef<NewsletterSubscriber>[] = [
    {
      header: "Timestamp",
      accessorKey: "created_at",
      cell: (item) => (
        <span className="text-xs font-mono text-slate-500" suppressHydrationWarning>
          {new Date(item.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Email Address",
      accessorKey: "email",
      cell: (item) => <span className="text-xs font-mono font-semibold text-slate-850">{item.email}</span>,
    },
    {
      header: "Source Page",
      accessorKey: "source",
      cell: (item) => (
        <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded">
          {item.source || "General Footer"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <FileSpreadsheet className="w-8 h-8 text-blue-600 shrink-0" />
          <span>Website Form Inquiries</span>
        </h1>
        <p className="text-slate-655 mt-1">Review contact letters, membership applications, job submissions, and newsletter signups.</p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-550/10 border border-emerald-500/20 text-emerald-700 text-sm rounded-lg animate-pulse">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab("contacts");
            setSelectedId(null);
          }}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "contacts"
              ? "border-blue-500 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Mail className="w-4 h-4 shrink-0" />
          <span>Contact Letters ({contacts.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("memberships");
            setSelectedId(null);
          }}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "memberships"
              ? "border-blue-500 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <UserCheck className="w-4 h-4 shrink-0" />
          <span>Membership Requests ({memberships.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("careers");
            setSelectedId(null);
          }}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "careers"
              ? "border-blue-500 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Briefcase className="w-4 h-4 shrink-0" />
          <span>Career CVs ({careers.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("newsletters");
            setSelectedId(null);
          }}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "newsletters"
              ? "border-blue-500 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Bell className="w-4 h-4 shrink-0" />
          <span>Newsletter Subs ({newsletters.length})</span>
        </button>
      </div>

      {/* Tables Grid */}
      <div className="space-y-4">
        {activeTab === "contacts" && (
          <DataTable
            columns={contactColumns}
            data={contacts}
            getRowId={(item) => item.id}
            expandedRowId={selectedId || undefined}
            renderRowDetails={(contact) => (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4 shadow-inner text-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-slate-800">Inquiry Message Detail</h4>
                  <button onClick={() => setSelectedId(null)} className="text-xs font-semibold text-slate-500 hover:text-slate-850">
                    Close Panel
                  </button>
                </div>
                <div className="bg-white p-4 border border-slate-200 rounded-lg text-slate-700 leading-relaxed whitespace-pre-wrap shadow-sm font-normal">
                  {contact.message}
                </div>
                <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-150">
                  <button
                    disabled={isPending}
                    onClick={() => handleUpdateStatus("contact_inquiries", contact.id, "reviewed")}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-750 border border-blue-200 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Mark Reviewed
                  </button>
                  <button
                    disabled={isPending}
                    onClick={() => handleUpdateStatus("contact_inquiries", contact.id, "completed")}
                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Mark Completed
                  </button>
                </div>
              </div>
            )}
          />
        )}

        {activeTab === "memberships" && (
          <DataTable
            columns={membershipColumns}
            data={memberships}
            getRowId={(item) => item.id}
            expandedRowId={selectedId || undefined}
            renderRowDetails={(app) => (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4 shadow-inner text-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-slate-800">Application Intent & Description</h4>
                  <button onClick={() => setSelectedId(null)} className="text-xs font-semibold text-slate-505 hover:text-slate-850">
                    Close Panel
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3 border border-slate-200 rounded shadow-sm text-slate-700 space-y-1">
                    <p className="font-semibold text-slate-900 text-sm">Company Metrics</p>
                    <p>Sector: {app.industry}</p>
                    <p>Size: {app.company_size} Employees</p>
                  </div>
                  <div className="bg-white p-3 border border-slate-200 rounded shadow-sm text-slate-700 space-y-1">
                    <p className="font-semibold text-slate-900 text-sm">Representative Coordinates</p>
                    <p>Name: {app.contact_person}</p>
                    <p>Phone: {app.phone || "N/A"}</p>
                  </div>
                </div>

                <div className="bg-white p-4 border border-slate-200 rounded-lg text-slate-700 leading-relaxed whitespace-pre-wrap shadow-sm">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Applicant message</p>
                  {app.message || "No supporting pitch message provided."}
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-150">
                  <button
                    disabled={isPending}
                    onClick={() => handleUpdateStatus("membership_applications", app.id, "approved")}
                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Approve Application
                  </button>
                  <button
                    disabled={isPending}
                    onClick={() => handleUpdateStatus("membership_applications", app.id, "rejected")}
                    className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Reject Application
                  </button>
                </div>
              </div>
            )}
          />
        )}

        {activeTab === "careers" && (
          <DataTable
            columns={careerColumns}
            data={careers}
            getRowId={(item) => item.id}
            expandedRowId={selectedId || undefined}
            renderRowDetails={(app) => (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4 shadow-inner text-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-slate-800">Job Applicant Profile</h4>
                  <button onClick={() => setSelectedId(null)} className="text-xs font-semibold text-slate-505 hover:text-slate-850">
                    Close Panel
                  </button>
                </div>

                <div className="bg-white p-4 border border-slate-200 rounded-lg text-slate-700 leading-relaxed whitespace-pre-wrap shadow-sm">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Cover letter</p>
                  {app.cover_letter || "No cover letter provided."}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  {app.resume_url ? (
                    <a
                      href={app.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Resume (CV)</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No resume attachment uploaded.</span>
                  )}

                  <div className="flex gap-2.5">
                    <button
                      disabled={isPending}
                      onClick={() => handleUpdateStatus("career_applications", app.id, "reviewed")}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Mark Reviewed
                    </button>
                    <button
                      disabled={isPending}
                      onClick={() => handleUpdateStatus("career_applications", app.id, "approved")}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Accept Candidate
                    </button>
                    <button
                      disabled={isPending}
                      onClick={() => handleUpdateStatus("career_applications", app.id, "rejected")}
                      className="px-3.5 py-1.5 bg-red-550/10 bg-red-50 hover:bg-red-100 text-red-700 border border-red-250 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Reject Candidate
                    </button>
                  </div>
                </div>
              </div>
            )}
          />
        )}

        {activeTab === "newsletters" && (
          <DataTable
            columns={newsletterColumns}
            data={newsletters}
            getRowId={(item) => item.id}
          />
        )}
      </div>
    </div>
  );
}
