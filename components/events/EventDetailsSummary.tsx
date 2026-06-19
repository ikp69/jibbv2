'use client'

import { motion } from 'framer-motion'

export interface Event {
  id: string
  title: string
  description: string
  image: string
  startDate: string
  endDate?: string
  venue: string
  city: string
  country: string
  capacity: number
  registeredCount: number
  language: string[]
  status: 'upcoming' | 'past'
  organizer: string
  fee?: string
  time: string
  slug: string
  registrationUrl: string
  eventType?: string // e.g. Seminar, Briefing, Exhibition
}

interface EventDetailsSummaryProps {
  event: Event
  locale: string
}

const translations = {
  en: {
    title: 'Quick Event Info',
    eventType: 'Event Type',
    status: 'Registration',
    seatsLeft: 'Seats Left',
    location: 'Location',
    language: 'Language',
    statusOpen: 'Open',
    statusClosed: 'Closed',
    statusCompleted: 'Concluded',
    seatsUnlimited: 'Unlimited',
    seatsNone: 'No Seats Left',
    seatsCompleted: 'Event Concluded',
    seatsFillingFast: 'Seats filling fast',
    defaultType: 'Seminar'
  },
  ja: {
    title: 'クイック情報',
    eventType: 'イベント形式',
    status: '登録ステータス',
    seatsLeft: '残席数',
    location: '開催場所',
    language: '対応言語',
    statusOpen: '受付中',
    statusClosed: '受付終了',
    statusCompleted: '終了',
    seatsUnlimited: '制限なし',
    seatsNone: '満席',
    seatsCompleted: 'イベント終了',
    seatsFillingFast: '残席わずか',
    defaultType: 'セミナー'
  }
}

export default function EventDetailsSummary({ event, locale }: EventDetailsSummaryProps) {
  const t = translations[locale as 'en' | 'ja'] || translations.en

  // Calculate status and seats
  const isPast = event.status === 'past'
  
  const getStatusBadge = () => {
    if (isPast) {
      return (
        <span className="px-2.5 py-1 text-[10px] md:text-xs font-bold rounded-lg bg-slate-100 text-slate-500 border border-slate-200">
          {t.statusCompleted}
        </span>
      )
    }
    const remaining = event.capacity - event.registeredCount
    if (remaining <= 0) {
      return (
        <span className="px-2.5 py-1 text-[10px] md:text-xs font-bold rounded-lg bg-red-50 text-red-600 border border-red-100">
          {t.statusClosed}
        </span>
      )
    }
    return (
      <span className="px-2.5 py-1 text-[10px] md:text-xs font-bold rounded-lg bg-green-50 text-green-700 border border-green-150">
        {t.statusOpen}
      </span>
    )
  }

  const getRemainingSeats = () => {
    if (isPast) {
      return t.seatsCompleted
    }
    const remaining = event.capacity - event.registeredCount
    if (event.capacity === 0) {
      return t.seatsUnlimited
    }
    if (remaining <= 0) {
      return t.seatsNone
    }
    return t.seatsFillingFast
  }

  // Determine event type based on title/slug metadata
  const getEventType = () => {
    if (event.eventType) return event.eventType
    
    const lowerTitle = event.title.toLowerCase()
    if (lowerTitle.includes('briefing') || lowerTitle.includes('説明会')) {
      return locale === 'ja' ? '説明会' : 'Briefing'
    }
    if (lowerTitle.includes('summit') || lowerTitle.includes('サミット')) {
      return locale === 'ja' ? 'サミット' : 'Summit'
    }
    if (lowerTitle.includes('exhibition') || lowerTitle.includes('展示会')) {
      return locale === 'ja' ? '展示会' : 'Exhibition'
    }
    return t.defaultType
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-white rounded-3xl p-6 shadow-md border border-slate-100"
    >
      <h3 className="text-slate-800 text-sm font-semibold tracking-wider uppercase mb-5">
        {t.title}
      </h3>

      <div className="flex flex-col gap-4">
        {/* Row 1: Event Type */}
        <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
          <div className="flex items-center gap-2.5 text-slate-500 text-xs md:text-sm">
            <span className="material-symbols-outlined text-slate-400 text-lg">layers</span>
            <span>{t.eventType}</span>
          </div>
          <span className="text-slate-800 text-xs md:text-sm font-semibold">
            {getEventType()}
          </span>
        </div>

        {/* Row 2: Status */}
        <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
          <div className="flex items-center gap-2.5 text-slate-500 text-xs md:text-sm">
            <span className="material-symbols-outlined text-slate-400 text-lg">verified</span>
            <span>{t.status}</span>
          </div>
          {getStatusBadge()}
        </div>

        {/* Row 3: Remaining Seats */}
        <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
          <div className="flex items-center gap-2.5 text-slate-500 text-xs md:text-sm">
            <span className="material-symbols-outlined text-slate-400 text-lg">group</span>
            <span>{t.seatsLeft}</span>
          </div>
          <span className={`text-xs md:text-sm font-semibold ${
            isPast ? 'text-slate-400' : 'text-orange-500'
          }`}>
            {getRemainingSeats()}
          </span>
        </div>

        {/* Row 4: Location */}
        <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
          <div className="flex items-center gap-2.5 text-slate-500 text-xs md:text-sm">
            <span className="material-symbols-outlined text-slate-400 text-lg">map</span>
            <span>{t.location}</span>
          </div>
          <span className="text-slate-800 text-xs md:text-sm font-semibold truncate max-w-[150px]" title={event.city}>
            {event.city}
          </span>
        </div>

        {/* Row 5: Language */}
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2.5 text-slate-500 text-xs md:text-sm">
            <span className="material-symbols-outlined text-slate-400 text-lg">translate</span>
            <span>{t.language}</span>
          </div>
          <span className="text-slate-800 text-xs md:text-sm font-semibold">
            {event.language.join(locale === 'ja' ? ' & ' : ' & ')}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
