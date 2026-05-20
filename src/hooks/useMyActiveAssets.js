import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Fetches active assignments for the current employee via GET /users/me/assets.
 * Uses react-query with key ['my-assets'].
 */
export function useMyActiveAssets() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['my-assets'],
    queryFn: async () => {
      const response = await apiRequest('/users/me/assets', { method: 'GET' })
      return response.data
    },
  })

  return {
    assignments: data ?? [],
    isLoading,
    error,
    refetch,
  }
}
