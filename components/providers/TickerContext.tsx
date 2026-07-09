"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TickerContextType {
  isTickerVisible: boolean;
  setIsTickerVisible: (visible: boolean) => void;
}

const TickerContext = createContext<TickerContextType | undefined>(undefined);

export function TickerProvider({ children }: { children: ReactNode }) {
  // Default to false — EventTicker sets this to true when it mounts.
  // When EventTicker is commented out, the navbar sits flush at top-0.
  const [isTickerVisible, setIsTickerVisible] = useState(false);

  return (
    <TickerContext.Provider value={{ isTickerVisible, setIsTickerVisible }}>
      {children}
    </TickerContext.Provider>
  );
}

export function useTickerContext() {
  const context = useContext(TickerContext);
  if (context === undefined) {
    throw new Error("useTickerContext must be used within a TickerProvider");
  }
  return context;
}
