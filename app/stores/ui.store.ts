import { defineStore } from 'pinia'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface UiState {
  isCartDrawerOpen: boolean
  isMobileMenuOpen: boolean
  toasts: Toast[]
  isGlobalLoading: boolean
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    isCartDrawerOpen: false,
    isMobileMenuOpen: false,
    toasts: [],
    isGlobalLoading: false,
  }),

  actions: {
    openCartDrawer(): void {
      this.isCartDrawerOpen = true
    },

    closeCartDrawer(): void {
      this.isCartDrawerOpen = false
    },

    toggleMobileMenu(): void {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },

    addToast(message: string, type: ToastType = 'info'): void {
      const id = crypto.randomUUID()
      this.toasts.push({ id, message, type })
      setTimeout(() => this.removeToast(id), 4000)
    },

    removeToast(id: string): void {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },

    setGlobalLoading(value: boolean): void {
      this.isGlobalLoading = value
    },
  },
})
