"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Premium exponential deceleration momentum
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
