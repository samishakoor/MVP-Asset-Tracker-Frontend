import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Updates an existing asset via PUT /assets/:id.
 * Invalidates the asset list and the individual asset cache on success.
 */
export function useUpdateAsset() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ assetId, payload }) => {
      const response = await apiRequest(`/assets/${assetId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
      return response.data
    },
    onSuccess: (_, { assetId }) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['asset', assetId] })
      queryClient.invalidateQueries({ queryKey: ['asset-types'] })
    },
  })

  return {
    updateAsset: (assetId, payload) => mutation.mutateAsync({ assetId, payload }),
    isSubmitting: mutation.isPending,
    error: mutation.error,
  }
}
