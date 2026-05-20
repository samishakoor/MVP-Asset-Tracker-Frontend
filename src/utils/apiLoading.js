let activeRequestCount = 0
const listeners = new Set()

function notifyListeners() {
  listeners.forEach((listener) => {
    listener(activeRequestCount)
  })
}

/**
 * Returns the number of in-flight API requests.
 *
 * @returns {number}
 */
export function getApiLoadingCount() {
  return activeRequestCount
}

/**
 * Subscribes to changes in the global API loading count.
 *
 * @param {(count: number) => void} listener
 * @returns {() => void} Unsubscribe function.
 */
export function subscribeApiLoading(listener) {
  listeners.add(listener)
  return function unsubscribe() {
    listeners.delete(listener)
  }
}

/**
 * Marks the start of an API request for global loading UI.
 */
export function incrementApiLoading() {
  activeRequestCount += 1
  notifyListeners()
}

/**
 * Marks the end of an API request for global loading UI.
 */
export function decrementApiLoading() {
  if (activeRequestCount > 0) {
    activeRequestCount -= 1
  }
  notifyListeners()
}
