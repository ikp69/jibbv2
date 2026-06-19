'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// We can define the Event interface directly or import it
export interface CalendarEvent {
  id: string
  title: string
  startDate: string // "YYYY-MM-DD"
  status: 'upcoming' | 'past'
}

interface EventCalendarProps {
  events: CalendarEvent[]
  selectedEventId: string
  onSelectEvent: (eventId: string) => void
  locale: string
}

const translations = {
  en: {
    calendarTitle: 'Event Calendar',
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    upcomingDot: 'Upcoming Event',
    pastDot: 'Past Event',
    selectedDot: 'Selected Event'
  },
  ja: {
    calendarTitle: 'イベントカレンダー',
    weekdays: ['月', '火', '水', '木', '金', '土', '日'],
    months: [
      '1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月'
    ],
    upcomingDot: '今後のイベント',
    pastDot: '過去のイベント',
    selectedDot: '選択されたイベント'
  }
}

export default function EventCalendar({
  events,
  selectedEventId,
  onSelectEvent,
  locale
}: EventCalendarProps) {
  const t = translations[locale as 'en' | 'ja'] || translations.en

  // Find the selected event
  const selectedEvent = useMemo(() => {
    return events.find(e => e.id === selectedEventId)
  }, [events, selectedEventId])

  // Calendar view state (year and month)
  const [currentYear, setCurrentYear] = useState(2026)
  const [currentMonth, setCurrentMonth] = useState(6) // 0-indexed, so 6 = July

  // Auto-sync calendar view to the selected event's date
  useEffect(() => {
    if (selectedEvent) {
      const [year, month] = selectedEvent.startDate.split('-').map(Number)
      if (!isNaN(year) && !isNaN(month)) {
        setCurrentYear(year)
        setCurrentMonth(month - 1) // 1-indexed to 0-indexed
      }
    }
  }, [selectedEvent])

  // Get calendar details
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate()
  }, [currentYear, currentMonth])

  const firstDayIndex = useMemo(() => {
    // getDay() gives Sunday=0, Monday=1, etc.
    // Shift so Monday is 0, Sunday is 6
    const day = new Date(currentYear, currentMonth, 1).getDay()
    return day === 0 ? 6 : day - 1
  }, [currentYear, currentMonth])

  // Group events by date string "YYYY-MM-DD" for quick lookup
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    events.forEach(e => {
      if (!map[e.startDate]) {
        map[e.startDate] = []
      }
      map[e.startDate].push(e)
    })
    return map
  }, [events])

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(prev => prev - 1)
    } else {
      setCurrentMonth(prev => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(prev => prev + 1)
    } else {
      setCurrentMonth(prev => prev + 1)
    }
  }

  // Generate calendar days grid
  const calendarCells = useMemo(() => {
    const cells = []
    
    // Fill leading empty cells for starting weekday alignment
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ day: null, dateStr: '' })
    }

    // Fill days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0')
      const dayStr = String(day).padStart(2, '0')
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`
      cells.push({ day, dateStr })
    }

    return cells
  }, [currentYear, currentMonth, daysInMonth, firstDayIndex])

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-md border border-slate-100">
      {/* Title */}
      <h3 className="text-slate-800 text-sm font-semibold tracking-wider uppercase mb-5">
        {t.calendarTitle}
      </h3>

      {/* Header Month Pagination */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-base font-bold text-slate-900">
          {locale === 'ja'
            ? `${currentYear}年 ${t.months[currentMonth]}`
            : `${t.months[currentMonth]} ${currentYear}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Previous month"
          >
            <span className="material-symbols-outlined text-sm font-semibold">chevron_left</span>
          </button>
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-lg bg-[#162D6B] flex items-center justify-center text-white hover:bg-[#112252] transition-colors cursor-pointer"
            aria-label="Next month"
          >
            <span className="material-symbols-outlined text-sm font-semibold">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 gap-y-2 mb-2 text-center">
        {t.weekdays.map((day, i) => (
          <span key={i} className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide">
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-3 text-center">
        {calendarCells.map((cell, idx) => {
          if (!cell.day) {
            return <div key={`empty-${idx}`} className="aspect-square" />
          }

          const dayEvents = eventsByDate[cell.dateStr] || []
          const hasEvents = dayEvents.length > 0
          const hasSelected = dayEvents.some(e => e.id === selectedEventId)
          const hasUpcoming = dayEvents.some(e => e.status === 'upcoming')

          return (
            <div
              key={`day-${cell.day}`}
              className="relative flex flex-col items-center justify-center aspect-square group"
            >
              {/* Tooltip on Hover */}
              {hasEvents && (
                <div className="absolute z-20 bottom-full mb-2 hidden group-hover:flex flex-col items-start bg-[#162D6B] text-white text-[11px] p-2.5 rounded-xl shadow-xl w-48 border border-white/10 left-1/2 -translate-x-1/2">
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#162D6B] rotate-45 border-r border-b border-white/10" />
                  <p className="font-semibold text-[10px] text-orange-400 uppercase mb-1 tracking-wider">
                    {hasUpcoming ? t.upcomingDot : t.pastDot}
                  </p>
                  {dayEvents.map(e => (
                    <p key={e.id} className="text-white font-medium line-clamp-2 leading-snug">
                      {e.title}
                    </p>
                  ))}
                </div>
              )}

              {/* Day Circle Container */}
              <button
                onClick={() => {
                  if (hasEvents) {
                    onSelectEvent(dayEvents[0].id)
                  }
                }}
                disabled={!hasEvents}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-all relative ${
                  hasSelected
                    ? 'bg-[#162D6B] text-white shadow-md shadow-[#162D6B]/15 scale-105'
                    : hasEvents
                    ? 'bg-slate-50 border border-slate-200 text-slate-900 hover:border-[#162D6B] hover:bg-slate-100 cursor-pointer'
                    : 'text-slate-600 cursor-default'
                }`}
              >
                {cell.day}
              </button>

              {/* Dots under the day number */}
              <div className="flex gap-1 items-center justify-center h-1.5 mt-0.5">
                {hasEvents && (
                  <span
                    className={`w-1 h-1 rounded-full ${
                      hasSelected
                        ? 'bg-[#F58220]'
                        : hasUpcoming
                        ? 'bg-[#162D6B]'
                        : 'bg-slate-400'
                    }`}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-start gap-4 text-[10px] md:text-xs text-slate-500 font-medium flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#162D6B]" />
          <span>{t.upcomingDot}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>{t.pastDot}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F58220]" />
          <span>{t.selectedDot}</span>
        </div>
      </div>


    </div>
  )
}
