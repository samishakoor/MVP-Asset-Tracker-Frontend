import PaginatedListItemSkeleton from './PaginatedListItemSkeleton.jsx'

/**
 * Generic skeleton loader for paginated list/card feeds inside PaginatedListContainer.
 * Used on audit logs, notifications, and similar listing pages.
 */
function PaginatedListSkeleton({ count }) {
  const rows = []
  let index = 0

  while (index < count) {
    rows.push(<PaginatedListItemSkeleton key={`paginated-list-skeleton-${index}`} />)
    index = index + 1
  }

  return (
    <div className="divide-y divide-slate-200" aria-busy="true" aria-label="Loading list">
      {rows}
    </div>
  )
}

export default PaginatedListSkeleton
