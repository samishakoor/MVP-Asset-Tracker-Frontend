import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import {
  SIGNUP_PAGE_LINK,
  LOGIN_PAGE_LINK,
  FORGOT_PASSWORD_PAGE_LINK,
  VERIFY_EMAIL_PAGE_LINK,
  ADMIN_DASHBOARD_PATH,
  EMPLOYEE_DASHBOARD_PATH,
} from '../constants/routes.js'
import { UserRole, AUTH_ERROR_MESSAGE } from '../constants/auth.js'
import { toast } from '../utils/toast.js'

/**
 * Login screen for admins and employees.
 * Rendered at /login inside AuthLayout.
 */
function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (location.state?.passwordResetSuccess === true) {
      toast.success('Your password has been reset. Sign in with your new password.')
      navigate(LOGIN_PAGE_LINK, { replace: true, state: {} })
    }
  }, [location.state, navigate])

  function handleTogglePasswordVisibility() {
    setShowPassword((prev) => !prev)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const user = await login(email, password)

      if (user.role === UserRole.ADMIN) {
        navigate(ADMIN_DASHBOARD_PATH, { replace: true })
      } else {
        navigate(EMPLOYEE_DASHBOARD_PATH, { replace: true })
      }
    } catch (err) {
      if (err.message === AUTH_ERROR_MESSAGE.EMAIL_NOT_VERIFIED) {
        toast.info('Verify your email to sign in. You can resend the verification link on the next screen.')
        navigate(VERIFY_EMAIL_PAGE_LINK, {
          replace: true,
          state: { email: email.trim().toLowerCase(), fromLogin: true },
        })
        return
      }
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
      <p className="mt-2 text-sm text-slate-600">Access your asset tracker account</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <Link
              to={FORGOT_PASSWORD_PAGE_LINK}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 pl-3 pr-10 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={handleTogglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        No account?{' '}
        <Link to={SIGNUP_PAGE_LINK} className="font-medium text-emerald-600 hover:text-emerald-700">
          Create one
        </Link>
      </p>
    </div>
  )
}

export default LoginPage
