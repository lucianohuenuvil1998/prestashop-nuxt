import { defineEventHandler, readBody, createError } from 'h3'
import { CartService } from '../../../services/cart.service'
import { getCartId } from '../../../utils/session'
import type { AddToCartPayload } from '~~/shared/types/api.types'

export default defineEventHandler(async (event) => {
  const cartId = getCartId(event)

  if (!cartId) {
    throw createError({ statusCode: 400, statusMessage: 'No active cart. Create one first.' })
  }

  const body = await readBody<AddToCartPayload>(event)

  if (!body?.productId || !body?.quantity) {
    throw createError({ statusCode: 400, statusMessage: 'productId and quantity are required' })
  }

  return CartService.addItem(cartId, body)
})
