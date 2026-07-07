import type { Cart } from '~~/shared/types/cart.types'
import type { AddToCartPayload } from '~~/shared/types/api.types'
import { PrestashopClient } from './prestashop.client'
import { toCart } from './mappers/cart.mapper'
import type { PSCartResponse } from './prestashop.types'

export const CartAdapter = {
  async fetchCart(cartId: string): Promise<Cart> {
    const raw = await PrestashopClient.get<PSCartResponse>(`/carts/${cartId}`)
    return toCart(raw)
  },

  async createCart(): Promise<Cart> {
    const raw = await PrestashopClient.post<PSCartResponse>('/carts')
    return toCart(raw)
  },

  async addItem(cartId: string, payload: AddToCartPayload): Promise<Cart> {
    const raw = await PrestashopClient.post<PSCartResponse>(`/carts/${cartId}/items`, {
      id_product: payload.productId,
      id_product_attribute: payload.variantId ?? 0,
      quantity: payload.quantity,
    })
    return toCart(raw)
  },

  async removeItem(cartId: string, itemId: number): Promise<Cart> {
    const raw = await PrestashopClient.delete<PSCartResponse>(`/carts/${cartId}/items/${itemId}`)
    return toCart(raw)
  },

  async updateItemQuantity(cartId: string, itemId: number, quantity: number): Promise<Cart> {
    const raw = await PrestashopClient.put<PSCartResponse>(`/carts/${cartId}/items/${itemId}`, {
      quantity,
    })
    return toCart(raw)
  },
}
