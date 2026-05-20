import AuditEventRow from './AuditEventRow.jsx'

/**
 * Chronological audit log for asset lifecycle events on the detail page.
 */
function AssetHistoryTimeline({ events }) {
  if (!events || events.length === 0) {
    return <p className="text-sm text-slate-600">No audit events yet.</p>
  }

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="divide-y divide-slate-200">
        {sortedEvents.map((event) => (
          <AuditEventRow
            key={event.id}
            eventType={event.eventType}
            createdAt={event.createdAt}
            triggeredByName={event.trigger ? event.trigger.name : 'System'}
            targetEmployeeName={event.targetEmployee?.name}
            notes={event.notes}
            showAssetName={false}
          />
        ))}
      </div>
    </div>
  )
}

export default AssetHistoryTimeline
