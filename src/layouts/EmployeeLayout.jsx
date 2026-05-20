import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Monitor, History, Menu, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import BrandLogo from '../components/BrandLogo.jsx'
import { EMPLOYEE_DASHBOARD_PATH, EMPLOYEE_HISTORY_PATH } from '../constants/routes.js'

/**
 * Employee layout with sidebar navigation.
 * Left sidebar (240px fixed on desktop, collapsible on mobile) with nav links and user info.
 * Right content area displays <Outlet /> for nested routes.
 * Mobile responsive: sidebar collapses to hamburger menu.
 */
function EmployeeLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false)
  }

  const navLinks = [
    {
      to: EMPLOYEE_DASHBOARD_PATH,
      icon: Monitor,
      label: 'My Gear',
      end: true,
    },
    {
      to: EMPLOYEE_HISTORY_PATH,
      icon: History,
      label: 'My History',
    },
  ]

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-slate-50">
      {/* Mobile header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <BrandLogo variant="slate" size="sm" />
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <BrandLogo variant="emerald" size="lg" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end === true}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </NavLink>
            )
          })}
        </nav>

        {/* User info and logout */}
        <div className="border-t border-slate-200 p-4">
          <div className="mb-3 rounded-lg bg-slate-50 p-3">
            <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
            <p className="truncate text-xs text-slate-600">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 pt-16 lg:ml-64 lg:pt-0">
        <div className="min-h-screen bg-slate-50">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default EmployeeLayout
