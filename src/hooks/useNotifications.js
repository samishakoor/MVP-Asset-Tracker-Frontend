import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Fetches notifications for the authenticated employee.
 * Returns notifications array and unread count.
 * Uses react-query with key ['notifications'].
 */
export function useNotifications() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await apiRequest('/notifications', { method: 'GET' })
      return response.data
    },
    refetchInterval: 30000,
  })

  return {
    notifications: data?.notifications ?? [],
    unreadCount: data?.unreadCount ?? 0,
    isLoading,
    error,
    refetch,
  }
}
