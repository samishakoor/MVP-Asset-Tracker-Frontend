import { useState } from 'react'
import { FileText } from 'lucide-react'
import { useAuditLogs } from '../hooks/useAuditLogs.js'
import AuditLogCard from '../components/AuditLogCard.jsx'
import PaginationControls from '../components/PaginationControls.jsx'
import PaginatedListSkeleton from '../components/PaginatedListSkeleton.jsx'
import PaginatedListContainer from '../components/PaginatedListContainer.jsx'
import PaginatedPageShell from '../components/PaginatedPageShell.jsx'
import PaginatedListEmpty from '../components/PaginatedListEmpty.jsx'
import { isPaginatedPageFull, isPaginationResultEmpty } from '../utils/paginationUi.js'

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

  const itemCount = events ? events.length : 0
  const fillViewport = isPending || isPaginatedPageFull(itemCount, limit)

  let listContent = null

  if (isPending) {
    listContent = <PaginatedListSkeleton count={limit} />
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
  }

  const isEmptyList = isPaginationResultEmpty(pagination)

  let listArea = null
  if (isEmptyList) {
    listArea = (
      <PaginatedListEmpty
        icon={FileText}
        title="No audit events yet."
        description="Asset lifecycle activity will appear here as it happens."
      />
    )
  } else {
    listArea = <PaginatedListContainer fillViewport={fillViewport}>{listContent}</PaginatedListContainer>
  }

  return (
    <PaginatedPageShell>
      <div className="mb-2 shrink-0 sm:mb-3">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Audit Logs</h1>
        <div className="mt-1">
          <p className="text-sm text-slate-600 sm:text-base">
            Complete history of all asset-related events
          </p>
          <div className="mt-2 flex justify-end">
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
      </div>

      {listArea}
    </PaginatedPageShell>
  )
}

export default AuditLogsPage
