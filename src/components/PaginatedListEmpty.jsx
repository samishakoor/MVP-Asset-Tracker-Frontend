/**
 * Dashed-border empty state for paginated list pages (matches Support Tickets empty card).
 * Render outside PaginatedListContainer when pagination total_records is zero.
 */
function PaginatedListEmpty({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <Icon className="mb-3 h-10 w-10 text-slate-300" aria-hidden="true" />
      <p className="text-sm font-medium text-slate-600">{title}</p>
      {description && description !== '' && (
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      )}
    </div>
  )
}

export default PaginatedListEmpty
