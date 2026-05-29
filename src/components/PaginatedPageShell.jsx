/**
 * Layout shell for paginated list pages.
 * Uses a flex column on mobile so a full page of items can expand the list area without gap below.
 */
function PaginatedPageShell({ children }) {
  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-0 flex flex-col bg-slate-50 lg:static lg:inset-auto lg:z-auto lg:min-h-0">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-4 pt-4 pb-0 sm:px-6 sm:pt-6 lg:flex-none lg:pb-8">
        {children}
      </div>
    </div>
  )
}

export default PaginatedPageShell
