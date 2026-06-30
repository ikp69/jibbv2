"use client";

import React, { useState } from "react";
import { User, Lock, Settings, ShieldAlert, Save, RefreshCw } from "lucide-react";
import { changePassword } from "@/features/cms/profile/actions/change-password";
import { updateAdminProfile } from "@/features/cms/profile/actions/update-admin-profile";

type AdminProfile = {
  id: string;
  company_name: string | null;
  designation: string | null;
  email: string | null;
};

type AdminSettingsClientProps = {
  profile: AdminProfile;
};

export default function AdminSettingsClient({ profile }: AdminSettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "system">("profile");

  // Profile forms
  const [companyName, setCompanyName] = useState(profile.company_name || "");
  const [designation, setDesignation] = useState(profile.designation || "");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password forms
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // System options
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setIsUpdatingProfile(true);

    try {
      const res = await updateAdminProfile({ companyName, designation });
      if (res.success) {
        setProfileSuccess("Admin profile metadata updated successfully.");
      } else {
        setProfileError(res.error || "Failed to update profile.");
      }
    } catch (err) {
      setProfileError("An unexpected error occurred. Please try again.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!newPassword || newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword(newPassword);
      if (res.success) {
        setPasswordSuccess("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(res.error || "Failed to update password.");
      }
    } catch (err) {
      setPasswordError("An unexpected error occurred. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-600 mt-1">Configure JIBB portal properties, administrator profile, and login security credentials.</p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === "profile"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Admin Profile</span>
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === "security"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & Passwords</span>
        </button>
        <button
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === "system"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>System Config</span>
        </button>
      </div>

      {/* Active Tab Panel */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl max-w-2xl shadow-sm">
        {activeTab === "profile" && (
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 mb-2">Edit Administrative Info</h3>

            {profileError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {profileError}
              </div>
            )}
            {profileSuccess && (
              <div className="p-3 bg-emerald-550/10 border border-emerald-500/20 text-emerald-700 text-xs rounded-lg">
                {profileSuccess}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email Address (Read Only)
              </label>
              <input
                type="email"
                disabled
                value={profile.email || ""}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Organization / Company
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                placeholder="Japan India Business Bureau"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Designation
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                placeholder="Chief Administrator"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isUpdatingProfile ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
          </form>
        )}

        {activeTab === "security" && (
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 mb-2">Change Password</h3>

            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 bg-emerald-550/10 border border-emerald-500/20 text-emerald-700 text-xs rounded-lg">
                {passwordSuccess}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isChangingPassword ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>Update Password</span>
            </button>
          </form>
        )}

        {activeTab === "system" && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 mb-2">Bilateral System Configurations</h3>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 p-4 bg-slate-50/50 border border-slate-200 rounded-lg">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900">Maintenance Mode</h4>
                  <p className="text-xs text-slate-500">Temporarily restrict portal dashboards access for scheduled updates.</p>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-white border-slate-300 focus:ring-blue-500 focus:ring-offset-white cursor-pointer"
                />
              </div>

              <div className="flex items-start justify-between gap-4 p-4 bg-slate-50/50 border border-slate-200 rounded-lg">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-slate-900">Require Directory Approval</h4>
                  <p className="text-xs text-slate-500">Newly registered organizations must be manually audited before listing in directories.</p>
                </div>
                <input
                  type="checkbox"
                  checked={requireApproval}
                  onChange={(e) => setRequireApproval(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-white border-slate-300 focus:ring-blue-500 focus:ring-offset-white cursor-pointer"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-750 text-xs rounded-lg flex gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
              <span>These configurations apply immediately across both Japanese and Indian regional sub-portals.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
