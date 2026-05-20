import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Assigns an asset to an employee via POST /api/assignments using React Query.
 */
export function useAssignAsset() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await apiRequest('/assignments', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['admin-summary'] })
    },
  })

  return {
    assignAsset: mutation.mutate,
    isSubmitting: mutation.isPending,
    error: mutation.error,
  }
}
