'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import EventsProgramTable from '@/components/events/EventsProgramTable'
import { getEventBySlug } from '@/lib/eventsData'

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const } } }
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const slideFromRight = { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } } }
const scaleIn = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const } } }
const programRowVariant = { hidden: { opacity: 0 }, visible: (i: number) => ({ opacity: 1, transition: { duration: 0.5, delay: i * 0.05, ease: [0.33, 1, 0.68, 1] as const } }) }
const venueRowVariant = { hidden: { opacity: 0, x: -30 }, visible: (i: number) => ({ opacity: 1, x: 0, transition: { duration: 0.5, delay: i * 0.12, ease: [0.33, 1, 0.68, 1] as const } }) }
const staggerOnScroll = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }

const getPartnerLogo = (name: string): string | null => {
  const n = name.toLowerCase()
  if (n.includes('japan india business bureau') || n.includes('jibb') || n.includes('日本インドビジネス')) return '/events/japan_india_business_bureau.jpg'
  if (n.includes('japan-india consulting') || n.includes('日印コンサルティング') || n.includes('jic')) return '/events/japan_india_consulting_jp_logo.jpg'
  return null
}

export default function MobilityEventPage() {
  const locale = useLocale()
  const jpFont = locale === 'ja' ? { fontFamily: 'var(--font-noto-jp)' } : {}

  const eventData = getEventBySlug('bharat-mobility-2026')!
  const t = eventData[locale as 'en' | 'ja']

  const names = [t.organizer, ...(t.coOrganizers || []), t.specialSupport || '', ...(t.supporters || [])].filter(Boolean)
  const uniqueLogos: { name: string; src: string }[] = []
  const seen = new Set<string>()
  names.forEach(name => {
    const logo = getPartnerLogo(name)
    if (logo && !seen.has(logo)) { seen.add(logo); uniqueLogos.push({ name, src: logo }) }
  })
  const marqueeItems = uniqueLogos.length > 0 ? Array(Math.ceil(15 / uniqueLogos.length)).fill(uniqueLogos).flat() : []

  const labels = {
    en: { backToEvents: '← All Events', programTitle: 'Program Schedule', organizersTitle: 'Organizers & Partners', venueTitle: 'Venue & Access', time: 'Time', reception: 'Reception', capacity: 'Capacity', openMaps: 'Open in Google Maps', viewProgram: 'View Program', travelDesc: 'Distance between central stations and airports in major Japanese cities', contactTitle: 'Contact Information', contactOrg: 'NPO Japan India Business Bureau (JIBB) / Japan India Consulting', contactEmail: 'trade@ji-consulting.jp' },
    ja: { backToEvents: '← イベント一覧', programTitle: 'プログラム', organizersTitle: '主催・後援', venueTitle: '会場・アクセス', time: '時間', reception: '懇親会', capacity: '定員', openMaps: 'Google マップで開く', viewProgram: 'プログラム', travelDesc: '国内の主要都市における中心駅と空港との距離', contactTitle: 'お問い合わせ', contactOrg: 'NPO法人 日本インドビジネスビューロー（JIBB）/ 日印コンサルティング株式会社', contactEmail: 'trade@ji-consulting.jp' }
  }
  const lb = labels[locale as 'en' | 'ja']

  return (
    <main className="event-detail-main">
      <Link href="/events" className="event-detail-back-btn" title={locale === 'ja' ? 'イベント一覧へ戻る' : 'Back to Events'}>
        <span className="material-symbols-outlined">arrow_back</span>
      </Link>

      {/* Past event banner */}
      <div className="event-concluded-banner">
        <span className="material-symbols-outlined">event_busy</span>
        <span style={jpFont}>
          {locale === 'ja' ? 'このイベントは終了しました（2026年5月11日）' : 'This event has concluded — May 11, 2026'}
        </span>
      </div>

      {/* Poster Hero */}
      <div className="event-detail-poster-hero">
        <Image src={eventData.posterEn} alt="Bharat Mobility 2027 Seminar" fill
          className="event-detail-poster-img" priority sizes="100vw" />
        <div className="event-detail-poster-overlay"></div>
      </div>

      {/* Hero */}
      <motion.section className="events-hero" initial="hidden" animate="visible" variants={staggerContainer}>
        <div className="events-hero-bg"></div>
        <motion.div className="events-hero-left" variants={fadeInUp}>
          <div className="events-tag">
            <span className="events-tag-line"></span>
            <span className="events-tag-text" style={jpFont}>{t.tagline}</span>
          </div>
          <h1 className="events-hero-title" style={jpFont}>
            {t.title}<br /><em>{t.titleHighlight}</em><br />{t.titleEnd}
          </h1>
          <p className="events-hero-subtitle" style={jpFont}>{t.subtitle}</p>
          <div className="events-hero-buttons">
            <a href="#program" className="events-btn events-btn-secondary">
              <span className="material-symbols-outlined">schedule</span>
              {lb.viewProgram}
            </a>
          </div>
        </motion.div>
        <motion.div className="events-hero-right" variants={fadeInUp}>
          <div className="events-badges">
            <span className="events-badge events-badge-date">{t.date}</span>
            <span className="events-badge events-badge-format">{t.format}</span>
            <span className="events-badge" style={{ background: '#e2e8f0', color: '#64748b' }}>
              {locale === 'ja' ? '終了' : 'Concluded'}
            </span>
          </div>
          <div className="events-details">
            <div className="events-detail-item">
              <span className="material-symbols-outlined">schedule</span>
              <div><h4 style={jpFont}>{lb.time}</h4><p>{t.time}</p></div>
            </div>
            <div className="events-detail-item">
              <span className="material-symbols-outlined">location_on</span>
              <div><h4 style={jpFont}>{locale === 'ja' ? '会場' : 'Venue'}</h4><p>{t.venue}</p></div>
            </div>
            <div className="events-detail-item">
              <span className="material-symbols-outlined">groups</span>
              <div><h4 style={jpFont}>{lb.capacity}</h4><p>{t.seminarCapacity}</p></div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Program */}
      <motion.section className="events-program" id="program"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerOnScroll}>
        <motion.div className="events-section-header" variants={fadeInUp}>
          <h2 className="events-section-title" style={jpFont}>{lb.programTitle}</h2>
          <span className="events-section-date">{t.date}</span>
        </motion.div>
        <EventsProgramTable
          program={t.program}
          locale={locale}
          eventId="mobility-2026"
          jpFont={jpFont}
        />
      </motion.section>

      {/* Partners */}
      {marqueeItems.length > 0 && (
        <motion.section className="events-partners-section"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={scaleIn}>
          <motion.div className="events-partners-section-header" variants={fadeInUp}>
            <p className="events-banner-tag">{locale === 'ja' ? 'パートナー' : 'Our Partners'}</p>
            <h2 className="events-banner-title" style={jpFont}>{lb.organizersTitle}</h2>
          </motion.div>
          <div className="events-partners-marquee">
            <div className="events-partners-track">
              {marqueeItems.map((logo, index) => (
                <div key={index} className="events-partner-logo-item">
                  <Image src={logo.src} alt={logo.name} width={200} height={80} className="events-partner-marquee-img" style={{ width: 'auto', height: 'auto' }} />
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Venue */}
      <section className="events-venue">
        <motion.div className="events-venue-banner"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={scaleIn}>
          <p className="events-banner-tag">{locale === 'ja' ? '会場・アクセス' : 'Location & Access'}</p>
          <h2 className="events-banner-title" style={jpFont}>{lb.venueTitle}</h2>
          <p className="events-venue-name-hero">{t.venue}</p>
        </motion.div>
        <div className="events-venue-split">
          <div className="events-venue-details">
            {[
              { icon: 'location_on', label: locale === 'ja' ? '住所' : 'Address', value: t.venue, sub: t.venueAddress },
              { icon: 'train', label: locale === 'ja' ? 'アクセス' : 'Access', value: locale === 'ja' ? '東銀座駅・新富町駅より徒歩圏内' : 'Walking distance from Higashi-Ginza / Shintomicho stations' },
              { icon: 'flight', label: locale === 'ja' ? '空港から' : 'From Airport', value: locale === 'ja' ? '成田から約60分、羽田から約30分' : '~60 min from Narita, ~30 min from Haneda' },
            ].map((row, i) => (
              <motion.div key={i} className="events-detail-row" custom={i}
                variants={venueRowVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                <div className="events-detail-icon"><span className="material-symbols-outlined">{row.icon}</span></div>
                <div className="events-detail-content">
                  <p className="events-detail-label">{row.label}</p>
                  <p className="events-detail-value" style={jpFont}>{row.value}</p>
                  {'sub' in row && row.sub && <p className="events-detail-sub">{row.sub}</p>}
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div className="events-travel-section"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={slideFromRight}>
            <div className="events-travel-header">
              <p className="events-travel-label">{locale === 'ja' ? '海外からお越しの方へ' : 'For International Attendees'}</p>
              <p className="events-travel-title" style={jpFont}>{lb.travelDesc}</p>
            </div>
            <Image src="/events/japan-travel-map.png" alt="Japan Travel Map" width={600} height={400}
              className="events-travel-map" style={{ width: '100%', height: 'auto' }} />
          </motion.div>
        </div>
        <motion.div className="events-contact-footer"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}>
          <div className="events-contact-inner">
            <div className="events-contact-left">
              <div className="events-contact-icon"><span className="material-symbols-outlined">mail</span></div>
              <div>
                <p className="events-contact-label">{lb.contactTitle}</p>
                <p className="events-contact-org" style={jpFont}>{lb.contactOrg}</p>
              </div>
            </div>
            <a href={`mailto:${lb.contactEmail}`} className="events-contact-email">{lb.contactEmail}</a>
          </div>
        </motion.div>
      </section>

    </main>
  )
}
