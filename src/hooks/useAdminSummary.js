import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Fetches admin dashboard summary via GET /admin/summary using React Query.
 */
export function useAdminSummary() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-summary'],
    queryFn: async () => {
      const response = await apiRequest('/admin/summary', { method: 'GET' })
      return response.data
    },
  })

  return {
    summary: data,
    isLoading,
    error,
    refetch,
  }
}
