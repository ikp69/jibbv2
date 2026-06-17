import { Metadata } from 'next'
import ManufacturingEventPage from './ManufacturingEventPage'

const BASE = 'https://npo-jibb.org'
const SLUG = 'india-japan-manufacturing-collaboration-2026'
const OG_IMAGE = `${BASE}/events/JIBB_Event_3_July_2026.jpg`

export const metadata: Metadata = {
  title: "India–Japan Manufacturing Collaboration 2026 | JIBB Seminar Tokyo",
  description: "Join us on July 3, 2026 at Ginza Blossom, Tokyo for an exclusive seminar on India's manufacturing investment opportunities, policy incentives, and market entry pathways for Japanese companies. Organized by Invest India & JIBB. Free of charge.",
  keywords: [
    'India Japan Manufacturing', 'JIBB Seminar 2026', 'India Manufacturing Investment',
    'Japanese companies India', 'Invest India seminar', 'India market entry',
    'Machine tools India', 'Semiconductor manufacturing India', 'Tokyo seminar 2026',
    'インド製造業セミナー', '日印製造業', 'インド投資'
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
    title: "India–Japan Manufacturing Collaboration 2026 | Seminar | 日印製造業セミナー",
    description: "Unlocking India's Manufacturing Growth Story — July 3, 2026 · Ginza Blossom, Tokyo. Free seminar for Japanese manufacturing companies. インド製造業投賄機会セミナー。",
    url: `${BASE}/events/${SLUG}`,
    siteName: 'JIBB',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'India Japan Manufacturing Collaboration 2026 | 日印製造業連携2026' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "India–Japan Manufacturing Collaboration 2026 | JIBB",
    description: "July 3, 2026 · Ginza Blossom, Tokyo. Free seminar for Japanese manufacturers exploring India. インド製造業参入セミナー。",
    images: [OG_IMAGE]
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: "India–Japan Manufacturing Collaboration 2026 Seminar",
  description: "An exclusive seminar on India's manufacturing investment opportunities, policy incentives, partnership models, and market entry pathways for Japanese manufacturing companies.",
  startDate: '2026-07-03T14:00:00+09:00',
  endDate: '2026-07-03T17:00:00+09:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
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
    { '@type': 'Organization', name: 'Invest India', url: 'https://www.investindia.gov.in' },
    { '@type': 'Organization', name: 'NPO Japan India Business Bureau (JIBB)', url: 'https://npo-jibb.org' }
  ],
  performer: [
    { '@type': 'Organization', name: 'Invest India' },
    { '@type': 'Organization', name: 'NPO Japan India Business Bureau (JIBB)' }
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'JPY',
    availability: 'https://schema.org/InStock',
    url: 'https://forms.office.com/r/d7tMkBLaq8',
    validFrom: '2026-05-01T00:00:00+09:00',
    validThrough: '2026-07-03'
  },
  identifier: 'JIBB-IJMC-2026',
  image: OG_IMAGE,
  url: `${BASE}/events/${SLUG}`,
  inLanguage: ['en', 'ja'],
  audience: {
    '@type': 'Audience',
    audienceType: 'Japanese manufacturing companies in machine tools, semiconductor equipment, robotics, and industrial automation'
  }
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ManufacturingEventPage />
    </>
  )
}
