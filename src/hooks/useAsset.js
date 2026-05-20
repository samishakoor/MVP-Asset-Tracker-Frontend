import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Fetches a single asset with full history by id using React Query.
 */
export function useAsset(assetId) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['asset', assetId],
    queryFn: async () => {
      if (!assetId) {
        throw new Error('Asset ID is required')
      }
      const response = await apiRequest(`/assets/${assetId}`, { method: 'GET' })
      return response.data
    },
    enabled: Boolean(assetId),
  })

  return {
    asset: data,
    isLoading,
    error,
    refetch,
  }
}
