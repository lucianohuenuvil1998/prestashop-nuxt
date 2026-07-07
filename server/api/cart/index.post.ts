import { defineEventHandler } from 'h3'
import { CartService } from '../../services/cart.service'
import { setCartId } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const cart = await CartService.createCart()
  setCartId(event, cart.id)
  return cart
})
