import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Creates a new asset via POST /assets.
 * Invalidates asset list and admin summary caches on success.
 */
export function useCreateAsset() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await apiRequest('/assets', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['asset-types'] })
      queryClient.invalidateQueries({ queryKey: ['admin-summary'] })
    },
  })

  return {
    createAsset: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    error: mutation.error,
  }
}
