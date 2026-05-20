/**
 * Admin dashboard summary stats grid and recent events list.
 * Used on AdminDashboardPage; receives summary data via props.
 */
function AdminSummaryStats({ summary }) {
  const statCards = [
    { label: 'Total Assets', value: summary.total_assets },
    { label: 'Available', value: summary.available },
    { label: 'Assigned', value: summary.assigned },
    { label: 'Under Repair', value: summary.under_repair },
    { label: 'Pending Review', value: summary.pending_review },
    { label: 'Open Tickets', value: summary.open_tickets },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium text-slate-500 sm:text-sm">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-medium text-slate-900">Assets per Employee</h2>
          {summary.assets_per_employee.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No active assignments.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {summary.assets_per_employee.map((row) => (
                <li
                  key={row.employee_id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-slate-900">{row.name}</span>
                  <span className="text-slate-600">{row.asset_count} assets</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-medium text-slate-900">Recent Events</h2>
          {summary.recent_events.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No events yet.</p>
          ) : (
            <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto">
              {summary.recent_events.map((event) => (
                <li
                  key={event.id}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm"
                >
                  <p className="font-medium text-slate-900">{event.asset_name}</p>
                  <p className="mt-1 capitalize text-slate-600">
                    {event.event_type.replace(/_/g, ' ')} · {event.triggered_by_name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(event.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default AdminSummaryStats
