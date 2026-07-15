'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { useLocale } from 'next-intl'
import { upcomingEvents, pastEvents } from '@/lib/eventsData'
import { EventCountdown, EventCalendar, EventDetailsSummary } from '@/components/events'
import { Event } from '@/components/events/EventDetailsSummary'

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.33, 1, 0.68, 1] as const } }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] as const } }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
}

export default function EventsLandingPage() {
  const locale = useLocale()
  const jpFont = locale === 'ja' ? { fontFamily: 'var(--font-noto-sans-jp)' } : {}

  const formatBadgeDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      if (locale === 'ja') {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${year}年${month}月${day}日`
      } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const month = months[date.getMonth()]
        const day = date.getDate()
        const year = date.getFullYear()
        return `${month} ${day}, ${year}`
      }
    } catch {
      return dateStr
    }
  }

  const labels = {
    en: {
      pageTag: 'Events & Seminars',
      pageTitle: 'Japan–India Business',
      pageTitleHighlight: 'Events',
      pageSubtitle: 'Connect with industry leaders, explore investment opportunities, and build meaningful partnerships between Japan and India.',
      upcoming: 'Upcoming Events',
      past: 'Past Events',
      collageTitle: 'Highlights from Past Events',
      collageSubtitle: 'Moments from our Japan–India business seminars and exhibitions.',
      viewMore: 'View Full Gallery',
      viewLess: 'Show Less',
      upcomingBox: 'Upcoming',
      upcomingItalic: 'Events',
      upcomingItalicSingle: 'Event',
      pastBox: 'Past',
      pastItalic: 'Events',
      pastItalicSingle: 'Event',
      view: 'View',
    },
    ja: {
      pageTag: 'イベント・セミナー',
      pageTitle: '日印ビジネス',
      pageTitleHighlight: 'イベント',
      pageSubtitle: '業界リーダーと交流し、投資機会を探り、日本とインドの間で意義あるパートナーシップを構築しましょう。',
      upcoming: '今後のイベント',
      past: '過去のイベント',
      collageTitle: '過去のイベント ハイライト',
      collageSubtitle: '日印ビジネスセミナー・展示会の記録。',
      viewMore: 'ギャラリー全体を見る',
      viewLess: '閉じる',
      upcomingBox: '今後の',
      upcomingItalic: 'イベント',
      upcomingItalicSingle: 'イベント',
      pastBox: '過去の',
      pastItalic: 'イベント',
      pastItalicSingle: 'イベント',
      view: '表示：',
    }
  }
  const l = labels[locale as 'en' | 'ja']

  // Redesigned state and architecture for events
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [selectedEventId, setSelectedEventId] = useState<string>('manufacturing')

  // Localization labels for the interactive elements
  const tabLabels = {
    en: {
      upcomingEvents: 'Upcoming Events',
      pastEvents: 'Past Events',
      eventsCalendar: 'Events Calendar',
      otherEvents: 'Other Events in this Category',
      noEvents: 'No events found in this category.',
      registerButton: 'REGISTER NOW',
      detailsButton: 'VIEW DETAILS',
      organisedBy: 'ORGANISED BY',
      fee: 'FEE',
      languages: 'LANGUAGES',
      capacity: 'CAPACITY',
      venue: 'VENUE',
      time: 'TIME',
      date: 'DATE',
      backToUpcoming: 'Back to Upcoming Events',
      newEventsComing: 'New Events Coming Soon',
      newEventsComingDesc: 'We are currently organizing our upcoming schedule of bilateral business bureaus, industry seminars, and investment forums.',
      getUpdatesTitle: 'Stay Updated & Collaborate',
      followLinkedIn: 'Follow us on LinkedIn for live updates',
      contactUsToOrganize: 'To organize or co-host events, please contact us.'
    },
    ja: {
      upcomingEvents: '今後のイベント',
      pastEvents: '過去のイベント',
      eventsCalendar: 'イベントカレンダー',
      otherEvents: 'このカテゴリのその他のイベント',
      noEvents: 'このカテゴリのイベントはありません。',
      registerButton: '今すぐ登録する',
      detailsButton: '詳細を見る',
      organisedBy: '主催',
      fee: '参加費',
      languages: '言語',
      capacity: '定員',
      venue: '会場',
      time: '時間',
      date: '日程',
      backToUpcoming: '今後のイベントに戻る',
      newEventsComing: '新しいイベントが間もなく登場します',
      newEventsComingDesc: '現在、日印間のビジネスフォーラム、業界セミナー、投資説明会などの次回スケジュールを企画・調整しております。',
      getUpdatesTitle: '最新情報と共同開催のご案内',
      followLinkedIn: 'LinkedInをフォローして最新情報を受け取る',
      contactUsToOrganize: 'イベントの共催や企画については、お問い合わせください。'
    }
  }

  // Helper to extract city from venueAddress
  const getEventCity = (address: string) => {
    const addr = address.toLowerCase()
    if (addr.includes('tokyo') || addr.includes('東京') || addr.includes('chiyoda') || addr.includes('chuo') || addr.includes('ginza') || addr.includes('六番町')) {
      return locale === 'ja' ? '東京' : 'Tokyo'
    }
    if (addr.includes('delhi') || addr.includes('デリー') || addr.includes('noida') || addr.includes('ノイダ')) {
      return locale === 'ja' ? 'ニューデリー' : 'New Delhi'
    }
    if (addr.includes('bengaluru') || addr.includes('bangalore') || addr.includes('ベンガルール') || addr.includes('バンガロール')) {
      return locale === 'ja' ? 'ベンガルール' : 'Bengaluru'
    }
    return locale === 'ja' ? '東京' : 'Tokyo'
  }

  // Helper to resolve country from venueAddress
  const getEventCountry = (address: string) => {
    const addr = address.toLowerCase()
    if (
      addr.includes('india') ||
      addr.includes('delhi') ||
      addr.includes('noida') ||
      addr.includes('bengaluru') ||
      addr.includes('bangalore') ||
      addr.includes('デリー') ||
      addr.includes('ノイダ') ||
      addr.includes('ベンガルール') ||
      addr.includes('インド')
    ) {
      return locale === 'ja' ? 'インド' : 'India'
    }
    return locale === 'ja' ? '日本' : 'Japan'
  }

  // Map and enrich all events (combining database events + mock upcoming events)
  const allEvents = useMemo(() => {
    // 1. Map real upcoming events
    const realUpcoming = upcomingEvents.map(e => {
      const loc = e[locale as 'en' | 'ja'] || e.en
      return {
        id: e.id,
        title: loc.title + ' ' + (loc.titleHighlight ? loc.titleHighlight + ' ' : '') + (loc.titleEnd || ''),
        description: loc.subtitle || loc.overview || '',
        image: locale === 'ja' ? e.posterJa : e.posterEn,
        startDate: e.eventDate,
        venue: loc.venue,
        city: getEventCity(loc.venueAddress),
        country: getEventCountry(loc.venueAddress),
        capacity: parseInt(loc.seminarCapacity) || 80,
        registeredCount: 57,
        language: locale === 'ja' ? ['日本語', '英語'] : ['Japanese', 'English'],
        status: 'upcoming' as const,
        organizer: loc.organizer + (loc.coOrganizers?.length ? ` & ${loc.coOrganizers.join(' & ')}` : ''),
        fee: locale === 'ja' ? '無料' : 'Free of Charge',
        time: loc.time,
        slug: e.slug,
        registrationUrl: e.registrationUrl,
        eventType: loc.title.toLowerCase().includes('briefing') || loc.title.toLowerCase().includes('説明会')
          ? (locale === 'ja' ? '説明会' : 'Briefing')
          : (locale === 'ja' ? 'セミナー' : 'Seminar')
      }
    })

    // 2. Map real past events
    const realPast = pastEvents.map(e => {
      const loc = e[locale as 'en' | 'ja'] || e.en
      return {
        id: e.id,
        title: loc.title + ' ' + (loc.titleHighlight ? loc.titleHighlight + ' ' : '') + (loc.titleEnd || ''),
        description: loc.subtitle || loc.overview || '',
        image: locale === 'ja' ? e.posterJa : e.posterEn,
        startDate: e.eventDate,
        venue: loc.venue,
        city: getEventCity(loc.venueAddress),
        country: getEventCountry(loc.venueAddress),
        capacity: parseInt(loc.seminarCapacity) || 120,
        registeredCount: parseInt(loc.seminarCapacity) || 120,
        language: locale === 'ja' ? ['日本語', '英語'] : ['Japanese', 'English'],
        status: 'past' as const,
        organizer: loc.organizer + (loc.coOrganizers?.length ? ` & ${loc.coOrganizers.join(' & ')}` : ''),
        fee: locale === 'ja' ? '無料' : 'Free of Charge',
        time: loc.time,
        slug: e.slug,
        registrationUrl: e.registrationUrl,
        eventType: loc.title.toLowerCase().includes('briefing') || loc.title.toLowerCase().includes('説明会')
          ? (locale === 'ja' ? '説明会' : 'Briefing')
          : (locale === 'ja' ? 'セミナー' : 'Seminar')
      }
    })

    return [...realUpcoming, ...realPast]
  }, [locale])

  // Filter events based on active tab
  const filteredEvents = useMemo(() => {
    return allEvents.filter(e => e.status === activeTab)
  }, [allEvents, activeTab])

  // Selected event computation
  const selectedEvent = useMemo(() => {
    return allEvents.find(e => e.id === selectedEventId) || allEvents.find(e => e.status === 'upcoming')
  }, [allEvents, selectedEventId])

  // Non-selected events for the active category
  const otherEvents = useMemo(() => {
    return filteredEvents.filter(e => e.id !== selectedEventId)
  }, [filteredEvents, selectedEventId])

  // Automatically update selected event when switching tabs
  useEffect(() => {
    const categoryEvents = allEvents.filter(e => e.status === activeTab)
    if (categoryEvents.length > 0) {
      setSelectedEventId(categoryEvents[0].id)
    }
  }, [activeTab, allEvents])

  // State for gallery lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // State for active gallery selection
  const galleryKeys = ['semicon-2025', 'semicon-2026', 'acma', 'electronica', 'embassy-meet'] as const
  const [activeGalleryId, setActiveGalleryId] = useState<typeof galleryKeys[number]>('semicon-2025')

  const galleries = useMemo(() => ({
    'semicon-2025': {
      name: { en: 'SEMICON 2025', ja: 'SEMICON 2025' },
      images: [
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.40 PM.jpeg', alt: locale === 'ja' ? 'ネットワーキングセッション' : 'Networking session' },
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.41 PM (1).jpeg', alt: locale === 'ja' ? '講演の様子' : 'Speaking session' },
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.41 PM.jpeg', alt: locale === 'ja' ? 'セミナー講演の様子' : 'Seminar presentation' },
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.42 PM (1).jpeg', alt: locale === 'ja' ? '参加者との交流' : 'Participant interaction' },
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.42 PM.jpeg', alt: locale === 'ja' ? '参加者のネットワーキング' : 'Attendee networking' },
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.43 PM.jpeg', alt: locale === 'ja' ? 'パネルディスカッション' : 'Panel discussion' },
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.44 PM.jpeg', alt: locale === 'ja' ? '展示ブース' : 'Exhibition booth' },
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.44 PM (1).jpeg', alt: locale === 'ja' ? 'イベント展示' : 'Event exhibition' },
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.44 PM (2).jpeg', alt: locale === 'ja' ? '参加企業ブース' : 'Company booth' },
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.45 PM.jpeg', alt: locale === 'ja' ? 'イベント懇親会' : 'Event reception' },
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.45 PM (1).jpeg', alt: locale === 'ja' ? '懇親会の様子' : 'Reception gathering' },
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.45 PM (2).jpeg', alt: locale === 'ja' ? 'ネットワーキングパーティー' : 'Networking party' },
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 6.32.45 PM (3).jpeg', alt: locale === 'ja' ? '参加者の交流会' : 'Participant meetup' }
      ]
    },
    'semicon-2026': {
      name: { en: 'SEMICON Briefing 2026', ja: 'SEMICON Briefing 2026' },
      images: [
        { src: '/events/event-gallery/SEMICON Briefing 2026/WhatsApp Image 2026-06-05 at 5.32.54 PM.jpeg', alt: locale === 'ja' ? 'SEMICON 2026 会場の様子' : 'SEMICON 2026 Event venue' },
        { src: '/events/event-gallery/SEMICON Briefing 2026/WhatsApp Image 2026-06-05 at 5.32.55 PM.jpeg', alt: locale === 'ja' ? 'ブース打合せ' : 'Booth meeting' },
        { src: '/events/event-gallery/SEMICON Briefing 2026/WhatsApp Image 2026-06-05 at 5.32.56 PM.jpeg', alt: locale === 'ja' ? '日印ビジネス対話' : 'Japan-India business dialogue' },
        { src: '/events/event-gallery/SEMICON Briefing 2026/WhatsApp Image 2026-06-05 at 5.32.56 PM (1).jpeg', alt: locale === 'ja' ? '展示ブースの展示品' : 'Exhibits at the exhibition booth' }
      ]
    },
    'acma': {
      name: { en: 'Bharat Mobility Briefing 2027', ja: 'Bharat Mobility Briefing 2027' },
      images: [
        { src: '/events/event-gallery/Bharat Mobility Briefing 2027/1778741011392.jpg', alt: locale === 'ja' ? 'ACMA セミナー' : 'ACMA Seminar' },
        { src: '/events/event-gallery/Bharat Mobility Briefing 2027/1778741011411.jpg', alt: locale === 'ja' ? 'ACMA ネットワーキング' : 'ACMA Networking' }
      ]
    },
    'electronica': {
      name: { en: 'ELECTRONICA 2026', ja: 'ELECTRONICA 2026' },
      images: [
        { src: '/events/event-gallery/ELECTRONICA 2026/DSC_8760.jpg', alt: locale === 'ja' ? 'ELECTRONICA 2026 展示会' : 'ELECTRONICA 2026 Exhibition' },
        { src: '/events/event-gallery/ELECTRONICA 2026/DSC_8770.jpg', alt: locale === 'ja' ? 'ブース交流' : 'Booth interaction' },
        { src: '/events/event-gallery/ELECTRONICA 2026/DSC_8961.jpg', alt: locale === 'ja' ? '出展社ブース' : 'Exhibitor booth' },
        { src: '/events/event-gallery/ELECTRONICA 2026/DSC_8974.jpg', alt: locale === 'ja' ? '商談の様子' : 'Business meeting' },
        { src: '/events/event-gallery/ELECTRONICA 2026/DSC_9032.jpg', alt: locale === 'ja' ? 'イベント来場者' : 'Event attendees' },
        { src: '/events/event-gallery/ELECTRONICA 2026/DSC_9033.jpg', alt: locale === 'ja' ? '対話セッション' : 'Dialogue session' },
        { src: '/events/event-gallery/ELECTRONICA 2026/DSC_9044.jpg', alt: locale === 'ja' ? 'ネットワーキング' : 'Networking' }
      ]
    },
    'embassy-meet': {
      name: { en: 'Japan Embassy Meet', ja: '在日大使館での会合' },
      images: [
        { src: '/events/event-gallery/Japan Embassy Meet/WhatsApp Image 2026-03-20 at 5.51.35 PM.jpeg', alt: locale === 'ja' ? '在日大使館での会合' : 'Japan Embassy Meet' },
        { src: '/events/event-gallery/Japan Embassy Meet/WhatsApp Image 2026-03-20 at 5.51.35 PM (1).jpeg', alt: locale === 'ja' ? '会合の様子' : 'Embassy Meet discussion' },
        { src: '/events/event-gallery/Japan Embassy Meet/WhatsApp Image 2026-03-20 at 5.51.35 PM (2).jpeg', alt: locale === 'ja' ? '日印代表者' : 'Japan-India representatives' },
        { src: '/events/event-gallery/Japan Embassy Meet/WhatsApp Image 2026-03-20 at 5.51.35 PM (3).jpeg', alt: locale === 'ja' ? '大使館でのネットワーキング' : 'Networking at the Embassy' }
      ]
    }
  }), [locale])

  const activeGallery = useMemo(() => galleries[activeGalleryId], [galleries, activeGalleryId])
  const allGalleryImages = useMemo(() => activeGallery.images, [activeGallery])

  const handlePrevGallery = () => {
    const currentIndex = galleryKeys.indexOf(activeGalleryId)
    const prevIndex = (currentIndex - 1 + galleryKeys.length) % galleryKeys.length
    setActiveGalleryId(galleryKeys[prevIndex])
  }

  const handleNextGallery = () => {
    const currentIndex = galleryKeys.indexOf(activeGalleryId)
    const nextIndex = (currentIndex + 1) % galleryKeys.length
    setActiveGalleryId(galleryKeys[nextIndex])
  }

  // State for gallery
  const [showAllImages, setShowAllImages] = useState(false)
  const [displayedImages, setDisplayedImages] = useState<typeof allGalleryImages>([])

  // The old carousel effects were removed and replaced with activeTab state listeners.

  // Handle keyboard events for lightbox navigation
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null)
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allGalleryImages.length : null))
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + allGalleryImages.length) % allGalleryImages.length : null))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightboxIndex, allGalleryImages.length])

  // Function to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Reset showAllImages when activeGalleryId changes
  useEffect(() => {
    setShowAllImages(false)
  }, [activeGalleryId])

  // Initialize and animate images
  useEffect(() => {
    const getLimit = () => {
      if (typeof window !== 'undefined') {
        return window.innerWidth <= 768 ? 4 : 6
      }
      return 6
    }

    const updateImages = () => {
      if (showAllImages) {
        setDisplayedImages(allGalleryImages)
      } else {
        const limit = getLimit()
        setDisplayedImages(allGalleryImages.slice(0, limit))
      }
    }

    // Run initially on mount/client-side
    updateImages()

    let interval: NodeJS.Timeout | undefined
    if (!showAllImages && allGalleryImages.length > getLimit()) {
      // Randomly swap images every 5 seconds (shuffling within current event gallery)
      interval = setInterval(() => {
        const limit = getLimit()
        const shuffled = shuffleArray(allGalleryImages)
        setDisplayedImages(shuffled.slice(0, limit))
      }, 5000)
    }

    const handleResize = () => {
      updateImages()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (interval) clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [showAllImages, allGalleryImages])

  return (
    <main className="evl-main">
      {/* ─── Hero ─── */}
      <section className="evl-hero">
        <div className="evl-hero-bg"></div>
        <motion.div
          className="evl-hero-content"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div className="evl-hero-tag" variants={fadeInUp}>
            <span className="evl-hero-tag-line"></span>
            <span className="evl-hero-tag-text" style={jpFont}>{l.pageTag}</span>
          </motion.div>
          <motion.h1 className="evl-hero-title" variants={fadeInUp} style={jpFont}>
            {l.pageTitle}<br />
            <em>{l.pageTitleHighlight}</em>
          </motion.h1>
          <motion.p className="evl-hero-subtitle" variants={fadeInUp} style={jpFont}>
            {l.pageSubtitle}
          </motion.p>
        </motion.div>
      </section>

      {/* ─── Interactive Events Section ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        {/* Tabs Navigation */}
        <div className="evl-tabs-container mb-8" style={jpFont}>
          <button
            className={`evl-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <span className="evl-tab-box">
              {l.upcomingBox}
            </span>
            <span className="evl-tab-italic">
              {l.upcomingItalic}
            </span>
          </button>

          <button
            className={`evl-tab-btn ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            <span className="evl-tab-box">
              {l.pastBox}
            </span>
            <span className="evl-tab-italic">
              {l.pastItalic}
            </span>
          </button>
        </div>

        <div className={`grid grid-cols-1 ${filteredEvents.length > 0 ? 'lg:grid-cols-10' : ''} gap-8 items-start`}>
          {/* Left Column: full width when no events, 70% otherwise */}
          <div className={`${filteredEvents.length > 0 ? 'lg:col-span-7' : ''} flex flex-col gap-8`}>

            {/* Mobile Countdown (Only for upcoming events and if countdown is not expired) */}
            {activeTab === 'upcoming' && selectedEvent && (
              <div className="block lg:hidden">
                <EventCountdown
                  targetDate={selectedEvent.startDate}
                  startTime={selectedEvent.time}
                  eventTitle={selectedEvent.title}
                  venueCity={selectedEvent.city}
                  organizer={selectedEvent.organizer}
                  locale={locale}
                />
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                {filteredEvents.length === 0 ? (
                  <div className="relative overflow-hidden bg-gradient-to-br from-white to-[#f8fafc] dark:from-[#131b2e] dark:to-[#0f172a] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-8 md:p-12 text-center flex flex-col items-center max-w-3xl mx-auto">
                    {/* Soft background glow circles */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-jibb-indigo/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-jibb-orange/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 w-10 h-10 bg-[#162D6B]/5 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-[#162D6B] dark:text-[#f8fafc] animate-pulse">
                      <span className="material-symbols-outlined text-8xl">campaign</span>
                    </div>

                    <h3 className="relative z-10 text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-4" style={jpFont}>
                      {tabLabels[locale as 'en' | 'ja'].newEventsComing}
                    </h3>
                    <p className="relative z-10 text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto" style={jpFont}>
                      {tabLabels[locale as 'en' | 'ja'].newEventsComingDesc}
                    </p>

                    <div className="relative z-10 flex flex-wrap gap-4 justify-center items-center">
                      <motion.a
                        href="https://linkedin.com/company/japan-india-business-bureau"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 450, damping: 12 }}
                        className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white transition-all duration-200 shadow-md shadow-[#0A66C2]/25 hover:shadow-lg text-sm font-bold"
                        style={jpFont}
                      >
                        <LinkedInIcon className="w-5 h-5 shrink-0 fill-white" />
                        <span>{locale === 'ja' ? 'LinkedIn でフォロー' : 'Follow us on LinkedIn'}</span>
                      </motion.a>

                      <Link
                        href="/contact"
                        className="px-6 py-3.5 bg-white border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-bold rounded-xl transition-all active:scale-95 flex items-center gap-2 text-sm"
                        style={jpFont}
                      >
                        <span className="material-symbols-outlined text-base">mail</span>
                        {locale === 'ja' ? 'お問い合わせ' : 'Contact Us'}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    {/* Prominent Selected Card */}
                    {selectedEvent && (
                      <motion.div
                        key={selectedEvent.id}
                        className="evl-banner-card overflow-hidden flex flex-col"
                        initial="hidden"
                        animate="visible"
                        variants={scaleIn}
                      >
                        <Link
                          href={`/events/${selectedEvent.slug}`}
                          className="evl-banner-link"
                        >
                          <Image
                            src={selectedEvent.image}
                            alt={selectedEvent.title}
                            width={1200}
                            height={630}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                            className="evl-banner-img transition-transform duration-500 hover:scale-[1.02]"
                            priority
                          />
                        </Link>

                        {/* Event Actions Panel */}
                        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
                          <div className="flex flex-col gap-1 text-left w-full sm:w-auto">
                            <h4 className="font-bold text-slate-800 text-sm md:text-base line-clamp-1 leading-snug">
                              {selectedEvent.title}
                            </h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm">location_on</span>
                              {selectedEvent.venue} ({selectedEvent.city})
                            </p>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <Link
                              href={`/events/${selectedEvent.slug}`}
                              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs md:text-sm transition-all hover:bg-slate-50 hover:border-slate-300 text-center w-full sm:w-auto"
                              style={jpFont}
                            >
                              {locale === 'ja' ? '詳細を見る' : 'View more details'}
                            </Link>

                            {selectedEvent.status === 'upcoming' && (
                              <a
                                href={selectedEvent.registrationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2.5 rounded-xl bg-[#F58220] hover:bg-[#e07216] text-white font-bold text-xs md:text-sm shadow-md shadow-[#F58220]/25 transition-all text-center w-full sm:w-auto relative overflow-hidden group btn-pulsate"
                                style={jpFont}
                              >
                                <span className="relative z-10 flex items-center justify-center gap-1.5">
                                  <span className="material-symbols-outlined text-xs md:text-sm">local_activity</span>
                                  {locale === 'ja' ? '今すぐ登録する' : 'Register Now'}
                                </span>
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Smaller Cards List (Other Events in this category) */}
                    {otherEvents.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-slate-800 text-sm font-semibold tracking-wider uppercase mb-4">
                          {tabLabels[locale as 'en' | 'ja'].otherEvents}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {otherEvents.map((ev) => (
                            <div
                              key={ev.id}
                              onClick={() => setSelectedEventId(ev.id)}
                              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
                            >
                              <div className="relative h-40 w-full overflow-hidden bg-slate-50">
                                <Image
                                  src={ev.image}
                                  alt={ev.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, 25vw"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#162D6B] text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-100">
                                  {formatBadgeDate(ev.startDate)}
                                </div>
                              </div>
                              <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                  <h5 className="font-bold text-slate-800 text-sm line-clamp-2 mb-2 group-hover:text-[#162D6B] transition-colors leading-snug">
                                    {ev.title}
                                  </h5>
                                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                                    {ev.description}
                                  </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase">
                                  <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">location_on</span>
                                    {ev.city}
                                  </span>
                                  <span className="text-[#F58220] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                                    {tabLabels[locale as 'en' | 'ja'].detailsButton}
                                    <span className="material-symbols-outlined text-xs font-bold">chevron_right</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: 30% — Only shown when there are events to display */}
          {filteredEvents.length > 0 && (
            <div className="lg:col-span-3 lg:sticky lg:top-[120px] flex flex-col gap-6">

              {/* Desktop Countdown (Only for upcoming events) */}
              {selectedEvent && selectedEvent.status === 'upcoming' && (
                <div className="hidden lg:block">
                  <EventCountdown
                    targetDate={selectedEvent.startDate}
                    startTime={selectedEvent.time}
                    eventTitle={selectedEvent.title}
                    venueCity={selectedEvent.city}
                    organizer={selectedEvent.organizer}
                    locale={locale}
                  />
                </div>
              )}

              {/* Event Calendar Widget */}
              <EventCalendar
                events={allEvents}
                selectedEventId={selectedEventId}
                onSelectEvent={(id) => {
                  setSelectedEventId(id)
                  // Switch tab based on event status
                  const selected = allEvents.find(e => e.id === id)
                  if (selected) {
                    setActiveTab(selected.status)
                  }
                }}
                locale={locale}
              />

              {/* Event Details Summary Widget */}
              {selectedEvent && (
                <EventDetailsSummary
                  event={selectedEvent}
                  locale={locale}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── Past Highlights Collage ─── */}
      <section className="evl-collage-section">
        <motion.div
          className="evl-collage-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <div className="evl-collage-header-left">
            <motion.p className="evl-collage-tag" variants={fadeInUp} style={jpFont}>
              {locale === 'ja' ? '記録' : 'Gallery'}
            </motion.p>
            <motion.h2 className="evl-collage-title" variants={fadeInUp} style={jpFont}>
              {l.collageTitle}
            </motion.h2>
            <motion.p className="evl-collage-subtitle" variants={fadeInUp} style={jpFont}>
              {l.collageSubtitle}
            </motion.p>
          </div>

          <motion.div className="evl-gallery-carousel-selector" variants={fadeInUp}>
            <button onClick={handlePrevGallery} className="evl-gallery-carousel-arrow" aria-label="Previous gallery">
              <span className="material-symbols-outlined">west</span>
            </button>
            <span className="evl-gallery-carousel-name" style={jpFont}>
              {activeGallery.name[locale as 'en' | 'ja']}
            </span>
            <button onClick={handleNextGallery} className="evl-gallery-carousel-arrow" aria-label="Next gallery">
              <span className="material-symbols-outlined">east</span>
            </button>
          </motion.div>
        </motion.div>

        <div className="evl-collage-grid-wrapper">
          {allGalleryImages.length === 0 ? (
            <motion.div
              className="evl-collage-empty-state"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <span className="material-symbols-outlined">photo_library</span>
              <p style={jpFont}>
                {locale === 'ja' ? '画像は近日中に追加されます。' : 'Images will be added soon.'}
              </p>
            </motion.div>
          ) : (
            <div className={`evl-collage-grid-container ${showAllImages ? 'expanded' : ''}`}>
              <AnimatePresence mode="sync">
                <motion.div
                  key={`${activeGalleryId}-${displayedImages.map(img => img.src).join('-')}`}
                  className="evl-collage-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {displayedImages.map((img, i) => (
                    <motion.div
                      key={`${img.src}-${i}`}
                      className="evl-collage-item"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      onClick={() => {
                        const fullIndex = allGalleryImages.findIndex(g => g.src === img.src)
                        if (fullIndex !== -1) {
                          setLightboxIndex(fullIndex)
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="evl-collage-img"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="evl-collage-overlay">
                        <span style={jpFont}>{img.alt}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* View More Button */}
          {allGalleryImages.length > 0 && (showAllImages || allGalleryImages.length > displayedImages.length) && (
            <motion.div
              className="evl-gallery-action"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <button
                className="evl-btn-view-gallery"
                onClick={() => setShowAllImages(!showAllImages)}
                style={jpFont}
              >
                <span className="material-symbols-outlined">
                  {showAllImages ? 'expand_less' : 'photo_library'}
                </span>
                <span>{showAllImages ? l.viewLess : l.viewMore}</span>
                <span className="evl-gallery-count">
                  ({displayedImages.length} / {allGalleryImages.length})
                </span>
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── Lightbox Modal ─── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="evl-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="evl-lightbox-close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close Lightbox"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <button
              className="evl-lightbox-nav-btn left"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex((prev) => (prev !== null ? (prev - 1 + allGalleryImages.length) % allGalleryImages.length : null))
              }}
              aria-label="Previous image"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            <div className="evl-lightbox-content" onClick={(e) => e.stopPropagation()}>
              <div className="evl-lightbox-img-wrapper">
                <Image
                  src={allGalleryImages[lightboxIndex].src}
                  alt={allGalleryImages[lightboxIndex].alt}
                  width={1600}
                  height={1200}
                  className="evl-lightbox-img"
                  priority
                />
              </div>
              <div className="evl-lightbox-caption" style={jpFont}>
                <span className="evl-lightbox-counter">
                  {lightboxIndex + 1} / {allGalleryImages.length}
                </span>
                <p className="evl-lightbox-desc">
                  {allGalleryImages[lightboxIndex].alt}
                </p>
              </div>
            </div>

            <button
              className="evl-lightbox-nav-btn right"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allGalleryImages.length : null))
              }}
              aria-label="Next image"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
