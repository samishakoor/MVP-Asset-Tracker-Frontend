import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Marks all notifications as read via PATCH /notifications/read-all.
 * Invalidates ['notifications'] on success.
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/notifications/read-all', {
        method: 'PATCH',
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  return {
    markAllAsRead: mutation.mutateAsync,
    isMarkingAll: mutation.isPending,
    markAllError: mutation.error,
  }
}
