import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Geist_Mono, Plus_Jakarta_Sans, Cormorant_Garamond, Montserrat } from "next/font/google";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { ClientProviders } from "@/components/providers/ClientProviders";

// ============================================================
// FONTS — all loaded via next/font (no external CDN requests)
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

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

// ============================================================
// METADATA
// ============================================================
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://npo-jibb.org"),
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
      className={`${inter.variable} ${plusJakartaSans.variable} ${notoSansJP.variable} ${geistMono.variable} ${cormorantGaramond.variable} ${montserrat.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Material Symbols — kept as external for now; move to self-hosted to eliminate CDN dependency */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground relative overflow-x-hidden">
        <ClientProviders messages={messages} locale={locale}>
            {children}
          </ClientProviders>
      </body>
    </html>
  );
}
