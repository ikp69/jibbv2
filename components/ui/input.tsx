import * as React from "react"
import { cn } from "@/lib/utils"

/* ============================================================
   JIBB Input — Japanese-precision styling
   Clean borders, warm background on focus, smooth transitions
   ============================================================ */

function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base
        "flex h-10 w-full rounded-lg border border-input bg-card px-4 py-2 text-sm text-foreground",
        // Placeholder
        "placeholder:text-muted-foreground/60",
        // Focus
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        // File input
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        // Validation
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

/* ============================================================
   JIBB Textarea — matching precision styling
   ============================================================ */

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base
        "flex min-h-[120px] w-full rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground resize-y",
        // Placeholder
        "placeholder:text-muted-foreground/60",
        // Focus
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Validation
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input, Textarea }
