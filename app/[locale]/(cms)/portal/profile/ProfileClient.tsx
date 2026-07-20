"use client";

import React, { useState, useTransition } from "react";
import { updateProfile } from "@/features/cms/profile/actions/update-profile";
import { changePassword } from "@/features/cms/profile/actions/change-password";
import { Settings, Lock, Eye, Check, AlertCircle, UploadCloud, Building2, Link, MapPin, LayoutGrid } from "lucide-react";

type ProfileDetails = {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  designation: string | null;
  membership_tier: string;
  phone: string | null;
  industry: string | null;
  country: string | null;
  city: string | null;
  website: string | null;
  company_description: string | null;
  looking_for: string[] | null;
  show_in_directory: boolean;
  company_logo: string | null;
};

type ProfileClientProps = {
  profile: ProfileDetails;
};

export default function ProfileClient({ profile }: ProfileClientProps) {
  const [activeSubTab, setActiveSubTab] = useState<"general" | "password" | "directory">("general");
  const [isPending, startTransition] = useTransition();

  // General settings state
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [designation, setDesignation] = useState(profile.designation || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [website, setWebsite] = useState(profile.website || "");
  const [city, setCity] = useState(profile.city || "");
  const [companyDescription, setCompanyDescription] = useState(profile.company_description || "");
  const [lookingForText, setLookingForText] = useState(profile.looking_for?.join(", ") || "");
  const [showInDirectory, setShowInDirectory] = useState(profile.show_in_directory);
  const [companyLogo, setCompanyLogo] = useState(profile.company_logo || "");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [logoInputMode, setLogoInputMode] = useState<"upload" | "url">("upload");

  // Directory profile — specializations chip state
  const [specializations, setSpecializations] = useState<string[]>(() => {
    const desc = profile.company_description || "";
    if (desc.startsWith("Specializes in: ")) {
      return desc.replace("Specializes in: ", "").split(", ").filter(Boolean);
    }
    return [];
  });
  const [specInput, setSpecInput] = useState("");
  const [dirMsg, setDirMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLogoUpload = async (file: File) => {
    setUploadError("");
    setUploadProgress(10);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const fileExt = file.name.split(".").pop();
      const uniqueId = Math.random().toString(36).substring(2, 9);
      const fileName = `logos/${Date.now()}-${uniqueId}.${fileExt}`;

      setUploadProgress(35);

      const { data, error } = await supabase.storage
        .from("company-logos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      setUploadProgress(75);

      const { data: { publicUrl } } = supabase.storage
        .from("company-logos")
        .getPublicUrl(fileName);

      setCompanyLogo(publicUrl);
      setUploadProgress(100);
    } catch (err: any) {
      console.error("Logo upload error:", err);
      setUploadError(err.message || "Failed to upload logo image.");
      setUploadProgress(0);
    }
  };

  // Password state
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    if (!fullName || !designation || !phone) {
      setErrors({ general: "Representative name, designation and phone number are required." });
      return;
    }

    const lookingFor = lookingForText.split(",").map((s) => s.trim()).filter(Boolean);

    startTransition(async () => {
      const res = await updateProfile({
        fullName,
        designation,
        phone,
        website: website || undefined,
        city: city || undefined,
        companyDescription: companyDescription || undefined,
        lookingFor,
        showInDirectory,
        companyLogo: companyLogo || undefined,
      });

      if (res.success) {
        setSuccessMsg("Profile details updated successfully.");
      } else {
        setErrors({ general: res.error || "Failed to update profile details" });
      }
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");

    if (!password || password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters long." });
      return;
    }

    if (password !== confirmPass) {
      setErrors({ confirmPass: "Passwords do not match." });
      return;
    }

    startTransition(async () => {
      const res = await changePassword(password);
      if (res.success) {
        setSuccessMsg("Your password has been changed successfully.");
        setPassword("");
        setConfirmPass("");
      } else {
        setErrors({ general: res.error || "Failed to change password" });
      }
    });
  };

  // ── Directory profile helpers ─────────────────────────────────────────────
  const addSpecialization = (val: string) => {
    const trimmed = val.replace(/,$/, "").trim();
    if (trimmed && !specializations.includes(trimmed)) {
      setSpecializations((prev) => [...prev, trimmed]);
    }
    setSpecInput("");
  };

  const removeSpecialization = (idx: number) => {
    setSpecializations((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSpecKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSpecialization(specInput);
    } else if (e.key === "Backspace" && specInput === "") {
      setSpecializations((prev) => prev.slice(0, -1));
    }
  };

  const handleSaveDirectoryProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setDirMsg(null);
    // Flush any pending text in the input box
    const pendingTrimmed = specInput.replace(/,$/, "").trim();
    const finalSpecs = pendingTrimmed && !specializations.includes(pendingTrimmed)
      ? [...specializations, pendingTrimmed]
      : specializations;
    if (pendingTrimmed && !specializations.includes(pendingTrimmed)) {
      setSpecializations(finalSpecs);
      setSpecInput("");
    }
    const descriptionFormatted = finalSpecs.length > 0
      ? `Specializes in: ${finalSpecs.join(", ")}`
      : "";
    startTransition(async () => {
      const res = await updateProfile({
        fullName,
        designation,
        phone,
        website: website || undefined,
        city: city || undefined,
        companyDescription: descriptionFormatted || undefined,
        lookingFor: lookingForText.split(",").map((s) => s.trim()).filter(Boolean),
        showInDirectory,
        companyLogo: companyLogo || undefined,
      });
      if (res.success) {
        setDirMsg({ type: "success", text: "Directory profile updated successfully." });
      } else {
        setDirMsg({ type: "error", text: res.error || "Failed to update directory profile." });
      }
    });
  };

  const getTierBadgeColorDir = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "platinum": return "bg-slate-100 text-slate-800 border-slate-200";
      case "gold":     return "bg-amber-50 text-amber-800 border-amber-200";
      case "silver":   return "bg-slate-50 text-slate-600 border-slate-200";
      default:         return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-8 h-8 text-blue-600 shrink-0" />
          <span>Profile Settings</span>
        </h1>
        <p className="text-slate-600 mt-1">Configure company profiles, visibility preferences, and secure credentials.</p>
      </div>

      {/* Success/Error Notifications */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errors.general && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Submenu */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col gap-1 lg:col-span-1 h-fit shadow-sm">
          <button
            onClick={() => {
              setActiveSubTab("general");
              setErrors({});
              setSuccessMsg("");
            }}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2.5 ${activeSubTab === "general"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>General Settings</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab("password");
              setErrors({});
              setSuccessMsg("");
            }}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2.5 ${activeSubTab === "password"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
          >
            <Lock className="w-4 h-4 shrink-0" />
            <span>Change Password</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab("directory");
              setErrors({});
              setSuccessMsg("");
              setDirMsg(null);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2.5 ${
              activeSubTab === "directory"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            <span>Directory Profile</span>
          </button>
        </div>

        {/* Right Settings Body Content */}
        <div className="lg:col-span-3">
          {activeSubTab === "general" ? (
            <form onSubmit={handleUpdateProfile} className="bg-white border border-slate-200 p-6 rounded-xl space-y-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Edit Company Profile</h3>

              {/* Company Logo Upload & Preview Section */}
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <div className="w-20 h-20 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {companyLogo ? (
                    <img src={companyLogo} alt="Company Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                <div className="space-y-2 flex-1 w-full">
                  <span className="text-xs font-bold text-slate-650 uppercase tracking-wider block">Company Logo</span>

                  <div className="flex gap-4 border-b border-slate-200 w-fit pb-1">
                    <button
                      type="button"
                      onClick={() => setLogoInputMode("upload")}
                      className={`text-xs font-bold cursor-pointer transition-colors pb-0.5 border-b-2 ${logoInputMode === "upload" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoInputMode("url")}
                      className={`text-xs font-bold cursor-pointer transition-colors pb-0.5 border-b-2 ${logoInputMode === "url" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                    >
                      Image URL
                    </button>
                  </div>

                  {logoInputMode === "upload" ? (
                    <div className="flex flex-col gap-1.5 w-full">
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition-colors">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Choose Image File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                await handleLogoUpload(files[0]);
                              }
                            }}
                          />
                        </label>
                        {companyLogo && (
                          <button
                            type="button"
                            onClick={() => setCompanyLogo("")}
                            className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                          >
                            Remove Logo
                          </button>
                        )}
                      </div>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="w-full max-w-xs bg-slate-200 h-1 rounded-full overflow-hidden mt-1">
                          <div className="bg-blue-600 h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      )}
                      {uploadError && <p className="text-[11px] font-semibold text-red-600">{uploadError}</p>}
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center w-full">
                      <div className="relative flex-1">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="url"
                          placeholder="https://example.com/logo.png"
                          value={companyLogo}
                          onChange={(e) => setCompanyLogo(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-xs text-slate-900 focus:outline-none transition-colors"
                        />
                      </div>
                      {companyLogo && (
                        <button
                          type="button"
                          onClick={() => setCompanyLogo("")}
                          className="text-xs font-semibold text-red-650 hover:underline cursor-pointer whitespace-nowrap"
                        >
                          Clear URL
                        </button>
                      )}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-450">Supported formats: JPG, PNG, WEBP, SVG. Recommended square proportions (e.g. 200x200px).</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    disabled
                    value={profile.company_name || ""}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg text-sm cursor-not-allowed focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry Focus</label>
                  <input
                    type="text"
                    disabled
                    value={profile.industry || ""}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-lg text-sm cursor-not-allowed focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 uppercase tracking-wider">Representative Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 uppercase tracking-wider">Designation</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 uppercase tracking-wider">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 uppercase tracking-wider">City Location</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Kyoto / Bengaluru"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-650 uppercase tracking-wider">Website URL</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-650 uppercase tracking-wider">Looking For Partnerships (Comma Separated)</label>
                  <input
                    type="text"
                    value={lookingForText}
                    onChange={(e) => setLookingForText(e.target.value)}
                    placeholder="e.g. Semiconductor R&D, Distributors, Import"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-650 uppercase tracking-wider">Company Description</label>
                  <textarea
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    placeholder="Brief description of operations..."
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-none transition-colors"
                  />
                </div>
              </div>

              {/* Privacy Setting Toggle */}
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showInDirectory"
                  checked={showInDirectory}
                  onChange={(e) => setShowInDirectory(e.target.checked)}
                  className="rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500/20 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="showInDirectory" className="text-xs text-slate-600 cursor-pointer">
                  <span className="font-semibold text-slate-900 block">List Organization in Public Member Directory</span>
                  Toggle visibility to allow other bureau members to find and coordinate with your organization.
                </label>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold cursor-pointer shadow-sm transition-colors"
                >
                  {isPending ? "Saving..." : "Save Profile Details"}
                </button>
              </div>
            </form>
          ) : activeSubTab === "directory" ? (
            /* ── Directory Profile Panel ── */
            <div className="space-y-6">
              <form onSubmit={handleSaveDirectoryProfile} className="bg-white border border-slate-200 p-6 rounded-xl space-y-5 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Directory Profile</h3>
                  <p className="text-xs text-slate-500 mt-2">
                    This information is visible to other bureau members in the Member Directory. Your company identity remains anonymized — only your industry, location, and specializations are shown.
                  </p>
                </div>

                {dirMsg && (
                  <div className={`p-3 border rounded-lg text-xs font-medium flex items-center gap-2 ${
                    dirMsg.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}>
                    {dirMsg.type === "success"
                      ? <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                      : <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    }
                    <span>{dirMsg.text}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-650 uppercase tracking-wider block">Specializes In</label>
                  <p className="text-[11px] text-slate-500">
                    Type a specialization and press{" "}
                    <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono">Enter</kbd>{" "}
                    or{" "}
                    <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono">,</kbd>{" "}
                    to add it as a tag. Press{" "}
                    <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono">Backspace</kbd>{" "}
                    to remove the last tag.
                  </p>
                  <div
                    className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-[64px] focus-within:border-blue-500 focus-within:bg-white transition-colors cursor-text"
                    onClick={() => document.getElementById("spec-input")?.focus()}
                  >
                    {specializations.map((spec, idx) => (
                      <span key={idx} className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold rounded-full">
                        {spec}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeSpecialization(idx); }}
                          className="text-blue-400 hover:text-blue-800 cursor-pointer leading-none ml-0.5 font-bold"
                          aria-label={`Remove ${spec}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      id="spec-input"
                      type="text"
                      value={specInput}
                      onChange={(e) => setSpecInput(e.target.value)}
                      onKeyDown={handleSpecKeyDown}
                      onBlur={() => { if (specInput.trim()) addSpecialization(specInput); }}
                      placeholder={specializations.length === 0 ? "e.g. Semiconductor R&D, Precision Manufacturing, Export..." : "Add more..."}
                      className="flex-1 min-w-[140px] bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                  {specializations.length > 0 && (
                    <p className="text-[11px] text-slate-500">
                      Will appear as:{" "}
                      <span className="font-semibold text-slate-700">Specializes in: {specializations.join(", ")}</span>
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold cursor-pointer shadow-sm transition-colors"
                  >
                    {isPending ? "Saving..." : "Save Directory Profile"}
                  </button>
                </div>
              </form>

              {/* Live Preview Card */}
              <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-4 shadow-sm">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Live Directory Card Preview
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">This is exactly how your profile appears to other members in the directory.</p>
                </div>

                <div className="border border-slate-200 bg-white rounded-xl p-5 flex flex-col justify-between space-y-4 max-w-sm shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-900 tracking-tight text-base leading-snug">
                        {profile.industry || "General"} Partner
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border capitalize shrink-0 ${getTierBadgeColorDir(profile.membership_tier)}`}>
                        {profile.membership_tier}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{profile.industry || "General"}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span>{city || profile.city || "—"}, {profile.country || "—"}</span>
                      </div>
                    </div>

                    {specializations.length > 0 && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <span className="font-semibold text-slate-700">Specializes in:</span>{" "}
                        {specializations.join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    {(() => {
                      const tags = lookingForText.split(",").map((s) => s.trim()).filter(Boolean);
                      return tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-slate-50 text-[10px] text-slate-600 rounded border border-slate-200">
                              {tag}
                            </span>
                          ))}
                          {tags.length > 3 && (
                            <span className="text-[10px] text-slate-500 font-semibold px-1">+{tags.length - 3} more</span>
                          )}
                        </div>
                      ) : null;
                    })()}

                    <div className="pt-3 border-t border-slate-100">
                      <div className="py-2 px-3 w-full bg-slate-100 text-slate-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5">
                        <span>Request Connection</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Change Password Form */
            <form onSubmit={handleUpdatePassword} className="bg-white border border-slate-200 p-6 rounded-xl space-y-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Change Password</h3>

              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                  />
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-650 uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
                  />
                  {errors.confirmPass && <p className="text-xs text-red-500 mt-1">{errors.confirmPass}</p>}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold cursor-pointer shadow-sm transition-colors"
                >
                  {isPending ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
