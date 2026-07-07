/**
 * Contrato del repositorio del dominio Cart.
 *
 * Define las operaciones de acceso a datos del carrito sin conocer
 * si los datos vienen de memoria (mock) o de la API de PrestaShop.
 */

import type { Cart } from '~~/shared/types/cart.types'
import type { AddToCartPayload } from '~~/shared/types/api.types'

export interface ICartRepository {
  findById(cartId: string): Promise<Cart | null>
  create(): Promise<Cart>
  addItem(cartId: string, payload: AddToCartPayload): Promise<Cart>
  removeItem(cartId: string, itemId: number): Promise<Cart>
  updateItemQuantity(cartId: string, itemId: number, quantity: number): Promise<Cart>
}
