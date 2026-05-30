/**
 * Returns the backend URL that starts the Google OAuth login flow.
 *
 * @returns {string}
 */
export function getGoogleLoginUrl() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured')
  }

  return `${apiBaseUrl}/auth/google/login`
}
