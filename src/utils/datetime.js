import { AssetStatus } from '../constants/assets.js'

/**
 * Formats a date string to relative time (e.g., "2 hours ago", "3 days ago").
 */
export function formatRelativeTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`
}

/**
 * Formats an event type string to a human-readable label.
 */
export function formatEventType(eventType) {
  const labels = {
    registered: 'Registered',
    assigned: 'Assigned',
    acknowledged: 'Acknowledged',
    returned: 'Returned',
    ticket_opened: 'Ticket Opened',
    repair_started: 'Repair Started',
    repair_completed: 'Repair Completed',
  }
  return labels[eventType] || eventType
}

/**
 * Formats the day difference between two dates as a human-readable duration label.
 *
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @returns {string}
 */
function formatDayDuration(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffInMs = end - start
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return 'Same day'
  }
  if (diffInDays === 1) {
    return '1 day'
  }
  return `${diffInDays} days`
}

/**
 * Calculates duration between two dates and returns a human-readable string.
 */
export function calculateDuration(startDate, endDate) {
  if (!endDate) {
    return 'Active'
  }

  return formatDayDuration(startDate, endDate)
}

/**
 * Calculates assignment duration from acknowledgment until return or today.
 * Shows an em dash when the assignment is still available/assigned (not acknowledged).
 *
 * @param {string|null|undefined} acknowledgedAt
 * @param {string|null|undefined} returnedAt
 * @param {string} currentStatus
 * @returns {string}
 */
export function calculateAcknowledgedAssignmentDuration(
  acknowledgedAt,
  returnedAt,
  currentStatus
) {
  if (currentStatus === AssetStatus.AVAILABLE || currentStatus === AssetStatus.ASSIGNED) {
    return '—'
  }

  if (!acknowledgedAt) {
    return '—'
  }

  const endDate = returnedAt ? returnedAt : new Date().toISOString()
  return formatDayDuration(acknowledgedAt, endDate)
}

/**
 * Formats a date to readable string (e.g., "May 20, 2026")
 */
export function formatDate(dateString) {
  if (!dateString) {
    return '—'
  }
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Formats a date with time (e.g., "May 20, 2026 10:30 AM")
 */
export function formatDateTime(dateString) {
  if (!dateString) {
    return '—'
  }
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
