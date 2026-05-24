import {
  Bell,
  Check,
  CheckCircle,
  Package,
  AlertCircle,
  Wrench,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { useMarkNotificationRead } from '../hooks/useMarkNotificationRead.js'
import { formatDate, formatRelativeTime } from '../utils/datetime.js'

const NOTIFICATION_ICONS = {
  asset_assigned: Package,
  asset_acknowledged: CheckCircle,
  ticket_created: AlertCircle,
  asset_under_repair: Wrench,
  ticket_resolved: CheckCircle2,
  asset_returned: Package,
}

const NOTIFICATION_TYPE_LABELS = {
  asset_assigned: 'Assignment',
  asset_acknowledged: 'Acknowledgment',
  ticket_created: 'Support',
  asset_under_repair: 'Repair',
  ticket_resolved: 'Resolved',
  asset_returned: 'Return',
}

const NOTIFICATION_STYLES = {
  asset_assigned: {
    icon: 'text-emerald-600 bg-emerald-100',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    accent: 'border-l-emerald-500',
  },
  asset_acknowledged: {
    icon: 'text-blue-600 bg-blue-100',
    badge: 'bg-blue-50 text-blue-700 ring-blue-600/10',
    accent: 'border-l-blue-500',
  },
  ticket_created: {
    icon: 'text-amber-600 bg-amber-100',
    badge: 'bg-amber-50 text-amber-700 ring-amber-600/10',
    accent: 'border-l-amber-500',
  },
  asset_under_repair: {
    icon: 'text-purple-600 bg-purple-100',
    badge: 'bg-purple-50 text-purple-700 ring-purple-600/10',
    accent: 'border-l-purple-500',
  },
  ticket_resolved: {
    icon: 'text-emerald-600 bg-emerald-100',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    accent: 'border-l-emerald-500',
  },
  asset_returned: {
    icon: 'text-slate-600 bg-slate-100',
    badge: 'bg-slate-50 text-slate-700 ring-slate-600/10',
    accent: 'border-l-slate-400',
  },
}

const DEFAULT_STYLES = {
  icon: 'text-slate-600 bg-slate-100',
  badge: 'bg-slate-50 text-slate-700 ring-slate-600/10',
  accent: 'border-l-slate-400',
}

/**
 * List row displaying a single notification with type badge, relative time, and read indicator.
 * Unread rows use a subtle background and a "New" badge on the right; read rows show a check.
 * Clicking an unread notification marks it as read.
 * Used on NotificationsPage inside a divided list container.
 */
function NotificationCard({ notification }) {
  const { markAsRead, isMarking } = useMarkNotificationRead()

  const Icon = NOTIFICATION_ICONS[notification.type] ?? Bell
  const styles = NOTIFICATION_STYLES[notification.type] ?? DEFAULT_STYLES
  const typeLabel = NOTIFICATION_TYPE_LABELS[notification.type] ?? 'Update'
  const relativeTime = formatRelativeTime(notification.createdAt)
  const fullDate = formatDate(notification.createdAt)
  const isUnread = !notification.isRead

  async function handleClick() {
    if (isUnread && !isMarking) {
      try {
        await markAsRead(notification.id)
      } catch (err) {
        console.error('Failed to mark notification as read:', err)
      }
    }
  }

  const rowClassName = isUnread
    ? 'bg-emerald-50/40 hover:bg-emerald-50/60'
    : 'bg-white hover:bg-slate-50'

  const timeLabel = (
    <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs text-slate-400">
      <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
      <time dateTime={notification.createdAt} title={fullDate}>
        {relativeTime}
      </time>
    </span>
  )

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isMarking}
      aria-label={
        isUnread
          ? `${notification.title}. Unread. Click to mark as read.`
          : `${notification.title}. Read.`
      }
      className={`group w-full p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset disabled:cursor-wait sm:p-5 ${rowClassName}`}
    >
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

          <h3 className="mt-2 text-sm font-semibold leading-snug text-slate-900 sm:text-base">
            {notification.title}
          </h3>
        </div>

        <div className="flex shrink-0 flex-col items-center pt-0.5">
          {isUnread ? (
            <span
              className="inline-flex items-center rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white"
              aria-label="Unread"
            >
              New
            </span>
          ) : (
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100"
              aria-hidden="true"
            >
              <Check className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
            </span>
          )}
          <span className="mt-1 hidden text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:block">
            {!isUnread && 'Read'}
          </span>
        </div>
      </div>

      <div className="mt-1.5 flex flex-col sm:flex-row sm:items-end sm:gap-4">
        <div className="hidden h-11 w-11 shrink-0 sm:block" aria-hidden="true" />
        <div className="min-w-0 w-full flex-1">
          <p className="m-0 w-full text-sm text-slate-600">{notification.message}</p>
          {notification.assetName && (
            <p className="m-0 mt-1 text-sm">
              <span className="font-medium text-slate-500">Asset:</span>{' '}
              <span className="font-medium text-slate-800">{notification.assetName}</span>
            </p>
          )}
          <div className="mt-1 sm:hidden">{timeLabel}</div>
        </div>
        <div className="hidden shrink-0 text-right sm:block">{timeLabel}</div>
      </div>
    </button>
  )
}

export default NotificationCard
