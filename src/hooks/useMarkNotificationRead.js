import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'

/**
 * Marks a single notification as read via PATCH /notifications/:id/read.
 * Invalidates ['notifications'] on success.
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (notificationId) => {
      const response = await apiRequest(`/notifications/${notificationId}/read`, {
        method: 'PATCH',
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  return {
    markAsRead: mutation.mutateAsync,
    isMarking: mutation.isPending,
    markError: mutation.error,
  }
}
