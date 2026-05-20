import TicketStatusBadge from './TicketStatusBadge.jsx'

/**
 * List item component for displaying a support ticket.
 * Props: ticket, onReview callback.
 */
function TicketListItem({ ticket, onReview }) {
  function handleReviewClick() {
    onReview(ticket)
  }

  const assetName = ticket.assignment?.asset?.name || 'Unknown Asset'
  const employeeName = ticket.assignment?.employee?.name || 'Unknown Employee'
  const createdDate = new Date(ticket.createdAt).toLocaleDateString()

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-slate-900">{assetName}</h3>
            <TicketStatusBadge status={ticket.status} />
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Reported by {employeeName} on {createdDate}
          </p>
          <p className="mt-2 text-sm text-slate-700">{ticket.description}</p>
          {ticket.adminNotes && (
            <div className="mt-2 rounded-md bg-slate-50 p-2">
              <p className="text-xs font-medium text-slate-700">Admin Notes:</p>
              <p className="text-xs text-slate-600">{ticket.adminNotes}</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleReviewClick}
          className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 sm:w-auto"
        >
          Review
        </button>
      </div>
    </div>
  )
}

export default TicketListItem
