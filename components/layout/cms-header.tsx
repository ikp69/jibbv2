"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, LogOut, Key, Settings, User as UserIcon, ShieldAlert } from "lucide-react";
import { logout } from "@/features/cms/auth/actions/logout";

type BreadcrumbItem = {
  label: string;
  path?: string;
};

type CmsHeaderProps = {
  breadcrumbs: BreadcrumbItem[];
  user: {
    email: string;
    companyName?: string | null;
    designation?: string | null;
    membershipTier: string;
    role: string;
  };
};

export default function CmsHeader({ breadcrumbs, user }: CmsHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    const res = await logout();
    if (res.success) {
      window.location.href = "/en/login";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "platinum":
        return "bg-slate-100 text-slate-850 border-slate-300";
      case "gold":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "silver":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "admin":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-blue-50 text-blue-750 border-blue-200";
    }
  };

  return (
    <>
      <header className="h-16 border-b border-slate-205 bg-white/95 backdrop-blur-md flex items-center justify-between px-6 z-20 w-full font-sans">
      {/* Left: Breadcrumbs */}
      <nav className="flex items-center text-sm font-medium text-slate-500">
        <ul className="flex items-center space-x-2">
          {breadcrumbs.map((crumb, idx) => (
            <li key={idx} className="flex items-center space-x-2">
              {idx > 0 && <span className="text-slate-300">/</span>}
              {crumb.path ? (
                <Link href={crumb.path} className="hover:text-slate-900 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-900 font-semibold">{crumb.label}</span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Right: Actions & User Dropdown */}
      <div className="flex items-center gap-4">
        {/* Membership Tier Badge */}
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border capitalize ${getTierColor(
            user.membershipTier
          )}`}
        >
          {user.membershipTier}
        </span>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
          >
            <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 text-slate-600 group-hover:border-slate-300 group-hover:text-slate-900 transition-colors">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-none">
                {user.companyName || user.email.split("@")[0]}
              </p>
              <p className="text-[10px] text-slate-500 leading-none mt-1">
                {user.designation || (user.role === "admin" ? "JIBB Admin" : "Member")}
              </p>
            </div>
          </button>

          {isDropdownOpen && (
            <>
              {/* Back Drop */}
              <div onClick={() => setIsDropdownOpen(false)} className="fixed inset-0 z-10" />

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1.5 text-slate-700">
                <div className="px-4 py-2 border-b border-slate-150">
                  <p className="text-xs font-semibold text-slate-955 truncate">{user.companyName || "Company"}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    href={user.role === "admin" ? "/en/admin/settings" : "/en/portal/profile"}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-450" />
                    <span>Account Settings</span>
                  </Link>

                  <Link
                    href={user.role === "admin" ? "/en/admin/settings" : "/en/portal/profile"}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Key className="w-4 h-4 text-slate-450" />
                    <span>Change Password</span>
                  </Link>
                </div>

                <div className="border-t border-slate-150 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-red-50 hover:text-red-650 transition-colors cursor-pointer text-left font-medium"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6 space-y-4 text-slate-800">
            <h3 className="text-base font-bold text-slate-900">
              Confirm Sign Out
            </h3>
            <p className="text-sm text-slate-500">
              Are you sure you want to sign out of JIBB Portal?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
