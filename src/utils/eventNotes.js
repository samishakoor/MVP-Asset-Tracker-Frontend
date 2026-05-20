/**
 * Returns a human-readable label for event notes based on event type.
 *
 * @param {string} eventType - Asset event type slug.
 * @returns {string}
 */
export function getEventNoteLabel(eventType) {
  const labels = {
    ticket_opened: 'Issue reported',
    repair_completed: 'Repair notes',
    repair_started: 'Repair notes',
  }

  if (labels[eventType]) {
    return labels[eventType]
  }

  return 'Notes'
}

/**
 * Visual variant key for note callout styling by event type.
 *
 * @param {string} eventType - Asset event type slug.
 * @returns {'ticket' | 'repair' | 'admin' | 'default'}
 */
export function getEventNoteVariant(eventType) {
  if (eventType === 'ticket_opened') {
    return 'ticket'
  }

  if (eventType === 'repair_started' || eventType === 'repair_completed') {
    return 'repair'
  }

  return 'default'
}

/**
 * Whether trimmed notes text should be shown in the UI.
 *
 * @param {string|null|undefined} notes - Raw notes from an asset event.
 * @returns {boolean}
 */
export function hasEventNotes(notes) {
  if (notes === null || notes === undefined) {
    return false
  }

  return notes.trim() !== ''
}
