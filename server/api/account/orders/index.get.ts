import { defineEventHandler } from 'h3'
import { OrderService } from '../../../services/order.service'
import { getAuthenticatedCustomer } from '../../../utils/auth'
import { getAuthToken } from '../../../utils/session'

export default defineEventHandler(async (event) => {
  const customer = getAuthenticatedCustomer(event)
  const token = getAuthToken(event) ?? undefined
  return OrderService.getOrdersForCustomer(customer.id, token)
})
