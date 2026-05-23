import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import {
  LOGIN_PAGE_LINK,
  VERIFY_EMAIL_PAGE_LINK,
  ADMIN_DASHBOARD_PATH,
  EMPLOYEE_DASHBOARD_PATH,
} from '../constants/routes.js'
import { UserRole } from '../constants/auth.js'

/**
 * Guards routes that require authentication and optionally a specific role.
 * Redirects unauthenticated users to login and wrong-role users to their dashboard.
 */
function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_PAGE_LINK} replace />
  }

  if (user.isVerified === false) {
    return (
      <Navigate
        to={VERIFY_EMAIL_PAGE_LINK}
        replace
        state={{ email: user.email, fromLogin: true }}
      />
    )
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === UserRole.ADMIN) {
      return <Navigate to={ADMIN_DASHBOARD_PATH} replace />
    }
    return <Navigate to={EMPLOYEE_DASHBOARD_PATH} replace />
  }

  return children
}

export default ProtectedRoute
