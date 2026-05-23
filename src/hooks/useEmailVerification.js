import { apiRequest } from '../utils/api.js'

const RESEND_COOLDOWN_SECONDS = 60

/**
 * Hook for email verification API calls.
 *
 * @returns {{ sendVerificationEmail: Function, verifyEmail: Function, resendCooldownSeconds: number }}
 */
export function useEmailVerification() {
  async function sendVerificationEmail(email) {
    const response = await apiRequest('/auth/send-verification-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    return response.message
  }

  async function verifyEmail(token) {
    const response = await apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
    return response.message
  }

  return {
    sendVerificationEmail,
    verifyEmail,
    resendCooldownSeconds: RESEND_COOLDOWN_SECONDS,
  }
}
