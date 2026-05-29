import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Fetches paginated notifications for the authenticated employee.
 * Returns notifications array, unread count, and pagination metadata.
 *
 * @param {object} params
 * @param {number} params.page - Page number (1-indexed)
 * @param {number} params.limit - Notifications per page
 */
export function useNotifications(params) {
  const { page, limit } = params

  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: async () => {
      const response = await apiRequest(
        `/notifications?page=${page}&limit=${limit}`,
        { method: 'GET' }
      )
      return response.data
    },
    refetchInterval: 30000,
  })

  return {
    notifications: data?.notifications ?? [],
    unreadCount: data?.unreadCount ?? 0,
    pagination: data?.pagination || null,
    isPending,
    isFetching,
    error,
    refetch,
  }
}
