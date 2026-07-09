"use client";

import { NextIntlClientProvider } from "next-intl";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
// import { EventTicker } from "@/components/ui/EventTicker";
import { TickerProvider } from "./TickerContext";

import { usePathname } from "next/navigation";

interface ClientProvidersProps {
  messages: Record<string, unknown>;
  locale: string;
  children: React.ReactNode;
}

export function ClientProviders({ messages, locale, children }: ClientProvidersProps) {
  const pathname = usePathname();
  
  // Detect if current route belongs to Member Portal or Admin CMS
  const cleanPath = pathname.replace(/^\/(en|ja)/, "");
  const isCmsRoute = cleanPath.startsWith("/admin") || cleanPath.startsWith("/portal") || cleanPath.startsWith("/login");

  if (isCmsRoute) {
    return (
      <NextIntlClientProvider messages={messages} locale={locale} timeZone="Asia/Kolkata">
        <TickerProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </TickerProvider>
      </NextIntlClientProvider>
    );
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone="Asia/Kolkata">
      <TickerProvider>
        <SmoothScrollProvider>
          {/* <EventTicker /> */}
          <Navbar />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </TickerProvider>
    </NextIntlClientProvider>
  );
}
