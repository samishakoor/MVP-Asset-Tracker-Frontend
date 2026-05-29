import { useState } from 'react'
import { FileText } from 'lucide-react'
import { useAuditLogs } from '../hooks/useAuditLogs.js'
import AuditLogCard from '../components/AuditLogCard.jsx'
import PaginationControls from '../components/PaginationControls.jsx'
import FeedListSkeleton from '../components/FeedListSkeleton.jsx'

/**
 * Full audit logs page with paginated event history.
 * Rendered at /admin/audit-logs inside AdminLayout (admin role only).
 */
function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { events, pagination, isPending, isFetching, error, refetch } = useAuditLogs({
    page,
    limit,
  })

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

  let listContent = null

  if (isPending) {
    listContent = <FeedListSkeleton count={limit} showTrailingColumn={false} />
  } else if (error) {
    listContent = (
      <div className="p-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="text-sm">{error.message || 'Failed to load audit logs'}</p>
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
  } else if (events && events.length > 0) {
    listContent = (
      <div className="divide-y divide-slate-200">
        {events.map((event) => (
          <AuditLogCard
            key={event.id}
            eventType={event.event_type}
            createdAt={event.created_at}
            triggeredByName={event.triggered_by_name}
            targetEmployeeName={event.target_employee_name}
            notes={event.notes}
            assetName={event.asset_name}
          />
        ))}
      </div>
    )
  } else {
    listContent = (
      <div className="flex h-full min-h-[12rem] items-center justify-center p-8">
        <div className="text-center">
          <FileText className="mx-auto mb-3 h-12 w-12 text-slate-400" />
          <p className="text-sm font-medium text-slate-600">No audit events yet.</p>
          <p className="mt-1 text-xs text-slate-400">
            Asset lifecycle activity will appear here as it happens.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-0 flex flex-col overflow-hidden bg-slate-50 lg:static lg:z-auto lg:h-screen">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col overflow-hidden px-4 pt-4 pb-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="mb-2 shrink-0 sm:mb-3">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Audit Logs</h1>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="min-w-0 text-sm text-slate-600 sm:text-base">
              Complete history of all asset-related events
            </p>
            <PaginationControls
              pagination={pagination}
              page={page}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
              isFetching={isFetching}
              ariaLabel="Audit log pagination"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          {listContent}
        </div>
      </div>
    </div>
  )
}

export default AuditLogsPage
