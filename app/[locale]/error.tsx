"use client";

import { useEffect } from "react";
import { Link } from "@/src/i18n/navigation";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error monitoring service in production
    console.error("[JIBB] Page error:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-background">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="size-8 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred. Please try again or return to the homepage.
          </p>
          {process.env.NODE_ENV === "development" && error?.message && (
            <pre className="mt-4 p-3 rounded-lg bg-muted text-xs text-left overflow-auto text-destructive">
              {error.message}
            </pre>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={reset}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="size-4" />
            Try again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-xl border border-border flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
          >
            <Home className="size-4" />
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
