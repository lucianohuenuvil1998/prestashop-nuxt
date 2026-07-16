import { defineEventHandler, getRouterParam, createError } from 'h3'
import { OrderService } from '../../../services/order.service'
import { getAuthenticatedCustomer } from '../../../utils/auth'
import { getAuthToken } from '../../../utils/session'

export default defineEventHandler(async (event) => {
  const customer = getAuthenticatedCustomer(event)
  const idParam = getRouterParam(event, 'id')
  const orderId = Number(idParam)

  if (!idParam || Number.isNaN(orderId)) {
    throw createError({ statusCode: 400, statusMessage: 'ID de pedido inválido' })
  }

  const token = getAuthToken(event) ?? undefined
  return OrderService.getOrderById(orderId, customer.id, token)
})
