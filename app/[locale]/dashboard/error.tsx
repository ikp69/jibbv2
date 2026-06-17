"use client";

import { useEffect } from "react";
import { Link } from "@/src/i18n/navigation";
import { AlertTriangle, LayoutDashboard, RotateCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[JIBB Dashboard] Error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 py-16">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="size-7 text-red-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Dashboard Error
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            We couldn&apos;t load your dashboard content. Please try refreshing.
          </p>
          {process.env.NODE_ENV === "development" && error?.message && (
            <pre className="mt-4 p-3 rounded-lg bg-white/5 text-xs text-left overflow-auto text-red-400 border border-white/10">
              {error.message}
            </pre>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={reset}
            className="w-full sm:w-auto px-5 py-2.5 bg-jibb-orange hover:bg-jibb-orange/90 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <RotateCcw className="size-3.5" />
            Retry
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <LayoutDashboard className="size-3.5" />
            Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
