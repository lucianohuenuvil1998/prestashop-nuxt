/**
 * CheckoutService — lógica de negocio del checkout.
 *
 * Actualmente usa datos mock para shipping/payment y construye
 * la orden a partir del carrito en memoria.
 *
 * Al integrar PrestaShop 8, reemplazar las constantes MOCK_* y
 * el método placeOrder para que deleguen en CheckoutAdapter.
 */

import type { Order } from '~~/shared/types/order.types'
import type { PlaceOrderPayload } from '~~/shared/types/api.types'
import type { CheckoutSummary, ShippingMethod, PaymentMethod } from '~~/shared/types/checkout.types'
import { cartRepository } from '../repositories'

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 1,
    name: 'Envío estándar',
    description: 'Entrega a domicilio',
    price: 4.99,
    currency: 'USD',
    delay: '5-7 días hábiles',
  },
  {
    id: 2,
    name: 'Envío express',
    description: 'Entrega prioritaria',
    price: 12.99,
    currency: 'USD',
    delay: '2-3 días hábiles',
  },
  {
    id: 3,
    name: 'Envío mismo día',
    description: 'Solo zonas seleccionadas (CABA)',
    price: 19.99,
    currency: 'USD',
    delay: 'Hoy hasta las 20 h',
  },
]

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'bank_wire',
    name: 'Transferencia bancaria',
    description: 'Tu pedido se confirma al acreditarse el pago. Te enviaremos los datos bancarios por email.',
  },
  {
    id: 'check',
    name: 'Pago con cheque',
    description: 'Envíanos tu cheque junto con el número de pedido. Procesamos al recibir el cheque.',
  },
  {
    id: 'cash_on_delivery',
    name: 'Contra entrega',
    description: 'Paga en efectivo o con tarjeta al recibir tu pedido. Sin costo adicional.',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function round(n: number): number {
  return Math.round(n * 100) / 100
}

function generateReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const random = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `DEMO-${random}`
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

export const CheckoutService = {
  /** Devuelve los métodos de envío y pago disponibles. */
  async getSummary(): Promise<CheckoutSummary> {
    return {
      shippingMethods: MOCK_SHIPPING_METHODS,
      paymentMethods: MOCK_PAYMENT_METHODS,
    }
  },

  /**
   * Crea una orden a partir del carrito activo.
   *
   * En mock: genera un ID y referencia aleatorios, construye las líneas
   * desde el carrito y aplica el costo de envío seleccionado.
   * En PS8 real: delegar en CheckoutAdapter.placeOrder(payload).
   */
  async placeOrder(payload: PlaceOrderPayload): Promise<Order> {
    const cart = await cartRepository.findById(payload.cartId)
    if (!cart || cart.items.length === 0) {
      throw new Error('El carrito está vacío')
    }

    const shippingMethod = MOCK_SHIPPING_METHODS.find((m) => m.id === payload.shippingMethodId)
    if (!shippingMethod) {
      throw new Error('Método de envío no válido')
    }

    const shippingCost = shippingMethod.price
    const subtotal = cart.totals.subtotal
    const total = round(subtotal + shippingCost)

    const order: Order = {
      id: Math.floor(Math.random() * 90_000) + 10_000,
      reference: generateReference(),
      status: 'awaiting_payment',
      customer: {
        id: 1,
        firstName: 'Cliente',
        lastName: 'Demo',
        email: 'cliente@test.com',
      },
      shippingAddress: {
        id: 1,
        alias: 'Principal',
        firstName: 'Cliente',
        lastName: 'Demo',
        company: null,
        address1: 'Av. Corrientes 1234',
        address2: null,
        city: 'Buenos Aires',
        state: 'Buenos Aires',
        postcode: 'C1043',
        country: 'Argentina',
        countryCode: 'AR',
        phone: null,
      },
      billingAddress: {
        id: 1,
        alias: 'Principal',
        firstName: 'Cliente',
        lastName: 'Demo',
        company: null,
        address1: 'Av. Corrientes 1234',
        address2: null,
        city: 'Buenos Aires',
        state: 'Buenos Aires',
        postcode: 'C1043',
        country: 'Argentina',
        countryCode: 'AR',
        phone: null,
      },
      lines: cart.items.map((item, idx) => ({
        id: idx + 1,
        productId: item.productId,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      totals: {
        subtotal,
        shipping: shippingCost,
        tax: 0,
        discount: 0,
        total,
        currency: cart.totals.currency,
      },
      createdAt: new Date().toISOString(),
    }

    return order
  },
}
