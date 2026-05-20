import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Reviews a support ticket via PATCH /support-tickets/:id/review.
 * Returns mutateAsync so callers can await the result.
 */
export function useReviewTicket() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ ticketId, action, adminNotes }) => {
      const response = await apiRequest(`/support-tickets/${ticketId}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ action, adminNotes }),
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset'] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['admin-summary'] })
    },
  })

  return {
    reviewTicket: mutation.mutateAsync,
    isReviewing: mutation.isPending,
    error: mutation.error,
  }
}
