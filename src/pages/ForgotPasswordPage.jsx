import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { usePasswordReset } from '../hooks/usePasswordReset.js'
import AuthCard from '../components/AuthCard.jsx'
import AuthFormAlert from '../components/AuthFormAlert.jsx'
import AuthTextField from '../components/AuthTextField.jsx'
import { LOGIN_PAGE_LINK } from '../constants/routes.js'
import { toast } from '../utils/toast.js'

const PRIMARY_BUTTON_CLASS =
  'w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-600/25 transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const SECONDARY_BUTTON_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60'

/**
 * Forgot-password screen — collects email and sends a reset link.
 * Rendered at /forgot-password inside AuthLayout.
 */
function ForgotPasswordPage() {
  const { requestPasswordReset, resendCooldownSeconds } = usePasswordReset()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(0)

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return undefined
    }

    const timerId = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return function cleanup() {
      window.clearInterval(timerId)
    }
  }, [secondsRemaining])

  async function sendResetEmail() {
    setIsSubmitting(true)

    try {
      const message = await requestPasswordReset(email)
      toast.success(message || 'Password reset link sent to your email')
      setEmailSent(true)
      setSecondsRemaining(resendCooldownSeconds)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await sendResetEmail()
  }

  async function handleResendClick() {
    if (secondsRemaining > 0 || isSubmitting) {
      return
    }
    await sendResetEmail()
  }

  if (emailSent) {
    return (
      <AuthCard
        title="Check your email"
        subtitle={
          <>
            A password reset link has been sent to{' '}
            <span className="font-semibold text-slate-800">{email}</span>. Open the email and
            follow the link to choose a new password.
          </>
        }
        badge={<Mail className="h-5 w-5" aria-hidden="true" />}
      >
        <AuthFormAlert variant="info">
          Did not receive the email? Check your spam folder or use the resend option below once the
          timer expires.
        </AuthFormAlert>

        <div className="mt-6 space-y-3">
          {secondsRemaining > 0 ? (
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-600">
              Resend available in{' '}
              <span className="font-semibold tabular-nums text-slate-900">{secondsRemaining}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendClick}
              disabled={isSubmitting}
              className={SECONDARY_BUTTON_CLASS}
            >
              {isSubmitting ? 'Sending...' : 'Resend email'}
            </button>
          )}

          <Link to={LOGIN_PAGE_LINK} className={`block text-center ${PRIMARY_BUTTON_CLASS}`}>
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Forgot password"
      subtitle="Enter the email associated with your account and we will send you a secure reset link."
      badge={<Mail className="h-5 w-5" aria-hidden="true" />}
      footer={
        <p className="text-sm text-slate-600">
          Remember your password?{' '}
          <Link to={LOGIN_PAGE_LINK} className="font-semibold text-emerald-600 hover:text-emerald-700">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthTextField
          id="forgot-email"
          label="Email"
          type="email"
          autoComplete="email"
          required={true}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON_CLASS}>
          {isSubmitting ? 'Sending reset email...' : 'Send reset link'}
        </button>
      </form>
    </AuthCard>
  )
}

export default ForgotPasswordPage
