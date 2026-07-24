import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEventBySlug } from '@/lib/eventsData'
import EventDetailClientPage from './EventDetailClientPage'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const event = getEventBySlug(slug)

  if (!event) {
    return {
      title: locale === 'ja' ? 'イベントが見つかりません | JIBB' : 'Event Not Found | JIBB'
    }
  }

  const loc = event[locale as 'en' | 'ja'] || event.en
  const title = `${loc.title} ${loc.titleHighlight} ${loc.titleEnd} | JIBB`
  const description = loc.subtitle || loc.overview || ''
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://npo-jibb.org'
  const ogImage = `${baseUrl}${event.posterEn}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/events/${slug}`,
      siteName: 'JIBB',
      locale: locale === 'en' ? 'en_US' : 'ja_JP',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    }
  }
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params
  const event = getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const loc = event[locale as 'en' | 'ja'] || event.en

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${loc.title} ${loc.titleHighlight} ${loc.titleEnd}`,
    description: loc.subtitle || loc.overview || '',
    startDate: event.eventDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: loc.venue,
      address: {
        '@type': 'PostalAddress',
        streetAddress: loc.venueAddress,
        addressCountry: event.timeZone === 'Asia/Kolkata' ? 'IN' : 'JP'
      }
    },
    organizer: {
      '@type': 'Organization',
      name: loc.organizer,
      url: 'https://npo-jibb.org'
    },
    image: event.posterEn,
    url: `https://npo-jibb.org/events/${slug}`,
    inLanguage: [locale]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventDetailClientPage event={event} locale={locale} />
    </>
  )
}
