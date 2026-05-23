import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePasswordReset } from '../hooks/usePasswordReset.js'
import { LOGIN_PAGE_LINK } from '../constants/routes.js'
import { toast } from '../utils/toast.js'

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
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Check your email</h1>
        <p className="mt-2 text-sm text-slate-600">
          We sent a password reset link to{' '}
          <span className="font-medium text-slate-800">{email}</span>. The link expires in 1 hour.
        </p>

        <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          Did not receive the email? Check your spam folder or wait for the timer to resend.
        </div>

        <div className="mt-6 space-y-3">
          {secondsRemaining > 0 ? (
            <p className="text-center text-sm text-slate-600">
              Resend available in{' '}
              <span className="font-medium text-slate-900">{secondsRemaining}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendClick}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Sending...' : 'Resend email'}
            </button>
          )}

          <Link
            to={LOGIN_PAGE_LINK}
            className="block w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Forgot password</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter your email and we will send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Remember your password?{' '}
        <Link to={LOGIN_PAGE_LINK} className="font-medium text-emerald-600 hover:text-emerald-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default ForgotPasswordPage
