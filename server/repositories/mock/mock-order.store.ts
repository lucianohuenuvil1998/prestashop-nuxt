/**
 * Almacenamiento en memoria para pedidos mock.
 *
 * Al confirmar un checkout, la orden se guarda aquí indexada por customerId.
 * Al integrar PrestaShop 8, reemplazar por PrestashopOrderRepository.
 */

import type { Order } from '~~/shared/types/order.types'

const ordersByCustomerId = new Map<number, Order[]>()
const ordersById = new Map<number, Order>()

function cloneOrder(order: Order): Order {
  return JSON.parse(JSON.stringify(order)) as Order
}

function sortByDateDesc(orders: Order[]): Order[] {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

// Pedidos demo para el usuario cliente@test.com (id: 1)
const SEED_ORDERS: Order[] = [
  {
    id: 10001,
    reference: 'DEMO-XK7P2M9A',
    status: 'delivered',
    customer: { id: 1, firstName: 'María', lastName: 'González', email: 'cliente@test.com' },
    shippingAddress: {
      id: 1,
      alias: 'Casa',
      firstName: 'María',
      lastName: 'González',
      company: null,
      address1: 'Av. Corrientes 1234',
      address2: null,
      city: 'Buenos Aires',
      state: 'Buenos Aires',
      postcode: 'C1043',
      country: 'Argentina',
      countryCode: 'AR',
      phone: '+54 11 1234-5678',
    },
    billingAddress: {
      id: 1,
      alias: 'Casa',
      firstName: 'María',
      lastName: 'González',
      company: null,
      address1: 'Av. Corrientes 1234',
      address2: null,
      city: 'Buenos Aires',
      state: 'Buenos Aires',
      postcode: 'C1043',
      country: 'Argentina',
      countryCode: 'AR',
      phone: '+54 11 1234-5678',
    },
    lines: [
      {
        id: 1,
        productId: 1,
        name: 'Auriculares Bluetooth Pro',
        sku: 'AUR-BT-PRO-001',
        quantity: 1,
        unitPrice: 89.99,
        totalPrice: 89.99,
      },
      {
        id: 2,
        productId: 3,
        name: 'Monitor 27" 4K IPS',
        sku: 'MON-27-4K-IPS-001',
        quantity: 1,
        unitPrice: 549.99,
        totalPrice: 549.99,
      },
    ],
    totals: {
      subtotal: 639.98,
      shipping: 4.99,
      tax: 0,
      discount: 0,
      total: 644.97,
      currency: 'USD',
    },
    createdAt: '2026-06-15T14:30:00.000Z',
    paymentMethodId: 'cash_on_delivery',
    shippingMethodName: 'Envío estándar',
  },
  {
    id: 10002,
    reference: 'DEMO-B3N8Q1RT',
    status: 'awaiting_shipment',
    customer: { id: 1, firstName: 'María', lastName: 'González', email: 'cliente@test.com' },
    shippingAddress: {
      id: 1,
      alias: 'Casa',
      firstName: 'María',
      lastName: 'González',
      company: null,
      address1: 'Av. Corrientes 1234',
      address2: null,
      city: 'Buenos Aires',
      state: 'Buenos Aires',
      postcode: 'C1043',
      country: 'Argentina',
      countryCode: 'AR',
      phone: '+54 11 1234-5678',
    },
    billingAddress: {
      id: 1,
      alias: 'Casa',
      firstName: 'María',
      lastName: 'González',
      company: null,
      address1: 'Av. Corrientes 1234',
      address2: null,
      city: 'Buenos Aires',
      state: 'Buenos Aires',
      postcode: 'C1043',
      country: 'Argentina',
      countryCode: 'AR',
      phone: '+54 11 1234-5678',
    },
    lines: [
      {
        id: 1,
        productId: 2,
        name: 'Teclado Mecánico Compacto',
        sku: 'TEC-MEC-75-001',
        quantity: 1,
        unitPrice: 129.00,
        totalPrice: 129.00,
      },
    ],
    totals: {
      subtotal: 129.00,
      shipping: 12.99,
      tax: 0,
      discount: 0,
      total: 141.99,
      currency: 'USD',
    },
    createdAt: '2026-07-01T10:15:00.000Z',
    paymentMethodId: 'bank_wire',
    shippingMethodName: 'Envío express',
  },
]

for (const order of SEED_ORDERS) {
  ordersById.set(order.id, order)
  const existing = ordersByCustomerId.get(order.customer.id) ?? []
  existing.push(order)
  ordersByCustomerId.set(order.customer.id, existing)
}

export const mockOrderStore = {
  save(order: Order): void {
    ordersById.set(order.id, order)

    const customerOrders = ordersByCustomerId.get(order.customer.id) ?? []
    const existingIdx = customerOrders.findIndex((o) => o.id === order.id)

    if (existingIdx >= 0) {
      customerOrders[existingIdx] = order
    }
    else {
      customerOrders.push(order)
    }

    ordersByCustomerId.set(order.customer.id, customerOrders)
  },

  findByCustomerId(customerId: number): Order[] {
    const orders = ordersByCustomerId.get(customerId) ?? []
    return sortByDateDesc(orders).map(cloneOrder)
  },

  findByIdForCustomer(orderId: number, customerId: number): Order | null {
    const order = ordersById.get(orderId)
    if (!order || order.customer.id !== customerId) return null
    return cloneOrder(order)
  },
}
