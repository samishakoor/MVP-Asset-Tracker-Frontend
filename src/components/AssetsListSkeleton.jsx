import Skeleton from './Skeleton.jsx'

/**
 * Skeleton loading state for the admin assets inventory table and mobile cards.
 */
function AssetsListSkeleton({ count }) {
  const rows = []
  let index = 0

  while (index < count) {
    rows.push(index)
    index = index + 1
  }

  return (
    <div aria-busy="true" aria-label="Loading assets">
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Name
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Type
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Serial Number
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Condition
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Assigned To
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((rowIndex) => (
              <tr key={`assets-table-skeleton-${rowIndex}`}>
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
                  <Skeleton className="h-4 w-16" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-5 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-5 py-4 text-right">
                  <Skeleton className="ml-auto h-8 w-28" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col divide-y divide-slate-200 sm:hidden">
        {rows.map((rowIndex) => (
          <div key={`assets-card-skeleton-${rowIndex}`} className="w-full bg-white p-4">
            <div className="mb-3 space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AssetsListSkeleton
