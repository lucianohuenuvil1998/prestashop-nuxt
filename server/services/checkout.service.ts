/**
 * CheckoutService — lógica de negocio del checkout.
 *
 * Actualmente usa datos mock para shipping/payment y construye
 * la orden a partir del carrito en memoria.
 *
 * Al integrar PrestaShop 8, reemplazar las constantes MOCK_* y
 * el método placeOrder para que deleguen en CheckoutAdapter.
 */

import type { Order, Address } from '~~/shared/types/order.types'
import type { PlaceOrderPayload, GuestAddressPayload, OrderResult } from '~~/shared/types/api.types'
import type { Customer } from '~~/shared/types/customer.types'
import type { CheckoutSummary, ShippingMethod, PaymentMethod } from '~~/shared/types/checkout.types'
import { cartRepository } from '../repositories'
import { mockOrderStore } from '../repositories/mock/mock-order.store'

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
    id: 'cash_on_delivery',
    name: 'Contra entrega',
    description: 'Paga en efectivo o con tarjeta al recibir tu pedido. Sin costo adicional.',
  },
  {
    id: 'webpay',
    name: 'Webpay',
    description: 'Paga con tarjeta de crédito o débito de forma segura. Serás redirigido al sitio de Webpay.',
    requiresRedirect: true,
  },
]

/** Métodos de pago que redirigen a un sitio externo. */
const REDIRECT_PAYMENT_IDS = new Set(['webpay'])

// ─── Helpers ──────────────────────────────────────────────────────────────────

function round(n: number): number {
  return Math.round(n * 100) / 100
}

function generateReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const random = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `DEMO-${random}`
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function guestAddressToAddress(g: GuestAddressPayload): Address {
  return {
    id: 0,
    alias: 'Entrega',
    firstName: g.firstName,
    lastName: g.lastName,
    company: g.company ?? null,
    address1: g.address1,
    address2: g.address2 ?? null,
    city: g.city,
    state: g.state ?? null,
    postcode: g.postcode,
    country: g.country,
    countryCode: '',
    phone: g.phone ?? null,
  }
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
  async placeOrder(
    payload: PlaceOrderPayload,
    customer: Customer | null,
  ): Promise<OrderResult> {
    const cart = await cartRepository.findById(payload.cartId)
    if (!cart || cart.items.length === 0) {
      throw new Error('El carrito está vacío')
    }

    const shippingMethod = MOCK_SHIPPING_METHODS.find((m) => m.id === payload.shippingMethodId)
    if (!shippingMethod) {
      throw new Error('Método de envío no válido')
    }

    let shippingAddress: Address
    let billingAddress: Address

    if (customer) {
      const found = customer.addresses.find((a) => a.id === payload.shippingAddressId)
      if (!found) throw new Error('Dirección no válida')
      shippingAddress = found
      billingAddress = customer.addresses.find((a) => a.id === payload.billingAddressId) ?? found
    }
    else {
      if (!payload.guestAddress || !payload.guestEmail) {
        throw new Error('Datos de invitado incompletos')
      }
      shippingAddress = guestAddressToAddress(payload.guestAddress)
      billingAddress = shippingAddress
    }

    const orderCustomer = customer
      ? { id: customer.id, firstName: customer.firstName, lastName: customer.lastName, email: customer.email }
      : { id: 0, firstName: shippingAddress.firstName, lastName: shippingAddress.lastName, email: payload.guestEmail! }

    const shippingCost = shippingMethod.price
    const subtotal = cart.totals.subtotal
    const total = round(subtotal + shippingCost)

    const order: Order = {
      id: Math.floor(Math.random() * 90_000) + 10_000,
      reference: generateReference(),
      status: 'awaiting_payment',
      customer: orderCustomer,
      shippingAddress,
      billingAddress,
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
      paymentMethodId: payload.paymentMethodId,
      shippingMethodName: shippingMethod.name,
    }

    mockOrderStore.save(order)

    // Métodos con redirección externa (Webpay, PayPal, etc.)
    if (REDIRECT_PAYMENT_IDS.has(payload.paymentMethodId)) {
      // En producción, aquí se llama al módulo de PS para obtener la URL real del gateway.
      // En mock, simulamos el retorno exitoso directamente.
      const redirectUrl = `/checkout/result?orderId=${order.id}&status=success`
      return { order, redirectUrl }
    }

    return { order }
  },
}
