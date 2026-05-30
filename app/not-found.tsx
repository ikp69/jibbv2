"use client";

import { useEffect } from "react";

export default function RootNotFound() {
  useEffect(() => {
    // Redirect to default locale's not-found page
    window.location.replace("/en/not-found");
  }, []);

  return (
    <html lang="en">
      <body className="bg-[#0F1629] text-[#F0EDE8] min-h-screen flex items-center justify-center font-sans m-0">
        <div className="text-center p-6 max-w-md">
          <div className="size-12 border-4 border-jibb-orange border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h1 className="text-2xl font-bold tracking-tight mb-2">Redirecting to Portal</h1>
          <p className="text-[#8B95A8] text-sm">
            Please wait while we navigate you to the Japan India Business Bureau corridors...
          </p>
        </div>
      </body>
    </html>
  );
}
