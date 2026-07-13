/**
 * Servicio del dominio Cart.
 *
 * Responsabilidad: orquestar las operaciones del repositorio y aplicar
 * reglas de negocio del carrito (ej: cantidad mínima, stock disponible).
 *
 * No conoce HTTP ni PS. Depende de ICartRepository vía el proveedor.
 */

import type { Cart } from '~~/shared/types/cart.types'
import type { AddToCartPayload } from '~~/shared/types/api.types'
import { cartRepository, productRepository } from '../repositories'

export const CartService = {
  async getCart(cartId: string): Promise<Cart | null> {
    return cartRepository.findById(cartId)
  },

  async createCart(): Promise<Cart> {
    return cartRepository.create()
  },

  async addItem(cartId: string, payload: AddToCartPayload): Promise<Cart> {
    // Si el cliente ya envió el snapshot, lo usamos directamente (sin llamar a PS).
    const snapshot = payload.snapshot ?? await (async () => {
      const product = await productRepository.findById(payload.productId)
      if (!product) throw new Error(`Producto ${payload.productId} no encontrado`)

      const variant = payload.variantId
        ? (product.variants.find(v => v.id === payload.variantId) ?? null)
        : null

      return {
        name: product.name,
        slug: product.slug,
        image: product.images[0]?.url ?? null,
        price: variant?.price ?? product.price,
        sku: variant?.sku ?? product.sku,
      }
    })()

    return cartRepository.addItem(cartId, payload, snapshot)
  },

  async removeItem(cartId: string, itemId: number): Promise<Cart> {
    return cartRepository.removeItem(cartId, itemId)
  },

  async updateItemQuantity(cartId: string, itemId: number, quantity: number): Promise<Cart> {
    return cartRepository.updateItemQuantity(cartId, itemId, quantity)
  },
}
