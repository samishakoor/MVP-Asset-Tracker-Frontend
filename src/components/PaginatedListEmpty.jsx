/**
 * Centered empty state for paginated list containers without forcing full container height.
 */
function PaginatedListEmpty({ icon: Icon, title, description }) {
  return (
    <div className="flex min-h-[10rem] items-center justify-center px-6 py-10 sm:min-h-[12rem] sm:py-12">
      <div className="text-center">
        <Icon className="mx-auto mb-3 h-10 w-10 text-slate-400 sm:h-12 sm:w-12" />
        <p className="text-sm font-medium text-slate-600">{title}</p>
        {description && description !== '' && (
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        )}
      </div>
    </div>
  )
}

export default PaginatedListEmpty
