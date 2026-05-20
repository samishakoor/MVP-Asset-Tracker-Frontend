import AssetStatusBadge from './AssetStatusBadge.jsx'

/**
 * Assignment history with nested support tickets on the asset detail page.
 */
function AssignmentHistoryList({ assignments }) {
  if (!assignments || assignments.length === 0) {
    return <p className="text-sm text-slate-600">No assignment history yet.</p>
  }

  return (
    <ul className="space-y-4">
      {assignments.map((assignment) => {
        const employeeName = assignment.employee ? assignment.employee.name : 'Unknown'
        const adminName = assignment.assignedByAdmin
          ? assignment.assignedByAdmin.name
          : 'Unknown'

        return (
          <li
            key={assignment.id}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">{employeeName}</p>
                <p className="text-xs text-slate-500">Assigned by {adminName}</p>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <AssetStatusBadge status={assignment.currentStatus} />
                <div className="text-xs text-slate-500 sm:text-right">
                  <p>Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}</p>
                  {assignment.acknowledgedAt && (
                    <p>Acknowledged: {new Date(assignment.acknowledgedAt).toLocaleDateString()}</p>
                  )}
                  {assignment.returnedAt && (
                    <p>Returned: {new Date(assignment.returnedAt).toLocaleDateString()}</p>
                  )}
                  <p className="mt-1 font-medium text-slate-700">
                    {assignment.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>

            {assignment.supportTickets && assignment.supportTickets.length > 0 && (
              <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                {assignment.supportTickets.map((ticket) => (
                  <li
                    key={ticket.id}
                    className="rounded-md bg-slate-50 p-3 text-sm"
                  >
                    <p className="font-medium text-slate-800">{ticket.description}</p>
                    <p className="mt-1 text-xs capitalize text-slate-500">
                      Status: {ticket.status.replace(/_/g, ' ')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default AssignmentHistoryList
