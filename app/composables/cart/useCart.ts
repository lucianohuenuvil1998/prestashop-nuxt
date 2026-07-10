import type { Cart } from '~~/shared/types/cart.types'
import type { AddToCartPayload } from '~~/shared/types/api.types'
import { useCartStore } from '../../stores/cart.store'
import { useUiStore } from '../../stores/ui.store'

export function useCart() {
  const cartStore = useCartStore()
  const uiStore = useUiStore()

  /** Intenta cargar el carrito existente desde la cookie de sesión. */
  async function init(): Promise<void> {
    try {
      const cart = await $fetch<Cart>('/api/cart')
      cartStore.setCart(cart)
    }
    catch {
      // Sin carrito activo — se creará al agregar el primer producto
    }
  }

  /** Crea un nuevo carrito y guarda el ID en cookie (lo hace el servidor). */
  async function ensureCart(): Promise<void> {
    if (cartStore.cartId) return
    const cart = await $fetch<Cart>('/api/cart', { method: 'POST' })
    cartStore.setCart(cart)
  }

  async function addItem(payload: AddToCartPayload): Promise<void> {
    await ensureCart()
    const cart = await $fetch<Cart>('/api/cart/items', {
      method: 'POST',
      body: payload,
    })
    cartStore.setCart(cart)
    uiStore.openCartDrawer()
    uiStore.addToast('Producto agregado al carrito', 'success')
  }

  async function removeItem(itemId: number): Promise<void> {
    const cart = await $fetch<Cart>(`/api/cart/items/${itemId}`, {
      method: 'DELETE',
    })
    cartStore.setCart(cart)
    uiStore.addToast('Producto eliminado del carrito', 'info')
  }

  async function updateQuantity(itemId: number, quantity: number): Promise<void> {
    const cart = await $fetch<Cart>(`/api/cart/items/${itemId}`, {
      method: 'PUT',
      body: { quantity },
    })
    cartStore.setCart(cart)
  }

  return {
    cart: computed(() => cartStore.cart),
    items: computed(() => cartStore.cart?.items ?? []),
    totals: computed(() => cartStore.cart?.totals ?? null),
    itemCount: computed(() => cartStore.itemCount),
    total: computed(() => cartStore.total),
    currency: computed(() => cartStore.currency),
    isEmpty: computed(() => cartStore.isEmpty),
    init,
    addItem,
    removeItem,
    updateQuantity,
  }
}
