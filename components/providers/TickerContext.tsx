"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TickerContextType {
  isTickerVisible: boolean;
  setIsTickerVisible: (visible: boolean) => void;
}

const TickerContext = createContext<TickerContextType | undefined>(undefined);

export function TickerProvider({ children }: { children: ReactNode }) {
  const [isTickerVisible, setIsTickerVisible] = useState(true);

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
