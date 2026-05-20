import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Modal } from './index.js'

/**
 * Modal dialog for reviewing support tickets.
 * Shows action dropdown (start_repair, resolve) and admin notes textarea.
 */
function ReviewTicketDialog({ isOpen, onClose, onConfirm, isReviewing }) {
  const [action, setAction] = useState('resolve')
  const [adminNotes, setAdminNotes] = useState('')

  function handleConfirm() {
    onConfirm({ action, adminNotes: adminNotes.trim() || undefined })
  }

  function handleClose() {
    setAction('resolve')
    setAdminNotes('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Review Support Ticket">
      <div className="space-y-4">
        {/* Action Selection */}
        <div>
          <label htmlFor="review-action" className="block text-sm font-medium text-slate-700">
            Action <span className="text-red-500">*</span>
          </label>
          <select
            id="review-action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            disabled={isReviewing}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
          >
            <option value="resolve">Resolve</option>
            <option value="start_repair">Start Repair</option>
          </select>
        </div>

        {/* Admin Notes */}
        <div>
          <label htmlFor="admin-notes" className="block text-sm font-medium text-slate-700">
            Admin Notes
          </label>
          <textarea
            id="admin-notes"
            rows={4}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            disabled={isReviewing}
            placeholder="Add any notes about this review..."
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isReviewing}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isReviewing}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isReviewing && <Loader2 className="h-4 w-4 animate-spin" />}
            {isReviewing ? 'Reviewing...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ReviewTicketDialog
