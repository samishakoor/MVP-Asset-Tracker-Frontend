import { Bell } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications.js'
import { useMarkAllNotificationsRead } from '../hooks/useMarkAllNotificationsRead.js'
import PageHeader from '../components/PageHeader.jsx'
import NotificationCard from '../components/NotificationCard.jsx'
import Spinner from '../components/Spinner.jsx'

/**
 * Notifications page for employees — shows all asset-related notifications.
 * Displays notification cards with read/unread status, with option to mark all as read.
 * Rendered at /employee/dashboard/notifications inside EmployeeLayout.
 */
function NotificationsPage() {
  const { notifications, unreadCount, isLoading, error, refetch } = useNotifications()
  const { markAllAsRead, isMarkingAll } = useMarkAllNotificationsRead()

  async function handleMarkAllAsRead() {
    if (unreadCount === 0) return
    try {
      await markAllAsRead()
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <PageHeader
          title="Notifications"
          subtitle="Stay updated on your asset activities"
        />
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <PageHeader
          title="Notifications"
          subtitle="Stay updated on your asset activities"
        />
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="text-sm">{error.message}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-2 text-sm font-medium underline"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Notifications"
          subtitle="Stay updated on your asset activities"
        />
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:self-start"
          >
            {isMarkingAll ? 'Marking...' : 'Mark All as Read'}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center sm:px-6">
          <Bell className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">No notifications yet.</p>
          <p className="mt-1 text-xs text-slate-400">
            Asset activity notifications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsPage
