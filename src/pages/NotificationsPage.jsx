import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications.js'
import { useMarkAllNotificationsRead } from '../hooks/useMarkAllNotificationsRead.js'
import NotificationCard from '../components/NotificationCard.jsx'
import PaginationControls from '../components/PaginationControls.jsx'
import FeedListSkeleton from '../components/FeedListSkeleton.jsx'

/**
 * Notifications page for employees with pagination.
 * Shows all asset-related notifications with read/unread status and mark all as read option.
 * Rendered at /employee/dashboard/notifications inside EmployeeLayout.
 */
function NotificationsPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { notifications, unreadCount, pagination, isPending, isFetching, error, refetch } =
    useNotifications({
    page,
    limit,
  })
  const { markAllAsRead, isMarkingAll } = useMarkAllNotificationsRead()

  function handlePreviousPage() {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  function handleNextPage() {
    if (pagination && page < pagination.total_pages) {
      setPage(page + 1)
    }
  }

  async function handleMarkAllAsRead() {
    if (unreadCount === 0) return
    try {
      await markAllAsRead()
      refetch()
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  let listContent = null

  if (isPending) {
    listContent = <FeedListSkeleton count={limit} showTrailingColumn={true} />
  } else if (error) {
    listContent = (
      <div className="p-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="text-sm">{error.message || 'Failed to load notifications'}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 text-sm font-medium underline"
          >
            Retry
          </button>
        </div>
      </div>
    )
  } else if (notifications && notifications.length > 0) {
    listContent = (
      <div className="divide-y divide-slate-200">
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
    )
  } else {
    listContent = (
      <div className="flex h-full min-h-[12rem] items-center justify-center p-8">
        <div className="text-center">
          <Bell className="mx-auto mb-3 h-12 w-12 text-slate-400" />
          <p className="text-sm font-medium text-slate-600">No notifications yet.</p>
          <p className="mt-1 text-xs text-slate-400">
            Asset activity notifications will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-0 flex flex-col overflow-hidden bg-slate-50 lg:static lg:z-auto lg:h-screen">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col overflow-hidden px-4 pt-4 pb-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="mb-2 shrink-0 sm:mb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Notifications</h1>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="min-w-0 text-sm text-slate-600 sm:text-base">
                  Stay updated on your asset activities
                </p>
                <PaginationControls
                  pagination={pagination}
                  page={page}
                  onPrevious={handlePreviousPage}
                  onNext={handleNextPage}
                  isFetching={isFetching}
                  ariaLabel="Notification pagination"
                />
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="w-full shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isMarkingAll ? 'Marking...' : 'Mark All as Read'}
              </button>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          {listContent}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage
