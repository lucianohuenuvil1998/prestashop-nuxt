import { defineEventHandler, getRouterParam, createError } from 'h3'
import { CartService } from '../../../services/cart.service'
import { getCartId } from '../../../utils/session'

export default defineEventHandler(async (event) => {
  const cartId = getCartId(event)

  if (!cartId) {
    throw createError({ statusCode: 400, statusMessage: 'No active cart' })
  }

  const itemId = getRouterParam(event, 'id')

  if (!itemId) {
    throw createError({ statusCode: 400, statusMessage: 'Item ID is required' })
  }

  return CartService.removeItem(cartId, Number(itemId))
})
