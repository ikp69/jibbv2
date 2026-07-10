"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PageTransitionLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Create a custom event to show loader
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };

    const handleRouteChangeEnd = () => {
      setIsLoading(false);
    };

    // Listen for Next.js navigation
    window.addEventListener("beforeunload", handleRouteChangeStart);

    // We also need to handle client-side navigation
    // Create a MutationObserver to detect when the main content changes
    const observer = new MutationObserver(() => {
      // Reset loading state when DOM significantly changes
      setIsLoading(false);
    });

    // Observe the main content area
    const mainElement = document.querySelector("main");
    if (mainElement) {
      observer.observe(mainElement, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      window.removeEventListener("beforeunload", handleRouteChangeStart);
      observer.disconnect();
    };
  }, []);

  // Manually trigger loading when Link is clicked - handled via custom dispatch
  useEffect(() => {
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a") as HTMLAnchorElement;

      if (
        link &&
        link.href &&
        !link.target &&
        !link.hasAttribute("data-no-loader") &&
        link.origin === window.location.origin
      ) {
        setIsLoading(true);
        // Auto-stop loading after a timeout as fallback
        setTimeout(() => setIsLoading(false), 1500);
      }
    };

    document.addEventListener("click", handleLinkClick, true);
    return () => document.removeEventListener("click", handleLinkClick, true);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-12 h-12 border-3 border-slate-200 border-t-blue-600 rounded-full"
            />
            
            {/* Loading text */}
            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
              className="text-sm font-medium text-slate-600"
            >
              Loading...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
