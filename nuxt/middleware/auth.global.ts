import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // If user is not authenticated and trying to access protected pages
  if (!authStore.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

  // If user is authenticated and tries to visit login page
  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})
