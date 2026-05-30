import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { AuthContext } from './authContext.js'
import { apiRequest } from '../utils/api.js'
import { parseAccessTokenPayload } from '../utils/jwt.js'
import { UserRole } from '../constants/auth.js'

function getStoredAuth() {
  const token = localStorage.getItem('token')
  const userRaw = localStorage.getItem('user')

  if (!token || !userRaw) {
    return { user: null, isAuthenticated: false }
  }

  try {
    const user = JSON.parse(userRaw)
    if (user.isVerified === false) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return { user: null, isAuthenticated: false }
    }
    return { user, isAuthenticated: true }
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return { user: null, isAuthenticated: false }
  }
}

function authReducer(state, action) {
  if (action.type === 'SET_USER') {
    return { ...state, user: action.payload, isAuthenticated: Boolean(action.payload) }
  }
  if (action.type === 'LOGOUT') {
    return { ...state, user: null, isAuthenticated: false }
  }
  throw new Error(`Unknown auth action: ${action.type}`)
}

const initialAuthState = getStoredAuth()

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
  }, [])

  useEffect(function listenForSessionExpiry() {
    function handleSessionExpired() {
      logout()
    }

    window.addEventListener('auth-session-expired', handleSessionExpired)

    return function cleanup() {
      window.removeEventListener('auth-session-expired', handleSessionExpired)
    }
  }, [logout])

  const persistAuth = useCallback((user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    dispatch({ type: 'SET_USER', payload: user })
  }, [])

  const login = useCallback(async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    const { user, token } = response.data
    persistAuth(user, token)
    return user
  }, [persistAuth])

  const loginWithGoogleToken = useCallback(async (token) => {
    const payload = parseAccessTokenPayload(token)

    if (!payload.id || !payload.email || !payload.name || !payload.roles || payload.roles.length === 0) {
      throw new Error('Invalid sign-in token')
    }

    const user = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.roles[0],
      isVerified: true,
    }

    persistAuth(user, token)
    return user
  }, [persistAuth])

  const signup = useCallback(async (name, email, password) => {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })

    return response.data.user
  }, [])

  const isAdmin = state.user !== null && state.user.role === UserRole.ADMIN
  const isEmployee = state.user !== null && state.user.role === UserRole.EMPLOYEE

  const value = useMemo(
    () => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isAdmin,
      isEmployee,
      login,
      loginWithGoogleToken,
      signup,
      logout,
      setUser(user) {
        dispatch({ type: 'SET_USER', payload: user })
      },
    }),
    [state.user, state.isAuthenticated, isAdmin, isEmployee, login, loginWithGoogleToken, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
