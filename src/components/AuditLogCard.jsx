import {
  Bell,
  CheckCircle,
  CheckCircle2,
  Clock,
  Package,
  PlusCircle,
  Trash2,
  UserPlus,
  Wrench,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import EventNotesCallout from './EventNotesCallout.jsx'
import { formatDate, formatRelativeTime } from '../utils/datetime.js'
import {
  AUDIT_EVENT_STYLES,
  AUDIT_EVENT_TYPE_LABELS,
  DEFAULT_AUDIT_EVENT_STYLES,
  getAuditLogDescriptionParts,
  getAuditLogTitleParts,
} from '../utils/auditLogDisplay.js'

const AUDIT_EVENT_ICONS = {
  registered: PlusCircle,
  deleted: Trash2,
  assigned: UserPlus,
  assignment_cancelled: XCircle,
  acknowledged: CheckCircle,
  ticket_opened: AlertCircle,
  repair_started: Wrench,
  repair_completed: CheckCircle2,
  returned: Package,
}

/**
 * List row for a single audit log entry with icon, type label, readable title, and timestamp.
 * Mimics NotificationCard layout for consistent admin activity feeds.
 * Used on AuditLogsPage inside a divided list container.
 */
function AuditLogCard({
  eventType,
  createdAt,
  triggeredByName,
  targetEmployeeName,
  notes,
  assetName,
}) {
  const Icon = AUDIT_EVENT_ICONS[eventType] ?? Bell
  const styles = AUDIT_EVENT_STYLES[eventType] ?? DEFAULT_AUDIT_EVENT_STYLES
  const typeLabel = AUDIT_EVENT_TYPE_LABELS[eventType] ?? 'Event'
  const titleParts = getAuditLogTitleParts(
    eventType,
    assetName,
    triggeredByName,
    targetEmployeeName,
  )
  const descriptionParts = getAuditLogDescriptionParts(
    eventType,
    triggeredByName,
    targetEmployeeName,
  )
  const hasDescription = descriptionParts.some((part) => part.text !== '')
  const relativeTime = formatRelativeTime(createdAt)
  const fullDate = formatDate(createdAt)

  const timeLabel = (
    <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs text-slate-400">
      <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
      <time dateTime={createdAt} title={fullDate}>
        {relativeTime}
      </time>
    </span>
  )

  return (
    <article className="w-full bg-white p-4 transition-colors hover:bg-slate-50 sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${styles.badge}`}
            >
              {typeLabel}
            </span>
          </div>

          <h3 className="mt-2 text-sm font-normal leading-snug text-slate-600 sm:text-base">
            {titleParts.map((part, index) => (
              <span
                key={index}
                className={part.bold ? 'font-semibold text-slate-900' : undefined}
              >
                {part.text}
              </span>
            ))}
          </h3>

          {hasDescription && (
            <p className="m-0 mt-1.5 w-full text-sm font-normal text-slate-600">
              {descriptionParts.map((part, index) => (
                <span
                  key={index}
                  className={part.bold ? 'font-medium text-slate-900' : undefined}
                >
                  {part.text}
                </span>
              ))}
            </p>
          )}
          <EventNotesCallout notes={notes} eventType={eventType} />
          <div className="mt-1 sm:hidden">{timeLabel}</div>
        </div>

        <div className="hidden shrink-0 self-start pt-0.5 sm:block">{timeLabel}</div>
      </div>
    </article>
  )
}

export default AuditLogCard
