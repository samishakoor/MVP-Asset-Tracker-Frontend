import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Cancels an unacknowledged assignment via PATCH /api/assignments/:id/cancel.
 */
export function useCancelAssignment() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (assignmentId) => {
      const response = await apiRequest(`/assignments/${assignmentId}/cancel`, {
        method: 'PATCH',
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset'] })
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['admin-summary'] })
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] })
    },
  })

  return {
    cancelAssignment: mutation.mutate,
    isCancelling: mutation.isPending,
    error: mutation.error,
  }
}
