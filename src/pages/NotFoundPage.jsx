import { Link } from 'react-router-dom'
import { HOME_PAGE_PATH } from '../constants/routes.js'

/**
 * Not found page — shown when no route matches the current URL.
 * Rendered for all unmatched paths via the NOT_FOUND catch-all route.
 */
function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-semibold text-slate-900">404 — Page not found</h1>
      <Link
        to={HOME_PAGE_PATH}
        className="mt-6 text-sm font-medium text-emerald-700 hover:text-emerald-800"
      >
        Back to home
      </Link>
    </main>
  )
}

export default NotFoundPage
