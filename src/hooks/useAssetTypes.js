import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '../utils/api.js'
import { ASSET_TYPE_OPTIONS } from '../constants/assets.js'

const FALLBACK_TYPES = ASSET_TYPE_OPTIONS.map((option) => option.value)

/**
 * Fetches default and custom asset types from GET /assets/types.
 * Uses react-query with key ['asset-types'].
 * Falls back to default types when the API is unavailable.
 */
export function useAssetTypes() {
  const { data: types, isLoading, error } = useQuery({
    queryKey: ['asset-types'],
    queryFn: async () => {
      const response = await apiRequest('/assets/types', { method: 'GET' })
      return response.data
    },
  })

  const allTypes = useMemo(() => {
    if (!types) {
      return FALLBACK_TYPES
    }

    if (Array.isArray(types.all) && types.all.length > 0) {
      return types.all
    }

    if (Array.isArray(types.custom) && types.custom.length > 0) {
      return [...new Set([...FALLBACK_TYPES, ...types.custom])].sort()
    }

    return FALLBACK_TYPES
  }, [types])

  return {
    types,
    allTypes,
    isLoading,
    error,
  }
}
