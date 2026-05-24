import { Clock } from 'lucide-react'
import Badge from './Badge.jsx'
import EventNotesCallout from './EventNotesCallout.jsx'
import { formatRelativeTime } from '../utils/datetime.js'
import { getEventAttribution } from '../utils/eventAttribution.js'

/**
 * Single row in an asset audit or recent-events timeline.
 * Shows event badge, optional asset name, attribution, and a prominent notes callout when present.
 */
function AuditEventRow({
  eventType,
  createdAt,
  triggeredByName,
  targetEmployeeName,
  notes,
  assetName,
  showAssetName,
}) {
  const shouldShowAssetName = showAssetName === true && assetName !== undefined && assetName !== ''
  const attribution = getEventAttribution(eventType, triggeredByName, targetEmployeeName)

  return (
    <div className="flex gap-4 p-3 sm:p-5">
      <div className="flex flex-col items-center">
        <div className="h-3 w-3 shrink-0 rounded-full bg-emerald-500" />
        <div className="w-px flex-1 bg-slate-200" />
      </div>

      <div className="min-w-0 flex-1 pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Badge status={eventType} />
            {shouldShowAssetName && (
              <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 ring-1 ring-slate-200">
                <span className="truncate text-sm font-semibold text-slate-700">{assetName}</span>
              </div>
            )}
          </div>
          
          {/* Timestamp - Desktop only (top right) */}
          <div className="hidden shrink-0 items-center gap-1.5 text-xs text-slate-500 sm:flex">
            <Clock className="h-3.5 w-3.5" />
            <time className="font-medium">{formatRelativeTime(createdAt)}</time>
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          {attribution.segments.map((segment, index) => (
            <span key={index}>
              {segment.preposition}{' '}
              <span className={segment.isBold ? 'font-bold text-slate-700' : ''}>
                {segment.name}
              </span>
              {index < attribution.segments.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>

        <EventNotesCallout notes={notes} eventType={eventType} />

        {/* Timestamp - Mobile only (bottom) */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 sm:hidden">
          <Clock className="h-3.5 w-3.5" />
          <time className="font-medium">{formatRelativeTime(createdAt)}</time>
        </div>
      </div>
    </div>
  )
}

export default AuditEventRow
