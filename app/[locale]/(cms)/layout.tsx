import React from "react";

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return <div className="cms-root w-full min-h-screen flex flex-col">{children}</div>;
}
