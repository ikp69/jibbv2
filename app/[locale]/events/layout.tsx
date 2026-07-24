import { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

import { env } from "@/lib/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  const title = locale === "ja"
    ? "開催予定イベント・セミナー | JIBB - 日印ビジネス機構"
    : "Upcoming Events & Seminars | JIBB - Japan India Business Bureau";

  const description = locale === "ja"
    ? "セミコンインディア2026出展説明会や自動車ビジネス進出セミナーの開催情報を紹介。日印ビジネスパートナーシップの機会を提供します。"
    : "Join Japan-India Business seminars, including Semicon India 2026 briefings, semiconductor outlooks, and Bharat Mobility entry opportunities.";

  return {
    title,
    description,
    keywords: [
      'JIBB events', 'Japan India seminar', 'Semicon India 2026', 'Bharat Mobility',
      'India market entry seminar', 'Japan India business events',
      'JIBBイベント', '日印セミナー', '日印ビジネスイベント', 'インド市場参入セミナー'
    ],
    alternates: {
      canonical: `${baseUrl}/${locale}/events`,
      languages: {
        en: `${baseUrl}/en/events`,
        "x-default": `${baseUrl}/en/events`,
      }
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/events`,
      siteName: 'JIBB',
      locale: locale === 'en' ? 'en_US' : 'ja_JP',
      alternateLocale: locale === 'en' ? 'ja_JP' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/images/og/events-og.jpg`,
          width: 1200,
          height: 630,
          alt: 'JIBB Events & Seminars — Japan-India Bilateral Business Opportunities',
          type: 'image/jpeg',
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/images/og/events-og.jpg`]
    },
  };
}


export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
