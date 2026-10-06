import { useAuthStore } from '~/stores/auth'

export const useApi = () => {
  const authStore = useAuthStore()

  const getApiBase = () => {
    const config = useRuntimeConfig()
    return config.public.apiBaseUrl || 'http://127.0.0.1:3001'
  }

  const fetchWithAuth = async <T>(url: string, options: any = {}): Promise<T> => {
    const apiBase = getApiBase()
    const headers: Record<string, string> = {
      ...(options.headers || {})
    }

    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    try {
      const finalUrl = url.startsWith('http') ? url : `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`
      return await $fetch<T>(finalUrl, {
        ...options,
        headers
      })
    } catch (err: any) {
      if (err?.status === 401) {
        authStore.logout()
      }
      throw err
    }
  }

  return {
    fetchWithAuth,
    getApiBase
  }
}
