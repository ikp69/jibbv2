"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function DelegationJapanError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 space-y-4">
      <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-full flex items-center justify-center text-red-600">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 font-sans">Failed to load delegation details</h2>
        <p className="text-sm text-slate-500 mt-1 font-sans">{error.message || "An unexpected error occurred."}</p>
      </div>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md cursor-pointer transition-colors font-sans"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
