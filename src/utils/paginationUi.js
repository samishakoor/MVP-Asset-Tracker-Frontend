/**
 * Returns true when the current page likely has a full batch (use viewport-filling list height).
 *
 * @param {number} itemCount
 * @param {number} pageSize
 * @returns {boolean}
 */
export function isPaginatedPageFull(itemCount, pageSize) {
  return itemCount >= pageSize
}
