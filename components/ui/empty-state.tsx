import React from "react";
import { FolderOpen } from "lucide-react";

type EmptyStateProps = {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 rounded-xl bg-white shadow-sm max-w-lg mx-auto my-12 font-sans">
      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-6 h-6 text-slate-500" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1.5">{title}</h3>
      <p className="text-sm text-slate-655 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md active:scale-[0.98] transition-all cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
