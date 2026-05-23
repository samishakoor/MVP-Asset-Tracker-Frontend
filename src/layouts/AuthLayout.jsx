import { Link, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import BrandLogo from '../components/BrandLogo.jsx'
import {
  ADMIN_DASHBOARD_PATH,
  EMPLOYEE_DASHBOARD_PATH,
  HOME_PAGE_PATH,
  VERIFY_EMAIL_PAGE_LINK,
} from '../constants/routes.js'
import { UserRole } from '../constants/auth.js'

/**
 * Centered layout for login and signup screens.
 * Redirects authenticated users to their role-specific dashboard.
 */
function AuthLayout() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    if (user.isVerified === false) {
      return (
        <Navigate
          to={VERIFY_EMAIL_PAGE_LINK}
          replace
          state={{ email: user.email, fromLogin: true }}
        />
      )
    }

    if (user.role === UserRole.ADMIN) {
      return <Navigate to={ADMIN_DASHBOARD_PATH} replace />
    }
    return <Navigate to={EMPLOYEE_DASHBOARD_PATH} replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <BrandLogo to={HOME_PAGE_PATH} variant="emerald" size="md" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
