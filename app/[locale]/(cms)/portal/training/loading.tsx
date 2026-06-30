import React from "react";
import { Loader2 } from "lucide-react";

export default function TrainingLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-sm text-slate-500 font-medium">Loading training programs...</p>
    </div>
  );
}
