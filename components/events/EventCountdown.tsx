'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EventCountdownProps {
  targetDate: string; // "YYYY-MM-DD"
  startTime?: string; // e.g. "13:30 - 17:00"
  eventTitle: string;
  venueCity: string;
  organizer: string;
  locale: string;
}

interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  expired: boolean;
}

const translations = {
  en: {
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    countdown: 'Event Countdown',
    completed: 'Event Completed',
    upcoming: 'Upcoming Event'
  },
  ja: {
    days: '日',
    hours: '時間',
    minutes: '分',
    seconds: '秒',
    countdown: 'イベント カウントダウン',
    completed: 'イベント終了',
    upcoming: '開催予定イベント'
  }
}

export default function EventCountdown({
  targetDate,
  startTime,
  eventTitle,
  venueCity,
  organizer,
  locale
}: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    expired: false
  })
  const [isMounted, setIsMounted] = useState(false)

  const t = translations[locale as 'en' | 'ja'] || translations.en

  // Helper to format date beautifully for the header
  const getFormattedDate = () => {
    try {
      const date = new Date(targetDate)
      if (isNaN(date.getTime())) return targetDate
      
      if (locale === 'ja') {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${year}年${month}月${day}日`
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }).toUpperCase()
      }
    } catch {
      return targetDate
    }
  }

  useEffect(() => {
    setIsMounted(true)

    // Calculate target timestamp
    let targetTime = 0
    try {
      let hour = 14
      let minute = 0
      if (startTime) {
        const timeMatch = startTime.match(/(\d{1,2}):(\d{2})/)
        if (timeMatch) {
          hour = parseInt(timeMatch[1], 10)
          minute = parseInt(timeMatch[2], 10)
        }
      }
      
      const [year, month, day] = targetDate.split('-').map(Number)
      // Assume event is in Japan Standard Time (UTC+9)
      const targetUtc = Date.UTC(year, month - 1, day, hour - 9, minute, 0)
      targetTime = new Date(targetUtc).getTime()
    } catch (e) {
      targetTime = new Date(targetDate).getTime()
    }

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetTime - now

      if (difference <= 0) {
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          expired: true
        })
        return
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24))
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
        expired: false
      })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [targetDate, startTime])

  if (!isMounted) {
    // Return skeleton shell during SSR hydration to prevent layout shift
    return (
      <div className="w-full bg-gradient-to-br from-[#162D6B] to-[#0c183a] rounded-3xl p-6 shadow-lg border border-white/10 text-white min-h-[110px] animate-pulse">
        <div className="grid grid-cols-4 gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-white/20 rounded-2xl"></div>
          ))}
        </div>
      </div>
    )
  }

  // Auto-hide when event expires
  if (timeLeft.expired) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full relative overflow-hidden bg-gradient-to-br from-[#162D6B] via-[#112252] to-[#0c183a] rounded-3xl p-6 shadow-xl border border-white/10 text-white"
    >
      {/* Decorative JIBB Accent Lines */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F58220]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#162D6B] rounded-full blur-xl pointer-events-none opacity-50" />

      {/* Countdown Grid */}
      <div className="relative z-10 grid grid-cols-4 gap-2 md:gap-3">
        <CountdownUnit value={timeLeft.days} label={t.days} />
        <CountdownUnit value={timeLeft.hours} label={t.hours} />
        <CountdownUnit value={timeLeft.minutes} label={t.minutes} />
        <CountdownUnit value={timeLeft.seconds} label={t.seconds} />
      </div>
    </motion.div>
  )
}

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-3 px-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
      <div className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight flex overflow-hidden h-[32px] md:h-[40px] items-center text-white">
        {value.split('').map((char, index) => (
          <div
            key={index}
            className="relative w-[14px] md:w-[18px] h-full overflow-hidden flex items-center justify-center"
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={char}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -24, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                className="absolute font-semibold"
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>
      <span className="text-[9px] md:text-[10px] font-bold uppercase text-orange-400/90 mt-1 tracking-wider">
        {label}
      </span>
    </div>
  )
}
