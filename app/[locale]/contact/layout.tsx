import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { env } from "@/lib/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });

  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const title = locale === "ja"
    ? "お問い合わせ | JIBB — 日印ビジネス機構"
    : "Contact Us | JIBB - Japan India Business Bureau";
  const description = locale === "ja"
    ? "日印ビジネス機構（JIBB）へのお問い合わせ。東京・Noida拠点からビジネス協力、市場参入支援、パートナーシップに関するご相談を承ります。"
    : "Contact JIBB for Japan-India business inquiries. Reach our Tokyo and Noida offices for bilateral collaboration, market entry support, and partnership opportunities.";

  return {
    title,
    description,
    keywords: [
      "JIBB contact",
      "Japan India business inquiry",
      "JIBB Tokyo office",
      "JIBB Noida office",
      "Japan India collaboration",
      "JIBB問い合わせ",
      "日印ビジネス相談",
      "東京オフィス",
      "Noidaオフィス",
      "bilateral business support",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/${locale}/contact`,
      siteName: "JIBB - Japan India Business Bureau",
      locale: locale === "en" ? "en_US" : "ja_JP",
      alternateLocale: locale === "en" ? "ja_JP" : "en_US",
      images: [
        {
          url: `${baseUrl}/images/og/contact-og.jpg`,
          width: 1200,
          height: 630,
          alt: "Contact JIBB — Tokyo & Noida Offices for Bilateral Partnerships",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/og/contact-og.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/contact`,
      languages: {
        en: `${baseUrl}/en/contact`,
        ja: `${baseUrl}/ja/contact`,
      },
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
