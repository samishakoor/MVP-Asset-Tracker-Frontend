import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useEmailVerification } from '../hooks/useEmailVerification.js'
import { LOGIN_PAGE_LINK, SIGNUP_PAGE_LINK } from '../constants/routes.js'
import { toast } from '../utils/toast.js'

/**
 * Email verification screen — confirms token from email or lets the user resend verification.
 * Rendered at /verify-email inside AuthLayout.
 */
function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { sendVerificationEmail, verifyEmail, resendCooldownSeconds } = useEmailVerification()
  const token = searchParams.get('token')
  const emailFromState = location.state?.email
  const verificationEmailSent = location.state?.verificationEmailSent === true
  const fromLogin = location.state?.fromLogin === true
  const [email] = useState(emailFromState || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [verifyError, setVerifyError] = useState(null)
  const [secondsRemaining, setSecondsRemaining] = useState(
    verificationEmailSent ? resendCooldownSeconds : 0
  )

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

  useEffect(() => {
    if (!token) {
      return undefined
    }

    let isCancelled = false

    async function confirmEmail() {
      setIsSubmitting(true)
      setVerifyError(null)

      try {
        const message = await verifyEmail(token)
        if (isCancelled) {
          return
        }
        setVerificationComplete(true)
        toast.success(message || 'Email verified successfully. You can now sign in.')
        navigate(LOGIN_PAGE_LINK, { replace: true })
      } catch (err) {
        if (isCancelled) {
          return
        }
        setVerifyError(err.message)
        toast.error(err.message)
      } finally {
        if (!isCancelled) {
          setIsSubmitting(false)
        }
      }
    }

    confirmEmail()

    return function cleanup() {
      isCancelled = true
    }
  }, [token, verifyEmail, navigate])

  async function handleResendClick() {
    if (!email || secondsRemaining > 0 || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const message = await sendVerificationEmail(email)
      toast.success(message || 'Verification email sent. Please check your inbox.')
      setSecondsRemaining(resendCooldownSeconds)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (token) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Verifying your email</h1>
        <p className="mt-2 text-sm text-slate-600">
          {isSubmitting ? 'Please wait while we confirm your email address...' : 'Processing your verification link.'}
        </p>

        {verifyError ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {verifyError}
          </div>
        ) : null}

        {verifyError ? (
          <div className="mt-6 space-y-3">
            <Link
              to={SIGNUP_PAGE_LINK}
              className="block w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700"
            >
              Back to sign up
            </Link>
            <Link
              to={LOGIN_PAGE_LINK}
              className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Back to sign in
            </Link>
          </div>
        ) : null}

        {verificationComplete ? (
          <p className="mt-4 text-sm text-emerald-700">Redirecting you to sign in...</p>
        ) : null}
      </div>
    )
  }

  if (!email) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Verify your email</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create an account first, then we will send a verification link to your email.
        </p>
        <Link
          to={SIGNUP_PAGE_LINK}
          className="mt-6 block w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700"
        >
          Go to sign up
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Verify your email</h1>
      {fromLogin ? (
        <p className="mt-2 text-sm text-slate-600">
          Your account for{' '}
          <span className="font-medium text-slate-800">{email}</span> is not verified yet. Request
          a new verification link below, then open the email and click Verify email to activate
          your account.
        </p>
      ) : (
        <p className="mt-2 text-sm text-slate-600">
          We sent a verification link to{' '}
          <span className="font-medium text-slate-800">{email}</span>. Open the email and click
          Verify email to activate your account.
        </p>
      )}

      <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        {fromLogin
          ? 'Did not receive an email or your link expired? Resend a fresh verification link below.'
          : 'Did not receive the email? Check your spam folder or resend after the timer below.'}
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
            {isSubmitting ? 'Sending...' : 'Resend verification email'}
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

export default VerifyEmailPage
