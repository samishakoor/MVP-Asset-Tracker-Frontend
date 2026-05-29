import { useState } from 'react'
import { History } from 'lucide-react'
import { useMyHistory } from '../hooks/useMyHistory.js'
import PaginationControls from '../components/PaginationControls.jsx'
import HistoryPageSkeleton from '../components/HistoryPageSkeleton.jsx'

/**
 * Calculates the number of days between two dates.
 *
 * @param {string} start - ISO date string.
 * @param {string} end - ISO date string.
 * @returns {number}
 */
function daysBetween(start, end) {
  const ms = new Date(end).getTime() - new Date(start).getTime()
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)))
}

/**
 * Formats a date string to a readable short date.
 *
 * @param {string} dateStr - ISO date string.
 * @returns {string}
 */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Employee history page — paginated list of previously returned assets.
 * Read-only. Shows asset name, type, serial number, assigned/return dates, and duration.
 * Rendered at /employee/dashboard/history inside EmployeeLayout.
 */
function EmployeeHistoryPage() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { history, pagination, isPending, isFetching, error, refetch } = useMyHistory({
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

  let mainContent = null

  if (isPending) {
    mainContent = (
      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <HistoryPageSkeleton count={limit} />
      </div>
    )
  } else if (error) {
    mainContent = (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <p className="text-sm">{error.message}</p>
        <button
          type="button"
          onClick={refetch}
          className="mt-2 text-sm font-medium underline"
        >
          Retry
        </button>
      </div>
    )
  } else if (history.length === 0) {
    mainContent = (
      <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
        <div className="p-8 text-center">
          <History className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">No returned assets yet.</p>
          <p className="mt-1 text-xs text-slate-400">
            Assets you return will appear here.
          </p>
        </div>
      </div>
    )
  } else {
    mainContent = (
      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Desktop table */}
        <div className="hidden sm:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Asset Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Serial Number
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Assigned Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Return Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((item) => {
                const days = daysBetween(item.assignedAt, item.returnedAt)
                return (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-900">{item.assetName}</td>
                    <td className="px-5 py-4 text-sm capitalize text-slate-600">
                      {item.assetType}
                    </td>
                    <td className="px-5 py-4 font-mono text-sm text-slate-600">
                      {item.serialNumber ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {formatDate(item.assignedAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {formatDate(item.returnedAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                      {days} {days === 1 ? 'day' : 'days'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="grid grid-cols-1 gap-3 p-3 sm:hidden">
          {history.map((item) => {
            const days = daysBetween(item.assignedAt, item.returnedAt)
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{item.assetName}</p>
                    <p className="mt-0.5 text-xs capitalize text-slate-500">{item.assetType}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {days} {days === 1 ? 'day' : 'days'}
                  </span>
                </div>

                {item.serialNumber && (
                  <p className="mb-2 font-mono text-xs text-slate-400">{item.serialNumber}</p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>
                    <span className="font-medium text-slate-700">Assigned:</span>{' '}
                    {formatDate(item.assignedAt)}
                  </span>
                  <span>
                    <span className="font-medium text-slate-700">Returned:</span>{' '}
                    {formatDate(item.returnedAt)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-0 flex flex-col overflow-hidden bg-slate-50 lg:static lg:z-auto lg:h-screen">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col overflow-hidden px-4 pt-4 pb-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="mb-2 shrink-0 sm:mb-3">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Asset History</h1>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="min-w-0 text-sm text-slate-600 sm:text-base">
              Assets you previously returned
            </p>
            <PaginationControls
              pagination={pagination}
              page={page}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
              isFetching={isFetching}
              ariaLabel="History pagination"
            />
          </div>
        </div>

        {mainContent}
      </div>
    </div>
  )
}

export default EmployeeHistoryPage
