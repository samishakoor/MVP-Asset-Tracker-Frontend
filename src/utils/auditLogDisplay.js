/**
 * Builds human-readable title and description lines for audit log entries.
 * Avoids fragmented "by / to / for" attribution chips in the UI.
 */

/**
 * @typedef {{ text: string, bold: boolean }} AuditLogTitlePart
 */

/**
 * @param {string} text
 * @param {boolean} bold
 * @returns {AuditLogTitlePart}
 */
function titlePart(text, bold) {
  return { text, bold }
}

/**
 * @param {string|undefined} name
 * @returns {boolean}
 */
function isBoldName(name) {
  return name !== undefined && name !== ''
}

/**
 * Returns title segments so only asset and employee names are emphasized in the UI.
 *
 * @param {string} eventType
 * @param {string} assetName
 * @param {string} triggeredByName
 * @param {string|null|undefined} targetEmployeeName
 * @returns {AuditLogTitlePart[]}
 */
export function getAuditLogTitleParts(
  eventType,
  assetName,
  triggeredByName,
  targetEmployeeName,
) {
  const asset = assetName || 'Asset'
  const assetBold = isBoldName(assetName)
  const employeeBold = isBoldName(targetEmployeeName)
  const actorBold = isBoldName(triggeredByName)

  if (eventType === 'registered') {
    return [titlePart(asset, assetBold), titlePart(' has been added to inventory', false)]
  }

  if (eventType === 'deleted') {
    return [titlePart(asset, assetBold), titlePart(' has been removed from inventory', false)]
  }

  if (eventType === 'assigned') {
    if (targetEmployeeName) {
      return [
        titlePart(asset, assetBold),
        titlePart(' has been assigned to ', false),
        titlePart(targetEmployeeName, employeeBold),
      ]
    }
    return [titlePart(asset, assetBold), titlePart(' has been assigned', false)]
  }

  if (eventType === 'assignment_cancelled') {
    if (targetEmployeeName) {
      return [
        titlePart('Assignment of ', false),
        titlePart(asset, assetBold),
        titlePart(' has been cancelled for ', false),
        titlePart(targetEmployeeName, employeeBold),
      ]
    }
    return [
      titlePart('Assignment of ', false),
      titlePart(asset, assetBold),
      titlePart(' has been cancelled', false),
    ]
  }

  if (eventType === 'acknowledged') {
    return [
      titlePart(triggeredByName, actorBold),
      titlePart(' has acknowledged ', false),
      titlePart(asset, assetBold),
    ]
  }

  if (eventType === 'ticket_opened') {
    return [
      titlePart('A support ticket has been opened for ', false),
      titlePart(asset, assetBold),
    ]
  }

  if (eventType === 'repair_started') {
    return [titlePart(asset, assetBold), titlePart(' has been marked under repair', false)]
  }

  if (eventType === 'repair_completed') {
    return [
      titlePart('Repair has been completed for ', false),
      titlePart(asset, assetBold),
    ]
  }

  if (eventType === 'returned') {
    if (targetEmployeeName) {
      return [
        titlePart(targetEmployeeName, employeeBold),
        titlePart(' has returned ', false),
        titlePart(asset, assetBold),
      ]
    }
    return [titlePart(asset, assetBold), titlePart(' has been returned', false)]
  }

  if (targetEmployeeName) {
    return [
      titlePart(asset, assetBold),
      titlePart(' has been updated for ', false),
      titlePart(targetEmployeeName, employeeBold),
    ]
  }

  return [titlePart(asset, assetBold), titlePart(' has been updated', false)]
}

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
  return getAuditLogTitleParts(
    eventType,
    assetName,
    triggeredByName,
    targetEmployeeName,
  )
    .map((part) => part.text)
    .join('')
}

/**
 * Returns description segments with the actionee name lightly emphasized.
 *
 * @param {string} eventType
 * @param {string} triggeredByName
 * @param {string|null|undefined} targetEmployeeName
 * @returns {AuditLogTitlePart[]}
 */
export function getAuditLogDescriptionParts(
  eventType,
  triggeredByName,
  targetEmployeeName,
) {
  const actorBold = isBoldName(triggeredByName)
  const employeeBold = isBoldName(targetEmployeeName)

  if (eventType === 'registered') {
    return [
      titlePart('Registered by ', false),
      titlePart(triggeredByName, actorBold),
    ]
  }

  if (eventType === 'deleted') {
    return [
      titlePart('Removed by ', false),
      titlePart(triggeredByName, actorBold),
    ]
  }

  if (eventType === 'assigned') {
    return [
      titlePart('Assigned by ', false),
      titlePart(triggeredByName, actorBold),
    ]
  }

  if (eventType === 'assignment_cancelled') {
    return [
      titlePart('Cancelled by ', false),
      titlePart(triggeredByName, actorBold),
    ]
  }

  if (eventType === 'acknowledged') {
    return [titlePart('Receipt confirmed', false)]
  }

  if (eventType === 'ticket_opened') {
    return [
      titlePart('Reported by ', false),
      titlePart(triggeredByName, actorBold),
    ]
  }

  if (eventType === 'repair_started') {
    if (targetEmployeeName) {
      return [
        titlePart('Started by ', false),
        titlePart(triggeredByName, actorBold),
        titlePart(' · Assigned to ', false),
        titlePart(targetEmployeeName, employeeBold),
      ]
    }
    return [
      titlePart('Started by ', false),
      titlePart(triggeredByName, actorBold),
    ]
  }

  if (eventType === 'repair_completed') {
    if (targetEmployeeName) {
      return [
        titlePart('Completed by ', false),
        titlePart(triggeredByName, actorBold),
        titlePart(' · Assigned to ', false),
        titlePart(targetEmployeeName, employeeBold),
      ]
    }
    return [
      titlePart('Completed by ', false),
      titlePart(triggeredByName, actorBold),
    ]
  }

  if (eventType === 'returned') {
    return [
      titlePart('Recorded by ', false),
      titlePart(triggeredByName, actorBold),
    ]
  }

  if (targetEmployeeName) {
    return [
      titlePart(targetEmployeeName, employeeBold),
      titlePart(' · ', false),
      titlePart(triggeredByName, actorBold),
    ]
  }

  return [titlePart(triggeredByName, actorBold)]
}

/**
 * @param {string} eventType
 * @param {string} triggeredByName
 * @param {string|null|undefined} targetEmployeeName
 * @returns {string}
 */
export function formatAuditLogDescription(eventType, triggeredByName, targetEmployeeName) {
  return getAuditLogDescriptionParts(eventType, triggeredByName, targetEmployeeName)
    .map((part) => part.text)
    .join('')
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
