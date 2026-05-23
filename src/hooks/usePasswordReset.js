import { apiRequest } from '../utils/api.js'

const RESEND_COOLDOWN_SECONDS = 60

/**
 * Hook for forgot-password and reset-password API calls.
 *
 * @returns {{ requestPasswordReset: Function, resetPassword: Function, resendCooldownSeconds: number }}
 */
export function usePasswordReset() {
  async function requestPasswordReset(email) {
    const response = await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    return response.message
  }

  async function resetPassword(token, password, confirmPassword) {
    await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password, confirmPassword }),
    })
  }

  return {
    requestPasswordReset,
    resetPassword,
    resendCooldownSeconds: RESEND_COOLDOWN_SECONDS,
  }
}
