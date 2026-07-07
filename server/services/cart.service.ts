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
import { cartRepository } from '../repositories'

export const CartService = {
  async getCart(cartId: string): Promise<Cart | null> {
    return cartRepository.findById(cartId)
  },

  async createCart(): Promise<Cart> {
    return cartRepository.create()
  },

  async addItem(cartId: string, payload: AddToCartPayload): Promise<Cart> {
    return cartRepository.addItem(cartId, payload)
  },

  async removeItem(cartId: string, itemId: number): Promise<Cart> {
    return cartRepository.removeItem(cartId, itemId)
  },

  async updateItemQuantity(cartId: string, itemId: number, quantity: number): Promise<Cart> {
    return cartRepository.updateItemQuantity(cartId, itemId, quantity)
  },
}
