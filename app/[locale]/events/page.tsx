'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { useLocale } from 'next-intl'
import { upcomingEvents, pastEvents } from '@/lib/eventsData'

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

  // State for toggling between Upcoming and Past events (showing banners only)
  const [showPast, setShowPast] = useState(false)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)

  const activeEvents = showPast ? pastEvents : upcomingEvents
  const activeBannerIndex = activeEvents.length > 0 && Number.isInteger(currentBannerIndex) && currentBannerIndex >= 0 && currentBannerIndex < activeEvents.length
    ? currentBannerIndex
    : 0
  const activeEvent = activeEvents[activeBannerIndex]

  // State for gallery lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // State for active gallery selection
  const galleryKeys = ['semicon-2025', 'semicon-2026', 'acma', 'electronica'] as const
  const [activeGalleryId, setActiveGalleryId] = useState<typeof galleryKeys[number]>('semicon-2025')

  const galleries = useMemo(() => ({
    'semicon-2025': {
      name: { en: 'SEMICON 2025', ja: 'SEMICON 2025' },
      images: [
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 5.51.35 PM.jpeg', alt: locale === 'ja' ? 'イベント会場 of 2025' : 'Event venue of 2025 atmosphere' },
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 5.51.35 PM (1).jpeg', alt: locale === 'ja' ? 'セミナー会場' : 'Seminar hall' },
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 5.51.35 PM (2).jpeg', alt: locale === 'ja' ? '参加者の様子' : 'Event participants' },
        { src: '/events/event-gallery/SEMICON 2025/WhatsApp Image 2026-03-20 at 5.51.35 PM (3).jpeg', alt: locale === 'ja' ? 'プレゼンテーション' : 'Presentation' },
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
        { src: '/events/event-gallery/ELECTRONICA 2026/DSC_8760.JPG', alt: locale === 'ja' ? 'ELECTRONICA 2026 展示会' : 'ELECTRONICA 2026 Exhibition' },
        { src: '/events/event-gallery/ELECTRONICA 2026/DSC_8770.JPG', alt: locale === 'ja' ? 'ブース交流' : 'Booth interaction' },
        { src: '/events/event-gallery/ELECTRONICA 2026/DSC_8961.JPG', alt: locale === 'ja' ? '出展社ブース' : 'Exhibitor booth' },
        { src: '/events/event-gallery/ELECTRONICA 2026/DSC_8974.JPG', alt: locale === 'ja' ? '商談の様子' : 'Business meeting' },
        { src: '/events/event-gallery/ELECTRONICA 2026/DSC_9032.jpg', alt: locale === 'ja' ? 'イベント来場者' : 'Event attendees' },
        { src: '/events/event-gallery/ELECTRONICA 2026/DSC_9033.JPG', alt: locale === 'ja' ? '対話セッション' : 'Dialogue session' },
        { src: '/events/event-gallery/ELECTRONICA 2026/DSC_9044.JPG', alt: locale === 'ja' ? 'ネットワーキング' : 'Networking' }
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

  // Reset banner index when switching tabs
  useEffect(() => {
    setCurrentBannerIndex(0)
  }, [showPast])

  // Re-clamp the current banner index if the active event list shrinks or changes
  useEffect(() => {
    if (activeEvents.length > 0 && (currentBannerIndex < 0 || currentBannerIndex >= activeEvents.length || !Number.isInteger(currentBannerIndex))) {
      setCurrentBannerIndex(0)
    }
  }, [activeEvents.length, currentBannerIndex])

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

        {/* ─── Events Banners Section ─── */}
        <section className="evl-banners-section">
          <div className="evl-tabs-container" style={jpFont}>
            <button 
              className={`evl-tab-btn ${!showPast ? 'active' : ''}`}
              onClick={() => setShowPast(false)}
            >
              <span className="evl-tab-box">
                {l.upcomingBox}
              </span>
              <span className="evl-tab-italic">
                {l.upcomingItalic}
              </span>
            </button>

            <button 
              className={`evl-tab-btn ${showPast ? 'active' : ''}`}
              onClick={() => setShowPast(true)}
            >
              <span className="evl-tab-box">
                {l.pastBox}
              </span>
              <span className="evl-tab-italic">
                {l.pastItalic}
              </span>
            </button>
          </div>

          <div className="evl-banners-container">
            {(activeEvents.length > 0 && activeEvent) && (
              <div className="evl-banner-carousel-wrapper">
                {/* Banner Card */}
                <motion.div
                  key={`${showPast ? 'past' : 'upcoming'}-${activeBannerIndex}`}
                  className="evl-banner-card"
                  initial="hidden"
                  animate="visible"
                  variants={scaleIn}
                >
                  <Link 
                    href={`/events/${activeEvent.slug}`} 
                    className="evl-banner-link"
                  >
                    <Image
                      src={locale === 'ja' 
                        ? activeEvent.posterJa 
                        : activeEvent.posterEn
                      }
                      alt={activeEvent[locale as 'en' | 'ja'].title}
                      width={1200}
                      height={630}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                      className="evl-banner-img"
                      priority
                    />
                  </Link>
                </motion.div>

                {/* Carousel Navigation Arrows */}
                {(showPast ? pastEvents : upcomingEvents).length > 1 && (
                  <>
                    <button 
                      className="evl-carousel-arrow left" 
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const len = (showPast ? pastEvents : upcomingEvents).length
                        setCurrentBannerIndex((prev) => (prev - 1 + len) % len)
                      }}
                      aria-label="Previous event"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button 
                      className="evl-carousel-arrow right" 
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const len = (showPast ? pastEvents : upcomingEvents).length
                        setCurrentBannerIndex((prev) => (prev + 1) % len)
                      }}
                      aria-label="Next event"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </>
                )}

                {/* Carousel Indicators (Dots) */}
                {(showPast ? pastEvents : upcomingEvents).length > 1 && (
                  <div className="evl-carousel-dots">
                    {(showPast ? pastEvents : upcomingEvents).map((_, index) => (
                      <button
                        key={index}
                        className={`evl-carousel-dot ${index === currentBannerIndex ? 'active' : ''}`}
                        onClick={() => setCurrentBannerIndex(index)}
                        aria-label={`Go to event slide ${index + 1}`}
                      />
                    ))}
                  </div>
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
