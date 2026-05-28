import * as React from "react"
import { cn } from "@/lib/utils"

/* ============================================================
   JIBB Card — warm background, subtle layered shadow, 12px radius
   ============================================================ */

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground rounded-xl border border-border/50 shadow-jibb transition-all duration-300",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-6 pb-0", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "text-lg font-semibold leading-snug tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
}

/* ---- Interactive Card variant ---- */
function CardInteractive({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-jibb-md hover:-translate-y-1 hover:border-primary/20 group",
        className
      )}
      {...props}
    />
  )
}

/* ---- Glass Card for dark/gradient backgrounds ---- */
function CardGlass({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-glass"
      className={cn(
        "bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-white transition-all duration-300 hover:bg-white/[0.15]",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardInteractive,
  CardGlass,
}
