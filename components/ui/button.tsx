import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium transition-all duration-300 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // JIBB Indigo primary
        default:
          "bg-primary text-primary-foreground shadow-jibb-sm hover:bg-primary/90 hover:shadow-jibb",
        // JIBB Orange accent — for high-emphasis CTAs
        accent:
          "bg-accent text-accent-foreground shadow-jibb-sm hover:bg-jibb-orange-dark hover:shadow-jibb-orange-glow hover:-translate-y-0.5",
        // Outline with indigo border
        outline:
          "border border-border bg-background text-foreground hover:bg-muted hover:border-primary/30 hover:text-primary",
        // Secondary soft background
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Ghost — invisible until hovered
        ghost:
          "hover:bg-muted hover:text-foreground",
        // Destructive (sakura red)
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/30",
        // Text link
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto",
        // Glass — for use over dark/gradient backgrounds
        glass:
          "bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20",
      },
      size: {
        default: "h-10 gap-2 px-5 text-sm rounded-lg",
        xs:      "h-7 gap-1 px-2.5 text-xs rounded-md [&_svg:not([class*='size-'])]:size-3",
        sm:      "h-9 gap-1.5 px-4 text-sm rounded-md",
        lg:      "h-12 gap-2 px-8 text-base rounded-xl font-semibold",
        xl:      "h-14 gap-2.5 px-10 text-lg rounded-xl font-semibold",
        icon:    "size-10 rounded-lg",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
