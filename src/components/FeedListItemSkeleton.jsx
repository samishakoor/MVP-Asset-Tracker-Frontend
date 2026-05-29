import Skeleton from './Skeleton.jsx'

/**
 * Skeleton row matching audit log and notification list item layout.
 * Set showTrailingColumn true for notification read-status column on desktop.
 */
function FeedListItemSkeleton({ showTrailingColumn }) {
  const trailingClassName = showTrailingColumn === true ? 'flex' : 'hidden'

  return (
    <div className="w-full p-4 sm:p-5" aria-hidden="true">
      <div className="flex gap-3 sm:gap-4">
        <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-3 w-40 max-w-xs" />
        </div>
        <div className={`${trailingClassName} shrink-0 flex-col items-center gap-1 pt-0.5 sm:flex`}>
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
      <div className="mt-2 flex gap-3 sm:gap-4">
        <div className="hidden h-11 w-11 shrink-0 sm:block" aria-hidden="true" />
        <Skeleton className="h-3 w-28 sm:hidden" />
      </div>
    </div>
  )
}

export default FeedListItemSkeleton
