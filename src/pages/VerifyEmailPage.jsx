import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { MailCheck, MailWarning } from 'lucide-react'
import { useEmailVerification } from '../hooks/useEmailVerification.js'
import AuthCard from '../components/AuthCard.jsx'
import AuthFormAlert from '../components/AuthFormAlert.jsx'
import Spinner from '../components/Spinner.jsx'
import { LOGIN_PAGE_LINK, SIGNUP_PAGE_LINK } from '../constants/routes.js'
import { toast } from '../utils/toast.js'

const PRIMARY_BUTTON_CLASS =
  'w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-600/25 transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const SECONDARY_BUTTON_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60'

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
  const fromLogin = location.state?.fromLogin === true
  const verificationEmailSent = location.state?.verificationEmailSent === true
  const [email] = useState(emailFromState || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [verifyError, setVerifyError] = useState(null)
  const [secondsRemaining, setSecondsRemaining] = useState(
    verificationEmailSent ? resendCooldownSeconds : 0,
  )
  const verifyRequestIdRef = useRef(0)

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

    verifyRequestIdRef.current += 1
    const requestId = verifyRequestIdRef.current

    async function confirmEmail() {
      setIsSubmitting(true)
      setVerifyError(null)

      try {
        const message = await verifyEmail(token)
        if (verifyRequestIdRef.current !== requestId) {
          return
        }
        setVerificationComplete(true)
        toast.success(message || 'Email verified successfully. You can now sign in.')
        navigate(LOGIN_PAGE_LINK, { replace: true })
      } catch (err) {
        if (verifyRequestIdRef.current !== requestId) {
          return
        }
        setVerifyError(err.message)
      } finally {
        if (verifyRequestIdRef.current === requestId) {
          setIsSubmitting(false)
        }
      }
    }

    confirmEmail()

    return undefined
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
    const cardTitle = verifyError ? 'Verification link expired' : 'Verifying your email'
    const cardSubtitle = verifyError
      ? 'This verification link is no longer valid. Sign in to request a new verification email.'
      : isSubmitting
        ? 'Please wait while we confirm your email address...'
        : 'Processing your verification link.'

    return (
      <AuthCard
        title={cardTitle}
        subtitle={cardSubtitle}
        badge={<MailCheck className="h-5 w-5" aria-hidden="true" />}
      >
        {isSubmitting && !verifyError ? (
          <div className="py-2">
            <Spinner />
          </div>
        ) : null}

        {verifyError ? <AuthFormAlert variant="error">{verifyError}</AuthFormAlert> : null}

        {verifyError ? (
          <div className="mt-6 space-y-3">
            <Link to={LOGIN_PAGE_LINK} className={`block text-center ${PRIMARY_BUTTON_CLASS}`}>
              Back to sign in
            </Link>
          </div>
        ) : null}

        {verificationComplete ? (
          <AuthFormAlert variant="success">Redirecting you to sign in...</AuthFormAlert>
        ) : null}
      </AuthCard>
    )
  }

  if (!email) {
    return (
      <AuthCard
        title="Verify your email"
        subtitle="Create an account first, then we will send a verification link to your inbox."
        badge={<MailWarning className="h-5 w-5" aria-hidden="true" />}
      >
        <Link to={SIGNUP_PAGE_LINK} className={`block text-center ${PRIMARY_BUTTON_CLASS}`}>
          Go to sign up
        </Link>
      </AuthCard>
    )
  }

  const subtitle = fromLogin ? (
    <>
      Your account for <span className="font-semibold text-slate-800">{email}</span> has not been
      verified yet. Request a new verification email below, then check your inbox and click the
      link to activate your account.
    </>
  ) : (
    <>
      We sent a verification link to{' '}
      <span className="font-semibold text-slate-800">{email}</span>. Open the email and click{' '}
      <span className="font-medium text-slate-800">Verify email</span> to activate your account.
    </>
  )

const infoMessage = 'Did not receive the email? Check your spam folder or resend after the timer below.'

  return (
    <AuthCard
      title="Verify your email"
      subtitle={subtitle}
      badge={<MailCheck className="h-5 w-5" aria-hidden="true" />}
    >
      <AuthFormAlert variant="info">{infoMessage}</AuthFormAlert>

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
            {isSubmitting ? 'Sending...' : 'Resend verification email'}
          </button>
        )}

        <Link to={LOGIN_PAGE_LINK} className={`block text-center ${PRIMARY_BUTTON_CLASS}`}>
          Back to sign in
        </Link>
      </div>
    </AuthCard>
  )
}

export default VerifyEmailPage
