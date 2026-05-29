import Skeleton from './Skeleton.jsx'

/**
 * Skeleton loading state for the admin support tickets table and mobile cards.
 */
function TicketsListSkeleton({ count }) {
  const rows = []
  let index = 0

  while (index < count) {
    rows.push(index)
    index = index + 1
  }

  return (
    <div aria-busy="true" aria-label="Loading tickets">
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Asset
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Employee
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Issue Description
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Date Reported
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((rowIndex) => (
              <tr key={`tickets-table-skeleton-${rowIndex}`}>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-48" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-5 py-4 text-right">
                  <Skeleton className="ml-auto h-8 w-16" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col divide-y divide-slate-200 sm:hidden">
        {rows.map((rowIndex) => (
          <div key={`tickets-card-skeleton-${rowIndex}`} className="w-full bg-white p-4">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="mb-3 h-4 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TicketsListSkeleton
