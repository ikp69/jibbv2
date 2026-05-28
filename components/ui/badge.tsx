import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ============================================================
   JIBB Badge — for sectors, tags, categories, and status labels
   ============================================================ */

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        // Default — primary indigo
        default:
          "bg-primary text-primary-foreground",
        // Sector badges — soft secondary
        secondary:
          "bg-secondary text-secondary-foreground",
        // Accent — orange highlight
        accent:
          "bg-accent/15 text-jibb-orange border border-accent/20",
        // Muted — subtle gray
        muted:
          "bg-muted text-muted-foreground",
        // Outline
        outline:
          "border border-border text-foreground bg-transparent",
        // Destructive/sakura
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/20",
        // Success
        success:
          "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
        // Sector — used for industry sector tags
        sector:
          "bg-primary/8 text-primary border border-primary/15 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
