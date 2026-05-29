import { ArrowLeft, ArrowRight } from 'lucide-react'

/**
 * Compact previous/next arrow pagination for list pages.
 * Renders nothing when pagination metadata is absent.
 * Used on AuditLogsPage, NotificationsPage, and EmployeeHistoryPage.
 */
function PaginationControls({ pagination, page, onPrevious, onNext, isFetching, ariaLabel }) {
  if (!pagination) {
    return null
  }

  const hasPreviousPage = page > 1
  const hasNextPage = page < pagination.total_pages
  const isDisabled = isFetching === true
  const totalPages = pagination.total_pages === 0 ? 1 : pagination.total_pages
  const pageLabel = `Page ${page} of ${totalPages}`

  return (
    <nav
      className="flex shrink-0 items-center gap-2"
      aria-label={ariaLabel}
    >
      <p className="whitespace-nowrap text-xs text-slate-500" aria-live="polite">
        {pageLabel}
      </p>
      <button
        type="button"
        onClick={onPrevious}
        disabled={!hasPreviousPage || isDisabled}
        aria-label="Previous page"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNextPage || isDisabled}
        aria-label="Next page"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  )
}

export default PaginationControls
