import { useAuthStore } from '../stores/auth.store'

export default defineNuxtRouteMiddleware(() => {
  const store = useAuthStore()

  if (store.isAuthenticated) {
    return navigateTo('/account')
  }
})
