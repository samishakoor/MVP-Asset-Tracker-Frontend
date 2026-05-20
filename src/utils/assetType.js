/**
 * Formats an asset type slug for display (defaults keep friendly labels).
 *
 * @param {string} value - Stored asset type value.
 * @returns {string}
 */
export function formatAssetTypeLabel(value) {
  if (value === '') {
    return ''
  }

  const knownLabels = {
    laptop: 'Laptop',
    monitor: 'Monitor',
    accessory: 'Accessory',
    other: 'Other',
  }

  if (knownLabels[value]) {
    return knownLabels[value]
  }

  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

/**
 * Normalizes typed asset type input before submit or custom selection.
 *
 * @param {string} raw - Raw user input.
 * @returns {string}
 */
export function normalizeAssetTypeInput(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '')
}
