import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { ToastType } from '../utils/toast.js'

/**
 * Toast notification container.
 * Listens for custom 'show-toast' events and displays notifications.
 * Mount once in App.jsx.
 */
function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    function handleShowToast(event) {
      const toast = event.detail
      setToasts((prev) => [...prev, toast])

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, 5000)
    }

    window.addEventListener('show-toast', handleShowToast)
    return () => window.removeEventListener('show-toast', handleShowToast)
  }, [])

  function dismissToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-start gap-2 p-4 sm:p-6">
      {toasts.map((toast) => {
        const Icon =
          toast.type === ToastType.SUCCESS
            ? CheckCircle
            : toast.type === ToastType.ERROR
              ? XCircle
              : Info

        const colorClasses =
          toast.type === ToastType.SUCCESS
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : toast.type === ToastType.ERROR
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'

        const iconColor =
          toast.type === ToastType.SUCCESS
            ? 'text-emerald-600'
            : toast.type === ToastType.ERROR
              ? 'text-red-600'
              : 'text-blue-600'

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border p-4 shadow-lg ${colorClasses}`}
          >
            <Icon className={`h-5 w-5 flex-shrink-0 ${iconColor}`} />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-black/5"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ToastContainer
