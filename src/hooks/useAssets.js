import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Builds query string from filter object.
 * Supports comma-separated status values (e.g., 'assigned,acknowledged')
 */
function buildQueryString(filters, pagination) {
  const params = new URLSearchParams()

  if (filters.status) {
    const statuses = filters.status.split(',').map((s) => s.trim())
    if (statuses.length === 1) {
      params.set('status', statuses[0])
    } else {
      statuses.forEach((status) => params.append('status', status))
    }
  }
  if (filters.asset_type) {
    params.set('asset_type', filters.asset_type)
  }

  if (filters.employee_id) {
    params.set('employee_id', filters.employee_id)
  }

  if (filters.active_assignment) {
    params.set('active_assignment', filters.active_assignment)
  }

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (pagination.page !== undefined) {
    params.set('page', String(pagination.page))
  }

  if (pagination.limit !== undefined) {
    params.set('limit', String(pagination.limit))
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}

/**
 * Fetches the admin asset list with optional filters using React Query.
 * When page and limit are provided in options, returns paginated payload.
 */
export function useAssets(filters = {}, options = {}) {
  const page = options.page
  const limit = options.limit
  const isPaginated = page !== undefined && limit !== undefined

  const pagination = {
    page: page,
    limit: limit,
  }

  const { data, isPending, isFetching, isLoading, error, refetch } = useQuery({
    queryKey: ['assets', filters, page, limit],
    queryFn: async () => {
      const query = buildQueryString(filters, pagination)
      const response = await apiRequest(`/assets${query}`, { method: 'GET' })
      const responseData = response.data

      if (isPaginated) {
        return {
          assets: responseData.assets ?? [],
          pagination: responseData.pagination ?? null,
        }
      }

      return {
        assets: Array.isArray(responseData) ? responseData : [],
        pagination: null,
      }
    },
  })

  return {
    assets: data?.assets ?? [],
    pagination: data?.pagination ?? null,
    isPending: isPaginated ? isPending : isLoading,
    isFetching,
    isLoading,
    error,
    refetch,
  }
}
