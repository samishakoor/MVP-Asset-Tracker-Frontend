import { useCallback, useState } from 'react'
import { apiRequest } from '../utils/api.js'

/**
 * Deletes an asset via DELETE /assets/:id.
 */
export function useDeleteAsset() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const deleteAsset = useCallback(async (assetId) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await apiRequest(`/assets/${assetId}`, {
        method: 'DELETE',
      })
      return response.data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return {
    deleteAsset,
    isSubmitting,
    error,
  }
}
