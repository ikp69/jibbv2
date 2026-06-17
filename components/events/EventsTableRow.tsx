'use client'

import { motion } from 'framer-motion'

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

interface EventsTableRowProps {
  item: ProgramItem
  index: number
  hasDetails: boolean
  isExpanded: boolean
  onToggle: () => void
  jpFont: React.CSSProperties
  variants: any
}

export default function EventsTableRow({
  item,
  index,
  hasDetails,
  isExpanded,
  onToggle,
  jpFont,
  variants
}: EventsTableRowProps) {
  return (
    <motion.div
      className={`events-table-row ${item.isBreak ? 'minimal' : ''} ${item.isHighlight ? 'highlight' : ''} ${hasDetails ? 'collapsible' : ''} ${isExpanded ? 'expanded' : ''}`}
      onClick={() => hasDetails && onToggle()}
      style={{ '--card-index': index, ...(hasDetails ? { cursor: 'pointer' } : {}) } as React.CSSProperties}
      custom={index}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="events-table-time">{item.time}</div>
      <div className="events-table-content">
        <div className="events-table-topic-wrapper">
          <h4 className="events-table-topic" style={jpFont}>{item.topic}</h4>
          {hasDetails && (
            <span className={`material-symbols-outlined dropdown-indicator ${isExpanded ? 'rotated' : ''}`}>
              expand_more
            </span>
          )}
        </div>
        {item.speaker && <p className="events-table-speaker"><strong>{item.speaker}</strong></p>}

        {hasDetails && (
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
            className="events-table-details-wrapper"
          >
            <div className="events-table-details" onClick={(e) => e.stopPropagation()}>
              <p className="events-details-title" style={jpFont}><strong>{item.detailsTitle}:</strong></p>
              <ul className="events-details-list">
                {item.details?.map((detail, dIdx) => (
                  <li key={dIdx} style={jpFont}>{detail}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
      <div className="events-table-org">
        {item.org && <span className="events-org-badge">{item.org}</span>}
      </div>
    </motion.div>
  )
}