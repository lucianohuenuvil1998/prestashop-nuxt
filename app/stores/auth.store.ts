import { defineStore } from 'pinia'

interface CustomerSnapshot {
  id: number
  email: string
  firstName: string
  lastName: string
}

interface AuthState {
  customer: CustomerSnapshot | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    customer: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => state.customer !== null,
    fullName: (state): string => {
      if (!state.customer) return ''
      return `${state.customer.firstName} ${state.customer.lastName}`.trim()
    },
  },

  actions: {
    setSession(customer: CustomerSnapshot): void {
      this.customer = customer
    },

    clearSession(): void {
      this.customer = null
    },
  },
})
