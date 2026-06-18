"use client";

import { NextIntlClientProvider } from "next-intl";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventTicker } from "@/components/ui/EventTicker";
import { TickerProvider } from "./TickerContext";

interface ClientProvidersProps {
  messages: Record<string, unknown>;
  locale: string;
  children: React.ReactNode;
}

export function ClientProviders({ messages, locale, children }: ClientProvidersProps) {
  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone="Asia/Kolkata">
      <TickerProvider>
        <SmoothScrollProvider>
          <EventTicker />
          <Navbar />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </TickerProvider>
    </NextIntlClientProvider>
  );
}
