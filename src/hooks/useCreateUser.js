import { useCallback, useState } from 'react'
import { apiRequest } from '../utils/api.js'

/**
 * Creates a new user (admin or employee) via POST /users.
 * Admin-only endpoint.
 */
export function useCreateUser() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const createUser = useCallback(async (payload) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(payload),
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
    createUser,
    isSubmitting,
    error,
  }
}
