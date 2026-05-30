import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { useEmailVerification } from '../hooks/useEmailVerification.js'
import AuthCard from '../components/AuthCard.jsx'
import AuthDivider from '../components/AuthDivider.jsx'
import AuthFormAlert from '../components/AuthFormAlert.jsx'
import AuthTextField from '../components/AuthTextField.jsx'
import GoogleLoginButton from '../components/GoogleLoginButton.jsx'
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

const PRIMARY_BUTTON_CLASS =
  'w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-600/25 transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

/**
 * Login screen for admins and employees.
 * Rendered at /login inside AuthLayout.
 */
function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithGoogleToken } = useAuth()
  const { sendVerificationEmail } = useEmailVerification()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleRedirectProcessing, setIsGoogleRedirectProcessing] = useState(false)

  function navigateAfterLogin(user) {
    if (user.role === UserRole.ADMIN) {
      navigate(ADMIN_DASHBOARD_PATH, { replace: true })
      return
    }

    navigate(EMPLOYEE_DASHBOARD_PATH, { replace: true })
  }

  useEffect(() => {
    if (location.state?.passwordResetSuccess === true) {
      toast.success('Your password has been reset. Sign in with your new password.')
      navigate(LOGIN_PAGE_LINK, { replace: true, state: {} })
    }
  }, [location.state, navigate])

  useEffect(function handleGoogleOAuthRedirect() {
    const searchParams = new URLSearchParams(location.search)
    const oauthError = searchParams.get('error')
    const token = searchParams.get('token')

    if (oauthError === 'google_auth_failed') {
      setError('Google sign-in failed. Please try again.')
      navigate(LOGIN_PAGE_LINK, { replace: true })
      return
    }

    if (!token) {
      return
    }

    let isCancelled = false

    async function completeGoogleLogin() {
      setError(null)
      setIsGoogleRedirectProcessing(true)

      try {
        const user = await loginWithGoogleToken(token)

        if (isCancelled) {
          return
        }

        navigateAfterLogin(user)
      } catch (err) {
        if (isCancelled) {
          return
        }

        setError(err.message)
        navigate(LOGIN_PAGE_LINK, { replace: true })
      } finally {
        if (!isCancelled) {
          setIsGoogleRedirectProcessing(false)
        }
      }
    }

    completeGoogleLogin()

    return function cleanup() {
      isCancelled = true
    }
  }, [location.search, loginWithGoogleToken, navigate])

  function handleTogglePasswordVisibility() {
    setShowPassword((prev) => !prev)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const user = await login(email, password)
      navigateAfterLogin(user)
    } catch (err) {
      if (err.message === AUTH_ERROR_MESSAGE.EMAIL_NOT_VERIFIED) {
        const normalizedEmail = email.trim().toLowerCase()

        try {
          await sendVerificationEmail(normalizedEmail)
          toast.success('Verification email sent. Please check your inbox.')
          navigate(VERIFY_EMAIL_PAGE_LINK, {
            replace: true,
            state: {
              email: normalizedEmail,
              verificationEmailSent: true,
              fromLogin: true,
            },
          })
        } catch (sendErr) {
          toast.error(sendErr.message)
          navigate(VERIFY_EMAIL_PAGE_LINK, {
            replace: true,
            state: { email: normalizedEmail, fromLogin: true },
          })
        }
        return
      }
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Sign in"
      subtitle="Access your AssetTrack account to view assignments and manage assets."
      badge={<LogIn className="h-5 w-5" aria-hidden="true" />}
      footer={
        <p className="text-sm text-slate-600">
          No account?{' '}
          <Link to={SIGNUP_PAGE_LINK} className="font-semibold text-emerald-600 hover:text-emerald-700">
            Create one
          </Link>
        </p>
      }
    >
      {isGoogleRedirectProcessing ? (
        <AuthFormAlert variant="info">Completing Google sign-in...</AuthFormAlert>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? <AuthFormAlert variant="error">{error}</AuthFormAlert> : null}

        <AuthTextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required={true}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <Link
              to={FORGOT_PASSWORD_PAGE_LINK}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-4 pr-11 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="button"
              onClick={handleTogglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-3.5 text-slate-500 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {showPassword ? (
                <Eye className="h-4 w-4" aria-hidden="true" />
              ) : (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isGoogleRedirectProcessing}
          className={PRIMARY_BUTTON_CLASS}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <AuthDivider label="Or" />
      <GoogleLoginButton disabled={isSubmitting || isGoogleRedirectProcessing} />
    </AuthCard>
  )
}

export default LoginPage
