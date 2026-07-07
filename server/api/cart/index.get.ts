import { defineEventHandler, createError } from 'h3'
import { CartService } from '../../services/cart.service'
import { getCartId } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const cartId = getCartId(event)

  if (!cartId) {
    throw createError({ statusCode: 404, statusMessage: 'No active cart' })
  }

  return CartService.getCart(cartId)
})
