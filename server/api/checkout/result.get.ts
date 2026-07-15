/**
 * GET /api/checkout/result?orderId=X
 *
 * Devuelve los datos del pedido para la página de resultado post-pago.
 * No requiere autenticación — el usuario puede llegar desde un gateway externo
 * sin sesión activa.
 *
 * Al integrar PS real, validar con un token firmado que Webpay/PS devuelvan
 * en la URL de retorno para evitar acceso no autorizado a pedidos ajenos.
 */

import { defineEventHandler, getQuery, createError } from 'h3'
import { mockOrderStore } from '../../repositories/mock/mock-order.store'

export default defineEventHandler((event) => {
  const { orderId } = getQuery(event)

  if (!orderId) {
    throw createError({ statusCode: 400, statusMessage: 'orderId es requerido' })
  }

  const id = Number(orderId)
  if (Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'orderId inválido' })
  }

  const order = mockOrderStore.findById(id)
  if (!order) {
    throw createError({ statusCode: 404, statusMessage: 'Pedido no encontrado' })
  }

  return order
})
