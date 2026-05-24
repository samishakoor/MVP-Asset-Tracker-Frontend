/**
 * Labeled text input styled for authentication screens.
 * Used on login, signup, and forgot-password forms.
 */
function AuthTextField({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
  required,
  minLength,
  hint,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        value={value}
        onChange={onChange}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      />
      {hint ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}

export default AuthTextField
