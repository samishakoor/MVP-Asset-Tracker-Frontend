import { MessageSquareQuote } from 'lucide-react'
import { getEventNoteLabel, getEventNoteVariant, hasEventNotes } from '../utils/eventNotes.js'

const VARIANT_STYLES = {
  ticket: {
    container: 'border-amber-300 bg-amber-50/80',
    icon: 'text-amber-600',
    label: 'text-amber-800',
    text: 'text-amber-950',
  },
  repair: {
    container: 'border-emerald-300 bg-emerald-50/80',
    icon: 'text-emerald-600',
    label: 'text-emerald-800',
    text: 'text-emerald-950',
  },
  admin: {
    container: 'border-violet-300 bg-violet-50/80',
    icon: 'text-violet-600',
    label: 'text-violet-800',
    text: 'text-violet-950',
  },
  default: {
    container: 'border-slate-300 bg-slate-50',
    icon: 'text-slate-500',
    label: 'text-slate-700',
    text: 'text-slate-900',
  },
}

/**
 * Prominent callout for asset event notes (ticket descriptions, repair notes, etc.).
 * Used in admin dashboard recent events and asset audit log timelines.
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
    <div
      className={`mt-3 rounded-lg border border-l-4 p-3 sm:mt-4 sm:p-4 ${styles.container}`}
      role="note"
      aria-label={label}
    >
      <div className="flex items-start gap-2.5 sm:gap-3">
        <span
          className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center sm:size-7"
          aria-hidden="true"
        >
          <MessageSquareQuote
            className={`size-4 overflow-visible ${styles.icon}`}
            strokeWidth={1.5}
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-semibold uppercase tracking-wide ${styles.label}`}>
            {label}
          </p>
          <p className={`mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed sm:text-[0.9375rem] ${styles.text}`}>
            {displayNotes}
          </p>
        </div>
      </div>
    </div>
  )
}

export default EventNotesCallout
