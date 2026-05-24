import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * Password input with show/hide toggle.
 * Used on auth screens (login, signup, reset password).
 */
function PasswordInput({
  id,
  label,
  value,
  onChange,
  autoComplete,
  required,
  minLength,
  hint,
}) {
  const [showPassword, setShowPassword] = useState(false)

  function handleTogglePasswordVisibility() {
    setShowPassword((prev) => !prev)
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-4 pr-10 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
        <button
          type="button"
          onClick={handleTogglePasswordVisibility}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {hint ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}

export default PasswordInput
