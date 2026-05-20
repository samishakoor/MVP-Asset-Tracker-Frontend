import { useState } from 'react'
import { useCreateTicket } from '../hooks/useCreateTicket.js'

/**
 * Modal for creating a support ticket for an assignment.
 * Props: isOpen, onClose, assignmentId, onSuccess.
 */
function CreateTicketModal({ isOpen, onClose, assignmentId, onSuccess }) {
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)

  const { createTicket, isSubmitting } = useCreateTicket()

  function handleDescriptionChange(event) {
    setDescription(event.target.value)
    setError(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    if (!description.trim()) {
      setError('Please describe the issue')
      return
    }

    try {
      await createTicket({
        assignmentId,
        description: description.trim(),
      })
      setDescription('')
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create ticket')
    }
  }

  function handleClose() {
    setDescription('')
    setError(null)
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Report Issue</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                Describe the issue
              </label>
              <textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                disabled={isSubmitting}
                rows={5}
                maxLength={2000}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100"
                placeholder="Describe the problem with the asset..."
                required
              />
              <p className="mt-1 text-xs text-slate-500">{description.length}/2000 characters</p>
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
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTicketModal
