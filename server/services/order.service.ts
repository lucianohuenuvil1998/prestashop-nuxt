/**
 * OrderService — lógica de negocio para consulta de pedidos.
 *
 * Cuando USE_PRESTASHOP=true: delega en el módulo headlessapi de PS.
 * En modo mock: usa mockOrderStore en memoria.
 */

import type { Order, Address, OrderStatus } from '~~/shared/types/order.types'
import { createError } from 'h3'
import { mockOrderStore } from '../repositories/mock/mock-order.store'
import { haGet } from '../lib/headlessapi/client'

const useHeadlessApi = process.env.USE_PRESTASHOP === 'true'

/** Adapta la dirección del módulo al tipo Address de Nuxt. */
function mapOrderAddress(raw: Record<string, unknown>): Address {
  return {
    id: (raw.id as number) || 0,
    alias: (raw.alias as string) || '',
    firstName: (raw.firstName as string) || '',
    lastName: (raw.lastName as string) || '',
    company: (raw.company as string) || null,
    address1: (raw.address1 as string) || '',
    address2: (raw.address2 as string) || null,
    city: (raw.city as string) || '',
    state: (raw.state as string) || null,
    postcode: (raw.postcode as string) || '',
    country: (raw.country as string) || '',
    countryCode: (raw.countryCode as string) || '',
    phone: (raw.phone as string) || null,
  }
}

/** Convierte una fila de la lista de pedidos al tipo Order. */
function mapOrderSummary(raw: Record<string, unknown>): Order {
  return {
    id: raw.id as number,
    reference: raw.reference as string,
    status: (raw.status as OrderStatus) || 'pending',
    customer: { id: 0, firstName: '', lastName: '', email: '' },
    shippingAddress: {} as Address,
    billingAddress: {} as Address,
    lines: [],
    totals: {
      subtotal: 0,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: raw.total as number,
      currency: (raw.currency as string) || 'CLP',
    },
    createdAt: raw.createdAt as string,
  }
}

/** Convierte el detalle completo de un pedido al tipo Order. */
function mapOrderDetail(raw: Record<string, unknown>): Order {
  const customer = raw.customer as Record<string, unknown>
  const totals = raw.totals as Record<string, unknown>
  const lines = (raw.lines as Record<string, unknown>[]) || []

  return {
    id: raw.id as number,
    reference: raw.reference as string,
    status: (raw.status as OrderStatus) || 'pending',
    customer: {
      id: customer.id as number,
      firstName: customer.firstName as string,
      lastName: customer.lastName as string,
      email: customer.email as string,
    },
    shippingAddress: mapOrderAddress(raw.shippingAddress as Record<string, unknown> || {}),
    billingAddress: mapOrderAddress(raw.billingAddress as Record<string, unknown> || {}),
    shippingMethodName: raw.shippingMethodName as string,
    paymentMethodId: raw.paymentMethodId as string,
    lines: lines.map(l => ({
      id: l.id as number,
      productId: l.productId as number,
      name: l.name as string,
      sku: l.sku as string,
      quantity: l.quantity as number,
      unitPrice: l.unitPrice as number,
      totalPrice: l.totalPrice as number,
    })),
    totals: {
      subtotal: totals.subtotal as number,
      shipping: totals.shipping as number,
      tax: totals.tax as number,
      discount: totals.discount as number,
      total: totals.total as number,
      currency: (totals.currency as string) || 'CLP',
    },
    createdAt: raw.createdAt as string,
  }
}

export const OrderService = {
  async getOrdersForCustomer(customerId: number, token?: string): Promise<Order[]> {
    if (useHeadlessApi && token) {
      try {
        const list = await haGet<Record<string, unknown>[]>('orders', 'list', token)
        return list.map(mapOrderSummary)
      }
      catch (e) {
        const msg = e instanceof Error ? e.message : 'Error al obtener pedidos'
        throw createError({ statusCode: 500, statusMessage: msg })
      }
    }
    return mockOrderStore.findByCustomerId(customerId)
  },

  async getOrderById(orderId: number, customerId: number, token?: string): Promise<Order> {
    if (useHeadlessApi && token) {
      try {
        const raw = await haGet<Record<string, unknown>>('orders', 'get', token, { id: orderId })
        return mapOrderDetail(raw)
      }
      catch (e) {
        const msg = e instanceof Error ? e.message : 'Pedido no encontrado'
        const status = msg.includes('no encontrado') || msg.includes('not found') ? 404 : 500
        throw createError({ statusCode: status, statusMessage: msg })
      }
    }

    const order = mockOrderStore.findByIdForCustomer(orderId, customerId)
    if (!order) throw createError({ statusCode: 404, statusMessage: 'Pedido no encontrado' })
    return order
  },
}
