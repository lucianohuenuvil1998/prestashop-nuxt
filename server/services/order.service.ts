/**
 * OrderService — lógica de negocio para consulta de pedidos.
 *
 * Phase 2: usa mockOrderStore en memoria.
 * Phase 3: reemplazar por PrestashopOrderRepository.
 */

import type { Order } from '~~/shared/types/order.types'
import { createError } from 'h3'
import { mockOrderStore } from '../repositories/mock/mock-order.store'

export const OrderService = {
  async getOrdersForCustomer(customerId: number): Promise<Order[]> {
    return mockOrderStore.findByCustomerId(customerId)
  },

  async getOrderById(orderId: number, customerId: number): Promise<Order> {
    const order = mockOrderStore.findByIdForCustomer(orderId, customerId)

    if (!order) {
      throw createError({ statusCode: 404, statusMessage: 'Pedido no encontrado' })
    }

    return order
  },
}
