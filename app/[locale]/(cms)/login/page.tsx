"use client";

import React, { useState, useTransition } from "react";
import { login } from "@/features/cms/auth/actions/login";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isPending, startTransition] = useTransition();

  const validate = () => {
    const tempErrors: typeof errors = {};
    if (!email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Invalid email format";
    }

    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setErrors({});
    startTransition(async () => {
      try {
        console.log("[CLIENT] Calling login with email:", email);
        const result = await login({ email, password });
        console.log("[CLIENT] Login returned:", result);
        
        if (result.success && result.redirectUrl) {
          console.log("[CLIENT] Success! Navigating to:", result.redirectUrl);
          // Auth succeeded - navigate to dashboard
          router.replace(result.redirectUrl);
        } else {
          console.log("[CLIENT] Auth failed with error:", result.error);
          // Auth failed - show error message
          setErrors({ general: result.error || "Authentication failed" });
        }
      } catch (err) {
        // Genuine network error or unexpected exception
        console.error("[CLIENT] Unexpected error:", err);
        setErrors({ general: "A network error occurred. Please try again." });
      }
    });
  };

  const handleQuickLogin = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("password123");
    setErrors({});
    startTransition(async () => {
      try {
        console.log("[CLIENT] Quick login with email:", roleEmail);
        const result = await login({ email: roleEmail, password: "password123" });
        console.log("[CLIENT] Quick login returned:", result);
        
        if (result.success && result.redirectUrl) {
          console.log("[CLIENT] Success! Navigating to:", result.redirectUrl);
          // Auth succeeded - navigate to dashboard
          router.replace(result.redirectUrl);
        } else {
          console.log("[CLIENT] Auth failed with error:", result.error);
          // Auth failed - show error message
          setErrors({ general: result.error || "Authentication failed" });
        }
      } catch (err) {
        console.error("[CLIENT] Unexpected error:", err);
        setErrors({ general: "A network error occurred. Please try again." });
      }
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
      {/* Decorative Brand Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />

      {/* Main Glassmorphism Login Container */}
      <div className="w-full max-w-md p-8 mx-4 bg-white backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          {/* Brand Logo */}
          <img
            src="/jibb-logo.svg"
            alt="JIBB Logo"
            className="w-16 h-16 object-contain mb-4"
          />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">JIBB Member Portal</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Auth Feedback */}
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Email input field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500" htmlFor="email">
              Company Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="email"
                type="email"
                disabled={isPending}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="representative@company.com"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-200 disabled:opacity-50"
              />
            </div>
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Password input field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500" htmlFor="password">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="password"
                type="password"
                disabled={isPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-250 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-200 disabled:opacity-50"
              />
            </div>
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-blue-600/50 disabled:to-blue-500/50 rounded-lg text-sm font-semibold text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Quick Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleQuickLogin("ishwarkumar@datbanks.com")}
              className="col-span-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 rounded-lg border border-slate-200 transition-colors text-center cursor-pointer disabled:opacity-50"
            >
              Admin
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleQuickLogin("ishwarkumar2102@gmail.com")}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 rounded-lg border border-slate-200 transition-colors text-center cursor-pointer disabled:opacity-50"
            >
              Associate
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleQuickLogin("ceo@silvercrestmetals.com")}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 rounded-lg border border-slate-200 transition-colors text-center cursor-pointer disabled:opacity-50"
            >
              Silver
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleQuickLogin("ceo@goldenhorizonbullion.com")}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 rounded-lg border border-slate-200 transition-colors text-center cursor-pointer disabled:opacity-50"
            >
              Gold
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleQuickLogin("md@platinumpeak.com")}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 rounded-lg border border-slate-200 transition-colors text-center cursor-pointer disabled:opacity-50"
            >
              Platinum
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-450">
          Japan India Business Bureau &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
