import { useCallback, useState } from 'react'
import { apiRequest } from '../utils/api.js'

/**
 * Updates assignment current status via PATCH /assignments/:id/status.
 */
export function useUpdateAssignmentStatus() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const updateAssignmentStatus = useCallback(async (assignmentId, currentStatus) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await apiRequest(`/assignments/${assignmentId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ currentStatus }),
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
    updateAssignmentStatus,
    isSubmitting,
    error,
  }
}
