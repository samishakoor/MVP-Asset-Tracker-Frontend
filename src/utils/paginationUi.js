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

/**
 * Returns true when the paginated API reports no items at all.
 *
 * @param {object | null | undefined} pagination
 * @returns {boolean}
 */
export function isPaginationResultEmpty(pagination) {
  return pagination !== null && pagination !== undefined && pagination.total === 0
}
