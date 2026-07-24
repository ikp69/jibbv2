import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { env } from "@/lib/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "careersPage" });

  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const title = locale === "ja"
    ? "採用情報・キャリア | JIBB — 日印ビジネス機構"
    : "Careers & Job Openings | JIBB - Japan India Business Bureau";
  const description = locale === "ja"
    ? "JIBBで日印ビジネスのキャリアを築こう。バイリンガルコンサルタント、翻訳コーディネーター、ビジネス開発職など募集中。東京・Noida拠点勤務。"
    : "Build your career at JIBB connecting Japan and India. Open positions: Bilateral Business Consultant, Translator/Coordinator, Business Development Executive. Tokyo and Noida offices.";

  return {
    title,
    description,
    keywords: [
      "JIBB careers",
      "Japan India jobs",
      "bilateral business consultant",
      "Japanese translator jobs",
      "business development India Japan",
      "JIBB採用",
      "日印ビジネス求人",
      "バイリンガルコンサルタント",
      "翻訳コーディネーター",
      "Tokyo Noida jobs",
      "cross-border career",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/${locale}/careers`,
      siteName: "JIBB - Japan India Business Bureau",
      locale: locale === "en" ? "en_US" : "ja_JP",
      alternateLocale: locale === "en" ? "ja_JP" : "en_US",
      images: [
        {
          url: `${baseUrl}/images/og/careers-og.jpg`,
          width: 1200,
          height: 630,
          alt: "Join JIBB Team — Careers in Japan-India Business & Bilateral Collaboration",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/og/careers-og.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/careers`,
      languages: {
        en: `${baseUrl}/en/careers`,
        ja: `${baseUrl}/ja/careers`,
      },
    },
  };
}

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
