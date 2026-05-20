import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Fetches returned assignment history for the current employee
 * via GET /users/me/history.
 * Uses react-query with key ['my-history'].
 */
export function useMyHistory() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['my-history'],
    queryFn: async () => {
      const response = await apiRequest('/users/me/history', { method: 'GET' })
      return response.data
    },
  })

  return {
    history: data ?? [],
    isLoading,
    error,
    refetch,
  }
}
