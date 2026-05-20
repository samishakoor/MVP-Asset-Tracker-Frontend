import { useEffect, useState } from 'react'
import GlobalApiLoader from '../components/GlobalApiLoader.jsx'
import { getApiLoadingCount, subscribeApiLoading } from '../utils/apiLoading.js'

/**
 * Tracks in-flight API requests and shows GlobalApiLoader while any request is active.
 * Wrap the app shell in App.jsx so all apiRequest calls trigger the overlay.
 */
export function ApiLoadingProvider({ children }) {
  const [activeCount, setActiveCount] = useState(getApiLoadingCount)

  useEffect(() => {
    return subscribeApiLoading(setActiveCount)
  }, [])

  const isLoading = activeCount > 0

  return (
    <>
      {children}
      {isLoading ? <GlobalApiLoader /> : null}
    </>
  )
}
