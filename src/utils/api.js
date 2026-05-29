import { AUTH_ERROR_MESSAGE } from '../constants/auth.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function clearAuthSessionAndNotify() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.dispatchEvent(new CustomEvent('auth-session-expired'))
}

/**
 * Performs an HTTP request to the asset tracker API.
 *
 * @param {string} path - API path (e.g. /auth/login).
 * @param {RequestInit} options - Fetch options.
 * @returns {Promise<object>} Parsed JSON response body.
 */
export async function apiRequest(path, options) {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured')
  }

  const url = `${API_BASE_URL}${path}`
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const token = localStorage.getItem('token')
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const body = await response.json()

  if (!response.ok) {
    const message = body.message || `Request failed with status ${response.status}`

    if (response.status === 403 && message === AUTH_ERROR_MESSAGE.EMAIL_NOT_VERIFIED) {
      clearAuthSessionAndNotify()
    }

    if (
      response.status === 401 &&
      token &&
      message === AUTH_ERROR_MESSAGE.ACCESS_TOKEN_EXPIRED
    ) {
      clearAuthSessionAndNotify()
    }

    throw new Error(message)
  }

  return body
}
