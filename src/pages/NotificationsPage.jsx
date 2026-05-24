import { useState } from 'react'
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications.js'
import { useMarkAllNotificationsRead } from '../hooks/useMarkAllNotificationsRead.js'
import PageHeader from '../components/PageHeader.jsx'
import NotificationCard from '../components/NotificationCard.jsx'
import Spinner from '../components/Spinner.jsx'

/**
 * Notifications page for employees with pagination.
 * Shows all asset-related notifications with read/unread status and mark all as read option.
 * Rendered at /employee/dashboard/notifications inside EmployeeLayout.
 */
function NotificationsPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { notifications, unreadCount, pagination, isFetching, error, refetch } = useNotifications({
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

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-0 flex flex-col overflow-hidden bg-slate-50 lg:static lg:z-auto lg:h-screen">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col overflow-hidden px-4 pt-4 pb-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="shrink-0">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <PageHeader
              title="Notifications"
              subtitle="Stay updated on your asset activities"
              compact={true}
            />
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:self-start"
              >
                {isMarkingAll ? 'Marking...' : 'Mark All as Read'}
              </button>
            )}
          </div>
        </div>

        {isFetching ? (
          <div className="flex min-h-0 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Scrollable Notifications Container */}
            <div className="mb-3 min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-sm">
              {error ? (
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
              ) : notifications && notifications.length > 0 ? (
                <div className="divide-y divide-slate-200">
                  {notifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center p-8">
                  <div className="text-center">
                    <Bell className="mx-auto mb-3 h-12 w-12 text-slate-400" />
                    <p className="text-sm font-medium text-slate-600">No notifications yet.</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Asset activity notifications will appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.total_pages > 1 && (
              <div className="shrink-0 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-center text-sm text-slate-600 sm:text-left">
                  Page {pagination.page} of {pagination.total_pages} ({pagination.total} total
                  notifications)
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={!pagination || page === pagination.total_pages}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage
