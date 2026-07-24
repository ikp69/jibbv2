import { Metadata } from 'next'
import MobilityEventPage from './MobilityEventPage'

const BASE = 'https://npo-jibb.org'
const SLUG = 'bharat-mobility-2026'
const OG_IMAGE = `${BASE}/events/bharat-mobility-2027-en.png`

import { env } from "@/lib/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  const title = locale === "ja"
    ? "バーラトモビリティ2027・インド自動車ビジネス参入セミナー | JIBB 東京"
    : "4th Bharat Mobility 2027 & India Automotive Business Entry Seminar | JIBB Tokyo";

  const description = locale === "ja"
    ? "インド自動車部品工業会（ACMA）代表団来日！インド自動車市場の展望、バーラト・モビリティ2027出展機会、市場参入手法に関する特別セミナー。2026年5月11日、東京・銀座ブロッサムにて開催。ハイブリッド形式。"
    : "ACMA delegation visits Japan! Exclusive seminar on India's automotive market outlook, Bharat Mobility 2027 exhibition opportunities, and market entry methods. Held May 11, 2026 at Ginza Blossom, Tokyo. Hybrid format.";

  return {
    title,
    description,
    keywords: [
      'Bharat Mobility 2027', 'India automotive market', 'ACMA Japan', 'JAPIA India',
      'Japan India automotive', 'JIBB seminar', 'India automotive entry',
      'インド自動車市場', 'バーラト・モビリティ', '日印自動車'
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
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Bharat Mobility 2027 Seminar | バーラトモビリティ2027セミナー' }]
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
  name: "4th Bharat Mobility 2027 & India Automotive Business Entry Seminar",
  description: "ACMA delegation visits Japan to brief on India's automotive market outlook, Bharat Mobility 2027 exhibition opportunity, and market entry strategies.",
  startDate: '2026-05-11T14:00:00+09:00',
  endDate: '2026-05-11T17:50:00+09:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Ginza Blossom (Chuo City Central Hall)',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2-15-6 Ginza',
      addressLocality: 'Chuo-ku',
      addressRegion: 'Tokyo',
      postalCode: '104-0061',
      addressCountry: 'JP'
    }
  },
  organizer: [
    { '@type': 'Organization', name: 'Automotive Component Manufacturers Association of India (ACMA)', url: 'https://www.acma.in' },
    { '@type': 'Organization', name: 'NPO Japan India Business Bureau (JIBB)', url: 'https://npo-jibb.org' }
  ],
  performer: [
    { '@type': 'Organization', name: 'Automotive Component Manufacturers Association of India (ACMA)' },
    { '@type': 'Organization', name: 'NPO Japan India Business Bureau (JIBB)' }
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
    availability: 'https://schema.org/InStock',
    url: 'https://npo-jibb.org/events/bharat-mobility-2026',
    validFrom: '2026-04-01T00:00:00+09:00',
    validThrough: '2026-05-11T23:59:59+09:00'
  },
  image: OG_IMAGE,
  url: `${BASE}/events/${SLUG}`,
  inLanguage: ['en', 'ja'],
  previousStartDate: '2026-05-11'
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MobilityEventPage />
    </>
  )
}
