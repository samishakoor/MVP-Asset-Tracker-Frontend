/**
 * Decodes the payload segment of a JWT access token.
 *
 * @param {string} token - JWT string from the API.
 * @returns {object} Parsed payload object.
 */
export function parseAccessTokenPayload(token) {
  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new Error('Invalid sign-in token')
  }

  const base64Url = parts[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const json = atob(base64)

  return JSON.parse(json)
}
