import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput.jsx'
import { usePasswordReset } from '../hooks/usePasswordReset.js'
import { LOGIN_PAGE_LINK, FORGOT_PASSWORD_PAGE_LINK } from '../constants/routes.js'

/**
 * Reset-password screen — sets a new password using the token from the reset email.
 * Rendered at /reset-password inside AuthLayout.
 */
function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { resetPassword } = usePasswordReset()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsSubmitting(true)

    try {
      await resetPassword(token, password, confirmPassword)
      navigate(LOGIN_PAGE_LINK, {
        replace: true,
        state: { passwordResetSuccess: true },
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Invalid reset link</h1>
        <p className="mt-2 text-sm text-slate-600">
          This password reset link is missing or invalid. Request a new link to continue.
        </p>
        <Link
          to={FORGOT_PASSWORD_PAGE_LINK}
          className="mt-6 block w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700"
        >
          Request new link
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Reset password</h1>
      <p className="mt-2 text-sm text-slate-600">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <PasswordInput
          id="reset-password"
          label="New password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          required={true}
          minLength={8}
          hint="At least 8 characters"
        />

        <PasswordInput
          id="reset-confirm-password"
          label="Confirm password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          required={true}
          minLength={8}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Resetting password...' : 'Reset password'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        <Link to={LOGIN_PAGE_LINK} className="font-medium text-emerald-600 hover:text-emerald-700">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}

export default ResetPasswordPage
