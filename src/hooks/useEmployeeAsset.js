import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Fetches the detail of a specific asset assigned to the current employee
 * via GET /users/me/assets/:assetId.
 * Uses react-query with key ['employee-asset', assetId].
 * Returns null data when the asset is not found (404).
 *
 * @param {string} assetId - Asset UUID from route params.
 */
export function useEmployeeAsset(assetId) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['employee-asset', assetId],
    queryFn: async () => {
      const response = await apiRequest(`/users/me/assets/${assetId}`, { method: 'GET' })
      return response.data
    },
    retry: (failureCount, err) => {
      if (err?.message?.toLowerCase().includes('not found')) return false
      return failureCount < 2
    },
  })

  return {
    asset: data ?? null,
    isLoading,
    error,
    refetch,
  }
}
