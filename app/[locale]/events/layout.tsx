import { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Upcoming Events & Seminars | 開催予定イベント・セミナー',
  description: 'Join Japan-India Business seminars, including Semicon India 2026 briefings, semiconductor outlooks, and Bharat Mobility entry opportunities. セミコンインディア2026出展説明会や自動車ビジネス進出セミナーの開催情報を紹介。',
  keywords: [
    'JIBB events', 'Japan India seminar', 'Semicon India 2026', 'Bharat Mobility',
    'India market entry seminar', 'Japan India business events',
    'JIBBイベント', '日印セミナー', '日印ビジネスイベント', 'インド市場参入セミナー'
  ],
  alternates: {
    canonical: 'https://npo-jibb.org/events',
    languages: {
      'en': 'https://npo-jibb.org/events',
      'ja': 'https://npo-jibb.org/events',
      'x-default': 'https://npo-jibb.org/events',
    }
  },
  openGraph: {
    title: 'Upcoming Events & Seminars | JIBB | 開催予定イベント・セミナー',
    description: 'Join Japan-India Business seminars, including Semicon India 2026 briefings, semiconductor outlooks, and Bharat Mobility entry opportunities.',
    url: 'https://npo-jibb.org/events',
    siteName: 'JIBB',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: 'https://www.npo-jibb.org/images/og/events-og.jpg',
        width: 1200,
        height: 630,
        alt: 'JIBB Events & Seminars — Japan-India Bilateral Business Opportunities',
        type: 'image/jpeg',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Upcoming Events & Seminars | JIBB',
    description: 'Join Japan-India Business seminars, including Semicon India 2026 and Bharat Mobility entry opportunities.',
    images: ['https://www.npo-jibb.org/images/og/events-og.jpg']
  },
}


export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
