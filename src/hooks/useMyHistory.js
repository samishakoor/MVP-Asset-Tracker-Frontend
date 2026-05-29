import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Fetches paginated returned assignment history for the current employee
 * via GET /users/me/history.
 */
export function useMyHistory(params) {
  const page = params.page
  const limit = params.limit

  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: ['my-history', page, limit],
    queryFn: async () => {
      const response = await apiRequest(
        `/users/me/history?page=${page}&limit=${limit}`,
        { method: 'GET' },
      )
      return response.data
    },
  })

  return {
    history: data?.history ?? [],
    pagination: data?.pagination ?? null,
    isPending,
    isFetching,
    error,
    refetch,
  }
}
