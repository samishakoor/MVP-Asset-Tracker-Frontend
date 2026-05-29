import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Builds query string for paginated support tickets.
 */
function buildTicketsQueryString(params) {
  const searchParams = new URLSearchParams()
  searchParams.set('page', String(params.page))
  searchParams.set('limit', String(params.limit))

  if (params.status) {
    searchParams.set('status', params.status)
  }

  return `?${searchParams.toString()}`
}

/**
 * Fetches paginated support tickets via GET /support-tickets (admin).
 */
export function useTickets(params) {
  const page = params.page
  const limit = params.limit
  const status = params.status

  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: ['tickets', page, limit, status],
    queryFn: async () => {
      const query = buildTicketsQueryString({ page, limit, status })
      const response = await apiRequest(`/support-tickets${query}`, { method: 'GET' })
      return response.data
    },
  })

  return {
    tickets: data?.tickets ?? [],
    pagination: data?.pagination ?? null,
    statusCounts: data?.status_counts ?? null,
    isPending,
    isFetching,
    error,
    refetch,
  }
}
