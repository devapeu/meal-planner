import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const VITE_API_URL = import.meta.env.VITE_API_URL

interface User {
  id: number
  username: string
  email: string
}

interface AuthResponse {
  token: string
  user: User
}

interface ErrorResponse {
  error: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const user = ref<User | null>(null)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  function setAuthData(authData: AuthResponse) {
    token.value = authData.token
    user.value = authData.user
    localStorage.setItem('auth_token', authData.token)
    error.value = null
  }

  function clearAuthData() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    error.value = null
  }

  async function register(username: string, password: string, email: string = '') {
    try {
      const response = await fetch(`${VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        error.value = (data as ErrorResponse).error || 'Registration failed'
        return false
      }

      setAuthData(data as AuthResponse)
      return true
    } catch (err) {
      error.value = 'Network error during registration'
      return false
    }
  }

  async function login(username: string, password: string) {
    try {
      const response = await fetch(`${VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        error.value = (data as ErrorResponse).error || 'Login failed'
        return false
      }

      setAuthData(data as AuthResponse)
      return true
    } catch (err) {
      error.value = 'Network error during login'
      return false
    }
  }

  async function logout() {
    if (!token.value) {
      clearAuthData()
      return
    }

    try {
      await fetch(`${VITE_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token.value}`,
        },
      })
    } catch (err) {
      console.error('Logout request failed:', err)
    } finally {
      clearAuthData()
    }
  }

  async function getCurrentUser() {
    if (!token.value) {
      return false
    }

    try {
      const response = await fetch(`${VITE_API_URL}/auth/user`, {
        headers: {
          'Authorization': `Token ${token.value}`,
        },
      })

      if (!response.ok) {
        clearAuthData()
        return false
      }

      const data = await response.json()
      user.value = data.user
      return true
    } catch (err) {
      error.value = 'Failed to fetch user data'
      return false
    }
  }

  function getAuthHeaders() {
    if (!token.value) {
      return {}
    }
    return {
      'Authorization': `Token ${token.value}`,
    }
  }

  return {
    token,
    user,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    getCurrentUser,
    getAuthHeaders,
  }
})
