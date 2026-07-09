import type { LoginCredentials, RegisterPayload, Customer } from '~~/shared/types/customer.types'
import { useAuthStore } from '../../stores/auth.store'

export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()

  async function login(credentials: LoginCredentials): Promise<void> {
    const session = await $fetch<Pick<Customer, 'id' | 'email' | 'firstName' | 'lastName'>>(
      '/api/auth/login',
      { method: 'POST', body: credentials },
    )
    store.setSession(session)
  }

  async function register(payload: RegisterPayload): Promise<void> {
    const session = await $fetch<Pick<Customer, 'id' | 'email' | 'firstName' | 'lastName'>>(
      '/api/auth/register',
      { method: 'POST', body: payload },
    )
    store.setSession(session)
  }

  async function logout(): Promise<void> {
    await $fetch('/api/auth/logout', { method: 'POST' })
    store.clearSession()
    await router.push('/')
  }

  async function fetchCurrentUser(): Promise<void> {
    try {
      const customer = await $fetch<Customer>('/api/auth/me')
      store.setSession({
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      })
    }
    catch {
      store.clearSession()
    }
  }

  return {
    isAuthenticated: computed(() => store.isAuthenticated),
    customer: computed(() => store.customer),
    login,
    register,
    logout,
    fetchCurrentUser,
  }
}
