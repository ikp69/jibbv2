'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import EventsTableRow from './EventsTableRow'

interface ProgramItem {
  time: string
  speaker: string
  org: string
  topic: string
  isBreak: boolean
  isHighlight?: boolean
  detailsTitle?: string
  details?: string[]
}

interface EventsProgramTableProps {
  program: ProgramItem[]
  locale: string
  eventId: string
  jpFont: React.CSSProperties
}

const programRowVariant = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.33, 1, 0.68, 1] as const }
  })
}

export default function EventsProgramTable({ program, locale, eventId, jpFont }: EventsProgramTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (index: number) => {
    const key = `${eventId}-${index}`
    setExpandedRows(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="events-program-table">
      {program.map((item, index) => {
        const hasDetails = !!item.details && item.details.length > 0
        const isExpanded = !!expandedRows[`${eventId}-${index}`]

        return (
          <EventsTableRow
            key={index}
            item={item}
            index={index}
            hasDetails={hasDetails}
            isExpanded={isExpanded}
            onToggle={() => toggleRow(index)}
            jpFont={jpFont}
            variants={programRowVariant}
          />
        )
      })}
    </div>
  )
}