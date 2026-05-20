/**
 * Simple toast notification system.
 * Dispatches custom events that ToastContainer listens to.
 */

export const ToastType = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
}

/**
 * Shows a toast notification.
 */
export function showToast(message, type = ToastType.INFO) {
  const event = new CustomEvent('show-toast', {
    detail: {
      message,
      type,
      id: Date.now(),
    },
  })
  window.dispatchEvent(event)
}

/**
 * Convenience methods for different toast types.
 */
export const toast = {
  success: (message) => showToast(message, ToastType.SUCCESS),
  error: (message) => showToast(message, ToastType.ERROR),
  info: (message) => showToast(message, ToastType.INFO),
}
