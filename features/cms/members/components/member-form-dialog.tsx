"use client";

import React, { useState, useTransition } from "react";
import { createMember } from "../actions/create-member";
import { X, Copy, Check, Info } from "lucide-react";

type MemberFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function MemberFormDialog({ isOpen, onClose, onSuccess }: MemberFormDialogProps) {
  const [companyName, setCompanyName] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [membershipTier, setMembershipTier] = useState<"associate" | "silver" | "gold" | "platinum">("associate");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [industry, setIndustry] = useState("General");
  const [country, setCountry] = useState("Both");
  const [website, setWebsite] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClose = () => {
    // Reset states
    setCompanyName("");
    setRepresentativeName("");
    setEmail("");
    setPhone("");
    setDesignation("");
    setMembershipTier("associate");
    setStartDate("");
    setEndDate("");
    setIndustry("General");
    setCountry("Both");
    setWebsite("");
    setCompanyDescription("");
    setNotes("");
    setErrors({});
    setTempPassword(null);
    onClose();
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!companyName) errs.companyName = "Company name is required";
    if (!representativeName) errs.representativeName = "Representative name is required";
    if (!email) errs.email = "Email is required";
    if (!phone) errs.phone = "Phone number is required";
    if (!designation) errs.designation = "Designation is required";
    if (!startDate) errs.startDate = "Start date is required";
    if (!endDate) errs.endDate = "End date is required";

    if (startDate && endDate) {
      if (new Date(endDate) <= new Date(startDate)) {
        errs.endDate = "End date must be after start date";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      const res = await createMember({
        companyName,
        representativeName,
        email,
        phone,
        designation,
        membershipTier,
        membershipStartDate: startDate,
        membershipEndDate: endDate,
        industry,
        country,
        website,
        companyDescription,
        lookingFor: [],
        notes,
      });

      if (res.success && res.temporaryPassword) {
        setTempPassword(res.temporaryPassword);
        onSuccess();
      } else {
        setErrors({ general: res.error || "Failed to create member" });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/60 backdrop-blur-sm p-4 font-sans overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-150">
          <h2 className="text-lg font-bold text-slate-900">Register New Member Organization</h2>
          <button onClick={handleClose} className="text-slate-500 hover:text-slate-900 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Temporary Password Reveal Screen */}
        {tempPassword ? (
          <div className="p-6 space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Member Registered Successfully!</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                The account has been created. Use the temporary credentials below to share offline with the member representative.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-md mx-auto space-y-3">
              <div className="text-left text-xs text-slate-700 space-y-1">
                <p><strong>Username/Email:</strong> {email}</p>
                <p><strong>Temporary Password:</strong></p>
              </div>
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded px-4 py-2.5">
                <span className="font-mono text-sm text-slate-900 select-all">{tempPassword}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-lg flex items-start gap-2.5 max-w-md mx-auto text-left">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <span>For security reasons, this temporary password is shown only once. Please convey it immediately.</span>
            </div>

            <div className="pt-4 border-t border-slate-150">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Form Input Screen */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Info */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Tanaka Tech Kabushikigaisha"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                />
                {errors.companyName && <p className="text-xs text-red-650">{errors.companyName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Representative Name</label>
                <input
                  type="text"
                  required
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                  placeholder="e.g. Kenji Tanaka"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                />
                {errors.representativeName && <p className="text-xs text-red-655">{errors.representativeName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. representative@company.com"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                />
                {errors.email && <p className="text-xs text-red-655">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +81-3-1234-5678"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                />
                {errors.phone && <p className="text-xs text-red-655">{errors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Designation</label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Director, International Business"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                />
                {errors.designation && <p className="text-xs text-red-655">{errors.designation}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Membership Tier</label>
                <select
                  value={membershipTier}
                  onChange={(e) => setMembershipTier(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                >
                  <option value="associate">Associate</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                />
                {errors.startDate && <p className="text-xs text-red-655">{errors.startDate}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">End Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                />
                {errors.endDate && <p className="text-xs text-red-655">{errors.endDate}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                >
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Country Operations</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                >
                  <option value="Japan">Japan</option>
                  <option value="India">India</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Website URL (Optional)</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://company.com"
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-905 placeholder-slate-450 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-505 uppercase tracking-wider">Company Description (Optional)</label>
                <textarea
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  placeholder="Brief summary of company business..."
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-905 placeholder-slate-450 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-550 uppercase tracking-wider">Internal Admin Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Only visible to JIBB admin users..."
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-905 placeholder-slate-450 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Footer Buttons */}
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
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
