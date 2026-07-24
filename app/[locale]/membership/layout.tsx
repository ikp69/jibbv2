import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { env } from "@/lib/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "membershipPage" });

  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const title = locale === "ja"
    ? "会員プラン・特典 | JIBB — 日印ビジネス機構"
    : "Membership Tiers & Benefits | JIBB - Japan India Business Bureau";
  const description = locale === "ja"
    ? "JIBBの4つの会員プラン（アソシエイト・シルバー・ゴールド・プラチナ）で日印ビジネスネットワークに参加。ビジネスマッチング割引、トレーニングプログラム、日本代表団アクセスなど特典多数。"
    : "Join JIBB with Associate, Silver, Gold, or Platinum membership to access Japan-India business network. Enjoy exclusive benefits including business matching discounts, training programs, and Japan delegation access.";

  return {
    title,
    description,
    keywords: [
      "JIBB membership",
      "Japan India business network",
      "membership benefits",
      "business association Japan India",
      "JIBB会員",
      "日印ビジネスネットワーク",
      "会員特典",
      "ビジネスマッチング",
      "cross-border business membership",
      "bilateral trade association",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/${locale}/membership`,
      siteName: "JIBB - Japan India Business Bureau",
      locale: locale === "en" ? "en_US" : "ja_JP",
      alternateLocale: locale === "en" ? "ja_JP" : "en_US",
      images: [
        {
          url: `${baseUrl}/images/og/membership-og.jpg`,
          width: 1200,
          height: 630,
          alt: "JIBB Membership Tiers — Associate, Silver, Gold, Platinum benefits",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/og/membership-og.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/membership`,
      languages: {
        en: `${baseUrl}/en/membership`,
        ja: `${baseUrl}/ja/membership`,
      },
    },
  };
}

export default function MembershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://npo-jibb.org"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Membership",
        "item": "https://npo-jibb.org/membership"
      }
    ]
  };

  return (
    <>
      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
