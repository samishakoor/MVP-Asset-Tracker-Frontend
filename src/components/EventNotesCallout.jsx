import { MessageSquareQuote } from 'lucide-react'
import { getEventNoteLabel, getEventNoteVariant, hasEventNotes } from '../utils/eventNotes.js'

const VARIANT_STYLES = {
  ticket: {
    ring: 'ring-amber-200',
    surface: 'bg-amber-50',
    headerBg: 'bg-amber-100',
    headerBorder: 'border-amber-200',
    icon: 'text-amber-700',
    label: 'text-amber-950',
    text: 'text-amber-950',
  },
  repair: {
    ring: 'ring-emerald-200',
    surface: 'bg-emerald-50',
    headerBg: 'bg-emerald-100',
    headerBorder: 'border-emerald-200',
    icon: 'text-emerald-700',
    label: 'text-emerald-950',
    text: 'text-emerald-950',
  },
  admin: {
    ring: 'ring-violet-200',
    surface: 'bg-violet-50',
    headerBg: 'bg-violet-100',
    headerBorder: 'border-violet-200',
    icon: 'text-violet-700',
    label: 'text-violet-950',
    text: 'text-violet-950',
  },
  default: {
    ring: 'ring-slate-200',
    surface: 'bg-slate-50',
    headerBg: 'bg-slate-100',
    headerBorder: 'border-slate-200',
    icon: 'text-slate-600',
    label: 'text-slate-900',
    text: 'text-slate-900',
  },
}

/**
 * Card-style callout for asset event notes (issue reported, repair notes, etc.).
 * Used in audit log lists and asset detail timelines.
 */
function EventNotesCallout({ notes, eventType }) {
  if (!hasEventNotes(notes)) {
    return null
  }

  const variant = getEventNoteVariant(eventType)
  const styles = VARIANT_STYLES[variant]
  const label = getEventNoteLabel(eventType)
  const displayNotes = notes.trim()

  return (
    <figure
      className={`isolate mt-3 w-full min-w-0 overflow-hidden rounded-lg ring-1 ring-inset sm:mt-4 ${styles.ring}`}
      role="note"
      aria-label={label}
    >
      <figcaption
        className={`flex items-center gap-2 border-b px-3 py-2 sm:px-3.5 ${styles.headerBorder} ${styles.headerBg}`}
      >
        <MessageSquareQuote
          className={`size-3.5 shrink-0 ${styles.icon}`}
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className={`text-xs font-semibold uppercase tracking-wide ${styles.label}`}>
          {label}
        </span>
      </figcaption>
      <blockquote
        className={`m-0 max-h-48 overflow-y-auto border-0 px-3 py-2.5 sm:px-3.5 sm:py-3 ${styles.surface}`}
      >
        <p
          className={`whitespace-pre-wrap text-sm leading-relaxed wrap-anywhere sm:text-[0.9375rem] ${styles.text}`}
        >
          {displayNotes}
        </p>
      </blockquote>
    </figure>
  )
}

export default EventNotesCallout
