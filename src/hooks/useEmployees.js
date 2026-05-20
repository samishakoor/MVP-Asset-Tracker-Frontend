import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'
import { UserRole } from '../constants/auth.js'

/**
 * Fetches all users and filters to employees only using React Query.
 */
export function useEmployees() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiRequest('/users', { method: 'GET' })
      return response.data
    },
  })

  const employees = data ? data.filter((user) => user.role === UserRole.EMPLOYEE) : []

  return {
    employees,
    isLoading,
    error,
  }
}
