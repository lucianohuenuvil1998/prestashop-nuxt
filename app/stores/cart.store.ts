import { defineStore } from 'pinia'
import type { Cart } from '~~/shared/types/cart.types'

interface CartState {
  cart: Cart | null
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    cart: null,
  }),

  getters: {
    cartId: (state): string | null => state.cart?.id ?? null,
    itemCount: (state): number => state.cart?.itemCount ?? 0,
    total: (state): number => state.cart?.totals.total ?? 0,
    currency: (state): string => state.cart?.totals.currency ?? 'USD',
    isEmpty: (state): boolean => (state.cart?.itemCount ?? 0) === 0,
  },

  actions: {
    setCart(cart: Cart): void {
      this.cart = cart
    },

    clearCart(): void {
      this.cart = null
    },
  },
})
