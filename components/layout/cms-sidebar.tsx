"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type NavGroup } from "@/constants/cms/navigation";
import * as Icons from "lucide-react";
import { Menu, ChevronLeft, ChevronRight, LogOut, HelpCircle } from "lucide-react";
import { logout } from "@/features/cms/auth/actions/logout";

type CmsSidebarProps = {
  navGroups: NavGroup[];
  portalType: "admin" | "portal";
};

export default React.memo(function CmsSidebar({ navGroups, portalType }: CmsSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = useCallback(() => {
    setIsMobileOpen(false);
    setShowLogoutConfirm(true);
  }, []);

  const confirmLogout = useCallback(async () => {
    const res = await logout();
    if (res.success) {
      window.location.href = "/en/login";
    }
  }, []);

  const isActive = useCallback((itemPath: string) => {
    const cleanPath = pathname.replace(/^\/(en|ja)/, "") || "/";
    if (itemPath === "/admin" || itemPath === "/portal") {
      return cleanPath === itemPath;
    }
    return cleanPath.startsWith(itemPath);
  }, [pathname]);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const toggleMobileOpen = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  return (
    <>
      {/* Mobile Drawer Trigger Bar */}
      <div className="flex md:hidden items-center justify-between px-4 h-16 bg-white border-b border-slate-200 text-slate-900 w-full fixed top-0 left-0 z-30">
        <div className="flex items-center gap-2">
          <img
            src="/jibb-logo.svg"
            alt="JIBB Logo"
            className="w-8 h-8 object-contain shrink-0"
          />
          <span className="font-bold tracking-tight text-slate-900">
            {portalType === "admin" ? "Admin Panel" : "Member Portal"}
          </span>
        </div>
        <button
          onClick={toggleMobileOpen}
          aria-expanded={isMobileOpen}
          aria-label="Toggle navigation drawer"
          className="p-1 text-slate-500 hover:text-slate-900 focus:outline-none cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar Container */}
      <aside
        aria-label="Sidebar Navigation"
        className={`hidden md:block h-screen fixed left-0 top-0 z-20 shrink-0 transition-all duration-300 ${
          isCollapsed ? "w-18" : "w-70"
        }`}
      >
        <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-700">
          {/* Brand Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 h-16">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src="/jibb-logo.svg"
                alt="JIBB Logo"
                className="w-12 h-12 object-contain shrink-0"
              />
              {!isCollapsed && (
                <span className="font-bold text-slate-900 tracking-tight truncate">
                  {portalType === "admin" ? "Admin Panel" : "Member Portal"}
                </span>
              )}
            </div>
            {/* Toggle Button for Desktop */}
            <button
              onClick={toggleCollapsed}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden md:flex items-center justify-center w-6 h-6 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav aria-label="Main Navigation" className="flex-1 overflow-y-auto py-4 space-y-6 px-3">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!isCollapsed && group.title && (
                  <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {group.title}
                  </span>
                )}
                <ul className="space-y-0.5">
                  {group.items.map((item, iIdx) => {
                    const active = isActive(item.path);
                    const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[item.icon] || HelpCircle;
                    return (
                      <li key={iIdx}>
                        <Link
                          href={item.path}
                          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                            active
                              ? "bg-blue-50 text-blue-600 font-semibold border-l-2 border-blue-600"
                              : "hover:bg-slate-100/70 hover:text-slate-900 text-slate-600"
                          } ${isCollapsed ? "justify-center" : ""}`}
                          title={isCollapsed ? item.label : undefined}
                        >
                          <IconComponent className="w-4 h-4 shrink-0" />
                          {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer Sign Out */}
          <div className="p-3 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-all duration-150 ${
                isCollapsed ? "justify-center" : ""
              }`}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Content */}
      <aside
        aria-label="Mobile Navigation Drawer"
        className={`md:hidden fixed top-0 bottom-0 left-0 w-64 z-50 transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full bg-white text-slate-700">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 h-16">
            <div className="flex items-center gap-2.5">
              <img src="/jibb-logo.svg" alt="JIBB Logo" className="w-8 h-8 object-contain shrink-0" />
              <span className="font-bold text-slate-900">{portalType === "admin" ? "Admin Panel" : "Member Portal"}</span>
            </div>
          </div>
          <nav aria-label="Mobile Navigation" className="flex-1 overflow-y-auto py-4 space-y-6 px-3">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {group.title && (
                  <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {group.title}
                  </span>
                )}
                <ul className="space-y-0.5">
                  {group.items.map((item, iIdx) => {
                    const active = isActive(item.path);
                    const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[item.icon] || HelpCircle;
                    return (
                      <li key={iIdx}>
                        <Link
                          href={item.path}
                          onClick={() => setIsMobileOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                            active
                              ? "bg-blue-50 text-blue-600 font-semibold border-l-2 border-blue-600"
                              : "hover:bg-slate-100/70 hover:text-slate-900 text-slate-600"
                          }`}
                        >
                          <IconComponent className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <div className="p-3 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main spacing wrapper for layout grid alignment */}
      <div
        className={`hidden md:block shrink-0 transition-all duration-300 ${
          isCollapsed ? "w-18" : "w-70"
        }`}
      />

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div role="dialog" aria-modal="true" aria-labelledby="sidebar-logout-dialog-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl shadow-2xl p-6 space-y-4 text-slate-800">
            <h3 id="sidebar-logout-dialog-title" className="text-base font-bold text-slate-900">
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
});

