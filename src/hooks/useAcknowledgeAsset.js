import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Acknowledges an assignment via PATCH /assignments/:id/acknowledge.
 * Invalidates ['my-assets'] on success so the dashboard refreshes.
 */
export function useAcknowledgeAsset() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (assignmentId) => {
      const response = await apiRequest(`/assignments/${assignmentId}/acknowledge`, {
        method: 'PATCH',
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-assets'] })
    },
  })

  return {
    acknowledgeAsset: mutation.mutateAsync,
    isAcknowledging: mutation.isPending,
    acknowledgeError: mutation.error,
  }
}
