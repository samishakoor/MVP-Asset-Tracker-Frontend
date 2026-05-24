/**
 * Page header component with title, optional subtitle, and optional action button.
 * Provides consistent spacing and layout across all pages.
 * Responsive: stacks on mobile, inline on desktop.
 */
function PageHeader({ title, subtitle, action, compact }) {
  const marginClass = compact ? 'mb-2 sm:mb-3' : 'mb-6 sm:mb-8'

  return (
    <div className={`${marginClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export default PageHeader
