import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Returns an asset assignment via PATCH /api/assignments/:id/return.
 */
export function useReturnAsset() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (assignmentId) => {
      const response = await apiRequest(`/assignments/${assignmentId}/return`, {
        method: 'PATCH',
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset'] })
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['admin-summary'] })
    },
  })

  return {
    returnAsset: mutation.mutate,
    isReturning: mutation.isPending,
    error: mutation.error,
  }
}
