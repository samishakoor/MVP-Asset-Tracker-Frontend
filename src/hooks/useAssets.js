import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Builds query string from filter object.
 * Supports comma-separated status values (e.g., 'assigned,acknowledged')
 */
function buildQueryString(filters) {
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

  const query = params.toString()
  return query ? `?${query}` : ''
}

/**
 * Fetches the admin asset list with optional filters using React Query.
 */
export function useAssets(filters = {}) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['assets', filters],
    queryFn: async () => {
      const query = buildQueryString(filters)
      const response = await apiRequest(`/assets${query}`, { method: 'GET' })
      return response.data
    },
  })

  return {
    assets: data || [],
    isLoading,
    error,
    refetch,
  }
}
