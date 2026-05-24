import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Custom React Query hook for soft-deleting an asset.
 * Asset must be in available status to be deleted.
 *
 * @returns {{ deleteAsset: Function, isDeleting: boolean }}
 */
export function useDeleteAsset() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (assetId) => {
      const response = await apiRequest(`/assets/${assetId}`, {
        method: 'DELETE',
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['admin-summary'] })
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] })
    },
  })

  return {
    deleteAsset: mutation.mutate,
    isDeleting: mutation.isPending,
  }
}
