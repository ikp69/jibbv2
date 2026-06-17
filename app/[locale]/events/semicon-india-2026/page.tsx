import { Metadata } from 'next'
import SemiconEventPage from './SemiconEventPage'

const BASE = 'https://npo-jibb.org'
const SLUG = 'semicon-india-2026'
const OG_IMAGE = `${BASE}/events/semicon-india-2026-en.png`

export const metadata: Metadata = {
  title: "Semicon India 2026 Exhibition Briefing & Semiconductor Market Seminar | JIBB Tokyo",
  description: "Exclusive briefing on India's semiconductor market and the Japan Pavilion exhibition opportunity at Semicon India 2026 (Sep 17–19, New Delhi). Held April 28, 2026 at Plaza F, Tokyo. Hybrid format. Organized by IESA & JIBB.",
  keywords: [
    'Semicon India 2026', 'Japan Pavilion Semicon India', 'India semiconductor market',
    'IESA JIBB seminar', 'Japan India semiconductor', 'CMP committee',
    'インド半導体市場', 'セミコンインディア2026', 'ジャパンパビリオン'
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
    title: "Semicon India 2026 — Semiconductor Market Outlook Seminar | JIBB | セミコンインデイ2026",
    description: "1st Exhibition Briefing & Semiconductor Market Outlook Seminar — April 28, 2026 · Plaza F, Tokyo. Hybrid event by IESA & JIBB. インド半導体市場セミナー・ジャパンパビリオン出展説明会。",
    url: `${BASE}/events/${SLUG}`,
    siteName: 'JIBB',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Semicon India 2026 Seminar | セミコンインデイ2026セミナー' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Semicon India 2026 Exhibition Briefing | JIBB",
    description: "April 28, 2026 · Plaza F, Tokyo. India semiconductor market outlook and Japan Pavilion briefing. インド半導体市場・ジャパンパビリオン出展説明。",
    images: [OG_IMAGE]
  }
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
