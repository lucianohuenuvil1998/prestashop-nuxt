import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { CartService } from '../../../services/cart.service'
import { getCartId } from '../../../utils/session'

export default defineEventHandler(async (event) => {
  const cartId = getCartId(event)
  if (!cartId) throw createError({ statusCode: 400, statusMessage: 'No active cart' })

  const itemId = getRouterParam(event, 'id')
  if (!itemId) throw createError({ statusCode: 400, statusMessage: 'Item ID is required' })

  const body = await readBody<{ quantity: number }>(event)
  if (body?.quantity === undefined || body.quantity < 0) {
    throw createError({ statusCode: 400, statusMessage: 'quantity must be a non-negative number' })
  }

  return CartService.updateItemQuantity(cartId, Number(itemId), body.quantity)
})
