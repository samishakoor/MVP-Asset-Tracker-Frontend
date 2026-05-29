import Skeleton from './Skeleton.jsx'

/**
 * Skeleton loading state for the employee history table and mobile cards.
 */
function HistoryPageSkeleton({ count }) {
  const rows = []
  let index = 0

  while (index < count) {
    rows.push(index)
    index = index + 1
  }

  return (
    <div aria-busy="true" aria-label="Loading history">
      <div className="hidden sm:block">
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
            {rows.map((rowIndex) => (
              <tr key={`history-table-skeleton-${rowIndex}`}>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-28" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-16" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 p-3 sm:hidden">
        {rows.map((rowIndex) => (
          <div
            key={`history-card-skeleton-${rowIndex}`}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <Skeleton className="mb-3 h-3 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryPageSkeleton
