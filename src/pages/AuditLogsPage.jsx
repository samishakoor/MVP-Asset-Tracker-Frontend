import { useState } from 'react'
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react'
import { useAuditLogs } from '../hooks/useAuditLogs.js'
import Spinner from '../components/Spinner.jsx'
import AuditLogCard from '../components/AuditLogCard.jsx'

/**
 * Full audit logs page with paginated event history.
 * Rendered at /admin/audit-logs inside AdminLayout (admin role only).
 */
function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { events, pagination, isFetching, error, refetch } = useAuditLogs({ page, limit })

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

  const hasPreviousPage = page > 1
  const hasNextPage = Boolean(pagination) && page < pagination.total_pages

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-0 flex flex-col overflow-hidden bg-slate-50 lg:static lg:z-auto lg:h-screen">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col overflow-hidden px-4 pt-4 pb-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="mb-2 shrink-0 sm:mb-3">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Audit Logs</h1>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="min-w-0 text-sm text-slate-600 sm:text-base">
              Complete history of all asset-related events
            </p>
            {pagination && (
              <nav
                className="flex shrink-0 items-center gap-1"
                aria-label="Audit log pagination"
              >
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={!hasPreviousPage || isFetching}
                  aria-label="Previous page"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={!hasNextPage || isFetching}
                  aria-label="Next page"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </nav>
            )}
          </div>
        </div>

        {isFetching ? (
          <div className="flex min-h-0 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Scrollable Logs Container */}
            <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-sm">
              {error ? (
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
              ) : events && events.length > 0 ? (
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
              ) : (
                <div className="flex h-full items-center justify-center p-8">
                  <div className="text-center">
                    <FileText className="mx-auto mb-3 h-12 w-12 text-slate-400" />
                    <p className="text-sm font-medium text-slate-600">No audit events yet.</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Asset lifecycle activity will appear here as it happens.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AuditLogsPage
