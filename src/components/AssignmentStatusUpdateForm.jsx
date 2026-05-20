import { useState } from 'react'
import { ASSIGNMENT_STATUS_OPTIONS } from '../constants/assets.js'

/**
 * Form to update the current status of an active assignment on the asset detail page.
 */
function AssignmentStatusUpdateForm({ currentStatus, onSubmit, isSubmitting, error }) {
  const [status, setStatus] = useState(currentStatus)

  async function handleSubmit(event) {
    event.preventDefault()
    await onSubmit(status)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error.message}
        </div>
      )}

      <div>
        <label htmlFor="assignment-status" className="block text-sm font-medium text-slate-700">
          Current status
        </label>
        <select
          id="assignment-status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="input-material mt-1"
        >
          {ASSIGNMENT_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? 'Updating...' : 'Update status'}
      </button>
    </form>
  )
}

export default AssignmentStatusUpdateForm
