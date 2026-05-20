import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Fetches all support tickets via GET /support-tickets (admin).
 * Uses react-query with key ['tickets'].
 */
export function useTickets() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const response = await apiRequest('/support-tickets', { method: 'GET' })
      return response.data
    },
  })

  return {
    tickets: data ?? [],
    isLoading,
    error,
    refetch,
  }
}
