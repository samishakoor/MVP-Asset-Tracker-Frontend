/**
 * Card shell for authentication screens — title, subtitle, and optional footer.
 * Used inside AuthLayout on login, signup, and password flows.
 */
function AuthCard({ title, subtitle, children, footer, badge }) {
  return (
    <div className="w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
        <div className="border-b border-slate-100 bg-linear-to-br from-emerald-50 via-white to-white px-6 py-7 sm:px-8 sm:py-8">
          {badge ? (
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              {badge}
            </div>
          ) : null}
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{subtitle}</p>
          ) : null}
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-7">{children}</div>

        {footer ? (
          <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-4 text-center sm:px-8">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default AuthCard
