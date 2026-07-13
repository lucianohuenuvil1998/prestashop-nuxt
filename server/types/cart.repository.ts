/**
 * Contrato del repositorio del dominio Cart.
 *
 * Define las operaciones de acceso a datos del carrito sin conocer
 * si los datos vienen de memoria (mock) o de la API de PrestaShop.
 */

import type { Cart } from '~~/shared/types/cart.types'
import type { AddToCartPayload } from '~~/shared/types/api.types'

/** Datos del producto necesarios para mostrar el item en el carrito. */
export interface CartProductSnapshot {
  name: string
  slug: string
  image: string | null
  price: number
  sku: string
}

export interface ICartRepository {
  findById(cartId: string): Promise<Cart | null>
  create(): Promise<Cart>
  addItem(cartId: string, payload: AddToCartPayload, product: CartProductSnapshot): Promise<Cart>
  removeItem(cartId: string, itemId: number): Promise<Cart>
  updateItemQuantity(cartId: string, itemId: number, quantity: number): Promise<Cart>
}
