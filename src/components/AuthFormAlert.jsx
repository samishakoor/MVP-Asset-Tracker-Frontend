const VARIANT_STYLES = {
  error: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
}

/**
 * Inline alert for auth forms — error, info, or success messaging.
 * Used on login, signup, reset password, and verify email screens.
 */
function AuthFormAlert({ variant, children }) {
  const styles = VARIANT_STYLES[variant]

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  )
}

export default AuthFormAlert
