import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import {
  LOGIN_PAGE_LINK,
  SIGNUP_PAGE_LINK,
  ADMIN_DASHBOARD_PATH,
  EMPLOYEE_DASHBOARD_PATH,
} from '../constants/routes.js'

/**
 * Home page — main landing screen for the asset tracker app.
 * Rendered at /home inside MainLayout.
 */
function HomePage() {
  const { isAuthenticated, isAdmin } = useAuth()

  let dashboardPath = EMPLOYEE_DASHBOARD_PATH
  let dashboardLabel = 'Go to my dashboard'

  if (isAdmin) {
    dashboardPath = ADMIN_DASHBOARD_PATH
    dashboardLabel = 'Go to admin dashboard'
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome to Asset Tracker</h1>
        <p className="mt-3 text-slate-600">
          Track company hardware assignments, custody acknowledgments, and support workflows.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {isAuthenticated ? (
            <Link
              to={dashboardPath}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              {dashboardLabel}
            </Link>
          ) : (
            <>
              <Link
                to={LOGIN_PAGE_LINK}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Sign in
              </Link>
              <Link
                to={SIGNUP_PAGE_LINK}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default HomePage
