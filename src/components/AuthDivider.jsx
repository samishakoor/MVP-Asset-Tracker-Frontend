/**
 * Horizontal divider with centered label for auth screens.
 * Used between email/password forms and social login actions.
 */
function AuthDivider({ label }) {
  return (
    <div className="relative my-6 sm:my-7" aria-hidden="true">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </span>
      </div>
    </div>
  )
}

export default AuthDivider
