import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import BrandLogo from '../components/BrandLogo.jsx'
import {
  HOME_PAGE_PATH,
  LOGIN_PAGE_LINK,
  SIGNUP_PAGE_LINK,
  ADMIN_DASHBOARD_PATH,
  EMPLOYEE_DASHBOARD_PATH,
} from '../constants/routes.js'

/**
 * Public app shell with a top header and page content via <Outlet />.
 * Header links collapse into a slide-in drawer on mobile (hamburger icon).
 */
function MainLayout() {
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const dashboardPath = isAdmin ? ADMIN_DASHBOARD_PATH : EMPLOYEE_DASHBOARD_PATH
  const dashboardLabel = isAdmin ? 'Admin Dashboard' : 'My Dashboard'

  function handleLogout() {
    logout()
    setIsDrawerOpen(false)
  }

  function closeDrawer() {
    setIsDrawerOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <BrandLogo to={HOME_PAGE_PATH} variant="emerald" size="md" onClick={closeDrawer} />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 sm:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  {dashboardLabel}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={LOGIN_PAGE_LINK}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  Login
                </Link>
                <Link
                  to={SIGNUP_PAGE_LINK}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            aria-label={isDrawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isDrawerOpen}
            className="flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 sm:hidden"
          >
            {isDrawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* ── Mobile drawer overlay ── */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 sm:hidden"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer panel ── */}
      <div
        className={`fixed right-0 top-16 z-40 h-[calc(100dvh-4rem)] w-64 border-l border-slate-200 bg-white shadow-xl transition-transform duration-200 ease-in-out sm:hidden ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col gap-1 p-4">
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                onClick={closeDrawer}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                {dashboardLabel}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to={LOGIN_PAGE_LINK}
                onClick={closeDrawer}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                to={SIGNUP_PAGE_LINK}
                onClick={closeDrawer}
                className="mt-1 rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* ── Page content ── */}
      <Outlet />
    </div>
  )
}

export default MainLayout
