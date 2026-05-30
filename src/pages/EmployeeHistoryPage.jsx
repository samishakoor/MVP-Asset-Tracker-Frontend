import { useState } from 'react'
import { History } from 'lucide-react'
import { useMyHistory } from '../hooks/useMyHistory.js'
import PaginationControls from '../components/PaginationControls.jsx'
import HistoryPageSkeleton from '../components/HistoryPageSkeleton.jsx'
import PaginatedListContainer from '../components/PaginatedListContainer.jsx'
import PaginatedPageShell from '../components/PaginatedPageShell.jsx'
import PaginatedListEmpty from '../components/PaginatedListEmpty.jsx'
import { isPaginatedPageFull, isPaginationResultEmpty } from '../utils/paginationHelper.js'

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
  const limit = 15

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

  const itemCount = history ? history.length : 0
  const fillMobileViewport = isPending || isPaginatedPageFull(itemCount, limit)

  let mainContent = null

  if (isPending) {
    mainContent = (
      <>
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:block">
          <HistoryPageSkeleton count={limit} />
        </div>
        <PaginatedListContainer
          className="sm:hidden"
          borderRadiusClass="rounded-2xl"
          fillViewport={fillMobileViewport}
        >
          <HistoryPageSkeleton count={limit} />
        </PaginatedListContainer>
      </>
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
  } else if (isPaginationResultEmpty(pagination)) {
    mainContent = (
      <PaginatedListEmpty
        icon={History}
        title="No returned assets yet."
        description="Assets you return will appear here."
      />
    )
  } else {
    mainContent = (
      <>
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
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

        <PaginatedListContainer
          className="sm:hidden"
          borderRadiusClass="rounded-2xl"
          fillViewport={fillMobileViewport}
        >
          <div className="flex flex-col divide-y divide-slate-200">
            {history.map((item) => {
              const days = daysBetween(item.assignedAt, item.returnedAt)
              return (
                <article key={item.id} className="w-full bg-white p-4">
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
                </article>
              )
            })}
          </div>
        </PaginatedListContainer>
      </>
    )
  }

  return (
    <PaginatedPageShell>
      <div className="mb-2 shrink-0 sm:mb-3">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Asset History</h1>
        <div className="mt-1">
          <p className="text-sm text-slate-600 sm:text-base">
            Assets you previously returned
          </p>
          <div className="mt-2 flex justify-end">
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
      </div>

      {mainContent}
    </PaginatedPageShell>
  )
}

export default EmployeeHistoryPage
