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
import { getOptionalCustomer } from '../../utils/auth'
import { validateEmail, validateCheckoutAddress } from '~~/shared/validation/form.validation'
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

  const customer = getOptionalCustomer(event)

  if (customer) {
    if (!body.shippingAddressId || !body.billingAddressId) {
      throw createError({ statusCode: 400, statusMessage: 'Selecciona una dirección de entrega' })
    }
  }
  else {
    const emailError = validateEmail(body.guestEmail ?? '')
    if (emailError) {
      throw createError({ statusCode: 400, statusMessage: emailError })
    }
    const addressError = validateCheckoutAddress(body.guestAddress ?? {})
    if (addressError) {
      throw createError({ statusCode: 400, statusMessage: addressError })
    }
  }

  try {
    const order = await CheckoutService.placeOrder({
      cartId,
      shippingAddressId: body.shippingAddressId,
      billingAddressId: body.billingAddressId,
      shippingMethodId: body.shippingMethodId,
      paymentMethodId: body.paymentMethodId,
      guestEmail: body.guestEmail,
      guestAddress: body.guestAddress,
    }, customer)

    clearCartId(event)

    return order
  }
  catch (err) {
    const message = err instanceof Error ? err.message : 'Error al procesar el pedido'
    throw createError({ statusCode: 400, statusMessage: message })
  }
})
