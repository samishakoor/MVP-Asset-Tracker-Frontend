import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import AuthCard from '../components/AuthCard.jsx'
import AuthFormAlert from '../components/AuthFormAlert.jsx'
import AuthTextField from '../components/AuthTextField.jsx'
import { LOGIN_PAGE_LINK, VERIFY_EMAIL_PAGE_LINK } from '../constants/routes.js'
import { toast } from '../utils/toast.js'

const PRIMARY_BUTTON_CLASS =
  'w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-600/25 transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

/**
 * Employee registration screen.
 * Rendered at /signup inside AuthLayout; new accounts require email verification.
 */
function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleTogglePasswordVisibility() {
    setShowPassword((prev) => !prev)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await signup(name, email, password)
      toast.success('Verification email sent. Please check your inbox.')
      navigate(VERIFY_EMAIL_PAGE_LINK, {
        replace: true,
        state: { email, verificationEmailSent: true },
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Register as an employee to track your assigned company assets."
      badge={<UserPlus className="h-5 w-5" aria-hidden="true" />}
      footer={
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <Link to={LOGIN_PAGE_LINK} className="font-semibold text-emerald-600 hover:text-emerald-700">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? <AuthFormAlert variant="error">{error}</AuthFormAlert> : null}

        <AuthTextField
          id="name"
          label="Full name"
          type="text"
          autoComplete="name"
          required={true}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <AuthTextField
          id="signup-email"
          label="Email"
          type="email"
          autoComplete="email"
          required={true}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative mt-1.5">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
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
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">At least 8 characters</p>
        </div>

        <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON_CLASS}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthCard>
  )
}

export default SignupPage
