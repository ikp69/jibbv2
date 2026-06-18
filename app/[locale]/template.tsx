"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Page Transition Template
 *
 * Next.js `template.tsx` re-mounts on every navigation, triggering
 * the Framer Motion enter animation automatically.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Mouse move tracker for card glow effects
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const group = target.closest(".group") as HTMLElement;
      if (group) {
        const rect = group.getBoundingClientRect();
        group.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        group.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      }
    };
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
