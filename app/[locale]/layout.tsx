import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

// ============================================================
// FONTS — Inter (Latin) + Noto Sans JP (Japanese) + Geist Mono
// ============================================================
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ============================================================
// METADATA
// ============================================================
export const metadata: Metadata = {
  title: {
    default: "JIBB — Japan India Business Bureau",
    template: "%s | JIBB",
  },
  description:
    "A cross-border innovation and industrial collaboration ecosystem connecting Japan and India through partnerships, trade, manufacturing, and technology.",
  keywords: [
    "Japan India",
    "business bureau",
    "cross-border",
    "innovation",
    "partnership",
    "semiconductor",
    "EV",
    "market entry",
    "JIBB",
  ],
  authors: [{ name: "Japan India Business Bureau" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ja_JP",
    siteName: "JIBB — Japan India Business Bureau",
  },
};

// ============================================================
// STATIC PARAMS — Pre-generate pages for both locales
// ============================================================
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ============================================================
// LOCALE LAYOUT
// ============================================================
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Load messages for the current locale
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${notoSansJP.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <Navbar />
            {children}
            <Footer />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
