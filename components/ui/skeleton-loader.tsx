import React from "react";
import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded bg-slate-800", className)}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-850 pb-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-12" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex gap-4 items-center py-2">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <Skeleton
                key={cIdx}
                className={cn("h-4", cIdx === 0 ? "w-1/3" : "w-1/5")}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 space-y-4">
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}
