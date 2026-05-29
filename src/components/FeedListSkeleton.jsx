import FeedListItemSkeleton from './FeedListItemSkeleton.jsx'

/**
 * Repeated feed list skeleton rows for paginated audit logs and notifications.
 */
function FeedListSkeleton({ count, showTrailingColumn }) {
  const rows = []
  let index = 0

  while (index < count) {
    rows.push(
      <FeedListItemSkeleton
        key={`feed-skeleton-${index}`}
        showTrailingColumn={showTrailingColumn}
      />,
    )
    index = index + 1
  }

  return (
    <div className="divide-y divide-slate-200" aria-busy="true" aria-label="Loading content">
      {rows}
    </div>
  )
}

export default FeedListSkeleton
