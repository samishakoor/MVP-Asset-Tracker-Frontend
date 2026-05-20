/**
 * Color-coded badge for displaying ticket status.
 * Used in ticket lists and detail views.
 */
function TicketStatusBadge({ status }) {
  const statusStyles = {
    open: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
  }

  const statusLabels = {
    open: 'Open',
    under_review: 'Under Review',
    resolved: 'Resolved',
  }

  const colorClass = statusStyles[status] || 'bg-slate-100 text-slate-800'
  const label = statusLabels[status] || status

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  )
}

export default TicketStatusBadge
