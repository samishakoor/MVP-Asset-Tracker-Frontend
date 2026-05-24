import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Fetches paginated audit logs via GET /admin/audit-logs using React Query.
 *
 * @param {object} params
 * @param {number} params.page - Page number (1-indexed)
 * @param {number} params.limit - Items per page
 */
export function useAuditLogs(params) {
  const { page, limit } = params

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['audit-logs', page, limit],
    queryFn: async () => {
      const response = await apiRequest(
        `/admin/audit-logs?page=${page}&limit=${limit}`,
        { method: 'GET' }
      )
      return response.data
    },
  })

  return {
    events: data?.events || [],
    pagination: data?.pagination || null,
    isLoading,
    isFetching,
    error,
    refetch,
  }
}
