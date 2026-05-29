/**
 * Builds human-readable title and description lines for audit log entries.
 * Avoids fragmented "by / to / for" attribution chips in the UI.
 */

/**
 * @param {string} eventType
 * @param {string} assetName
 * @param {string} triggeredByName
 * @param {string|null|undefined} targetEmployeeName
 * @returns {string}
 */
export function formatAuditLogTitle(
  eventType,
  assetName,
  triggeredByName,
  targetEmployeeName,
) {
  const asset = assetName || 'Asset'

  if (eventType === 'registered') {
    return `${asset} added to inventory`
  }

  if (eventType === 'deleted') {
    return `${asset} removed from inventory`
  }

  if (eventType === 'assigned') {
    if (targetEmployeeName) {
      return `${asset} assigned to ${targetEmployeeName}`
    }
    return `${asset} assigned`
  }

  if (eventType === 'assignment_cancelled') {
    if (targetEmployeeName) {
      return `Assignment cancelled for ${targetEmployeeName}`
    }
    return `Assignment cancelled for ${asset}`
  }

  if (eventType === 'acknowledged') {
    return `${triggeredByName} acknowledged ${asset}`
  }

  if (eventType === 'ticket_opened') {
    return `Support ticket opened for ${asset}`
  }

  if (eventType === 'repair_started') {
    return `${asset} marked under repair`
  }

  if (eventType === 'repair_completed') {
    return `Repair completed for ${asset}`
  }

  if (eventType === 'returned') {
    if (targetEmployeeName) {
      return `${targetEmployeeName} returned ${asset}`
    }
    return `${asset} returned`
  }

  if (targetEmployeeName) {
    return `${asset} · ${targetEmployeeName}`
  }

  return asset
}

/**
 * @param {string} eventType
 * @param {string} triggeredByName
 * @param {string|null|undefined} targetEmployeeName
 * @returns {string}
 */
export function formatAuditLogDescription(eventType, triggeredByName, targetEmployeeName) {
  if (eventType === 'registered') {
    return `Registered by ${triggeredByName}`
  }

  if (eventType === 'deleted') {
    return `Removed by ${triggeredByName}`
  }

  if (eventType === 'assigned') {
    return `Assigned by ${triggeredByName}`
  }

  if (eventType === 'assignment_cancelled') {
    return `Cancelled by ${triggeredByName}`
  }

  if (eventType === 'acknowledged') {
    return 'Receipt confirmed'
  }

  if (eventType === 'ticket_opened') {
    return `Reported by ${triggeredByName}`
  }

  if (eventType === 'repair_started') {
    if (targetEmployeeName) {
      return `Started by ${triggeredByName} · Assigned to ${targetEmployeeName}`
    }
    return `Started by ${triggeredByName}`
  }

  if (eventType === 'repair_completed') {
    if (targetEmployeeName) {
      return `Completed by ${triggeredByName} · Assigned to ${targetEmployeeName}`
    }
    return `Completed by ${triggeredByName}`
  }

  if (eventType === 'returned') {
    return `Recorded by ${triggeredByName}`
  }

  if (targetEmployeeName) {
    return `${targetEmployeeName} · ${triggeredByName}`
  }

  return triggeredByName
}

export const AUDIT_EVENT_TYPE_LABELS = {
  registered: 'Registered',
  deleted: 'Removed',
  assigned: 'Assignment',
  assignment_cancelled: 'Cancelled',
  acknowledged: 'Acknowledged',
  ticket_opened: 'Support',
  repair_started: 'Repair',
  repair_completed: 'Resolved',
  returned: 'Return',
}

export const AUDIT_EVENT_STYLES = {
  registered: {
    icon: 'text-slate-600 bg-slate-100',
    badge: 'bg-slate-50 text-slate-700 ring-slate-600/10',
  },
  deleted: {
    icon: 'text-red-600 bg-red-100',
    badge: 'bg-red-50 text-red-700 ring-red-600/10',
  },
  assigned: {
    icon: 'text-emerald-600 bg-emerald-100',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  },
  assignment_cancelled: {
    icon: 'text-amber-600 bg-amber-100',
    badge: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  },
  acknowledged: {
    icon: 'text-blue-600 bg-blue-100',
    badge: 'bg-blue-50 text-blue-700 ring-blue-600/10',
  },
  ticket_opened: {
    icon: 'text-amber-600 bg-amber-100',
    badge: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  },
  repair_started: {
    icon: 'text-purple-600 bg-purple-100',
    badge: 'bg-purple-50 text-purple-700 ring-purple-600/10',
  },
  repair_completed: {
    icon: 'text-emerald-600 bg-emerald-100',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  },
  returned: {
    icon: 'text-slate-600 bg-slate-100',
    badge: 'bg-slate-50 text-slate-700 ring-slate-600/10',
  },
}

export const DEFAULT_AUDIT_EVENT_STYLES = {
  icon: 'text-slate-600 bg-slate-100',
  badge: 'bg-slate-50 text-slate-700 ring-slate-600/10',
}
