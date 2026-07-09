/**
 * GET /api/account/orders
 *
 * Devuelve el historial de pedidos del cliente autenticado.
 */

import { defineEventHandler } from 'h3'
import { OrderService } from '../../../services/order.service'
import { getAuthenticatedCustomer } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const customer = getAuthenticatedCustomer(event)
  return OrderService.getOrdersForCustomer(customer.id)
})
