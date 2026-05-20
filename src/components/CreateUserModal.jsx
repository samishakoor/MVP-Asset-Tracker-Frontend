import { useState } from 'react'
import { useCreateUser } from '../hooks/useCreateUser.js'
import { UserRole } from '../constants/auth.js'

/**
 * Modal for admins to create new users (admin or employee accounts).
 * Props: isOpen, onClose, onSuccess.
 */
function CreateUserModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(UserRole.EMPLOYEE)
  const [error, setError] = useState(null)

  const { createUser, isSubmitting } = useCreateUser()

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    try {
      await createUser({
        name,
        email,
        password,
        role,
      })
      setName('')
      setEmail('')
      setPassword('')
      setRole(UserRole.EMPLOYEE)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create user')
    }
  }

  function handleClose() {
    setName('')
    setEmail('')
    setPassword('')
    setRole(UserRole.EMPLOYEE)
    setError(null)
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Create User</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] overflow-y-auto p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="user-name" className="block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  id="user-name"
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="user-email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="user-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="user-password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="user-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <p className="mt-1 text-xs text-slate-500">Minimum 6 characters</p>
              </div>

              <div>
                <label htmlFor="user-role" className="block text-sm font-medium text-slate-700">
                  Role
                </label>
                <select
                  id="user-role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value={UserRole.EMPLOYEE}>Employee</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateUserModal
