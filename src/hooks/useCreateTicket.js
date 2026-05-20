import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Creates a support ticket via POST /support-tickets.
 * Invalidates ['my-assets'] and ['employee-asset'] queries on success.
 */
export function useCreateTicket() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ assignmentId, description }) => {
      const response = await apiRequest('/support-tickets', {
        method: 'POST',
        body: JSON.stringify({ assignmentId, description }),
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-assets'] })
      queryClient.invalidateQueries({ queryKey: ['employee-asset'] })
    },
  })

  return {
    createTicket: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    error: mutation.error,
  }
}
