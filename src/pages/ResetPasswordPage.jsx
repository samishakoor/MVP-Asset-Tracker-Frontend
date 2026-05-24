import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { KeyRound, Link2Off } from 'lucide-react'
import PasswordInput from '../components/PasswordInput.jsx'
import AuthCard from '../components/AuthCard.jsx'
import AuthFormAlert from '../components/AuthFormAlert.jsx'
import { usePasswordReset } from '../hooks/usePasswordReset.js'
import { LOGIN_PAGE_LINK, FORGOT_PASSWORD_PAGE_LINK } from '../constants/routes.js'

const PRIMARY_BUTTON_CLASS =
  'w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-600/25 transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

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
      <AuthCard
        title="Invalid reset link"
        subtitle="This password reset link is missing or invalid. Request a new link to continue."
        badge={<Link2Off className="h-5 w-5" aria-hidden="true" />}
      >
        <Link to={FORGOT_PASSWORD_PAGE_LINK} className={`block text-center ${PRIMARY_BUTTON_CLASS}`}>
          Request new link
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Reset password"
      subtitle="Choose a strong new password for your AssetTrack account."
      badge={<KeyRound className="h-5 w-5" aria-hidden="true" />}
      footer={
        <Link to={LOGIN_PAGE_LINK} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? <AuthFormAlert variant="error">{error}</AuthFormAlert> : null}

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

        <button type="submit" disabled={isSubmitting} className={PRIMARY_BUTTON_CLASS}>
          {isSubmitting ? 'Resetting password...' : 'Reset password'}
        </button>
      </form>
    </AuthCard>
  )
}

export default ResetPasswordPage
