/**
 * Universal status badge component for assets, support tickets, and event types.
 * Maps status values to colors and labels with a clean pill design.
 * Used across lists, detail views, tables, and timelines.
 */
function Badge({ status }) {
  const statusConfig = {
    // Asset statuses
    available: {
      color: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20',
      label: 'Available',
    },
    assigned: {
      color: 'bg-amber-100 text-amber-800 ring-1 ring-amber-600/20',
      label: 'Assigned',
    },
    acknowledged: {
      color: 'bg-blue-100 text-blue-800 ring-1 ring-blue-600/20',
      label: 'Acknowledged',
    },
    pending_review: {
      color: 'bg-orange-100 text-orange-800 ring-1 ring-orange-600/20',
      label: 'Pending Review',
    },
    under_repair: {
      color: 'bg-red-100 text-red-800 ring-1 ring-red-600/20',
      label: 'Under Repair',
    },
    // Ticket statuses
    open: {
      color: 'bg-orange-100 text-orange-800 ring-1 ring-orange-600/20',
      label: 'Open',
    },
    under_review: {
      color: 'bg-amber-100 text-amber-800 ring-1 ring-amber-600/20',
      label: 'Under Review',
    },
    resolved: {
      color: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20',
      label: 'Resolved',
    },
    // Event types
    registered: {
      color: 'bg-slate-100 text-slate-800 ring-1 ring-slate-600/20',
      label: 'Registered',
    },
    returned: {
      color: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20',
      label: 'Returned',
    },
    ticket_opened: {
      color: 'bg-orange-100 text-orange-800 ring-1 ring-orange-600/20',
      label: 'Ticket Opened',
    },
    repair_started: {
      color: 'bg-red-100 text-red-800 ring-1 ring-red-600/20',
      label: 'Repair Started',
    },
    repair_completed: {
      color: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20',
      label: 'Repair Completed',
    },
  }

  const config = statusConfig[status] || {
    color: 'bg-slate-100 text-slate-700 ring-1 ring-slate-600/20',
    label: status,
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  )
}

export default Badge
