import { Metadata } from 'next'
import MobilityEventPage from './MobilityEventPage'

const BASE = 'https://npo-jibb.org'
const SLUG = 'bharat-mobility-2026'
const OG_IMAGE = `${BASE}/events/bharat-mobility-2027-en.png`

export const metadata: Metadata = {
  title: "4th Bharat Mobility 2027 & India Automotive Business Entry Seminar | JIBB Tokyo",
  description: "ACMA delegation visits Japan! Exclusive seminar on India's automotive market outlook, Bharat Mobility 2027 exhibition opportunities, and market entry methods. Held May 11, 2026 at Ginza Blossom, Tokyo. Hybrid format.",
  keywords: [
    'Bharat Mobility 2027', 'India automotive market', 'ACMA Japan', 'JAPIA India',
    'Japan India automotive', 'JIBB seminar', 'India automotive entry',
    'インド自動車市場', 'バーラト・モビリティ', '日印自動車'
  ],
  alternates: {
    canonical: `${BASE}/events/${SLUG}`,
    languages: {
      'en': `${BASE}/events/${SLUG}`,
      'ja': `${BASE}/events/${SLUG}`,
      'x-default': `${BASE}/events/${SLUG}`,
    }
  },
  openGraph: {
    title: "Bharat Mobility 2027 & India Automotive Business Entry Seminar | JIBB",
    description: "ACMA delegation visits Japan — May 11, 2026 · Ginza Blossom, Tokyo. India automotive market outlook and exhibition briefing. インド自動車市場セミナー・バーラトモビリティ2027出展説明会。",
    url: `${BASE}/events/${SLUG}`,
    siteName: 'JIBB',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Bharat Mobility 2027 Seminar | バーラトモビリティ2027セミナー' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bharat Mobility 2027 India Automotive Seminar | JIBB",
    description: "May 11, 2026 · Ginza Blossom, Tokyo. India automotive business entry seminar with ACMA. インド自動車ビジネス参入セミナー。",
    images: [OG_IMAGE]
  }
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
