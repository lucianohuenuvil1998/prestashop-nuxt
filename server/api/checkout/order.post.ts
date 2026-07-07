/**
 * POST /api/checkout/order
 *
 * Confirma el pedido con el carrito activo.
 * Requiere: shippingMethodId, paymentMethodId, shippingAddressId, billingAddressId.
 *
 * En Phase 2 (mock): construye la Order desde el carrito en memoria
 * y elimina la cookie cart_id al finalizar.
 */

import { defineEventHandler, readBody, createError } from 'h3'
import { CheckoutService } from '../../services/checkout.service'
import { getCartId, clearCartId } from '../../utils/session'
import type { PlaceOrderPayload } from '~~/shared/types/api.types'

export default defineEventHandler(async (event) => {
  const cartId = getCartId(event)

  if (!cartId) {
    throw createError({ statusCode: 400, statusMessage: 'No hay carrito activo' })
  }

  const body = await readBody<Omit<PlaceOrderPayload, 'cartId'>>(event)

  if (!body?.shippingMethodId || !body?.paymentMethodId) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan datos de checkout' })
  }

  const order = await CheckoutService.placeOrder({
    cartId,
    shippingAddressId: body.shippingAddressId ?? 1,
    billingAddressId: body.billingAddressId ?? 1,
    shippingMethodId: body.shippingMethodId,
    paymentMethodId: body.paymentMethodId,
  })

  // La orden fue creada — borrar la cookie para que el cliente inicie un carrito nuevo
  clearCartId(event)

  return order
})
