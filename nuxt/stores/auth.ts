import { defineStore } from 'pinia'
import type { PilotProfile, LoginResponse } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('susi_auth_token', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax'
  })

  const user = ref<{ username: string; name: string } | null>(null)
  const profile = ref<PilotProfile | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const getApiBase = () => {
    const config = useRuntimeConfig()
    return config.public.apiBaseUrl || 'http://127.0.0.1:3001'
  }

  async function login(username: string, password: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const apiBase = getApiBase()
      const response = await $fetch<LoginResponse>(`${apiBase}/auth/login`, {
        method: 'POST',
        body: { username, password }
      })

      if (response && response.access_token) {
        token.value = response.access_token
        user.value = response.user || { username, name: 'Capt. John Doe' }
        await fetchProfile()
        return true
      }
      return false
    } catch (err: any) {
      console.error('Login error:', err)
      error.value = err?.data?.message || err?.message || 'Invalid username or password. Please check your credentials.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProfile(): Promise<void> {
    if (!token.value) return

    try {
      const apiBase = getApiBase()
      const data = await $fetch<PilotProfile>(`${apiBase}/pilot/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      profile.value = data
    } catch (err: any) {
      console.error('Fetch profile error:', err)
      if (err?.status === 401) {
        logout()
      }
    }
  }

  function logout() {
    token.value = null
    user.value = null
    profile.value = null
    navigateTo('/login')
  }

  return {
    token,
    user,
    profile,
    isLoading,
    error,
    isAuthenticated,
    login,
    fetchProfile,
    logout
  }
})
