"use client";

import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ============================================================
   AnimatedButton — Framer Motion micro-interaction wrapper
   
   Drop-in replacement for <Button> that adds:
   • Spring-based scale+lift on hover
   • Press feedback on tap
   • Works with all Button variants and sizes
   
   Usage:
     <AnimatedButton variant="accent" size="lg">
       Join JIBB <ArrowRight className="size-4" />
     </AnimatedButton>
   ============================================================ */

interface AnimatedButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Additional class on the motion wrapper (rarely needed). */
  wrapperClassName?: string;
}

export function AnimatedButton({
  className,
  variant,
  size,
  asChild,
  wrapperClassName,
  children,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      className={cn("inline-flex", wrapperClassName)}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        variant={variant}
        size={size}
        asChild={asChild}
        className={cn(
          // Override the Button's built-in active:scale since we handle it via Framer Motion
          "active:!scale-100",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
