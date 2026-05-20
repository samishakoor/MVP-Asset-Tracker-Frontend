import { useState, useEffect } from 'react'
import { X, CheckCircle } from 'lucide-react'
import { useReviewTicket } from '../hooks/useReviewTicket.js'
import { TICKET_ACTION_OPTIONS, TICKET_ACTIONS } from '../constants/tickets.js'

/**
 * Modal for reviewing a support ticket.
 * Shows ticket details (read-only), an action select, and admin notes textarea.
 * Props:
 *   isOpen       — controls visibility
 *   onClose      — called when modal should close
 *   ticket       — the ticket object to review
 *   initialAction — pre-selected action value (e.g. TICKET_ACTIONS.RESOLVE)
 *   onSuccess    — called after a successful review submission
 */
function ReviewTicketModal({ isOpen, onClose, ticket, initialAction, onSuccess }) {
  const [action, setAction] = useState(initialAction ?? TICKET_ACTIONS.RESOLVE)
  const [adminNotes, setAdminNotes] = useState('')
  const [submitError, setSubmitError] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const { reviewTicket, isReviewing } = useReviewTicket()

  useEffect(() => {
    if (isOpen) {
      setAction(initialAction ?? TICKET_ACTIONS.RESOLVE)
      setAdminNotes('')
      setSubmitError(null)
      setShowSuccess(false)
    }
  }, [isOpen, initialAction])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError(null)

    try {
      await reviewTicket({ ticketId: ticket.id, action, adminNotes })
      setShowSuccess(true)
      onSuccess()
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (err) {
      setSubmitError(err.message || 'Failed to review ticket. Please try again.')
    }
  }

  function handleClose() {
    if (isReviewing) return
    setAdminNotes('')
    setSubmitError(null)
    setShowSuccess(false)
    onClose()
  }

  if (!isOpen || !ticket) {
    return null
  }

  const assetName = ticket.assignment?.asset?.name ?? 'Unknown Asset'
  const serialNumber = ticket.assignment?.asset?.serialNumber
  const employeeName = ticket.assignment?.employee?.name ?? 'Unknown Employee'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Review Ticket</h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isReviewing}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            {/* Success */}
            {showSuccess && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Ticket reviewed successfully.
              </div>
            )}

            {/* Error */}
            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            {/* Ticket details (read-only) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Asset</p>
                <p className="mt-0.5 text-sm font-medium text-slate-900">
                  {assetName}
                  {serialNumber && (
                    <span className="ml-1.5 font-normal text-slate-500">({serialNumber})</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Employee</p>
                <p className="mt-0.5 text-sm text-slate-900">{employeeName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Issue Description</p>
                <p className="mt-0.5 text-sm text-slate-900">{ticket.description}</p>
              </div>
            </div>

            {/* Action select */}
            <div>
              <label htmlFor="reviewAction" className="block text-sm font-medium text-slate-700">
                Action <span className="text-red-500">*</span>
              </label>
              <select
                id="reviewAction"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                disabled={isReviewing || showSuccess}
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-500"
              >
                {TICKET_ACTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin notes */}
            <div>
              <label htmlFor="adminNotes" className="block text-sm font-medium text-slate-700">
                Admin Notes <span className="text-slate-400 text-xs font-normal">(optional)</span>
              </label>
              <textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                disabled={isReviewing || showSuccess}
                rows={3}
                maxLength={2000}
                placeholder="Add any notes or comments..."
                className="mt-1.5 block w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isReviewing}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isReviewing || showSuccess}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
            >
              {isReviewing ? 'Submitting…' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewTicketModal
