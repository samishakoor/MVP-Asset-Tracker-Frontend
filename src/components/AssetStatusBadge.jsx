/**
 * Color-coded badge for asset lifecycle status.
 * Used on asset list and detail screens.
 */
function AssetStatusBadge({ status }) {
  let badgeClasses = 'bg-slate-100 text-slate-700'
  let label = status

  if (status === 'available') {
    badgeClasses = 'bg-emerald-100 text-emerald-800'
    label = 'Available'
  } else if (status === 'assigned') {
    badgeClasses = 'bg-amber-100 text-amber-800'
    label = 'Assigned'
  } else if (status === 'acknowledged') {
    badgeClasses = 'bg-blue-100 text-blue-800'
    label = 'Acknowledged'
  } else if (status === 'pending_review') {
    badgeClasses = 'bg-orange-100 text-orange-800'
    label = 'Pending IT Review'
  } else if (status === 'under_repair') {
    badgeClasses = 'bg-red-100 text-red-800'
    label = 'Under Repair'
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClasses}`}>
      {label}
    </span>
  )
}

export default AssetStatusBadge
