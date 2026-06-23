import { Metadata } from 'next'
import SemiconEventPage from './SemiconEventPage'

const BASE = 'https://npo-jibb.org'
const SLUG = 'semicon-india-2026'
const OG_IMAGE = `${BASE}/events/semicon-india-2026-en.png`

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://npo-jibb.org";

  const title = locale === "ja"
    ? "セミコンインディア2026出展説明会・半導体市場セミナー | JIBB 東京"
    : "Semicon India 2026 Exhibition Briefing & Semiconductor Market Seminar | JIBB Tokyo";

  const description = locale === "ja"
    ? "インド半導体市場およびセミコンインディア2026でのジャパンパビリオン出展機会に関する特別説明会（9月17〜19日、ニューデリー）。2026年4月28日、東京・プラザエフにて開催。ハイブリッド形式。IESAおよびJIBB主催。"
    : "Exclusive briefing on India's semiconductor market and the Japan Pavilion exhibition opportunity at Semicon India 2026 (Sep 17–19, New Delhi). Held April 28, 2026 at Plaza F, Tokyo. Hybrid format. Organized by IESA & JIBB.";

  return {
    title,
    description,
    keywords: [
      'Semicon India 2026', 'Japan Pavilion Semicon India', 'India semiconductor market',
      'IESA JIBB seminar', 'Japan India semiconductor', 'CMP committee',
      'インド半導体市場', 'セミコンインディア2026', 'ジャパンパビリオン'
    ],
    alternates: {
      canonical: `${baseUrl}/${locale}/events/${SLUG}`,
      languages: {
        en: `${baseUrl}/en/events/${SLUG}`,
        "x-default": `${baseUrl}/en/events/${SLUG}`,
      }
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/events/${SLUG}`,
      siteName: 'JIBB',
      locale: locale === 'en' ? 'en_US' : 'ja_JP',
      alternateLocale: locale === 'en' ? 'ja_JP' : 'en_US',
      type: 'website',
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Semicon India 2026 Seminar | セミコンインデイ2026セミナー' }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE]
    }
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: "1st Exhibition Briefing & Semiconductor Market Outlook Seminar — Semicon India 2026",
  description: "Exclusive briefing on India's semiconductor market and the Japan Pavilion exhibition opportunity at Semicon India 2026 in New Delhi.",
  startDate: '2026-04-28T14:00:00+09:00',
  endDate: '2026-04-28T19:30:00+09:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Plaza F',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '15 Rokubancho',
      addressLocality: 'Chiyoda-ku',
      addressRegion: 'Tokyo',
      postalCode: '102-0085',
      addressCountry: 'JP'
    }
  },
  organizer: [
    { '@type': 'Organization', name: 'India Electronics & Semiconductor Association (IESA)', url: 'https://www.iesa.org.in' },
    { '@type': 'Organization', name: 'NPO Japan India Business Bureau (JIBB)', url: 'https://npo-jibb.org' }
  ],
  image: OG_IMAGE,
  url: `${BASE}/events/${SLUG}`,
  inLanguage: ['en', 'ja'],
  previousStartDate: '2026-04-28'
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SemiconEventPage />
    </>
  )
}
