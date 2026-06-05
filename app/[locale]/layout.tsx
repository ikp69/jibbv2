import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { PageTransitionProvider } from "@/components/providers/PageTransitionProvider";

// ============================================================
// FONTS — Inter (Latin) + Noto Sans JP (Japanese) + Geist Mono
// ============================================================
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
      className={`${inter.variable} ${plusJakartaSans.variable} ${notoSansJP.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground bg-grid-mesh relative overflow-x-hidden">
        {/* Global background column layout grid lines aligning with the page container */}
        <div className="pointer-events-none fixed inset-0 z-0 flex justify-between max-w-7xl mx-auto px-6 lg:px-8" aria-hidden="true">
          <div className="w-[1px] bg-border/20 dark:bg-white/5 h-full" />
          <div className="w-[1px] bg-border/20 dark:bg-white/5 h-full" />
        </div>

        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <Navbar />
            <PageTransitionProvider>
              {children}
            </PageTransitionProvider>
            <Footer />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
