import Skeleton from './Skeleton.jsx'

/**
 * Generic skeleton row for paginated list feeds (audit logs, notifications, etc.).
 * Matches shared list card layout: icon, type label, title, description, and timestamp.
 */
function PaginatedListItemSkeleton() {
  return (
    <div className="w-full p-4 sm:p-5" aria-hidden="true">
      <div className="flex gap-3 sm:gap-4">
        <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-4 w-full max-w-md" />
          <Skeleton className="mt-1.5 h-3 w-48 max-w-sm" />
          <div className="mt-1 sm:hidden">
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="hidden shrink-0 pt-0.5 sm:block">
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}

export default PaginatedListItemSkeleton
